import { Router, type Request, type Response } from 'express'
import {
  parseBuiltInSkillPatch,
  parseCustomSkillInput,
  parseCustomSkillPatch,
  type SkillScope,
} from '../shared/agentSkills.ts'
import {
  SkillInputError,
  createCustomSkill,
  deleteCustomSkill,
  listBuiltInSkills,
  listCustomSkills,
  resetBuiltInSkill,
  updateBuiltInSkill,
  updateCustomSkill,
} from './agentSkills.ts'
import { isWorkspaceMember } from './workspaces.ts'
import { captureFeature } from './featureEvents.ts'

/** /api/agent-skills: custom design/frontend skills managed in Settings and
 *  Workspace, plus /api/agent-skills/builtin for toggling, editing or resetting
 *  the built-in skill packs. `?workspace=<id>` targets a workspace (members
 *  only); without it, targets the signed-in user's personal canvases. */
export const agentSkillsRouter = Router()

function canUseSkillScope(scope: SkillScope, userId: string): boolean {
  return 'personal' in scope || isWorkspaceMember(scope.workspaceId, userId)
}

function scopeOf(req: Request, res: Response): SkillScope | null {
  const workspace = req.query.workspace
  const scope: SkillScope = typeof workspace === 'string' && workspace ? { workspaceId: workspace } : { personal: true }
  if (canUseSkillScope(scope, req.user!.id)) return scope
  res.status(403).json({ error: 'you are not a member of this workspace' })
  return null
}

function failed(res: Response, e: unknown, what: string) {
  if (e instanceof SkillInputError) res.status(400).json({ error: e.message })
  else {
    console.error(`[agent-skills] ${what} failed`, e)
    res.status(500).json({ error: `the skill could not be ${what === 'delete' ? 'removed' : 'saved'} — try again` })
  }
}

agentSkillsRouter.get('/', (req, res) => {
  const scope = scopeOf(req, res)
  if (scope) res.json(listCustomSkills(scope, req.user!.id))
})

agentSkillsRouter.post('/', async (req, res) => {
  const scope = scopeOf(req, res)
  if (!scope) return
  const input = parseCustomSkillInput(req.body)
  if (!input.ok) return res.status(400).json({ error: input.error })
  const userId = req.user!.id
  try {
    const skill = await createCustomSkill(scope, userId, input.value, () => canUseSkillScope(scope, userId))
    captureFeature(userId, 'custom_skill_created', 'ui', {
      scope: 'workspaceId' in scope ? 'workspace' : 'personal',
      slug: skill.slug,
    })
    res.json(skill)
  } catch (e) {
    failed(res, e, 'create')
  }
})

agentSkillsRouter.get('/builtin', (req, res) => {
  const scope = scopeOf(req, res)
  if (scope) res.json(listBuiltInSkills(scope, req.user!.id))
})

agentSkillsRouter.patch('/builtin/:slug', async (req, res) => {
  const scope = scopeOf(req, res)
  if (!scope) return
  const patch = parseBuiltInSkillPatch(req.params.slug, req.body)
  if (!patch.ok) return res.status(400).json({ error: patch.error })
  const userId = req.user!.id
  try {
    const skill = await updateBuiltInSkill(scope, userId, req.params.slug, patch.value, () =>
      canUseSkillScope(scope, userId),
    )
    if (!skill) return res.status(404).json({ error: 'skill not found' })
    if (patch.value.disabled !== undefined)
      captureFeature(userId, 'builtin_skill_toggled', 'ui', { slug: req.params.slug, enabled: !patch.value.disabled })
    res.json(skill)
  } catch (e) {
    failed(res, e, 'update')
  }
})

agentSkillsRouter.delete('/builtin/:slug', async (req, res) => {
  const scope = scopeOf(req, res)
  if (!scope) return
  const userId = req.user!.id
  try {
    const skill = await resetBuiltInSkill(scope, userId, req.params.slug, () => canUseSkillScope(scope, userId))
    if (!skill) return res.status(404).json({ error: 'skill not found' })
    res.json(skill)
  } catch (e) {
    failed(res, e, 'update')
  }
})

agentSkillsRouter.patch('/:slug', async (req, res) => {
  const scope = scopeOf(req, res)
  if (!scope) return
  const patch = parseCustomSkillPatch(req.body)
  if (!patch.ok) return res.status(400).json({ error: patch.error })
  const userId = req.user!.id
  try {
    const skill = await updateCustomSkill(scope, userId, req.params.slug, patch.value, () =>
      canUseSkillScope(scope, userId),
    )
    if (!skill) return res.status(404).json({ error: 'skill not found' })
    res.json(skill)
  } catch (e) {
    failed(res, e, 'update')
  }
})

agentSkillsRouter.delete('/:slug', async (req, res) => {
  const scope = scopeOf(req, res)
  if (!scope) return
  const userId = req.user!.id
  try {
    if (!(await deleteCustomSkill(scope, userId, req.params.slug, () => canUseSkillScope(scope, userId))))
      return res.status(404).json({ error: 'skill not found' })
    res.json({ ok: true })
  } catch (e) {
    failed(res, e, 'delete')
  }
})
