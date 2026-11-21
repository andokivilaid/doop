import { nanoid } from 'nanoid'
import { and, eq } from 'drizzle-orm'
import { db } from './db/index.ts'
import * as t from './db/schema.ts'
import {
  BUILT_IN_SKILLS,
  MAX_CUSTOM_SKILLS,
  type ActiveSkill,
  type BuiltInSkill,
  type BuiltInSkillPatch,
  type CustomSkill,
  type CustomSkillInput,
  type CustomSkillPatch,
  type SkillPack,
  type SkillScope,
} from '../shared/agentSkills.ts'

/**
 * Agent skills (shared/agentSkills.ts) and each workspace's or person's
 * overrides to the built-in skill packs (`agent_skill_overrides`). Mirrored in
 * memory at boot alongside `customAgents` so `get_canvas`, `get_skill` and
 * resident runs read them synchronously without hitting Postgres on every turn.
 */

type SkillRow = typeof t.agentSkills.$inferSelect
type OverrideRow = typeof t.agentSkillOverrides.$inferSelect

const rows = new Map<string, SkillRow>()
const overrides = new Map<string, OverrideRow>()
/** `${canvasId}\n${agentName}` for MCP sessions that have already received the skills */
const seenOnCanvas = new Set<string>()

function overrideKey(scope: string, slug: string): string {
  return `${scope}\n${slug}`
}

export class SkillInputError extends Error {}

export async function hydrateAgentSkills(): Promise<void> {
  const [all, changed] = await Promise.all([db.select().from(t.agentSkills), db.select().from(t.agentSkillOverrides)])
  rows.clear()
  for (const row of all) rows.set(row.id, row)
  overrides.clear()
  for (const row of changed) overrides.set(overrideKey(row.scope, row.slug), row)
}

function scopeKey(scope: SkillScope, userId: string): string {
  return 'workspaceId' in scope ? `ws:${scope.workspaceId}` : `user:${userId}`
}

function canvasScopeKey(
  canvas: { workspaceId?: string | null; ownerId?: string | null } | undefined,
): string | undefined {
  if (!canvas) return undefined
  if (canvas.workspaceId) return `ws:${canvas.workspaceId}`
  return canvas.ownerId ? `user:${canvas.ownerId}` : undefined
}

function withOverride(pack: SkillPack, row: OverrideRow | undefined): SkillPack {
  if (!row) return pack
  return {
    slug: pack.slug,
    title: row.title ?? pack.title,
    summary: row.summary ?? pack.summary,
    markdown: row.markdown ?? pack.markdown,
  }
}

function builtInsIn(key: string): BuiltInSkill[] {
  return BUILT_IN_SKILLS.map((pack) => {
    const row = overrides.get(overrideKey(key, pack.slug))
    const edited = !!row && (!!row.title || !!row.summary || !!row.markdown)
    return {
      ...withOverride(pack, row),
      builtIn: true,
      enabled: !row?.disabled,
      edited,
    }
  })
}

function toCustomSkill(row: SkillRow): CustomSkill {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    markdown: row.markdown,
    createdAt: row.createdAt,
  }
}

function rowsIn(key: string): SkillRow[] {
  return [...rows.values()].filter((row) => row.scope === key).sort((a, b) => a.createdAt - b.createdAt)
}

export function listBuiltInSkills(scope: SkillScope, userId: string): BuiltInSkill[] {
  return builtInsIn(scopeKey(scope, userId))
}

export function listCustomSkills(scope: SkillScope, userId: string): CustomSkill[] {
  return rowsIn(scopeKey(scope, userId)).map(toCustomSkill)
}

function activeInKey(key: string | undefined): ActiveSkill[] {
  if (!key) {
    return BUILT_IN_SKILLS.map((pack) => ({ ...pack, builtIn: true }))
  }
  const builtIns: ActiveSkill[] = builtInsIn(key)
    .filter((pack) => pack.enabled)
    .map(({ slug, title, summary, markdown }) => ({ slug, title, summary, markdown, builtIn: true }))
  const custom: ActiveSkill[] = rowsIn(key).map((row) => ({
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    markdown: row.markdown,
    builtIn: false,
  }))
  return [...builtIns, ...custom]
}

export function activeSkillsForScope(scope: SkillScope, userId: string): ActiveSkill[] {
  return activeInKey(scopeKey(scope, userId))
}

export function activeSkillsForCanvas(
  canvas: { workspaceId?: string | null; ownerId?: string | null } | undefined,
): ActiveSkill[] {
  return activeInKey(canvasScopeKey(canvas))
}

export function markSkillsSeen(canvasId: string, agentName: string): void {
  seenOnCanvas.add(`${canvasId}\n${agentName}`)
}

export function hasSeenSkills(canvasId: string, agentName: string): boolean {
  return seenOnCanvas.has(`${canvasId}\n${agentName}`)
}

export function skillsBrief(skills: readonly ActiveSkill[]): string {
  if (!skills.length) return ''
  const names = skills.map((s) => `${s.slug} (${s.title})`).join(', ')
  return (
    `Active design & frontend skills (${names}) are included under \`skills\` — apply their typography, ` +
    `spatial rhythm, token/Tailwind, WCAG contrast and mobile platform rules on every frame you create or edit ` +
    `(canvas style guides outrank them where a brand rule intentionally differs).`
  )
}

export function skillsPromptBlock(skills: readonly ActiveSkill[]): string {
  if (!skills.length) return ''
  return (
    `# Design & frontend skills\n` +
    `Apply these craft rules across every frame and component you create or restyle ` +
    `(canvas design guidelines and pinned references outrank them where they conflict):\n\n` +
    skills.map((s) => `## ${s.title} (\`${s.slug}\`)\n\n${s.markdown}`).join('\n\n')
  )
}

const scopeChains = new Map<string, Promise<unknown>>()

function inScopeOrder<T>(key: string, work: () => Promise<T>): Promise<T> {
  const next = (scopeChains.get(key) ?? Promise.resolve()).then(work, work)
  const settled = next.catch(() => {})
  scopeChains.set(key, settled)
  void settled.then(() => {
    if (scopeChains.get(key) === settled) scopeChains.delete(key)
  })
  return next
}

export async function createCustomSkill(
  scope: SkillScope,
  userId: string,
  input: CustomSkillInput,
  allowed: () => boolean,
): Promise<CustomSkill> {
  const key = scopeKey(scope, userId)
  return inScopeOrder(key, async () => {
    if (!allowed()) throw new SkillInputError('this workspace no longer exists or you left it')
    const existing = rowsIn(key)
    if (existing.length >= MAX_CUSTOM_SKILLS)
      throw new SkillInputError(`a scope has room for ${MAX_CUSTOM_SKILLS} custom skills — remove one first`)
    if (existing.some((r) => r.slug === input.slug))
      throw new SkillInputError(`skill "${input.slug}" already exists here`)
    const now = Date.now()
    const row: SkillRow = {
      id: nanoid(10),
      scope: key,
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      markdown: input.markdown,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    }
    await db.insert(t.agentSkills).values(row)
    rows.set(row.id, row)
    return toCustomSkill(row)
  })
}

function findRow(key: string, slug: string): SkillRow | undefined {
  for (const row of rows.values()) if (row.scope === key && row.slug === slug) return row
  return undefined
}

export async function updateCustomSkill(
  scope: SkillScope,
  _userId: string,
  slug: string,
  patch: CustomSkillPatch,
  allowed: () => boolean,
): Promise<CustomSkill | undefined> {
  const key = scopeKey(scope, _userId)
  return inScopeOrder(key, async () => {
    const row = findRow(key, slug)
    if (!row || !allowed()) return undefined
    const next: SkillRow = { ...row, ...patch, updatedAt: Date.now() }
    await db
      .update(t.agentSkills)
      .set({
        title: next.title,
        summary: next.summary,
        markdown: next.markdown,
        updatedAt: next.updatedAt,
      })
      .where(eq(t.agentSkills.id, row.id))
    rows.set(row.id, next)
    return toCustomSkill(next)
  })
}

export async function deleteCustomSkill(
  scope: SkillScope,
  userId: string,
  slug: string,
  allowed: () => boolean,
): Promise<boolean> {
  const key = scopeKey(scope, userId)
  return inScopeOrder(key, async () => {
    const row = findRow(key, slug)
    if (!row || !allowed()) return false
    await db.delete(t.agentSkills).where(eq(t.agentSkills.id, row.id))
    rows.delete(row.id)
    return true
  })
}

export async function updateBuiltInSkill(
  scope: SkillScope,
  userId: string,
  slug: string,
  patch: BuiltInSkillPatch,
  allowed: () => boolean,
): Promise<BuiltInSkill | undefined> {
  const key = scopeKey(scope, userId)
  const stock = BUILT_IN_SKILLS.find((pack) => pack.slug === slug)
  if (!stock) return undefined
  return inScopeOrder(key, async () => {
    if (!allowed()) throw new SkillInputError('this workspace no longer exists or you left it')
    const current = overrides.get(overrideKey(key, slug))
    const differs = <T>(value: T | undefined, shipped: T, kept: T | null): T | null =>
      value === undefined ? kept : value === shipped ? null : value
    const next: OverrideRow = {
      scope: key,
      slug,
      disabled: patch.disabled ?? current?.disabled ?? false,
      title: differs(patch.title, stock.title, current?.title ?? null),
      summary: differs(patch.summary, stock.summary, current?.summary ?? null),
      markdown: differs(patch.markdown, stock.markdown, current?.markdown ?? null),
      updatedBy: userId,
      updatedAt: Date.now(),
    }
    await writeOverride(next)
    return builtInsIn(key).find((pack) => pack.slug === slug)
  })
}

export async function resetBuiltInSkill(
  scope: SkillScope,
  userId: string,
  slug: string,
  allowed: () => boolean,
): Promise<BuiltInSkill | undefined> {
  const key = scopeKey(scope, userId)
  if (!BUILT_IN_SKILLS.some((pack) => pack.slug === slug)) return undefined
  return inScopeOrder(key, async () => {
    if (!allowed()) throw new SkillInputError('this workspace no longer exists or you left it')
    const disabled = overrides.get(overrideKey(key, slug))?.disabled ?? false
    await writeOverride({
      scope: key,
      slug,
      disabled,
      title: null,
      summary: null,
      markdown: null,
      updatedBy: userId,
      updatedAt: Date.now(),
    })
    return builtInsIn(key).find((pack) => pack.slug === slug)
  })
}

async function writeOverride(row: OverrideRow): Promise<void> {
  const unchanged = !row.disabled && !row.title && !row.summary && !row.markdown
  if (unchanged) {
    await db
      .delete(t.agentSkillOverrides)
      .where(and(eq(t.agentSkillOverrides.scope, row.scope), eq(t.agentSkillOverrides.slug, row.slug)))
    overrides.delete(overrideKey(row.scope, row.slug))
    return
  }
  await db
    .insert(t.agentSkillOverrides)
    .values(row)
    .onConflictDoUpdate({ target: [t.agentSkillOverrides.scope, t.agentSkillOverrides.slug], set: row })
  overrides.set(overrideKey(row.scope, row.slug), row)
}

export async function dropWorkspaceSkills(workspaceId: string): Promise<void> {
  await dropScope(`ws:${workspaceId}`)
}

export async function dropPersonalSkills(userId: string): Promise<void> {
  await dropScope(`user:${userId}`)
}

async function dropScope(key: string): Promise<void> {
  await inScopeOrder(key, async () => {
    await db.delete(t.agentSkills).where(eq(t.agentSkills.scope, key))
    await db.delete(t.agentSkillOverrides).where(eq(t.agentSkillOverrides.scope, key))
    for (const [id, row] of rows) if (row.scope === key) rows.delete(id)
    for (const [id, row] of overrides) if (row.scope === key) overrides.delete(id)
  })
}
