import { ensureDomGlobals, resetMiniDomCaches } from '@purestack/ts-minidom'
import { afterAll, afterEach, beforeEach } from 'vitest'

const restoreDomGlobals = ensureDomGlobals()

function resetDomState() {
  resetMiniDomCaches()
}

beforeEach(() => {
  resetDomState()
})

afterEach(() => {
  resetDomState()
})

afterAll(() => {
  restoreDomGlobals()
})
