import http from 'node:http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { normalizeRepoTargetDir, sanitizeBranchName, validateRepoFilePath } from '../server/github.ts'
import { Client, startServer, type Server } from './harness.ts'

describe('GitHub PR path & branch sanitization', () => {
  it('validates repo-relative file paths and rejects traversal or .git writes', () => {
    expect(normalizeRepoTargetDir(undefined)).toBe('src/components/doop')
    expect(normalizeRepoTargetDir('/src/ui/')).toBe('src/ui')
    expect(normalizeRepoTargetDir('')).toBe('')
    expect(validateRepoFilePath('src/components/doop/Hero.tsx')).toBe('src/components/doop/Hero.tsx')
    expect(() => validateRepoFilePath('../secrets.txt')).toThrow(/unsafe path segment/)
    expect(() => validateRepoFilePath('.git/config')).toThrow(/unsafe path segment/)
    expect(() => validateRepoFilePath('/leading/slash.tsx')).toThrow(/relative/)
  })

  it('sanitizes branch names safely', () => {
    expect(sanitizeBranchName('feat/design sync!')).toBe('feat/design-sync')
    expect(sanitizeBranchName('a..b')).toMatch(/^doop\/design-sync-/)
  })
})

describe('Two-way GitHub Pull Request export end-to-end', () => {
  let ghMock: http.Server
  let ghUrl = ''
  let server: Server
  let owner: Client
  let stranger: Client
  let canvasId = ''
  let connId = ''

  const recordedRequests: { method: string; url: string; body?: Record<string, unknown> }[] = []
  let refuseTreeWrite = false

  beforeAll(async () => {
    ghMock = http.createServer((req, res) => {
      const chunks: Buffer[] = []
      req.on('data', (c: Buffer) => chunks.push(c))
      req.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8')
        const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : undefined
        const url = req.url ?? ''
        recordedRequests.push({ method: req.method ?? 'GET', url, body })

        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'GET' && url === '/repos/acme/web') {
          res.end(JSON.stringify({ default_branch: 'main' }))
          return
        }
        if (req.method === 'GET' && url === '/repos/acme/web/git/ref/heads/main') {
          res.end(JSON.stringify({ object: { sha: 'commit-base-111' } }))
          return
        }
        if (req.method === 'GET' && url === '/repos/acme/web/git/commits/commit-base-111') {
          res.end(JSON.stringify({ tree: { sha: 'tree-base-222' } }))
          return
        }
        if (req.method === 'POST' && url === '/repos/acme/web/git/trees') {
          if (refuseTreeWrite) {
            res.statusCode = 403
            res.end(JSON.stringify({ message: 'Resource not accessible by personal access token' }))
            return
          }
          res.statusCode = 201
          res.end(JSON.stringify({ sha: 'tree-new-333' }))
          return
        }
        if (req.method === 'POST' && url === '/repos/acme/web/git/commits') {
          res.statusCode = 201
          res.end(JSON.stringify({ sha: 'commit-new-444' }))
          return
        }
        if (req.method === 'POST' && url === '/repos/acme/web/git/refs') {
          res.statusCode = 201
          res.end(JSON.stringify({ ref: body?.ref }))
          return
        }
        if (req.method === 'POST' && url === '/repos/acme/web/pulls') {
          res.statusCode = 201
          res.end(JSON.stringify({ html_url: 'https://github.com/acme/web/pull/42', number: 42 }))
          return
        }
        res.statusCode = 404
        res.end(JSON.stringify({ message: `unhandled ${req.method} ${url}` }))
      })
    })

    await new Promise<void>((resolve) => ghMock.listen(0, '127.0.0.1', () => resolve()))
    const addr = ghMock.address()
    const port = typeof addr === 'object' && addr ? addr.port : 0
    ghUrl = `http://127.0.0.1:${port}`

    server = await startServer({ GITHUB_API_URL: ghUrl })
    owner = new Client(server)
    stranger = new Client(server)
    await owner.signUp('pr-owner@test.dev', 'PR Owner')
    await stranger.signUp('pr-stranger@test.dev', 'PR Stranger')

    const createdCanvas = (await (await owner.post('/api/canvases', { name: 'Nordic Vault' })).json()) as {
      id: string
    }
    canvasId = createdCanvas.id

    await owner.post(`/api/canvases/${canvasId}/tokens`, {
      tokens: [{ name: '--color-brand', type: 'color', value: '#FF6A00' }],
    })

    await owner.post(`/api/canvases/${canvasId}/frames`, {
      name: 'Policy Card',
      width: 390,
      height: 844,
      html: '<html><body><div data-doop-id="p1" style="display: flex; gap: 8px; background: var(--color-brand);">Covered</div></body></html>',
    })

    const connRes = await owner.post(`/api/canvases/${canvasId}/github`, {
      repo: 'acme/web',
      token: 'ghp_test_token_123',
    })
    expect(connRes.status).toBe(200)
    connId = ((await connRes.json()) as { id: string }).id
  }, 70_000)

  afterAll(() => {
    server?.stop()
    ghMock?.close()
  })

  it('commits tokens.css and clean React + Tailwind components and opens a Pull Request', async () => {
    // Non-members are blocked
    expect((await stranger.post(`/api/canvases/${canvasId}/github/${connId}/pr`, {})).status).toBe(403)

    // Path traversal in targetDir is rejected cleanly
    const traversal = await owner.post(`/api/canvases/${canvasId}/github/${connId}/pr`, {
      targetDir: '../outside',
    })
    expect(traversal.status).toBe(400)

    recordedRequests.length = 0
    const prRes = await owner.post(`/api/canvases/${canvasId}/github/${connId}/pr`, {
      format: 'tsx',
      targetDir: 'src/design',
      includeTokens: true,
      branchName: 'doop/sync-vault',
      title: 'feat(ui): sync Nordic Vault tokens and PolicyCard',
    })
    expect(prRes.status).toBe(200)
    const prBody = (await prRes.json()) as {
      prUrl: string
      prNumber: number
      branch: string
      commitSha: string
      filesWritten: string[]
    }
    expect(prBody.prUrl).toBe('https://github.com/acme/web/pull/42')
    expect(prBody.prNumber).toBe(42)
    expect(prBody.branch).toBe('doop/sync-vault')
    expect(prBody.filesWritten).toEqual(['src/design/tokens.css', 'src/design/PolicyCard.tsx'])

    const treeCall = recordedRequests.find((r) => r.method === 'POST' && r.url === '/repos/acme/web/git/trees')
    const treeEntries = (treeCall?.body?.tree ?? []) as { path: string; content: string }[]
    expect(treeEntries).toHaveLength(2)
    expect(treeEntries[0]!.content).toContain('--color-brand: #FF6A00;')
    expect(treeEntries[1]!.content).toContain('import "./tokens.css"')
    expect(treeEntries[1]!.content).toContain('export function PolicyCard()')
    expect(treeEntries[1]!.content).not.toContain('data-doop-id')
  })

  it('surfaces a clear permission guidance message when PAT lacks repo write scope', async () => {
    refuseTreeWrite = true
    const denied = await owner.post(`/api/canvases/${canvasId}/github/${connId}/pr`, {
      format: 'tsx',
    })
    refuseTreeWrite = false
    expect(denied.status).toBe(400)
    const body = (await denied.json()) as { error: string }
    expect(body.error).toContain('Contents: Read and write')
    expect(body.error).toContain('Pull requests: Read and write')
  })
})
