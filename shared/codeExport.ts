/**
 * Production code export from Doop frames and elements:
 * - Clean, editor-attribute-free HTML + CSS custom properties (`exportCleanHtml`)
 * - Deterministic React (TSX) + Tailwind v4 components (`exportReactTailwind`)
 * - Ready-to-import `tokens.css` combining `@theme` and `:root` (`exportTokensCssFile`)
 * - Structured Markdown implementation briefs for coding agents (`exportAgentBrief`)
 *
 * Pure and dependency-free so both the browser UI and the server (MCP tools +
 * GitHub PR sync) run the exact same exporter.
 */
import {
  THEME_ATTR,
  TOKEN_BLOCK_ATTR,
  tokensCss,
  tokensTailwind,
  tokensUsedBy,
  type DesignToken,
} from './designTokens.ts'

export type CodeExportFormat = 'html' | 'tsx'

export interface CleanHtmlOptions {
  tokens?: readonly DesignToken[]
  tokenThemes?: readonly string[]
  /** When exporting a single element snippet rather than a full document */
  elementHtml?: string
  /** Optional relative stylesheet path (e.g. "./tokens.css") for multi-file bundles/PRs */
  externalTokensPath?: string
}

export interface ReactExportOptions {
  componentName?: string
  tokens?: readonly DesignToken[]
  tokenThemes?: readonly string[]
  /** When exporting a single element snippet rather than a full document */
  elementHtml?: string
  /** Import path to emit at the top of the TSX file (e.g. "./tokens.css") */
  importTokensPath?: string
}

export interface AgentBriefOptions {
  canvasId: string
  canvasName: string
  origin: string
  frame: { id: string; name: string; width: number; height: number; html: string }
  element?: { selector: string; name: string; elementId?: string; html?: string }
  tokens?: readonly DesignToken[]
  tokenThemes?: readonly string[]
}

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const DOOP_INTERNAL_ATTRS = new Set([
  'data-doop-id',
  'data-doop-locked',
  'data-doop-name',
  'data-doop-component',
  'data-doop-instance',
  'data-doop-overrides',
  'data-doop-part',
  'data-doop-slot',
  'data-doop-prop',
  'data-doop-if',
  'data-doop-on',
  'data-doop-action',
  'data-doop-transition',
  'data-doop-duration',
  'data-doop-interactions',
  'data-doop-webfonts',
  'data-doop-fonts',
  'data-doop-tokens',
])

const JSX_ATTR_NAMES: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  srcset: 'srcSet',
  crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy',
  datetime: 'dateTime',
  inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint',
  playsinline: 'playsInline',
  formaction: 'formAction',
  novalidate: 'noValidate',
  // SVG attributes
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'fill-opacity': 'fillOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'alignment-baseline': 'alignmentBaseline',
  'baseline-shift': 'baselineShift',
  'paint-order': 'paintOrder',
  'vector-effect': 'vectorEffect',
  'color-interpolation-filters': 'colorInterpolationFilters',
  ' marker-start': 'markerStart',
  'marker-mid': 'markerMid',
  'marker-end': 'markerEnd',
  'xlink:href': 'xlinkHref',
  'xmlns:xlink': 'xmlnsXlink',
  'xml:space': 'xmlSpace',
}

const JSX_BOOLEAN_ATTRS = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'hidden',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
])

const PX_SPACING_SCALE: Record<string, string> = {
  '0': '0',
  '0px': '0',
  '1px': 'px',
  '2px': '0.5',
  '4px': '1',
  '6px': '1.5',
  '8px': '2',
  '10px': '2.5',
  '12px': '3',
  '14px': '3.5',
  '16px': '4',
  '20px': '5',
  '24px': '6',
  '28px': '7',
  '32px': '8',
  '36px': '9',
  '40px': '10',
  '44px': '11',
  '48px': '12',
  '56px': '14',
  '64px': '16',
  '80px': '20',
  '96px': '24',
}

const TOKEN_STYLE_RE = new RegExp(`<style\\b[^>]*\\b${TOKEN_BLOCK_ATTR}\\b[^>]*>[\\s\\S]*?</style>`, 'gi')
const DOOP_META_RE = /<meta\b[^>]*\bname=["']doop-github-screen["'][^>]*>\s*/gi
const SNAPSHOT_CSP_RE = /<meta\b[^>]*\bhttp-equiv=["']Content-Security-Policy["'][^>]*\bdefault-src\s+'none'[^>]*>\s*/gi

/** Safe PascalCase React component identifier from any frame or layer title. */
export function toComponentName(raw: string | undefined, fallback = 'DesignFrame'): string {
  const cleaned = (raw ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
  if (!cleaned) return fallback
  const pascal = cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  if (!pascal) return fallback
  return /^[0-9]/.test(pascal) ? `Frame${pascal}` : pascal
}

/** Kebab-case file stem for downloads and repo commits. */
export function toFileStem(raw: string | undefined, fallback = 'frame'): string {
  const stem = (raw ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return stem || fallback
}

export function componentFileName(name: string | undefined): string {
  return `${toComponentName(name)}.tsx`
}

export function htmlFileName(name: string | undefined): string {
  return `${toFileStem(name)}.html`
}

/** Extract an element's outerHTML from raw HTML by `data-doop-id` when no DOM is available. */
export function extractElementByDoopId(html: string, elementId: string): string | null {
  const escaped = elementId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const openRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9:-]*)\\b[^>]*\\bdata-doop-id\\s*=\\s*(?:"${escaped}"|'${escaped}')[^>]*>`,
    'i',
  )
  const match = openRe.exec(html)
  if (!match) return null
  const tagName = match[1]!.toLowerCase()
  const start = match.index
  const openTag = match[0]
  if (VOID_ELEMENTS.has(tagName) || openTag.endsWith('/>')) return openTag
  const tagRe = new RegExp(`<(/?)${tagName}\\b[^>]*>`, 'gi')
  tagRe.lastIndex = start + openTag.length
  let depth = 1
  let next: RegExpExecArray | null
  while ((next = tagRe.exec(html))) {
    if (next[1] === '/') {
      depth -= 1
      if (depth === 0) return html.slice(start, next.index + next[0].length)
    } else if (!next[0].endsWith('/>')) {
      depth += 1
    }
  }
  return html.slice(start)
}

interface ParsedAttr {
  name: string
  value: string | null
}

/** Parse attributes inside an opening HTML tag's attribute slice. */
function parseTagAttrs(attrText: string): ParsedAttr[] {
  const attrs: ParsedAttr[] = []
  const re = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(attrText))) {
    const name = m[1]!
    const value = m[2] ?? m[3] ?? m[4] ?? null
    attrs.push({ name, value })
  }
  return attrs
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

/** Strip Doop's internal `data-doop-*` attributes (preserving `data-doop-theme`) from HTML tags. */
export function stripDoopAttributes(html: string): string {
  const withoutMeta = html.replace(DOOP_META_RE, '').replace(SNAPSHOT_CSP_RE, '')
  /* Keep raw <style> and <script> bodies untouched while scrubbing opening tags outside them */
  const protectedBlocks: string[] = []
  const masked = withoutMeta.replace(
    /<(style|script)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_whole, tag: string, rawAttrs: string, body: string) => {
      const keptAttrs = parseTagAttrs(rawAttrs)
        .filter((a) => !DOOP_INTERNAL_ATTRS.has(a.name.toLowerCase()))
        .map((a) => (a.value === null ? ` ${a.name}` : ` ${a.name}="${escapeHtmlAttr(a.value)}"`))
        .join('')
      const idx = protectedBlocks.push(`<${tag}${keptAttrs}>${body}</${tag}>`) - 1
      return `\uE000DOOP_BLOCK_${idx}\uE000`
    },
  )
  const cleaned = masked.replace(
    /<([a-zA-Z][a-zA-Z0-9:-]*)(\s[^>]*?)?(\s*\/?)>/g,
    (whole, tag: string, rawAttrs: string | undefined, selfClose: string) => {
      if (!rawAttrs) return whole
      const attrs = parseTagAttrs(rawAttrs).filter((a) => !DOOP_INTERNAL_ATTRS.has(a.name.toLowerCase()))
      const rendered = attrs
        .map((a) => (a.value === null ? ` ${a.name}` : ` ${a.name}="${escapeHtmlAttr(a.value)}"`))
        .join('')
      return `<${tag}${rendered}${selfClose}>`
    },
  )
  return cleaned.replace(/\uE000DOOP_BLOCK_(\d+)\uE000/g, (_m, i: string) => protectedBlocks[Number(i)] ?? '')
}

function formatReadableTokensCss(tokens: readonly DesignToken[], tokenThemes: readonly string[] = []): string {
  const compact = tokensCss(tokens, tokenThemes)
  if (!compact) return ''
  return compact
    .split('\n')
    .map((line) => {
      const brace = line.indexOf('{')
      const end = line.lastIndexOf('}')
      if (brace === -1 || end === -1) return line
      const selector = line.slice(0, brace).trim()
      const decls = line
        .slice(brace + 1, end)
        .split(';')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => {
          const colon = d.indexOf(':')
          return colon === -1 ? `  ${d};` : `  ${d.slice(0, colon)}: ${d.slice(colon + 1)};`
        })
      return `${selector} {\n${decls.join('\n')}\n}`
    })
    .join('\n\n')
}

/** Ready-to-import `tokens.css` combining Tailwind v4 `@theme` and standard `:root` custom properties. */
export function exportTokensCssFile(tokens: readonly DesignToken[], tokenThemes: readonly string[] = []): string {
  if (!tokens.length) {
    return '/* Design tokens exported from Doop — no tokens defined on this canvas yet. */\n'
  }
  const tw = tokensTailwind(tokens, tokenThemes)
  const root = formatReadableTokensCss(tokens, tokenThemes)
  return `/* Design tokens exported from Doop */\n\n${tw}\n\n${root}\n`
}

/** Export clean, self-contained (or external-stylesheet-linked) HTML without internal editor attributes. */
export function exportCleanHtml(frameHtml: string, options: CleanHtmlOptions = {}): string {
  const { tokens = [], tokenThemes = [], elementHtml, externalTokensPath } = options
  if (elementHtml !== undefined) {
    const cleanSnippet = stripDoopAttributes(elementHtml).trim()
    const used = tokensUsedBy(cleanSnippet, tokens)
    if (!used.length || externalTokensPath) return cleanSnippet
    return `<style>\n${formatReadableTokensCss(used, tokenThemes)}\n</style>\n${cleanSnippet}`
  }

  let working = frameHtml
  const used = tokensUsedBy(working, tokens)
  if (externalTokensPath) {
    working = working.replace(TOKEN_STYLE_RE, '')
    const linkTag = `<link rel="stylesheet" href="${escapeHtmlAttr(externalTokensPath)}">`
    if (/<head\b[^>]*>/i.test(working)) {
      working = working.replace(/<head\b[^>]*>/i, (m) => `${m}\n${linkTag}`)
    } else {
      working = `${linkTag}\n${working}`
    }
  } else if (used.length) {
    const styleBlock = `<style>\n${formatReadableTokensCss(used, tokenThemes)}\n</style>`
    if (TOKEN_STYLE_RE.test(working)) {
      working = working.replace(TOKEN_STYLE_RE, styleBlock)
    } else if (/<head\b[^>]*>/i.test(working)) {
      working = working.replace(/<head\b[^>]*>/i, (m) => `${m}\n${styleBlock}`)
    } else {
      working = `${styleBlock}\n${working}`
    }
  } else {
    working = working.replace(TOKEN_STYLE_RE, '')
  }

  return stripDoopAttributes(working).trim() + '\n'
}

/* ------------------------------------------------------------------ */
/* Inline CSS → Tailwind v4 utilities + residual JSX style={{ ... }}  */

function splitCssDeclarations(cssText: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = []
  let depth = 0
  let quote: '"' | "'" | null = null
  let start = 0
  for (let i = 0; i <= cssText.length; i++) {
    const ch = cssText[i]
    if (quote) {
      if (ch === '\\') i += 1
      else if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === '(') depth += 1
    else if (ch === ')' && depth > 0) depth -= 1
    else if (ch === ';' || i === cssText.length) {
      if (depth === 0) {
        const chunk = cssText.slice(start, i).trim()
        if (chunk) {
          const colon = chunk.indexOf(':')
          if (colon > 0) {
            const prop = chunk.slice(0, colon).trim()
            const val = chunk.slice(colon + 1).trim()
            if (prop && val) pairs.push([prop, val])
          }
        }
        start = i + 1
      }
    }
  }
  return pairs
}

function splitCssSpaceValues(val: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote: '"' | "'" | null = null
  let start = 0
  for (let i = 0; i <= val.length; i++) {
    const ch = val[i]
    if (quote) {
      if (ch === '\\') i += 1
      else if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === '(') depth += 1
    else if (ch === ')' && depth > 0) depth -= 1
    else if ((ch !== undefined && /\s/.test(ch)) || i === val.length) {
      if (depth === 0) {
        const token = val.slice(start, i).trim()
        if (token) parts.push(token)
        start = i + 1
      }
    }
  }
  return parts
}

/** Safe arbitrary value inside Tailwind `prefix-[...]`: no unescaped whitespace or quotes/brackets. */
function twArbitrary(raw: string): string | null {
  const v = raw.trim()
  if (!v || /["'[\]\n\r\\]/.test(v)) return null
  /* Simple var(--foo) without fallback spaces is clean; spaces inside calc/color-mix become underscores */
  if (/^var\(\s*--[a-zA-Z0-9_-]+\s*\)$/.test(v)) {
    return `[${v.replace(/\s+/g, '')}]`
  }
  if (/^(#-?[a-zA-Z0-9]+|-?\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|dvh|svh|ch|deg|fr))$/.test(v)) {
    return `[${v}]`
  }
  return null
}

function spacingSuffix(val: string): string | null {
  const v = val.trim()
  if (v in PX_SPACING_SCALE) return PX_SPACING_SCALE[v]!
  if (v === 'auto') return 'auto'
  return twArbitrary(v)
}

function sizeSuffix(val: string, axis: 'w' | 'h'): string | null {
  const v = val.trim()
  if (v === '100%') return 'full'
  if (v === 'auto') return 'auto'
  if (v === 'fit-content') return 'fit'
  if (v === 'min-content') return 'min'
  if (v === 'max-content') return 'max'
  if (axis === 'w' && v === '100vw') return 'screen'
  if (axis === 'h' && (v === '100vh' || v === '100dvh')) return v === '100dvh' ? 'dvh' : 'screen'
  if (v in PX_SPACING_SCALE) return PX_SPACING_SCALE[v]!
  return twArbitrary(v)
}

function isSimplePaintValue(val: string): boolean {
  const v = val.trim()
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return true
  if (/^var\(\s*--[a-zA-Z0-9_-]+\s*\)$/.test(v)) return true
  if (/^(?:rgb|rgba|hsl|hsla|oklch)\([^(),\s]+(?:,\s*[^(),\s]+)*\)$/i.test(v)) return false
  return false
}

function camelCssProp(prop: string): string {
  if (prop.startsWith('--')) return prop
  const lower = prop.toLowerCase()
  if (lower.startsWith('-webkit-'))
    return (
      'Webkit' +
      lower
        .slice(8)
        .replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
        .replace(/^./, (c) => c.toUpperCase())
    )
  if (lower.startsWith('-moz-'))
    return (
      'Moz' +
      lower
        .slice(5)
        .replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
        .replace(/^./, (c) => c.toUpperCase())
    )
  return lower.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
}

function mapSingleDeclarationToTailwind(prop: string, rawVal: string): string[] | null {
  if (/!important\s*$/i.test(rawVal)) return null
  const p = prop.toLowerCase()
  const v = rawVal.trim()

  switch (p) {
    case 'display': {
      const map: Record<string, string> = {
        flex: 'flex',
        'inline-flex': 'inline-flex',
        grid: 'grid',
        'inline-grid': 'inline-grid',
        block: 'block',
        'inline-block': 'inline-block',
        inline: 'inline',
        none: 'hidden',
        contents: 'contents',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'position': {
      const map: Record<string, string> = {
        relative: 'relative',
        absolute: 'absolute',
        fixed: 'fixed',
        sticky: 'sticky',
        static: 'static',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'flex-direction': {
      const map: Record<string, string> = {
        row: 'flex-row',
        column: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'column-reverse': 'flex-col-reverse',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'flex-wrap': {
      const map: Record<string, string> = {
        wrap: 'flex-wrap',
        nowrap: 'flex-nowrap',
        'wrap-reverse': 'flex-wrap-reverse',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'flex': {
      if (v === '1' || v === '1 1 0%' || v === '1 1 0') return ['flex-1']
      if (v === 'auto' || v === '1 1 auto') return ['flex-auto']
      if (v === 'none' || v === '0 0 auto') return ['flex-none']
      return null
    }
    case 'flex-shrink':
      return v === '0' ? ['shrink-0'] : v === '1' ? ['shrink'] : null
    case 'flex-grow':
      return v === '0' ? ['grow-0'] : v === '1' ? ['grow'] : null
    case 'align-items': {
      const map: Record<string, string> = {
        center: 'items-center',
        'flex-start': 'items-start',
        start: 'items-start',
        'flex-end': 'items-end',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'justify-content': {
      const map: Record<string, string> = {
        center: 'justify-center',
        'flex-start': 'justify-start',
        start: 'justify-start',
        'flex-end': 'justify-end',
        end: 'justify-end',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
        'space-evenly': 'justify-evenly',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'align-self': {
      const map: Record<string, string> = {
        auto: 'self-auto',
        center: 'self-center',
        'flex-start': 'self-start',
        start: 'self-start',
        'flex-end': 'self-end',
        end: 'self-end',
        stretch: 'self-stretch',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'overflow': {
      const map: Record<string, string> = {
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scroll: 'overflow-scroll',
        visible: 'overflow-visible',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'overflow-x': {
      const map: Record<string, string> = {
        hidden: 'overflow-x-hidden',
        auto: 'overflow-x-auto',
        scroll: 'overflow-x-scroll',
        visible: 'overflow-x-visible',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'overflow-y': {
      const map: Record<string, string> = {
        hidden: 'overflow-y-hidden',
        auto: 'overflow-y-auto',
        scroll: 'overflow-y-scroll',
        visible: 'overflow-y-visible',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'gap': {
      const parts = splitCssSpaceValues(v)
      if (parts.length === 1) {
        const s = spacingSuffix(parts[0]!)
        return s ? [`gap-${s}`] : null
      }
      if (parts.length === 2) {
        const r = spacingSuffix(parts[0]!)
        const c = spacingSuffix(parts[1]!)
        return r && c ? [`gap-y-${r}`, `gap-x-${c}`] : null
      }
      return null
    }
    case 'row-gap': {
      const s = spacingSuffix(v)
      return s ? [`gap-y-${s}`] : null
    }
    case 'column-gap': {
      const s = spacingSuffix(v)
      return s ? [`gap-x-${s}`] : null
    }
    case 'padding':
    case 'margin': {
      const pre = p === 'padding' ? 'p' : 'm'
      const parts = splitCssSpaceValues(v)
      if (parts.length === 1) {
        const s = spacingSuffix(parts[0]!)
        return s ? [`${pre}-${s}`] : null
      }
      if (parts.length === 2) {
        const y = spacingSuffix(parts[0]!)
        const x = spacingSuffix(parts[1]!)
        if (!y || !x) return null
        return y === '0' && x === 'auto' && pre === 'm' ? ['mx-auto', 'my-0'] : [`${pre}y-${y}`, `${pre}x-${x}`]
      }
      if (parts.length === 4) {
        const [tVal, rVal, bVal, lVal] = parts.map((item) => spacingSuffix(item))
        if (!tVal || !rVal || !bVal || !lVal) return null
        return [`${pre}t-${tVal}`, `${pre}r-${rVal}`, `${pre}b-${bVal}`, `${pre}l-${lVal}`]
      }
      return null
    }
    case 'padding-top':
    case 'padding-right':
    case 'padding-bottom':
    case 'padding-left':
    case 'margin-top':
    case 'margin-right':
    case 'margin-bottom':
    case 'margin-left': {
      const preMap: Record<string, string> = {
        'padding-top': 'pt',
        'padding-right': 'pr',
        'padding-bottom': 'pb',
        'padding-left': 'pl',
        'margin-top': 'mt',
        'margin-right': 'mr',
        'margin-bottom': 'mb',
        'margin-left': 'ml',
      }
      const s = spacingSuffix(v)
      return s ? [`${preMap[p]!}-${s}`] : null
    }
    case 'width': {
      const s = sizeSuffix(v, 'w')
      return s ? [`w-${s}`] : null
    }
    case 'height': {
      const s = sizeSuffix(v, 'h')
      return s ? [`h-${s}`] : null
    }
    case 'min-width': {
      if (v === '0' || v === '0px') return ['min-w-0']
      const s = sizeSuffix(v, 'w')
      return s ? [`min-w-${s}`] : null
    }
    case 'max-width': {
      if (v === 'none') return ['max-w-none']
      const s = sizeSuffix(v, 'w')
      return s ? [`max-w-${s}`] : null
    }
    case 'min-height': {
      if (v === '0' || v === '0px') return ['min-h-0']
      const s = sizeSuffix(v, 'h')
      return s ? [`min-h-${s}`] : null
    }
    case 'max-height': {
      const s = sizeSuffix(v, 'h')
      return s ? [`max-h-${s}`] : null
    }
    case 'inset':
    case 'top':
    case 'right':
    case 'bottom':
    case 'left': {
      const parts = splitCssSpaceValues(v)
      if (parts.length !== 1) return null
      const s = spacingSuffix(parts[0]!)
      return s ? [`${p}-${s}`] : null
    }
    case 'text-align': {
      const map: Record<string, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'text-transform': {
      const map: Record<string, string> = {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
        none: 'normal-case',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'text-decoration': {
      const map: Record<string, string> = {
        underline: 'underline',
        'line-through': 'line-through',
        none: 'no-underline',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'font-style':
      return v === 'italic' ? ['italic'] : v === 'normal' ? ['not-italic'] : null
    case 'font-weight': {
      const map: Record<string, string> = {
        '300': 'font-light',
        '400': 'font-normal',
        normal: 'font-normal',
        '500': 'font-medium',
        '600': 'font-semibold',
        '700': 'font-bold',
        bold: 'font-bold',
        '800': 'font-extrabold',
      }
      if (map[v]) return [map[v]!]
      return null
    }
    case 'font-size': {
      if (/^-?\d+(?:\.\d+)?(?:px|rem|em)$/.test(v)) return [`text-[${v}]`]
      if (/^var\(\s*--[a-zA-Z0-9_-]+\s*\)$/.test(v)) return [`text-[length:${v.replace(/\s+/g, '')}]`]
      return null
    }
    case 'line-height': {
      const arb = twArbitrary(v)
      if (v === '1') return ['leading-none']
      return arb ? [`leading-${arb}`] : null
    }
    case 'letter-spacing': {
      const arb = twArbitrary(v)
      return arb ? [`tracking-${arb}`] : null
    }
    case 'color': {
      if (v === 'transparent') return ['text-transparent']
      if (v === 'currentColor' || v === 'currentcolor') return ['text-current']
      if (isSimplePaintValue(v)) return [`text-[${v.replace(/\s+/g, '')}]`]
      return null
    }
    case 'background':
    case 'background-color': {
      if (v === 'transparent' || v === 'none') return ['bg-transparent']
      if (isSimplePaintValue(v)) return [`bg-[${v.replace(/\s+/g, '')}]`]
      return null
    }
    case 'border-color': {
      if (v === 'transparent') return ['border-transparent']
      if (isSimplePaintValue(v)) return [`border-[color:${v.replace(/\s+/g, '')}]`]
      return null
    }
    case 'border-radius': {
      if (v === '0' || v === '0px') return ['rounded-none']
      if (v === '9999px' || v === '999px' || v === '50%') return ['rounded-full']
      const parts = splitCssSpaceValues(v)
      if (parts.length === 1) {
        const arb = twArbitrary(parts[0]!)
        return arb ? [`rounded-${arb}`] : null
      }
      return null
    }
    case 'white-space': {
      const map: Record<string, string> = {
        nowrap: 'whitespace-nowrap',
        pre: 'whitespace-pre',
        'pre-wrap': 'whitespace-pre-wrap',
        normal: 'whitespace-normal',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'object-fit': {
      const map: Record<string, string> = {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'cursor': {
      const map: Record<string, string> = {
        pointer: 'cursor-pointer',
        default: 'cursor-default',
        'not-allowed': 'cursor-not-allowed',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'pointer-events':
      return v === 'none' ? ['pointer-events-none'] : v === 'auto' ? ['pointer-events-auto'] : null
    case 'user-select': {
      const map: Record<string, string> = {
        none: 'select-none',
        text: 'select-text',
        all: 'select-all',
      }
      return map[v] ? [map[v]!] : null
    }
    case 'opacity': {
      if (v === '0') return ['opacity-0']
      if (v === '1') return ['opacity-100']
      const arb = twArbitrary(v)
      return arb ? [`opacity-${arb}`] : null
    }
    case 'z-index': {
      if (/^(0|10|20|30|40|50)$/.test(v)) return [`z-${v}`]
      if (/^-?\d+$/.test(v)) return [`z-[${v}]`]
      return null
    }
    default:
      return null
  }
}

function convertStyleAttr(cssText: string): { classes: string[]; styleObjectLiteral: string | null } {
  const declarations = splitCssDeclarations(cssText)
  /* Last declaration for a property wins, preserving order */
  const deduped = new Map<string, string>()
  for (const [prop, val] of declarations) {
    const key = prop.startsWith('--') ? prop : prop.toLowerCase()
    deduped.delete(key)
    deduped.set(key, val)
  }

  const classes: string[] = []
  const residual: string[] = []
  for (const [prop, val] of deduped) {
    const mapped = prop.startsWith('--') ? null : mapSingleDeclarationToTailwind(prop, val)
    if (mapped) {
      classes.push(...mapped)
    } else {
      const jsKey = prop.startsWith('--') ? JSON.stringify(prop) : camelCssProp(prop)
      residual.push(`${jsKey}: ${JSON.stringify(val)}`)
    }
  }
  return {
    classes,
    styleObjectLiteral: residual.length ? `{ ${residual.join(', ')} }` : null,
  }
}

function jsxAttrName(name: string, inSvg: boolean, tagName: string): string {
  if (name.startsWith('data-') || name.startsWith('aria-')) return name
  const lower = name.toLowerCase()
  if (tagName === 'input' && lower === 'checked') return 'defaultChecked'
  if ((tagName === 'input' || tagName === 'textarea' || tagName === 'select') && lower === 'value')
    return 'defaultValue'
  if (JSX_ATTR_NAMES[lower]) return JSX_ATTR_NAMES[lower]!
  if (inSvg && name.includes('-')) {
    return lower.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
  }
  return lower === 'class' ? 'className' : name
}

function escapeJsxText(text: string): string {
  if (!text) return ''
  return text.replace(/([{}<>])/g, (_m, ch: string) => `{'${ch}'}`)
}

function htmlFragmentToJsx(html: string): string {
  const out: string[] = []
  let i = 0
  let svgDepth = 0

  while (i < html.length) {
    /* HTML comment */
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4)
      i = end === -1 ? html.length : end + 3
      continue
    }
    /* Raw style or script block */
    const rawBlock = /^<(style|script)\b([^>]*)>([\s\S]*?)<\/\1>/i.exec(html.slice(i))
    if (rawBlock) {
      const tag = rawBlock[1]!.toLowerCase()
      const rawAttrs = rawBlock[2] ?? ''
      const body = rawBlock[3] ?? ''
      if (tag === 'style' && body.trim()) {
        out.push(`<style>{${JSON.stringify(body)}}</style>`)
      } else if (tag === 'script') {
        /* Skip inline scripts in React component export unless external src */
        const srcAttr = parseTagAttrs(rawAttrs).find((a) => a.name.toLowerCase() === 'src')
        if (srcAttr?.value) out.push(`<script src=${JSON.stringify(srcAttr.value)} />`)
      }
      i += rawBlock[0].length
      continue
    }
    /* Closing tag */
    const closeMatch = /^<\/([a-zA-Z][a-zA-Z0-9:-]*)\s*>/.exec(html.slice(i))
    if (closeMatch) {
      const tag = closeMatch[1]!.toLowerCase()
      if (tag === 'svg' && svgDepth > 0) svgDepth -= 1
      if (!VOID_ELEMENTS.has(tag)) {
        out.push(`</${svgDepth > 0 && closeMatch[1] !== tag ? closeMatch[1]! : tag}>`)
      }
      i += closeMatch[0].length
      continue
    }
    /* Opening tag */
    const openMatch = /^<([a-zA-Z][a-zA-Z0-9:-]*)(\s(?:[^>"']|"[^"]*"|'[^']*')*)?\s*(\/?)>/.exec(html.slice(i))
    if (openMatch) {
      const rawTag = openMatch[1]!
      const lowerTag = rawTag.toLowerCase()
      const rawAttrs = openMatch[2] ?? ''
      const explicitSelfClose = openMatch[3] === '/'
      const enteringSvg = lowerTag === 'svg'
      const inSvg = svgDepth > 0 || enteringSvg
      const emitTag = inSvg ? rawTag : lowerTag
      const isVoid = VOID_ELEMENTS.has(lowerTag) || explicitSelfClose
      if (enteringSvg && !explicitSelfClose) svgDepth += 1

      const parsedAttrs = parseTagAttrs(rawAttrs).filter((a) => !DOOP_INTERNAL_ATTRS.has(a.name.toLowerCase()))
      const classTokens: string[] = []
      let styleLiteral: string | null = null
      const jsxAttrs: string[] = []

      for (const attr of parsedAttrs) {
        const lower = attr.name.toLowerCase()
        if (lower === 'class' || lower === 'classname') {
          if (attr.value?.trim()) classTokens.push(attr.value.trim())
          continue
        }
        if (lower === 'style') {
          if (attr.value?.trim()) {
            const converted = convertStyleAttr(attr.value)
            classTokens.push(...converted.classes)
            styleLiteral = converted.styleObjectLiteral
          }
          continue
        }
        if (/^on[a-z]+$/i.test(lower)) continue // drop inline DOM string event handlers
        const propName = jsxAttrName(attr.name, inSvg, lowerTag)
        if (
          attr.value === null ||
          (JSX_BOOLEAN_ATTRS.has(lower) && (attr.value === '' || attr.value.toLowerCase() === lower))
        ) {
          jsxAttrs.push(propName)
        } else {
          jsxAttrs.push(`${propName}=${JSON.stringify(attr.value)}`)
        }
      }

      if (classTokens.length) {
        jsxAttrs.unshift(`className=${JSON.stringify(classTokens.join(' '))}`)
      }
      if (styleLiteral) {
        jsxAttrs.push(`style={${styleLiteral}}`)
      }

      const attrStr = jsxAttrs.length ? ` ${jsxAttrs.join(' ')}` : ''
      out.push(isVoid ? `<${emitTag}${attrStr} />` : `<${emitTag}${attrStr}>`)
      i += openMatch[0].length
      continue
    }

    /* Plain text up to the next `<` */
    const nextLt = html.indexOf('<', i + 1)
    const slice = nextLt === -1 ? html.slice(i) : html.slice(i, nextLt)
    out.push(escapeJsxText(slice))
    i = nextLt === -1 ? html.length : nextLt
  }

  return out.join('')
}

/** Extract stylesheets, font links, root theme/styles, and body markup from a full HTML document. */
function unpackDocumentForReact(html: string): {
  fontLinks: string[]
  styleBodies: string[]
  wrapperAttrs: string
  bodyInner: string
} {
  const withoutInternal = html.replace(DOOP_META_RE, '').replace(SNAPSHOT_CSP_RE, '').replace(TOKEN_STYLE_RE, '')

  const fontLinks: string[] = []
  for (const m of withoutInternal.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = parseTagAttrs(m[1] ?? '')
    const rel = attrs.find((a) => a.name.toLowerCase() === 'rel')?.value?.toLowerCase()
    const href = attrs.find((a) => a.name.toLowerCase() === 'href')?.value
    if (rel === 'stylesheet' && href && /^https?:\/\//i.test(href)) fontLinks.push(href)
  }

  const styleBodies: string[] = []
  const withoutHeadStyles = withoutInternal.replace(
    /<style\b([^>]*)>([\s\S]*?)<\/style>/gi,
    (_m, _attrs: string, css: string) => {
      const trimmed = css.trim()
      if (trimmed) styleBodies.push(trimmed)
      return ''
    },
  )

  const htmlTag = /<html\b([^>]*)>/i.exec(withoutHeadStyles)
  const bodyOpen = /<body\b([^>]*)>/i.exec(withoutHeadStyles)
  const bodyCloseIdx = withoutHeadStyles.search(/<\/body\s*>/i)

  const bodyInner = bodyOpen
    ? withoutHeadStyles.slice(
        bodyOpen.index + bodyOpen[0].length,
        bodyCloseIdx > bodyOpen.index ? bodyCloseIdx : undefined,
      )
    : withoutHeadStyles
        .replace(/<!doctype[^>]*>/gi, '')
        .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?html\b[^>]*>/gi, '')

  /* Carry over root theme attribute + body class/style onto the component's outer container */
  const htmlAttrs = htmlTag ? parseTagAttrs(htmlTag[1] ?? '') : []
  const bodyAttrs = bodyOpen ? parseTagAttrs(bodyOpen[1] ?? '') : []
  const theme =
    bodyAttrs.find((a) => a.name.toLowerCase() === THEME_ATTR)?.value ??
    htmlAttrs.find((a) => a.name.toLowerCase() === THEME_ATTR)?.value ??
    null
  const bodyClass = bodyAttrs.find((a) => a.name.toLowerCase() === 'class')?.value?.trim() ?? ''
  const bodyStyle = bodyAttrs.find((a) => a.name.toLowerCase() === 'style')?.value?.trim() ?? ''

  const wrapperClasses: string[] = []
  if (bodyClass) wrapperClasses.push(bodyClass)
  let wrapperStyle: string | null = null
  if (bodyStyle) {
    const converted = convertStyleAttr(bodyStyle)
    wrapperClasses.push(...converted.classes)
    wrapperStyle = converted.styleObjectLiteral
  }

  const wrapperParts: string[] = []
  if (wrapperClasses.length) wrapperParts.push(`className=${JSON.stringify(wrapperClasses.join(' '))}`)
  if (theme) wrapperParts.push(`${THEME_ATTR}=${JSON.stringify(theme)}`)
  if (wrapperStyle) wrapperParts.push(`style={${wrapperStyle}}`)

  return {
    fontLinks,
    styleBodies,
    wrapperAttrs: wrapperParts.length ? ` ${wrapperParts.join(' ')}` : '',
    bodyInner: bodyInner.trim(),
  }
}

/** Convert a Doop frame or element HTML into a clean TypeScript React + Tailwind v4 component. */
export function exportReactTailwind(frameHtml: string, options: ReactExportOptions = {}): string {
  const { componentName, tokens = [], tokenThemes = [], elementHtml, importTokensPath } = options
  const fnName = toComponentName(componentName)
  const importLine = importTokensPath ? `import ${JSON.stringify(importTokensPath)}\n\n` : ''

  if (elementHtml !== undefined) {
    const jsx = htmlFragmentToJsx(elementHtml.trim()).trim()
    return `${importLine}export function ${fnName}() {\n  return (\n    ${jsx || '<div />'}\n  )\n}\n`
  }

  const { fontLinks, styleBodies, wrapperAttrs, bodyInner } = unpackDocumentForReact(frameHtml)
  const used = tokensUsedBy(frameHtml, tokens)
  const inlineTokenCss = !importTokensPath && used.length ? formatReadableTokensCss(used, tokenThemes) : ''
  const combinedCss = [inlineTokenCss, ...styleBodies].filter(Boolean).join('\n\n')
  const jsxBody = htmlFragmentToJsx(bodyInner)

  const headFragments = [
    ...fontLinks.map((href) => `<link rel="stylesheet" href=${JSON.stringify(href)} />`),
    ...(combinedCss ? [`<style>{${JSON.stringify(combinedCss)}}</style>`] : []),
  ]

  const innerLines = [...headFragments, jsxBody].filter(Boolean).join('\n      ')
  return (
    `${importLine}export function ${fnName}() {\n` +
    `  return (\n` +
    `    <div${wrapperAttrs}>\n` +
    `      ${innerLines}\n` +
    `    </div>\n` +
    `  )\n` +
    `}\n`
  )
}

/** Generate a structured Markdown implementation brief ready to paste into any coding agent. */
export function exportAgentBrief(options: AgentBriefOptions): string {
  const { canvasId, canvasName, origin, frame, element, tokens = [], tokenThemes = [] } = options
  const targetName = element ? `${frame.name} → ${element.name}` : frame.name
  const linkUrl = element?.elementId
    ? `${origin}/c/${canvasId}?frame=${encodeURIComponent(frame.id)}&element=${encodeURIComponent(element.elementId)}`
    : `${origin}/c/${canvasId}?frame=${encodeURIComponent(frame.id)}`
  const screenshotUrl = `${origin}/i/${encodeURIComponent(frame.id)}.png?scale=2`

  const sourceForTokens = element?.html ?? frame.html
  const usedTokens = tokensUsedBy(sourceForTokens, tokens)
  const tsx = exportReactTailwind(frame.html, {
    componentName: element ? element.name : frame.name,
    tokens,
    tokenThemes,
    elementHtml: element?.html,
    importTokensPath: usedTokens.length ? './tokens.css' : undefined,
  }).trim()

  const lines: string[] = [
    `# Implement "${targetName}" from Doop`,
    '',
    `- **Canvas**: ${canvasName} (\`${canvasId}\`)`,
    `- **Frame**: ${frame.name} (\`${frame.id}\`, ${Math.round(frame.width)}×${Math.round(frame.height)}px)`,
    ...(element
      ? [
          `- **Element**: ${element.name} (selector \`${element.selector}\`${element.elementId ? `, \`data-doop-id="${element.elementId}"\`` : ''})`,
        ]
      : []),
    `- **Canvas link**: ${linkUrl}`,
    `- **Visual reference (live PNG)**: ${screenshotUrl}`,
    '',
    '## Implementation Notes',
    '- Adapt the structure below to our repository’s existing component primitives, routing, and Tailwind / CSS token conventions.',
    '- Preserve semantic HTML landmarks, keyboard focus rings, WCAG AA contrast, and responsive flex/grid behavior (`min-w-0` on truncating labels).',
  ]

  if (usedTokens.length) {
    lines.push(
      '',
      '## Design Tokens Used (`tokens.css`)',
      '```css',
      exportTokensCssFile(usedTokens, tokenThemes).trim(),
      '```',
    )
  }

  lines.push('', '## Reference Component (React + Tailwind v4)', '```tsx', tsx, '```', '')
  return lines.join('\n')
}
