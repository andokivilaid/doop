// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const shell = vi.hoisted(() => ({ desktop: false }))
vi.mock('../src/lib/auth', () => ({
  authClient: { useSession: () => ({ data: { user: { id: 'alice', name: 'Alice Doe' } } }), signOut: vi.fn() },
}))
vi.mock('../src/lib/me', () => ({ useMe: () => null, offersUpgrade: () => false }))
vi.mock('../src/lib/shell', () => ({ isDesktopShell: () => shell.desktop }))
import { AccountMenu } from '../src/components/DashShell'
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root
let container: HTMLDivElement
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  shell.desktop = false
})

/* render the menu and open it from the keyboard, as Radix expects */
async function openMenu(): Promise<Map<string, string | null>> {
  await act(async () => root.render(<AccountMenu />))
  const trigger = container.querySelector('button')!
  await act(async () => {
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  })
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]')].filter((a) => a.tagName === 'A')
  return new Map(links.map((a) => [a.textContent?.trim() ?? '', a.getAttribute('href')]))
}

it('hides the plan badge and external Doop links in the account menu', async () => {
  const links = await openMenu()
  expect(links.has('Help & docs')).toBe(false)
  expect(links.has('Get desktop app')).toBe(false)
  expect(links.has('Doop website')).toBe(false)
  const menuText = document.querySelector('[role="menu"]')?.textContent ?? ''
  expect(menuText).not.toContain('Free')
  expect(menuText).toContain('Settings')
})

it('keeps external links hidden inside the desktop app too', async () => {
  shell.desktop = true
  const links = await openMenu()
  expect(links.has('Help & docs')).toBe(false)
  expect(links.has('Get desktop app')).toBe(false)
  expect(links.has('Doop website')).toBe(false)
})
