import type { Frame } from '../../shared/types'
import {
  componentFileName,
  exportAgentBrief,
  exportCleanHtml,
  exportReactTailwind,
  exportTokensCssFile,
  htmlFileName,
  toComponentName,
  toFileStem,
  type CodeExportFormat,
} from '../../shared/codeExport'
import { errorMessage } from './api'
import { trackExport, type ExportSource } from './exportEvents'
import type { ElementTarget } from './frameExport'
import { t as translate } from './i18n'
import { elementHtml } from './layers'
import { useStore } from './store'

function canvasTokenContext() {
  const canvas = useStore.getState().canvas
  return {
    canvasId: canvas?.id ?? '',
    canvasName: canvas?.name ?? 'Canvas',
    tokens: canvas?.tokens ?? [],
    tokenThemes: canvas?.tokenThemes ?? [],
  }
}

function resolveElementSnippet(frame: Frame, target?: ElementTarget & { elementId?: string }) {
  if (!target) return undefined
  const html = elementHtml(frame.html, target.selector)
  if (!html) return null
  const inferredId = target.elementId ?? /\bdata-doop-id=["']([^"']+)["']/i.exec(html)?.[1]
  return { ...target, elementId: inferredId, html }
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function copyFrameCode(
  frame: Frame,
  format: CodeExportFormat,
  source: ExportSource,
  target?: ElementTarget,
): Promise<void> {
  const notify = useStore.getState().pushNotice
  const { tokens, tokenThemes } = canvasTokenContext()
  const resolved = resolveElementSnippet(frame, target)
  if (target && !resolved) {
    notify(translate('panels.exportElementMissing'))
    return
  }
  const text =
    format === 'html'
      ? exportCleanHtml(frame.html, {
          tokens,
          tokenThemes,
          elementHtml: resolved?.html,
        })
      : exportReactTailwind(frame.html, {
          componentName: resolved ? resolved.name : frame.name,
          tokens,
          tokenThemes,
          elementHtml: resolved?.html,
        })

  try {
    await navigator.clipboard.writeText(text)
    trackExport(format, 1, source, target ? 'element' : 'frame')
    notify(translate(format === 'html' ? 'stage.cleanHtmlCopied' : 'stage.reactTailwindCopied'))
  } catch (err) {
    notify(errorMessage(err, translate('stage.copyClipboardFailed')))
  }
}

export async function copyAgentImplementationBrief(
  frame: Frame,
  source: ExportSource,
  target?: ElementTarget & { elementId?: string },
): Promise<void> {
  const notify = useStore.getState().pushNotice
  const { canvasId, canvasName, tokens, tokenThemes } = canvasTokenContext()
  const resolved = resolveElementSnippet(frame, target)
  if (target && !resolved) {
    notify(translate('panels.exportElementMissing'))
    return
  }
  const brief = exportAgentBrief({
    canvasId: canvasId || frame.canvasId,
    canvasName,
    origin: location.origin,
    frame,
    element: resolved ?? undefined,
    tokens,
    tokenThemes,
  })
  try {
    await navigator.clipboard.writeText(brief)
    trackExport('brief', 1, source, target ? 'element' : 'frame')
    notify(translate('stage.agentBriefCopied'))
  } catch (err) {
    notify(errorMessage(err, translate('stage.copyClipboardFailed')))
  }
}

export function downloadSingleCodeExport(
  frame: Frame,
  format: CodeExportFormat,
  source: ExportSource,
  target?: ElementTarget,
): void {
  const notify = useStore.getState().pushNotice
  const { tokens, tokenThemes } = canvasTokenContext()
  const resolved = resolveElementSnippet(frame, target)
  if (target && !resolved) {
    notify(translate('panels.exportElementMissing'))
    return
  }
  const label = resolved ? resolved.name : frame.name
  const fileName = format === 'html' ? htmlFileName(label) : componentFileName(label)
  const content =
    format === 'html'
      ? exportCleanHtml(frame.html, { tokens, tokenThemes, elementHtml: resolved?.html })
      : exportReactTailwind(frame.html, {
          componentName: label,
          tokens,
          tokenThemes,
          elementHtml: resolved?.html,
        })
  const mime = format === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8'
  triggerDownload(new Blob([content], { type: mime }), fileName)
  trackExport(format, 1, source, target ? 'element' : 'frame')
  notify(translate('panels.exportReady', { name: fileName }))
}

export async function copyCombinedCode(
  frames: Frame[],
  format: CodeExportFormat,
  includeTokens: boolean,
  source: ExportSource,
): Promise<void> {
  const notify = useStore.getState().pushNotice
  const { tokens, tokenThemes } = canvasTokenContext()
  const blocks: string[] = []
  if (includeTokens) {
    blocks.push(`/* --- tokens.css --- */\n${exportTokensCssFile(tokens, tokenThemes).trim()}`)
  }
  for (const frame of frames) {
    const fileName = format === 'html' ? htmlFileName(frame.name) : componentFileName(frame.name)
    const content =
      format === 'html'
        ? exportCleanHtml(frame.html, {
            tokens,
            tokenThemes,
            externalTokensPath: includeTokens ? './tokens.css' : undefined,
          })
        : exportReactTailwind(frame.html, {
            componentName: frame.name,
            tokens,
            tokenThemes,
            importTokensPath: includeTokens ? './tokens.css' : undefined,
          })
    blocks.push(frames.length > 1 || includeTokens ? `/* --- ${fileName} --- */\n${content.trim()}` : content.trim())
  }
  try {
    await navigator.clipboard.writeText(blocks.join('\n\n') + '\n')
    trackExport(format, Math.max(1, frames.length), source)
    notify(translate(format === 'html' ? 'stage.cleanHtmlCopied' : 'stage.reactTailwindCopied'))
  } catch (err) {
    notify(errorMessage(err, translate('stage.copyClipboardFailed')))
  }
}

export async function downloadFramesCodeBundle(
  frames: Frame[],
  format: CodeExportFormat,
  includeTokens: boolean,
  source: ExportSource,
): Promise<void> {
  const notify = useStore.getState().pushNotice
  const { canvasName, tokens, tokenThemes } = canvasTokenContext()

  if (frames.length === 0 && includeTokens) {
    triggerDownload(
      new Blob([exportTokensCssFile(tokens, tokenThemes)], { type: 'text/css;charset=utf-8' }),
      'tokens.css',
    )
    trackExport(format, 0, source)
    notify(translate('panels.exportReady', { name: 'tokens.css' }))
    return
  }

  if (frames.length === 1 && !includeTokens) {
    downloadSingleCodeExport(frames[0]!, format, source)
    return
  }

  try {
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    const used = new Set<string>()

    if (includeTokens) {
      zip.file('tokens.css', exportTokensCssFile(tokens, tokenThemes))
      used.add('tokens.css')
    }

    for (const frame of frames) {
      const baseName = format === 'html' ? htmlFileName(frame.name) : componentFileName(frame.name)
      const dot = baseName.lastIndexOf('.')
      const stem = baseName.slice(0, dot)
      const ext = baseName.slice(dot)
      let fileName = baseName
      let n = 2
      while (used.has(fileName.toLowerCase())) {
        fileName = `${stem}${n}${ext}`
        n += 1
      }
      used.add(fileName.toLowerCase())
      const compStem = fileName.slice(0, fileName.lastIndexOf('.'))
      const content =
        format === 'html'
          ? exportCleanHtml(frame.html, {
              tokens,
              tokenThemes,
              externalTokensPath: includeTokens ? './tokens.css' : undefined,
            })
          : exportReactTailwind(frame.html, {
              componentName: toComponentName(compStem),
              tokens,
              tokenThemes,
              importTokensPath: includeTokens ? './tokens.css' : undefined,
            })
      zip.file(fileName, content)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const archiveName = `${toFileStem(canvasName, 'doop')}-code.zip`
    triggerDownload(blob, archiveName)
    trackExport(format, frames.length, source)
    notify(translate('panels.exportReady', { name: archiveName }))
  } catch (err) {
    notify(errorMessage(err, translate('panels.exportSaveFailed', { name: 'code.zip' })))
  }
}
