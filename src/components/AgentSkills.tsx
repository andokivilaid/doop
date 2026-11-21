import { useEffect, useId, useState } from 'react'
import { api, errorMessage } from '../lib/api'
import { useT } from '../lib/i18n'
import { posthog } from '../lib/posthog'
import {
  MAX_CUSTOM_SKILLS,
  MAX_SKILL_MARKDOWN,
  MAX_SKILL_SUMMARY,
  MAX_SKILL_TITLE,
  skillSlugFor,
  type BuiltInSkill,
  type CustomSkill,
} from '../../shared/agentSkills'
import { ConfirmDialog } from './ui/alert-dialog'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { CardDescription, CardHeader, CardRow, CardTitle, SettingsCard } from './ui/card'
import { EmptyState } from './ui/empty-state'
import { Field } from './ui/field'
import { BookOpenIcon, EditIcon, PlusIcon, SparkIcon, TrashIcon } from './ui/icons'
import { Input } from './ui/input'
import { Modal, ModalActions, ModalLede, ModalSpacer, ModalTitle } from './ui/modal'
import { Note } from './ui/note'
import { Switch } from './ui/switch'
import { Textarea } from './ui/textarea'
import { cn } from '../lib/utils'

type EditingSkill = { kind: 'new' } | { kind: 'custom'; skill: CustomSkill } | { kind: 'builtin'; skill: BuiltInSkill }

/**
 * Design & frontend craft skills card (Settings → Doop Agent and Workspace → Agents).
 * Enabled skill packs are seeded automatically to every MCP-connected coding/design
 * agent on `get_canvas` (and `get_skill`) as well as the resident Doop Agent team.
 */
export function AgentSkills({ workspaceId }: { workspaceId?: string }) {
  const t = useT()
  const [builtIns, setBuiltIns] = useState<BuiltInSkill[] | null>(null)
  const [customSkills, setCustomSkills] = useState<CustomSkill[] | null>(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<EditingSkill | null>(null)
  const [removing, setRemoving] = useState<CustomSkill | null>(null)

  useEffect(() => {
    let live = true
    Promise.all([api.listBuiltInSkills(workspaceId), api.listCustomSkills(workspaceId)]).then(
      ([builtInList, customList]) => {
        if (!live) return
        setBuiltIns(builtInList)
        setCustomSkills(customList)
      },
      (e: unknown) => {
        if (!live) return
        setBuiltIns([])
        setCustomSkills([])
        setError(errorMessage(e, t('agents.skillsLoadFailed')))
      },
    )
    return () => {
      live = false
    }
  }, [workspaceId, t])

  function replaceBuiltIn(next: BuiltInSkill) {
    setBuiltIns((list) => list?.map((s) => (s.slug === next.slug ? next : s)) ?? null)
  }

  async function toggleBuiltIn(skill: BuiltInSkill, enabled: boolean) {
    setError('')
    replaceBuiltIn({ ...skill, enabled })
    try {
      replaceBuiltIn(await api.updateBuiltInSkill(skill.slug, { disabled: !enabled }, workspaceId))
    } catch (e) {
      replaceBuiltIn(skill)
      setError(errorMessage(e, t('agents.skillsSaveFailed')))
    }
  }

  async function removeCustom(skill: CustomSkill) {
    setError('')
    try {
      await api.deleteCustomSkill(skill.slug, workspaceId)
      setCustomSkills((list) => list?.filter((s) => s.slug !== skill.slug) ?? null)
    } catch (e) {
      setError(errorMessage(e, t('agents.skillsRemoveFailed')))
    }
  }

  function handleSaved(saved: CustomSkill | BuiltInSkill) {
    if ('enabled' in saved) replaceBuiltIn(saved)
    else if (editing?.kind === 'new') setCustomSkills((list) => [...(list ?? []), saved])
    else setCustomSkills((list) => list?.map((s) => (s.slug === saved.slug ? saved : s)) ?? null)
    setEditing(null)
  }

  const full = (customSkills?.length ?? 0) >= MAX_CUSTOM_SKILLS
  const addButton = (
    <Button size="sm" disabled={customSkills === null || full} onClick={() => setEditing({ kind: 'new' })}>
      <PlusIcon /> {t('agents.skillsAdd')}
    </Button>
  )

  return (
    <SettingsCard>
      <CardHeader>
        <CardTitle>{t('agents.skillsTitle')}</CardTitle>
        <CardDescription>
          {workspaceId ? t('agents.skillsDescriptionWorkspace') : t('agents.skillsDescriptionPersonal')}{' '}
          {t('agents.skillsDescriptionRest')}
        </CardDescription>
      </CardHeader>

      <CardRow label={t('agents.skillsBuiltIn')}>
        {error ? <Note tone="error">{error}</Note> : <Note>{t('agents.skillsBuiltInNote')}</Note>}
      </CardRow>

      {builtIns?.map((skill) => (
        <SkillRow
          key={skill.slug}
          skill={skill}
          builtIn
          off={!skill.enabled}
          badge={
            !skill.enabled ? (
              <Badge tone="outline">{t('agents.off')}</Badge>
            ) : skill.edited ? (
              <Badge tone="outline">{t('agents.edited')}</Badge>
            ) : null
          }
          actions={
            <>
              <Button size="sm" variant="bare" onClick={() => setEditing({ kind: 'builtin', skill })}>
                <EditIcon size="rail" /> {t('agents.edit')}
              </Button>
              <Switch
                size="sm"
                checked={skill.enabled}
                aria-label={t('agents.skillsToggle', { name: skill.title })}
                onCheckedChange={(on) => void toggleBuiltIn(skill, on)}
              />
            </>
          }
        />
      ))}

      {customSkills?.length === 0 ? (
        <div className="flex flex-col gap-2 px-4 py-5 sm:px-[22px]">
          <EmptyState
            variant="dashed"
            className="border"
            title={t('agents.skillsEmptyTitle')}
            description={workspaceId ? t('agents.skillsEmptyWorkspace') : t('agents.skillsEmptyPersonal')}
            action={addButton}
          />
        </div>
      ) : (
        <CardRow label={t('agents.yours')} action={addButton}>
          <Note>
            {customSkills === null
              ? t('agents.loading')
              : full
                ? t('agents.skillsFull', { count: MAX_CUSTOM_SKILLS })
                : t('agents.skillsCount', { count: customSkills.length })}
          </Note>
        </CardRow>
      )}

      {customSkills?.map((skill) => (
        <SkillRow
          key={skill.slug}
          skill={skill}
          actions={
            <>
              <Button size="sm" variant="bare" onClick={() => setEditing({ kind: 'custom', skill })}>
                <EditIcon size="rail" /> {t('agents.edit')}
              </Button>
              <Button size="sm" variant="bare" onClick={() => setRemoving(skill)}>
                <TrashIcon size="rail" /> {t('agents.remove')}
              </Button>
            </>
          }
        />
      ))}

      {editing && (
        <SkillForm editing={editing} workspaceId={workspaceId} onClose={() => setEditing(null)} onSaved={handleSaved} />
      )}

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={removing ? t('agents.skillsRemoveTitle', { name: removing.title }) : ''}
        description={t('agents.skillsRemoveDescription')}
        confirmLabel={t('agents.remove')}
        destructive
        onConfirm={() => {
          if (removing) void removeCustom(removing)
          setRemoving(null)
        }}
      />
    </SettingsCard>
  )
}

function SkillRow({
  skill,
  builtIn = false,
  off = false,
  badge,
  actions,
}: {
  skill: CustomSkill | BuiltInSkill
  builtIn?: boolean
  off?: boolean
  badge?: React.ReactNode
  actions: React.ReactNode
}) {
  return (
    <CardRow
      label={
        <span className={cn('inline-flex min-w-0 items-center gap-2', off && 'opacity-50')}>
          {builtIn ? (
            <SparkIcon size="rail" className="flex-none text-accent" />
          ) : (
            <BookOpenIcon size="rail" className="flex-none text-ink-soft" />
          )}
          <span className="truncate">{skill.title}</span>
        </span>
      }
      action={<div className="flex items-center gap-2">{actions}</div>}
    >
      <div className={cn('flex min-w-0 basis-full flex-col gap-0.5', off && 'opacity-50')}>
        <p className="flex min-w-0 items-center gap-2 text-body text-ink">
          <span className="truncate">
            <span className="font-mono text-ink-soft">{skill.slug}</span> · {skill.summary}
          </span>
          {badge}
        </p>
      </div>
    </CardRow>
  )
}

function SkillForm({
  editing,
  workspaceId,
  onClose,
  onSaved,
}: {
  editing: EditingSkill
  workspaceId?: string
  onClose: () => void
  onSaved: (skill: CustomSkill | BuiltInSkill) => void
}) {
  const t = useT()
  const ids = useId()
  const existing = editing.kind === 'new' ? undefined : editing.skill
  const [title, setTitle] = useState(existing?.title ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!existing)
  const [summary, setSummary] = useState(existing?.summary ?? '')
  const [markdown, setMarkdown] = useState(existing?.markdown ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const shownSlug = slugTouched ? slug : skillSlugFor(title)

  async function run(work: () => Promise<CustomSkill | BuiltInSkill>) {
    setSaving(true)
    setError('')
    try {
      onSaved(await work())
    } catch (e) {
      setError(errorMessage(e, t('agents.skillsSaveFailed')))
      setSaving(false)
    }
  }

  function save() {
    const patch = { title, summary, markdown }
    return run(async () => {
      if (editing.kind === 'builtin') return api.updateBuiltInSkill(editing.skill.slug, patch, workspaceId)
      if (editing.kind === 'custom') return api.updateCustomSkill(editing.skill.slug, patch, workspaceId)
      const created = await api.createCustomSkill({ slug: shownSlug, ...patch }, workspaceId)
      posthog.capture('custom_skill_created_ui', { workspace: !!workspaceId, slug: created.slug })
      return created
    })
  }

  return (
    <Modal onClose={onClose} size="lg">
      <ModalTitle>{existing ? t('agents.editTitle', { name: existing.title }) : t('agents.skillsAddTitle')}</ModalTitle>
      <ModalLede>{editing.kind === 'builtin' ? t('agents.skillsBuiltInLede') : t('agents.skillsFormLede')}</ModalLede>
      <form
        className="mt-4 flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label={t('agents.name')} labelVariant="form" htmlFor={`${ids}-title`}>
            <Input
              id={`${ids}-title`}
              variant="well"
              value={title}
              maxLength={MAX_SKILL_TITLE}
              placeholder={t('agents.skillsTitlePlaceholder')}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus={!existing}
            />
          </Field>
          <Field
            label={t('agents.skillsSlug')}
            labelVariant="form"
            htmlFor={`${ids}-slug`}
            hint={existing ? t('agents.skillsSlugFixedHint') : undefined}
          >
            <Input
              id={`${ids}-slug`}
              variant="well"
              className="font-mono"
              value={shownSlug}
              disabled={!!existing}
              placeholder="design-system-rules"
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '')
                    .slice(0, 48),
                )
              }}
            />
          </Field>
        </div>
        <Field label={t('agents.blurb')} labelVariant="form" htmlFor={`${ids}-summary`}>
          <Input
            id={`${ids}-summary`}
            variant="well"
            value={summary}
            maxLength={MAX_SKILL_SUMMARY}
            placeholder={t('agents.skillsSummaryPlaceholder')}
            onChange={(e) => setSummary(e.target.value)}
          />
        </Field>
        <Field
          label={t('agents.skillsMarkdown')}
          labelVariant="form"
          htmlFor={`${ids}-markdown`}
          hint={t('agents.skillsMarkdownHint', { used: markdown.length, max: MAX_SKILL_MARKDOWN })}
        >
          <Textarea
            id={`${ids}-markdown`}
            variant="well"
            className="min-h-[220px] font-mono"
            value={markdown}
            maxLength={MAX_SKILL_MARKDOWN}
            placeholder={t('agents.skillsMarkdownPlaceholder')}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </Field>
        {error && <Note tone="error">{error}</Note>}
        <ModalActions className="mt-2">
          {editing.kind === 'builtin' && editing.skill.edited && (
            <>
              <Button
                type="button"
                variant="bare"
                disabled={saving}
                onClick={() => void run(() => api.resetBuiltInSkill(editing.skill.slug, workspaceId))}
              >
                {t('agents.reset')}
              </Button>
              <ModalSpacer />
            </>
          )}
          <Button type="button" variant="bare" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? t('agents.saving') : existing ? t('agents.save') : t('agents.skillsCreate')}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
