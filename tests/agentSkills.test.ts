import { Client as McpClient } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { BUILT_IN_SKILLS } from '../shared/agentSkills.ts'
import { buildMcpServer } from '../server/mcp.ts'
import { store } from '../server/store.ts'
import { Client, startServer, type Server } from './harness.ts'

vi.mock('../server/db/persist.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../server/db/persist.ts')>()
  return Object.fromEntries(Object.keys(actual).map((k) => [k, () => Promise.resolve()]))
})

describe('MCP automatic skill seeding & code export tools', () => {
  it('seeds all enabled built-in skills on get_canvas and exposes list_skills / get_skill / export_frame_code', async () => {
    const canvas = store.createCanvas('Skill Test Canvas', 'mcp-skill-owner')

    const mcpServer = buildMcpServer('Skill Owner', 'mcp-skill-owner')
    const client = new McpClient({ name: 'skills-test', version: '1.0.0' })
    const [a, b] = InMemoryTransport.createLinkedPair()
    await mcpServer.connect(b)
    await client.connect(a)

    const canvasRes = (await client.callTool({
      name: 'get_canvas',
      arguments: { canvas_id: canvas.id, agent_name: 'Claude' },
    })) as { content: { type: string; text: string }[] }
    const payload = JSON.parse(canvasRes.content[0]!.text) as {
      skills: { slug: string; title: string; builtIn: boolean; instructions: string }[]
      note: string
    }

    expect(payload.skills.map((s) => s.slug)).toEqual(BUILT_IN_SKILLS.map((s) => s.slug))
    expect(payload.skills[0]!.instructions).toContain('tabular-nums')
    expect(payload.note).toContain('Active design & frontend skills')

    const createdFrameRes = (await client.callTool({
      name: 'create_frame',
      arguments: {
        canvas_id: canvas.id,
        name: 'Pricing Card',
        width: 480,
        height: 360,
        html: '<html><body><div data-doop-id="card-1" style="display: flex; gap: 12px; padding: 16px;"><span>€29</span></div></body></html>',
        agent_name: 'Claude',
      },
    })) as { content: { type: string; text: string }[] }
    const createdFrame = (JSON.parse(createdFrameRes.content[0]!.text) as { frame: { id: string } }).frame

    const singleSkill = (await client.callTool({
      name: 'get_skill',
      arguments: { canvas_id: canvas.id, slug: 'mobile-hig-m3' },
    })) as { content: { type: string; text: string }[] }
    expect(singleSkill.content[0]!.text).toContain('44×44pt')
    expect(singleSkill.content[0]!.text).toContain('Material 3')

    const codeRes = (await client.callTool({
      name: 'export_frame_code',
      arguments: { frame_id: createdFrame.id, format: 'tsx', element_id: 'card-1', include_tokens: true },
    })) as { content: { type: string; text: string }[] }
    const exported = JSON.parse(codeRes.content[0]!.text) as { file_name: string; code: string; tokens_css: string }
    expect(exported.file_name).toBe('Card1.tsx')
    expect(exported.code).toContain('flex gap-3 p-4')
    expect(exported.code).not.toContain('data-doop-id')
    expect(exported.tokens_css).toContain('Design tokens exported from Doop')

    await client.close()
    await mcpServer.close()
  })
})

describe('Agent skills REST CRUD & overrides', () => {
  let server: Server
  let alice: Client
  let bob: Client

  beforeAll(async () => {
    server = await startServer()
    alice = new Client(server)
    bob = new Client(server)
    await alice.signUp('skills-alice@test.dev', 'Alice')
    await bob.signUp('skills-bob@test.dev', 'Bob')
  }, 70_000)

  afterAll(() => server?.stop())

  it('manages built-in overrides, reset, and custom skills isolated per user', async () => {
    const builtInsRes = await alice.get('/api/agent-skills/builtin')
    expect(builtInsRes.status).toBe(200)
    const builtIns = (await builtInsRes.json()) as { slug: string; enabled: boolean; edited: boolean }[]
    expect(builtIns).toHaveLength(3)
    expect(builtIns.every((s) => s.enabled && !s.edited)).toBe(true)

    // Toggle off and customize one built-in pack for Alice
    const patchedRes = await alice.patch('/api/agent-skills/builtin/ui-ux-craft', {
      disabled: true,
      summary: 'Alice custom summary',
    })
    expect(patchedRes.status).toBe(200)
    const patched = await patchedRes.json()
    expect(patched.enabled).toBe(false)
    expect(patched.edited).toBe(true)
    expect(patched.summary).toBe('Alice custom summary')

    // Bob's built-ins stay untouched
    const bobBuiltIns = (await (await bob.get('/api/agent-skills/builtin')).json()) as {
      slug: string
      enabled: boolean
      edited: boolean
    }[]
    expect(bobBuiltIns.find((s) => s.slug === 'ui-ux-craft')?.enabled).toBe(true)

    // Reset restores built-in text while keeping disabled state
    const resetRes = await alice.delete('/api/agent-skills/builtin/ui-ux-craft')
    expect(resetRes.status).toBe(200)
    const resetPack = await resetRes.json()
    expect(resetPack.edited).toBe(false)
    expect(resetPack.enabled).toBe(false)

    // Create, update, and delete a custom skill
    const createRes = await alice.post('/api/agent-skills', {
      title: 'Shadcn Repo Rules',
      slug: 'shadcn-repo-rules',
      summary: 'Import primitives from @/components/ui',
      markdown: '- Import Button, Dialog and Input from `@/components/ui` instead of raw HTML elements.',
    })
    expect(createRes.status).toBe(200)
    const created = await createRes.json()
    expect(created.slug).toBe('shadcn-repo-rules')

    const listAlice = (await (await alice.get('/api/agent-skills')).json()) as { slug: string }[]
    expect(listAlice.map((s) => s.slug)).toEqual(['shadcn-repo-rules'])
    expect(await (await bob.get('/api/agent-skills')).json()).toEqual([])

    const updateRes = await alice.patch('/api/agent-skills/shadcn-repo-rules', {
      summary: 'Updated shadcn summary',
    })
    expect(updateRes.status).toBe(200)
    expect((await updateRes.json()).summary).toBe('Updated shadcn summary')

    expect((await alice.delete('/api/agent-skills/shadcn-repo-rules')).status).toBe(200)
    expect(await (await alice.get('/api/agent-skills')).json()).toEqual([])
  })
})
