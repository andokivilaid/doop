/**
 * Agent skills: reusable design and frontend craft playbooks seeded to every
 * agent working on a canvas — both external agents connecting over MCP
 * (Claude Code, Cursor, Codex, ChatGPT, Antigravity) and the resident Doop
 * Agent team.
 *
 * Like custom agents, skills live per workspace (`ws:<id>`) or per user
 * (`user:<id>` on personal canvases). Three studio-grade built-in skill packs
 * ship enabled out of the box; a team or person can toggle them off, edit
 * their markdown (with one-click Reset), or add custom skills of their own.
 */
import type { AgentScope, Parsed } from './customAgents.ts'

export const MAX_CUSTOM_SKILLS = 20
export const MAX_SKILL_TITLE = 80
export const MAX_SKILL_SUMMARY = 180
export const MIN_SKILL_MARKDOWN = 20
export const MAX_SKILL_MARKDOWN = 12_000

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,47}$/
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f]/

export interface SkillPack {
  slug: string
  title: string
  summary: string
  markdown: string
}

export interface BuiltInSkill extends SkillPack {
  builtIn: true
  enabled: boolean
  edited: boolean
}

export interface CustomSkill extends SkillPack {
  builtIn?: false
  createdAt: number
}

export type ActiveSkill = SkillPack & { builtIn: boolean }

export interface CustomSkillInput {
  slug: string
  title: string
  summary: string
  markdown: string
}

export type CustomSkillPatch = Partial<Pick<CustomSkillInput, 'title' | 'summary' | 'markdown'>>

export type BuiltInSkillPatch = CustomSkillPatch & { disabled?: boolean }

export type { AgentScope as SkillScope }

export const BUILT_IN_SKILLS: readonly SkillPack[] = [
  {
    slug: 'ui-ux-craft',
    title: 'UI/UX Craft, Typography & Layout Rhythm',
    summary: 'Optical hierarchy, tabular numerals, spatial grouping, tactile surfaces, and anti-AI-slop discipline.',
    markdown: `### Typographic Hierarchy & Optical Precision
- Pair one expressive display face with one calm, legible UI/body face and a monospace face for code, IDs, prices, and metrics.
- Enable \`font-variant-numeric: tabular-nums\` on every price, counter, table column, timestamp, badge number, and policy/serial code so vertical lanes align cleanly.
- Scale contrast deliberately: tight tracking (\`-0.02em\` to \`-0.04em\`) and tight leading (\`1.05\`–\`1.18\`) on display headings; comfortable reading measure (\`58ch\`–\`68ch\`) and leading (\`1.45\`–\`1.6\`) on body prose; generous positive tracking (\`0.06em\`–\`0.1em\`) on uppercase micro-labels.

### Spatial Rhythm & Gestalt Grouping
- Inner spacing must always be tighter than outer group separation (e.g. \`6px\` between label and value, \`16px\` between fields, \`32–48px\` between sections) so related items cohere without needing boxes around everything.
- Anchor elements to crisp vertical alignment lanes. Avoid arbitrary container widths, ragged trailing actions, or centered body paragraphs over three lines.
- Give primary content immediate visual priority: answer the user's core question in the first viewport within 3 seconds, with at most ONE primary call-to-action per viewport band.

### Surface Discipline & Anti-AI-Slop Rules
- Commit to a concrete material register (archival linen + ink, brushed aluminum, matte slate, editorial newsprint, warm stone) and derive every surface step from it.
- Never use generic purple/indigo-to-cyan SaaS gradients, neon glow borders, gratuitous backdrop-blur glassmorphism, heavy fuzzy drop shadows, 3-identical-icon-card filler rows, or placeholder copy ("Lorem ipsum", "Acme Corp").
- Separate elevation with crisp \`1px\` hairline borders and subtle tonal surface steps rather than heavy blur shadows.`,
  },
  {
    slug: 'frontend-react-tailwind-wcag',
    title: 'React, Tailwind v4 Tokens & WCAG 2.2 Accessibility',
    summary: 'Semantic HTML landmarks, WCAG 2.2 AA/AAA contrast, non-color status cues, and token-first architecture.',
    markdown: `### Token-First CSS & Tailwind v4 Compatibility
- Express every color, font family, type size, radius, and spacing step through canvas design tokens (\`var(--color-*)\`, \`var(--font-*)\`, \`var(--text-*)\`, \`var(--radius-*)\`, \`var(--spacing-*)\`) so 1-click React + Tailwind v4 export maps directly onto \`@theme\` without hardcoded hexes.
- Implement dark mode and alternate themes strictly via token overrides and \`data-doop-theme="<theme>"\` on the root or subtree — never fork a frame just to swap hex values.
- Keep resting element layout/surface styles inspectable, and place interactive states (\`:hover\`, \`:focus-visible\`, \`:active\`, \`:disabled\`), \`@media\` queries, and \`@keyframes\` in \`<style>\`.

### Semantic Landmarks & Production Component Structure
- Use semantic HTML elements: \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`, \`<button type="button">\`, \`<label for="…">\` paired with \`<input id="…">\`, and \`<table>\`/\`<thead>\`/\`<th scope="col">\` for tabular data.
- Never use \`<div onclick>\` for buttons/links or skip heading ranks (\`h1\` → \`h2\` → \`h3\`). Every icon-only control and non-decorative \`<img>\`/\`<svg>\` requires an explicit \`aria-label\` or \`alt\`.
- Extract repeated primitives (\`Button\`, \`Input\`, \`Badge\`, \`Card\`, \`NavItem\`) as Doop components (\`<doop-use>\`) and guard flex/grid text children with \`min-width: 0\` so long localized strings never overflow.

### WCAG 2.2 AA / AAA Contrast & Inclusive Feedback
- Maintain \`>= 4.5:1\` contrast for body/UI text (\`>= 7:1\` AAA preferred for dense reading) and \`>= 3:1\` for large display text (\`>= 24px\` or \`>= 18.66px\` bold) and essential control boundaries/icons.
- Never communicate state (active, error, warning, verified) through color alone: always pair color with a clear text label, icon, or shape change.
- Include unmistakable \`:focus-visible\` outlines (\`2px\` offset ring) on every interactive control.`,
  },
  {
    slug: 'mobile-hig-m3',
    title: 'Mobile Craft — Apple HIG & Material 3 Expressive',
    summary: 'Safe areas, 44pt/48dp touch targets, thumb-zone ergonomics, iOS sheets/bars, and M3 tonal surfaces.',
    markdown: `### Viewport Sizing, Safe Areas & Thumb-Zone Ergonomics
- Size mobile frames realistically (\`390×844\` or \`402×874\` for iOS; \`412×915\` for Android). Reserve top status bar / Dynamic Island clearance (\`54px\` iOS, \`28px\` Android) and bottom home-indicator / gesture clearance (\`34px\` iOS, \`24px\` Android).
- Keep frequent primary actions within the natural one-handed thumb zone (bottom 40% of the viewport); put destructive or rare settings actions higher or behind confirmation.
- Enforce minimum \`44×44pt\` (Apple HIG) and \`48×48dp\` (Material 3) hit targets on all tappable controls, with \`>= 8px\` spacing between adjacent targets.

### Apple Human Interface Guidelines (iOS)
- Use large-title navigation headers that establish hierarchy clearly, inset grouped lists (\`16–20px\` horizontal margin, hairline dividers inset to align with label text), and translucent bottom tab bars with 3–5 labeled destinations (never horizontally scrolling tabs).
- Present secondary tasks and contextual pickers in detented bottom sheets with a centered \`36×5px\` grabber handle rather than cramped center-screen dialogs.

### Material 3 Expressive (Android)
- Build hierarchy through tonal surface roles (\`surface\`, \`surface-container-low\`, \`surface-container\`, \`surface-container-high\`) and high-contrast \`on-*-container\` ink tokens rather than drop shadows or glass blur.
- Pair a top \`SearchBar\` (with trailing account avatar) or clean top app bar with a pill-indicator bottom navigation bar and at most one prominent or extended \`FAB\` (\`16–28dp\` corner radius) for the screen's signature action.`,
  },
] as const

export function skillSlugFor(title: string): string {
  return title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function cleanLine(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().replace(/\s+/g, ' ') : ''
}

function titleOf(raw: unknown): Parsed<string> {
  const title = cleanLine(raw)
  if (title.length < 2 || title.length > MAX_SKILL_TITLE || CONTROL.test(title))
    return { ok: false, error: `title the skill in 2 to ${MAX_SKILL_TITLE} characters` }
  return { ok: true, value: title }
}

function summaryOf(raw: unknown): Parsed<string> {
  const summary = cleanLine(raw)
  if (!summary) return { ok: false, error: 'add a one-line summary' }
  if (summary.length > MAX_SKILL_SUMMARY)
    return { ok: false, error: `keep the summary under ${MAX_SKILL_SUMMARY} characters` }
  return { ok: true, value: summary }
}

function markdownOf(raw: unknown): Parsed<string> {
  const markdown = typeof raw === 'string' ? raw.trim() : ''
  if (markdown.length < MIN_SKILL_MARKDOWN)
    return { ok: false, error: 'write at least a short set of actionable rules' }
  if (markdown.length > MAX_SKILL_MARKDOWN)
    return { ok: false, error: `keep the skill instructions under ${MAX_SKILL_MARKDOWN} characters` }
  return { ok: true, value: markdown }
}

export function parseCustomSkillInput(raw: unknown): Parsed<CustomSkillInput> {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const title = titleOf(input.title)
  if (!title.ok) return title
  const rawSlug =
    typeof input.slug === 'string' && input.slug.trim() ? input.slug.trim().toLowerCase() : skillSlugFor(title.value)
  if (!SLUG_RE.test(rawSlug)) return { ok: false, error: 'the slug is 2 to 48 lowercase letters, digits and hyphens' }
  if (BUILT_IN_SKILLS.some((s) => s.slug === rawSlug))
    return { ok: false, error: `${rawSlug} already belongs to a built-in skill pack` }
  const summary = summaryOf(input.summary)
  if (!summary.ok) return summary
  const markdown = markdownOf(input.markdown)
  if (!markdown.ok) return markdown
  return {
    ok: true,
    value: {
      slug: rawSlug,
      title: title.value,
      summary: summary.value,
      markdown: markdown.value,
    },
  }
}

export function parseCustomSkillPatch(raw: unknown): Parsed<CustomSkillPatch> {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const patch: CustomSkillPatch = {}
  if ('title' in input) {
    const title = titleOf(input.title)
    if (!title.ok) return title
    patch.title = title.value
  }
  if ('summary' in input) {
    const summary = summaryOf(input.summary)
    if (!summary.ok) return summary
    patch.summary = summary.value
  }
  if ('markdown' in input) {
    const markdown = markdownOf(input.markdown)
    if (!markdown.ok) return markdown
    patch.markdown = markdown.value
  }
  return { ok: true, value: patch }
}

export function parseBuiltInSkillPatch(slug: string, raw: unknown): Parsed<BuiltInSkillPatch> {
  if (!BUILT_IN_SKILLS.some((s) => s.slug === slug)) return { ok: false, error: 'no such built-in skill pack' }
  const fields = parseCustomSkillPatch(raw)
  if (!fields.ok) return fields
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  if (!('disabled' in input)) return fields
  return { ok: true, value: { ...fields.value, disabled: input.disabled === true } }
}
