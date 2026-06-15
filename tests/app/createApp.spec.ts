import { expect, test } from 'vitest'

import { createApp, html, raw, ref, RegorConfig, useScope } from '../../src'
import { htmlEqual } from '../common/html-equal'

test('hello world', () => {
  const root = document.createElement('div')
  createApp(
    {
      message: ref('hello world'),
    },
    {
      element: root,
      template: html`<div>{{ message }}</div>`,
    },
  )

  expect(root.textContent).toBe('hello world')
})

test('click counter', () => {
  const root = document.createElement('div')
  const count = ref(0)
  createApp(
    {
      count,
    },
    {
      element: root,
      template: html`<div>count: {{ count }}</div>
        <button @click="count++">click me: {{ count }}</button>`,
    },
  )
  expect(root.querySelector('div')?.textContent).toBe('count: 0')
  for (let i = 0; i < 10; ++i) {
    root.querySelector('button')?.click()
    expect(root.querySelector('div')?.textContent).toBe(`count: ${i + 1}`)
  }
  htmlEqual(
    root.innerHTML,
    raw`<div>count: 10</div><button>click me: 10</button>`,
  )
  expect(root.querySelector('div > span')).toBeNull()
})

test('interpolation supports bracket syntax', () => {
  const root = document.createElement('div')
  createApp(
    {
      message: ref('hello brackets'),
    },
    {
      element: root,
      template: html`<div>[[ message ]]</div>`,
    },
  )

  expect(root.textContent).toBe('hello brackets')
})

test('interpolation supports both syntaxes at once', () => {
  const root = document.createElement('div')
  createApp(
    {
      message: ref('hello'),
      target: ref('world'),
    },
    {
      element: root,
      template: html`<div>{{ message }} [[ target ]]</div>`,
    },
  )

  expect(root.textContent).toBe('hello world')
})

test('interpolation preserves authored text spacing', () => {
  const root = document.createElement('div')
  const first = ref('Ada')
  const last = ref('Lovelace')
  createApp(
    {
      first,
      last,
    },
    {
      element: root,
      template: html`<section>
        <p id="joined">{{ first }}{{ last }}</p>
        <p id="spaced">{{ first }} {{ last }}</p>
        <p id="mixed">Hello {{ first }}!</p>
        <p id="whole">{{ first }}</p>
      </section>`,
    },
  )

  expect(root.querySelector('#joined')?.textContent).toBe('AdaLovelace')
  expect(root.querySelector('#spaced')?.textContent).toBe('Ada Lovelace')
  expect(root.querySelector('#mixed')?.textContent).toBe('Hello Ada!')
  expect(root.querySelector('#whole')?.textContent).toBe('Ada')
  expect(root.querySelector('p > span')).toBeNull()

  first('Grace')
  last('Hopper')
  expect(root.querySelector('#joined')?.textContent).toBe('GraceHopper')
  expect(root.querySelector('#spaced')?.textContent).toBe('Grace Hopper')
  expect(root.querySelector('#mixed')?.textContent).toBe('Hello Grace!')
  expect(root.querySelector('#whole')?.textContent).toBe('Grace')
  expect(root.querySelector('p > span')).toBeNull()
})

test('interpolation removes only generated spans and keeps cleanup anchored', () => {
  const root = document.createElement('div')
  const message = ref('hello')
  const title = ref('title')
  const app = createApp(
    {
      message,
      title,
    },
    {
      element: root,
      template: html`<section>
        <p>Hello {{ message }}!</p>
        <span id="manual" r-text="title"></span>
      </section>`,
    },
  )

  const paragraph = root.querySelector('p') as HTMLParagraphElement
  const manual = root.querySelector('#manual') as HTMLSpanElement

  expect(paragraph.textContent).toBe('Hello hello!')
  expect(paragraph.querySelector('span')).toBeNull()
  expect(manual.tagName).toBe('SPAN')
  expect(manual.textContent).toBe('title')

  message('world')
  title('next')
  expect(paragraph.textContent).toBe('Hello world!')
  expect(manual.textContent).toBe('next')

  app.unbind()
  message('stopped')
  title('stopped')
  expect(paragraph.textContent).toBe('Hello world!')
  expect(manual.textContent).toBe('next')
})

test('createApp mounts json template and supports unbind', () => {
  const root = document.createElement('div')
  root.appendChild(document.createElement('span'))
  const app = createApp(
    { msg: ref('json') },
    {
      element: root,
      json: {
        t: 'div',
        c: [{ d: 'ok' }],
      } as any,
    },
  )

  expect(root.textContent).toBe('ok')
  app.unbind()
})

test('createApp supports string templates and scope contexts', () => {
  class ScopeCtx {
    msg = ref('scope-ok')
  }
  const appRoot = document.createElement('div')
  appRoot.id = 'app'
  document.body.appendChild(appRoot)
  createApp(
    useScope(() => new ScopeCtx()),
    '<p>{{ msg }}</p>',
  )
  expect(appRoot.querySelector('p')?.textContent).toBe('scope-ok')
  appRoot.remove()

  const root = document.createElement('div')
  createApp(
    { msg: ref('inline') },
    { element: root, template: '<p>{{ msg }}</p>' },
  )
  expect(root.querySelector('p')?.textContent).toBe('inline')
})

test('createApp throws when selector root is missing and can disable interpolation', () => {
  expect(() =>
    createApp({}, { selector: '#__missing__regor_root__' }),
  ).toThrow()

  const root = document.createElement('div')
  const cfg = new RegorConfig()
  cfg.useInterpolation = false
  createApp(
    { msg: ref('x') },
    { element: root, template: '<p>{{ msg }}</p>' },
    cfg,
  )
  expect(root.querySelector('p')?.textContent).toBe('{{ msg }}')
})

test('createApp supports default #app selector and throws when no root source provided', () => {
  const appRoot = document.createElement('div')
  appRoot.id = 'app'
  document.body.appendChild(appRoot)
  try {
    const app = createApp({ msg: ref('auto-root') })
    expect(app.context.msg()).toBe('auto-root')
    app.unbind()
  } finally {
    appRoot.remove()
  }

  expect(() => createApp({}, { template: '<div>x</div>' } as any)).toThrow()
})
