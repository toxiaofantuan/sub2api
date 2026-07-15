import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const dir = dirname(fileURLToPath(import.meta.url))
const sidebarSource = readFileSync(resolve(dir, '../AppSidebar.vue'), 'utf8')
const homeViewSource = readFileSync(resolve(dir, '../../../views/HomeView.vue'), 'utf8')
const keyUsageViewSource = readFileSync(resolve(dir, '../../../views/KeyUsageView.vue'), 'utf8')

describe('brand logo asset', () => {
  it('AppSidebar uses the fixed default logo asset', () => {
    expect(sidebarSource).toContain('src="/logo.png"')
    expect(sidebarSource).not.toContain('siteLogo')
  })

  it('HomeView uses the fixed default logo asset', () => {
    expect(homeViewSource).toContain('src="/logo.png"')
    expect(homeViewSource).not.toContain('siteLogo')
  })

  it('KeyUsageView uses the fixed default logo asset', () => {
    expect(keyUsageViewSource).toContain('src="/logo.png"')
    expect(keyUsageViewSource).not.toContain('siteLogo')
  })
})
