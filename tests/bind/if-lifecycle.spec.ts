import { expect, test } from 'vitest'

import { createApp, drainUnbind, html, observerCount, ref } from '../../src'

test.each([false, true])(
  'a removed template ignores nested r-if updates (drain cleanup first: %s)',
  async (drainFirst) => {
    const root = document.createElement('div')
    const visible = ref(true)
    const warning = ref(false)
    const app = createApp(
      { visible, warning },
      {
        element: root,
        template: html`<template r-if="visible">
          <p r-if="warning">Older version</p>
          <span>Results</span>
        </template>`,
      },
    )

    try {
      expect(root.querySelector('span')?.textContent).toBe('Results')
      expect(observerCount(warning)).toBe(1)
      visible(false)
      if (drainFirst) await drainUnbind()
      // Cached results can update nested state in the same turn as removal.
      warning(true)
      expect(root.querySelector('p')).toBeNull()
      expect(root.querySelector('span')).toBeNull()
      if (drainFirst) expect(observerCount(warning)).toBe(0)

      visible(true)
      expect(root.querySelectorAll('p')).toHaveLength(1)
      expect(root.querySelector('p')?.textContent).toBe('Older version')
      await drainUnbind()
      expect(observerCount(warning)).toBe(1)
      warning(false)
      expect(root.querySelector('p')).toBeNull()
      warning(true)
      expect(root.querySelectorAll('p')).toHaveLength(1)
    } finally {
      app.unbind()
      await drainUnbind()
      expect(observerCount(visible)).toBe(0)
      expect(observerCount(warning)).toBe(0)
    }
  },
)

test.each([
  ['elseif', 'if'],
  ['if', 'elseif'],
  ['if', 'else'],
  ['elseif', 'else'],
  ['else', 'if'],
  ['else', 'elseif'],
])(
  'a removed template ignores nested branch changes from %s to %s',
  async (initialBranch, nextBranch) => {
    const root = document.createElement('div')
    const visible = ref(true)
    const branch = ref(initialBranch)
    const app = createApp(
      { visible, branch },
      {
        element: root,
        template: html`<template r-if="visible">
            <p r-if="branch === 'if'">if</p>
            <p r-else-if="branch === 'elseif'">elseif</p>
            <p r-else>else</p>
          </template>
          <strong>Outside</strong>`,
      },
    )

    try {
      expect(root.querySelector('p')?.textContent).toBe(initialBranch)
      visible(false)
      branch(nextBranch)
      expect(root.querySelector('p')).toBeNull()
      expect(root.querySelector('strong')?.textContent).toBe('Outside')

      visible(true)
      expect(root.querySelectorAll('p')).toHaveLength(1)
      expect(root.querySelector('p')?.textContent).toBe(nextBranch)
      await drainUnbind()
      expect(root.querySelector('p')?.textContent).toBe(nextBranch)
    } finally {
      app.unbind()
      await drainUnbind()
    }
  },
)

test('a removed template ignores an independent nested r-else-if observer', async () => {
  const root = document.createElement('div')
  const visible = ref(true)
  const warning = ref(false)
  const app = createApp(
    { visible, warning },
    {
      element: root,
      template: html`<template r-if="visible">
        <p r-if="false">if</p>
        <p r-else-if="warning">Older version</p>
        <p r-else>Results</p>
      </template>`,
    },
  )

  try {
    expect(root.querySelector('p')?.textContent).toBe('Results')
    visible(false)
    warning(true)
    expect(root.querySelector('p')).toBeNull()
    warning(false)
    expect(root.querySelector('p')).toBeNull()
    warning(true)
    await drainUnbind()
    expect(observerCount(warning)).toBe(0)

    visible(true)
    expect(root.querySelectorAll('p')).toHaveLength(1)
    expect(root.querySelector('p')?.textContent).toBe('Older version')
    warning(false)
    expect(root.querySelectorAll('p')).toHaveLength(1)
    expect(root.querySelector('p')?.textContent).toBe('Results')
  } finally {
    app.unbind()
    await drainUnbind()
    expect(observerCount(warning)).toBe(0)
  }
})
