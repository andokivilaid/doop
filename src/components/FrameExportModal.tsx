import { readingOrder } from '../../shared/frameOrder'
import type { CodeExportFormat } from '../../shared/codeExport'
import type { Frame } from '../../shared/types'
import { downloadSingleCodeExport } from '../lib/codeExportClient'
import {
  downloadElementExport,
  downloadFrameExport,
  downloadFramesPdf,
  type ElementTarget,
  type FrameExportFormat,
} from '../lib/frameExport'
import { setExportSettings, useExportSettings } from '../lib/exportSettings'
import { ExportOptions } from './ExportOptions'
import { AppIcon } from './ui/brand-mark'
import { Button } from './ui/button'
import { ChoiceList, ChoiceRow } from './ui/choice-list'
import { BracesIcon, CodeIcon, ImportIcon } from './ui/icons'
import { Modal, ModalActions, ModalLede, ModalTitle } from './ui/modal'
import { useT } from '@/lib/i18n'
import { trackExport } from '../lib/exportEvents'

function CodeTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="grid size-8 flex-none place-items-center rounded-control bg-ink text-surface shadow-ring"
    >
      {children}
    </span>
  )
}

/** A frame's own export, or one element's: the scale to render at, then
 *  its image, PDF and production code formats as a list, each row downloads. */
export function FrameExportModal({
  frame,
  groupFrames = [frame],
  element,
  onClose,
}: {
  frame: Frame
  /** the selection the menu acts on; the PDF binds all of it, a page per
   *  frame in reading order */
  groupFrames?: Frame[]
  /** one element of the frame instead of the whole of it: no PDF */
  element?: ElementTarget
  onClose: () => void
}) {
  const t = useT()
  const settings = useExportSettings()

  function download(format: FrameExportFormat) {
    setExportSettings({ format })
    trackExport(format, 1, element ? 'element_menu' : 'frame_menu', element ? 'element' : 'frame')
    if (element) void downloadElementExport(frame, element, format, settings.scale)
    else void downloadFrameExport(frame, format, settings.scale)
    onClose()
  }

  function downloadPdf() {
    trackExport('pdf', groupFrames.length, 'frame_menu')
    void downloadFramesPdf(frame.canvasId, readingOrder(groupFrames))
    onClose()
  }

  function downloadCode(format: CodeExportFormat) {
    downloadSingleCodeExport(frame, format, element ? 'element_menu' : 'frame_menu', element)
    onClose()
  }

  const downloadMark = <ImportIcon size="rail" />
  return (
    <Modal size="sm" onClose={onClose}>
      <ModalTitle className="break-words">
        {t('panels.frameExportTitle', { name: element?.name ?? frame.name })}
      </ModalTitle>
      <ModalLede>{element ? t('panels.elementExportLede') : t('panels.frameExportLede')}</ModalLede>
      <div className="mt-5">
        <ExportOptions value={settings} onChange={setExportSettings} withFormat={false} />
      </div>
      <ChoiceList className="mt-3">
        <ChoiceRow
          icon={<AppIcon brand="png" />}
          title={t('panels.frameExportPng')}
          description={t('panels.frameExportPngHint')}
          trailing={downloadMark}
          onClick={() => download('png')}
        />
        <ChoiceRow
          icon={<AppIcon brand="jpg" />}
          title={t('panels.frameExportJpg')}
          description={t('panels.frameExportJpgHint')}
          trailing={downloadMark}
          onClick={() => download('jpg')}
        />
        <ChoiceRow
          icon={<AppIcon brand="svg" />}
          title={t('panels.frameExportSvg')}
          description={t('panels.frameExportSvgHint')}
          trailing={downloadMark}
          onClick={() => download('svg')}
        />
        {!element && (
          <ChoiceRow
            icon={<AppIcon brand="pdf" />}
            title={
              groupFrames.length > 1
                ? t('panels.frameExportPdfGroup', { count: groupFrames.length })
                : t('panels.exportDownloadPdf')
            }
            description={groupFrames.length > 1 ? t('panels.frameExportPdfGroupHint') : t('panels.frameExportPdfHint')}
            trailing={downloadMark}
            onClick={downloadPdf}
          />
        )}
        <ChoiceRow
          icon={
            <CodeTile>
              <BracesIcon size={16} />
            </CodeTile>
          }
          title={t('panels.frameExportReact')}
          description={t('panels.frameExportReactHint')}
          trailing={downloadMark}
          onClick={() => downloadCode('tsx')}
        />
        <ChoiceRow
          icon={
            <CodeTile>
              <CodeIcon size={16} />
            </CodeTile>
          }
          title={t('panels.frameExportCleanHtml')}
          description={t('panels.frameExportCleanHtmlHint')}
          trailing={downloadMark}
          onClick={() => downloadCode('html')}
        />
      </ChoiceList>
      <ModalActions>
        <Button variant="ghost" onClick={onClose}>
          {t('common.cancel')}
        </Button>
      </ModalActions>
    </Modal>
  )
}
