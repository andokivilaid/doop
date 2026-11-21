import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Client, startServer, type Server } from './harness.ts'

/* fork: SIGNUP_REQUIRES_APPROVAL */
let server: Server

function signUp(client: Client, email: string, name: string) {
  return client.req('/api/auth/sign-up/email', {
    method: 'POST',
    headers: { Origin: server.base },
    body: JSON.stringify({ email, password: 'password12345', name }),
  })
}

function signIn(client: Client, email: string) {
  return client.req('/api/auth/sign-in/email', {
    method: 'POST',
    headers: { Origin: server.base },
    body: JSON.stringify({ email, password: 'password12345' }),
  })
}

beforeAll(async () => {
  server = await startServer({ SIGNUP_REQUIRES_APPROVAL: 'true', ADMIN_EMAILS: 'boss@example.com' })
}, 70_000)

afterAll(() => server?.stop())

describe('signup approval', () => {
  const admin = () => new Client(server)
  let boss: Client

  it('lets the first account on an empty instance straight in', async () => {
    boss = admin()
    const res = await signUp(boss, 'boss@example.com', 'Boss')
    expect(res.status, await res.text()).toBe(200)
  })

  it('creates later accounts waiting, and refuses them a session until approved', async () => {
    const newcomer = new Client(server)
    const res = await signUp(newcomer, 'new@example.com', 'Newcomer')
    expect(res.status).toBe(403)
    expect((await res.json()).code).toBe('BANNED_USER')

    const again = await signIn(newcomer, 'new@example.com')
    expect(again.status).toBe(403)

    const users = (await (await boss.req('/api/admin/users')).json()) as {
      id: string
      email: string
      pendingApproval: boolean
    }[]
    const waiting = users.find((u) => u.email === 'new@example.com')!
    expect(waiting.pendingApproval).toBe(true)
    expect(users.find((u) => u.email === 'boss@example.com')!.pendingApproval).toBe(false)

    const approve = await boss.req('/api/auth/admin/unban-user', {
      method: 'POST',
      headers: { Origin: server.base },
      body: JSON.stringify({ userId: waiting.id }),
    })
    expect(approve.status, await approve.text()).toBe(200)

    const after = await signIn(newcomer, 'new@example.com')
    expect(after.status, await after.text()).toBe(200)
  })
})
