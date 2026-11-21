import { useEffect, useId, useState } from 'react'
import type { Frame } from '../../shared/types'
import type { CodeExportFormat } from '../../shared/codeExport'
import { readingOrder } from '../../shared/frameOrder'
import { MAX_PDF_FRAMES } from '../../shared/pdfLimits'
import { api, errorMessage, type GithubConnectionInfo, type GithubPrExportResult } from '../lib/api'
import { copyCombinedCode, downloadFramesCodeBundle } from '../lib/codeExportClient'
import { downloadFramesPdf } from '../lib/frameExport'
import { ImportStepHeader } from './ImportSources'
import { Button } from './ui/button'
import { Callout } from './ui/callout'
import { FrameThumb } from './FramePreview'
import { Checkbox } from './ui/checkbox'
import { AppIcon } from './ui/brand-mark'
import { Field } from './ui/field'
import { CodeIcon, CopyIcon, ExportIcon, GithubIcon, PlusIcon } from './ui/icons'
import { Input } from './ui/input'
import { Modal, ModalActions, ModalLede, ModalSpacer, ModalTitle } from './ui/modal'
import { Note } from './ui/note'
import { Pressable } from './ui/pressable'
import { Segmented, SegmentedItem } from './ui/segmented'
import { SelectionBar, SelectionBarAction } from './ui/selection-bar'
import { Switch } from './ui/switch'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { trackExport } from '../lib/exportEvents'
import { useStore } from '../lib/store'

type ExportMode = 'pdf' | 'code' | 'github'

/**
 * The top bar's Export modal:
 * 1. PDF — vector multi-page PDF of checked frames in reading order
 * 2. Code — clean HTML + CSS or React + Tailwind v4 (.tsx) + `tokens.css` (copy or `.zip` bundle)
 * 3. GitHub PR — two-way repo sync that commits `tokens.css` + exported components to a branch and opens a PR
 */
export function ExportModal({
  frames,
  initialSelection,
  onClose,
}: {
  frames: Frame[]
  initialSelection: string[]
  onClose: () => void
}) {
  const t = useT()
  const ids = useId()
  const canvas = useStore((s) => s.canvas)
  const canvasId = frames[0]?.canvasId ?? canvas?.id ?? ''

  const [mode, setMode] = useState<ExportMode>('pdf')
  const [codeFormat, setCodeFormat] = useState<CodeExportFormat>('tsx')
  const [includeTokens, setIncludeTokens] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelection.length ? initialSelection : frames.map((frame) => frame.id)),
  )

  /* GitHub PR state */
  const [connections, setConnections] = useState<GithubConnectionInfo[] | null>(null)
  const [selectedConnId, setSelectedConnId] = useState<string>('')
  const [showConnectForm, setShowConnectForm] = useState(false)
  const [repoInput, setRepoInput] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [targetDir, setTargetDir] = useState('src/components/doop')
  const [prTitle, setPrTitle] = useState('')
  const [creatingPr, setCreatingPr] = useState(false)
  const [ghError, setGhError] = useState('')
  const [prResult, setPrResult] = useState<GithubPrExportResult | null>(null)

  const listed = readingOrder(frames)
  const chosen = listed.filter((frame) => selected.has(frame.id))
  const overPdfLimit = chosen.length > MAX_PDF_FRAMES
  const extra = chosen.length - MAX_PDF_FRAMES

  useEffect(() => {
    if (mode !== 'github' || !canvasId || connections !== null) return
    let live = true
    api.listGithubConnections(canvasId).then(
      (list) => {
        if (!live) return
        setConnections(list)
        if (list[0]) setSelectedConnId(list[0].id)
        else setShowConnectForm(true)
      },
      (err: unknown) => {
        if (!live) return
        setConnections([])
        setShowConnectForm(true)
        setGhError(errorMessage(err, 'Could not load GitHub connections'))
      },
    )
    return () => {
      live = false
    }
  }, [mode, canvasId, connections])

  function toggle(frameId: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(frameId)) next.delete(frameId)
      else next.add(frameId)
      return next
    })
  }

  function runPdf() {
    const [first] = chosen
    if (!first || overPdfLimit) return
    trackExport('pdf', chosen.length, 'export_modal')
    void downloadFramesPdf(first.canvasId, chosen)
    onClose()
  }

  function runCodeDownload() {
    if (!chosen.length && !includeTokens) return
    void downloadFramesCodeBundle(chosen, codeFormat, includeTokens, 'export_modal')
    onClose()
  }

  async function handleConnectRepo(e: React.FormEvent) {
    e.preventDefault()
    if (!canvasId || !repoInput.trim() || !tokenInput.trim() || connecting) return
    setConnecting(true)
    setGhError('')
    try {
      const conn = await api.connectGithub(canvasId, {
        repo: repoInput.trim(),
        token: tokenInput.trim(),
      })
      setConnections((prev) => [conn, ...(prev ?? [])])
      setSelectedConnId(conn.id)
      setShowConnectForm(false)
      setRepoInput('')
      setTokenInput('')
    } catch (err) {
      setGhError(errorMessage(err, 'Could not connect repository'))
    } finally {
      setConnecting(false)
    }
  }

  async function runCreatePr() {
    if (!canvasId || !selectedConnId || creatingPr) return
    if (!chosen.length && !includeTokens) return
    setCreatingPr(true)
    setGhError('')
    setPrResult(null)
    try {
      const res = await api.pushGithubPr(canvasId, selectedConnId, {
        frameIds: chosen.map((f) => f.id),
        format: codeFormat,
        targetDir: targetDir.trim(),
        includeTokens,
        ...(prTitle.trim() ? { title: prTitle.trim() } : {}),
      })
      trackExport('github_pr', chosen.length, 'export_modal')
      setPrResult(res)
    } catch (err) {
      setGhError(errorMessage(err, 'Could not create Pull Request'))
    } finally {
      setCreatingPr(false)
    }
  }

  if (!frames.length && mode === 'pdf') {
    return (
      <Modal size="sm" onClose={onClose}>
        <ModalTitle>{t('panels.exportNothing')}</ModalTitle>
        <ModalLede>{t('panels.exportNothingLede')}</ModalLede>
        <ModalActions>
          <Button variant="ghost" onClick={onClose}>
            {t('common.close')}
          </Button>
        </ModalActions>
      </Modal>
    )
  }

  const headerIcon =
    mode === 'pdf' ? (
      <AppIcon brand="pdf" size={40} />
    ) : mode === 'github' ? (
      <AppIcon brand="github" size={40} />
    ) : (
      <span
        aria-hidden
        className="grid size-10 flex-none place-items-center rounded-card bg-ink text-surface shadow-ring"
      >
        <CodeIcon size={22} />
      </span>
    )

  const headerTitle =
    mode === 'pdf'
      ? t('panels.exportPdfTitle')
      : mode === 'github'
        ? t('panels.exportGithubTitle')
        : t('panels.exportCodeTitle')

  const headerLede =
    mode === 'pdf'
      ? t('panels.exportPdfLede')
      : mode === 'github'
        ? t('panels.exportGithubLede')
        : t('panels.exportCodeLede')

  const canExportCode = chosen.length > 0 || includeTokens

  return (
    <Modal size="lg" onClose={onClose}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Segmented value={mode} onValueChange={(next) => setMode(next as ExportMode)} className="w-full sm:w-auto">
          <SegmentedItem value="pdf">{t('panels.exportTabPdf')}</SegmentedItem>
          <SegmentedItem value="code">{t('panels.exportTabCode')}</SegmentedItem>
          <SegmentedItem value="github">{t('panels.exportTabGithub')}</SegmentedItem>
        </Segmented>
      </div>

      <ImportStepHeader icon={headerIcon} title={headerTitle} lede={headerLede} />

      {(mode === 'code' || mode === 'github') && (
        <div className="mt-4 flex flex-col gap-3 rounded-panel bg-surface p-3.5 shadow-ring">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              value={codeFormat}
              onValueChange={(next) => setCodeFormat(next as CodeExportFormat)}
              aria-label={t('panels.exportFormat')}
            >
              <SegmentedItem value="tsx">{t('panels.exportFormatTsx')}</SegmentedItem>
              <SegmentedItem value="html">{t('panels.exportFormatHtml')}</SegmentedItem>
            </Segmented>
            <label className="flex cursor-pointer items-center gap-2 text-label text-ink" htmlFor={`${ids}-tokens`}>
              <Switch id={`${ids}-tokens`} size="sm" checked={includeTokens} onCheckedChange={setIncludeTokens} />
              <span>{t('panels.exportIncludeTokens')}</span>
            </label>
          </div>

          {mode === 'github' && (
            <div className="flex flex-col gap-3 border-t border-line-soft pt-3">
              {connections && connections.length > 0 && !showConnectForm ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-medium text-ink-soft">{t('panels.githubRepoLabel')}</span>
                    <Button size="sm" variant="bare" onClick={() => setShowConnectForm(true)}>
                      <PlusIcon size="rail" /> {t('panels.githubConnectNew')}
                    </Button>
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {connections.map((conn) => {
                      const active = conn.id === selectedConnId
                      return (
                        <Pressable
                          key={conn.id}
                          focus="ring"
                          onClick={() => setSelectedConnId(conn.id)}
                          className={cn(
                            'flex items-center gap-2 rounded-control px-3 py-2 text-left transition-colors',
                            active ? 'bg-paper-deep text-ink shadow-ring' : 'bg-sub text-ink-soft hover:text-ink',
                          )}
                        >
                          <GithubIcon size="rail" className="flex-none" />
                          <span className="min-w-0 flex-1 truncate font-mono text-label">{conn.repo}</span>
                          <span className="font-mono text-caption text-ink-faint">{conn.branch}</span>
                        </Pressable>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <form className="flex flex-col gap-2.5" onSubmit={(e) => void handleConnectRepo(e)}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Field label={t('panels.githubRepoLabel')} labelVariant="form" htmlFor={`${ids}-repo`}>
                      <Input
                        id={`${ids}-repo`}
                        variant="well"
                        className="font-mono"
                        placeholder={t('panels.githubRepoPlaceholder')}
                        value={repoInput}
                        onChange={(e) => setRepoInput(e.target.value)}
                      />
                    </Field>
                    <Field label={t('panels.githubTokenLabel')} labelVariant="form" htmlFor={`${ids}-pat`}>
                      <Input
                        id={`${ids}-pat`}
                        type="password"
                        variant="well"
                        className="font-mono"
                        placeholder="github_pat_…"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Note>{t('panels.githubTokenHint')}</Note>
                    <div className="flex items-center gap-2">
                      {connections && connections.length > 0 && (
                        <Button type="button" size="sm" variant="bare" onClick={() => setShowConnectForm(false)}>
                          {t('common.cancel')}
                        </Button>
                      )}
                      <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        disabled={connecting || !repoInput.trim() || !tokenInput.trim()}
                      >
                        {connecting ? t('panels.githubConnecting') : t('panels.githubConnectButton')}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label={t('panels.githubTargetDir')} labelVariant="form" htmlFor={`${ids}-dir`}>
                  <Input
                    id={`${ids}-dir`}
                    variant="well"
                    className="font-mono"
                    value={targetDir}
                    placeholder="src/components/doop"
                    onChange={(e) => setTargetDir(e.target.value)}
                  />
                </Field>
                <Field label={t('panels.githubPrTitleLabel')} labelVariant="form" htmlFor={`${ids}-pr-title`}>
                  <Input
                    id={`${ids}-pr-title`}
                    variant="well"
                    value={prTitle}
                    placeholder={`chore(design): sync "${canvas?.name ?? 'Doop'}"`}
                    onChange={(e) => setPrTitle(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>
      )}

      {listed.length > 0 && (
        <>
          <SelectionBar
            className="mt-4"
            count={chosen.length}
            total={frames.length}
            actions={
              <>
                <SelectionBarAction onClick={() => setSelected(new Set(frames.map((frame) => frame.id)))}>
                  {t('panels.exportSelectAll')}
                </SelectionBarAction>
                <SelectionBarAction onClick={() => setSelected(new Set())}>
                  {t('panels.exportClear')}
                </SelectionBarAction>
              </>
            }
          />
          <div
            className="max-h-[calc(100dvh-470px)] overflow-y-auto rounded-panel bg-surface shadow-ring sm:max-h-[min(260px,calc(100vh-470px))]"
            role="group"
            aria-label={t('panels.exportFramesAria')}
          >
            {listed.map((frame) => (
              <label
                key={frame.id}
                className="relative grid min-h-[56px] cursor-pointer grid-cols-[20px_64px_minmax(0,1fr)] items-center gap-3 border-b border-line-soft px-4 py-2 transition-colors last:border-b-0 hover:bg-sub"
              >
                <Checkbox checked={selected.has(frame.id)} onChange={() => toggle(frame.id)} />
                <FrameThumb frameId={frame.id} />
                <span className="min-w-0">
                  <span className="block truncate text-copy font-medium text-ink">
                    {frame.name || t('panels.exportUntitled')}
                  </span>
                  <span className="block font-mono text-caption text-ink-faint">
                    {Math.round(frame.width)} × {Math.round(frame.height)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      {mode === 'pdf' && (
        <p className={cn('mt-2 px-0.5 text-caption', overPdfLimit ? 'text-accent-ink' : 'text-ink-faint')}>
          {overPdfLimit
            ? `${t('panels.exportPdfMax', { count: MAX_PDF_FRAMES })} ${t('panels.exportUncheck', { count: extra })}`
            : t('panels.exportPdfHint')}
        </p>
      )}

      {ghError && mode === 'github' && (
        <div className="mt-3">
          <Note tone="error">{ghError}</Note>
        </div>
      )}

      {prResult && mode === 'github' && (
        <Callout className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-body font-medium text-ink">
              {t('panels.githubPrCreated', { number: prResult.prNumber })}
            </p>
            <p className="truncate font-mono text-caption text-ink-faint">
              {prResult.branch} · {prResult.filesWritten.join(', ')}
            </p>
          </div>
          <Button asChild size="sm" variant="primary">
            <a href={prResult.prUrl} target="_blank" rel="noreferrer">
              <ExportIcon size="rail" /> {t('panels.githubOpenPr')}
            </a>
          </Button>
        </Callout>
      )}

      <ModalActions>
        {mode === 'code' && (
          <>
            <Button
              variant="bare"
              disabled={!canExportCode}
              onClick={() => void copyCombinedCode(chosen, codeFormat, includeTokens, 'export_modal')}
            >
              <CopyIcon size="rail" /> {t('panels.exportCopyCode')}
            </Button>
            <ModalSpacer />
          </>
        )}
        <Button variant="ghost" onClick={onClose}>
          {prResult ? t('common.close') : t('common.cancel')}
        </Button>
        {mode === 'pdf' ? (
          <Button variant="primary" disabled={!chosen.length || overPdfLimit} onClick={runPdf}>
            {chosen.length > 1
              ? t('panels.exportDownloadPdfPages', { count: chosen.length })
              : t('panels.exportDownloadPdf')}
          </Button>
        ) : mode === 'code' ? (
          <Button variant="primary" disabled={!canExportCode} onClick={runCodeDownload}>
            {chosen.length === 0
              ? t('panels.exportDownloadTokensOnly')
              : chosen.length === 1 && !includeTokens
                ? t('panels.exportDownloadCode')
                : t('panels.exportDownloadZip', { count: chosen.length })}
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={!selectedConnId || showConnectForm || !canExportCode || creatingPr}
            onClick={() => void runCreatePr()}
          >
            {creatingPr ? t('panels.githubCreatingPr') : t('panels.githubCreatePr')}
          </Button>
        )}
      </ModalActions>
    </Modal>
  )
}
