import { describe, expect, it } from 'vitest'
import type { DesignToken } from '../shared/designTokens.ts'
import {
  componentFileName,
  exportAgentBrief,
  exportCleanHtml,
  exportReactTailwind,
  exportTokensCssFile,
  extractElementByDoopId,
  htmlFileName,
  toComponentName,
} from '../shared/codeExport.ts'

const TOKENS: DesignToken[] = [
  {
    name: '--color-surface',
    type: 'color',
    value: '#FAF8F5',
    themes: { dark: '#121826' },
    order: 1,
    updatedAt: 1,
    updatedBy: 'test',
  },
  {
    name: '--color-ink',
    type: 'color',
    value: '#121826',
    themes: { dark: '#F8FAFC' },
    order: 2,
    updatedAt: 1,
    updatedBy: 'test',
  },
  {
    name: '--radius-card',
    type: 'radius',
    value: '20px',
    order: 3,
    updatedAt: 1,
    updatedBy: 'test',
  },
]

const SAMPLE_FRAME = `<!doctype html>
<html data-doop-theme="dark">
<head>
  <meta name="doop-github-screen" content="c1%7Cpage%7C%2F%7Capp%2Fpage.tsx">
  <style data-doop-tokens>:root{--color-surface:#FAF8F5;--color-ink:#121826}</style>
  <link data-doop-webfonts rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
  <style>.cta-btn:hover { opacity: 0.9; }</style>
</head>
<body style="display: flex; flex-direction: column; gap: 16px; padding: 24px; background: var(--color-surface); color: var(--color-ink);">
  <section data-doop-id="hero-card" data-doop-locked="true" style="display: flex; align-items: center; justify-content: space-between; border-radius: var(--radius-card); box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
    <label for="policy-id" class="eyebrow" data-doop-name="Label">Policy {ID}</label>
    <input id="policy-id" value="PX-2026" readonly tabindex="0">
    <svg viewbox="0 0 24 24" stroke-width="1.5" fill-rule="evenodd"><path d="M4 12h16" stroke-linecap="round"></path></svg>
    <button type="button" class="cta-btn" data-doop-on="click" data-doop-action="navigate:f2">Continue</button>
  </section>
</body>
</html>`

describe('codeExport', () => {
  it('derives clean PascalCase component names and filenames', () => {
    expect(toComponentName('01 · UX Audit & Studio Thesis')).toBe('Frame01UXAuditStudioThesis')
    expect(componentFileName('Wallet Pass Card')).toBe('WalletPassCard.tsx')
    expect(htmlFileName('01 · UX Audit & Studio Thesis')).toBe('01-ux-audit-studio-thesis.html')
  })

  it('strips internal data-doop-* attributes while preserving data-doop-theme and tokens in clean HTML', () => {
    const clean = exportCleanHtml(SAMPLE_FRAME, { tokens: TOKENS, tokenThemes: ['dark'] })
    expect(clean).toContain('data-doop-theme="dark"')
    expect(clean).not.toContain('data-doop-id')
    expect(clean).not.toContain('data-doop-locked')
    expect(clean).not.toContain('data-doop-name')
    expect(clean).not.toContain('data-doop-on')
    expect(clean).not.toContain('data-doop-webfonts')
    expect(clean).not.toContain('doop-github-screen')
    expect(clean).toContain('--color-surface: #FAF8F5;')
    expect(clean).toContain('[data-doop-theme="dark"]')
    expect(clean).toContain('.cta-btn:hover { opacity: 0.9; }')
  })

  it('links external tokens.css instead of inlining :root when externalTokensPath is set', () => {
    const clean = exportCleanHtml(SAMPLE_FRAME, {
      tokens: TOKENS,
      tokenThemes: ['dark'],
      externalTokensPath: './tokens.css',
    })
    expect(clean).toContain('<link rel="stylesheet" href="./tokens.css">')
    expect(clean).not.toContain('--color-surface: #FAF8F5;')
  })

  it('exports valid React + Tailwind v4 TSX with mapped utilities, residual style={{}}, and JSX attributes', () => {
    const tsx = exportReactTailwind(SAMPLE_FRAME, {
      componentName: 'Insurance Hero',
      tokens: TOKENS,
      tokenThemes: ['dark'],
      importTokensPath: './tokens.css',
    })
    expect(tsx).toContain('import "./tokens.css"')
    expect(tsx).toContain('export function InsuranceHero()')
    expect(tsx).toContain('data-doop-theme="dark"')
    // Body inline styles mapped to Tailwind v4 classes
    expect(tsx).toContain('flex flex-col gap-4 p-6 bg-[var(--color-surface)] text-[var(--color-ink)]')
    // Section layout mapped to Tailwind + box-shadow preserved in style={{}}
    expect(tsx).toContain('flex items-center justify-between rounded-[var(--radius-card)]')
    expect(tsx).toContain('style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}')
    // HTML -> JSX attribute renames, void self-closing tags, SVG camelCasing, and curly-brace escaping
    expect(tsx).toContain('htmlFor="policy-id"')
    expect(tsx).toContain("Policy {'{'}ID{'}'}")
    expect(tsx).toContain('<input id="policy-id" defaultValue="PX-2026" readOnly tabIndex="0" />')
    expect(tsx).toContain('viewBox="0 0 24 24" strokeWidth="1.5" fillRule="evenodd"')
    expect(tsx).toContain('strokeLinecap="round"')
    expect(tsx).not.toContain('data-doop-id')
  })

  it('extracts a single element by data-doop-id and generates tokens.css + agent brief', () => {
    const snippet = extractElementByDoopId(SAMPLE_FRAME, 'hero-card')
    expect(snippet).toBeTruthy()
    expect(snippet).toContain('Policy {ID}')

    const tokensCssOut = exportTokensCssFile(TOKENS, ['dark'])
    expect(tokensCssOut).toContain('@theme {')
    expect(tokensCssOut).toContain(':root {')
    expect(tokensCssOut).toContain('[data-doop-theme="dark"]')

    const brief = exportAgentBrief({
      canvasId: 'c123',
      canvasName: 'Nordic Vault',
      origin: 'https://doop.myservice.ee',
      frame: { id: 'f99', name: 'Wallet Screen', width: 390, height: 844, html: SAMPLE_FRAME },
      element: { selector: 'section:nth-of-type(1)', name: 'Hero Card', elementId: 'hero-card', html: snippet! },
      tokens: TOKENS,
      tokenThemes: ['dark'],
    })
    expect(brief).toContain('https://doop.myservice.ee/c/c123?frame=f99&element=hero-card')
    expect(brief).toContain('https://doop.myservice.ee/i/f99.png?scale=2')
    expect(brief).toContain('export function HeroCard()')
  })
})
