import { afterEach, expect, test } from 'vitest'

import { createApp, ref, sref } from '../../src'

const cleanups: (() => void)[] = []

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup()
})

const mountModel = (
  template: string,
  initial: unknown = 0,
  context: Record<string, unknown> = {},
) => {
  const root = document.createElement('div')
  const value = sref(initial)
  const app = createApp({ ...context, value }, { element: root, template })
  cleanups.push(() => app.unbind())
  const control = root.querySelector('input, textarea, select') as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
  return { app, control, value }
}

test.each(['input', 'textarea'])(
  'r-model numeric modifiers and expression options convert %s values',
  (tag) => {
    for (const modifier of ['int', 'number']) {
      for (const binding of [
        `r-model.${modifier}="value"`,
        `r-model="value, '${modifier}'"`,
        `r-model="value, { ${modifier}: true }"`,
      ]) {
        const template =
          tag === 'input'
            ? `<input type="text" ${binding}>`
            : `<textarea ${binding}></textarea>`
        const { control, value } = mountModel(template)
        control.value = '7.8'
        control.dispatchEvent(new Event('input'))
        expect(value(), binding).toBe(modifier === 'int' ? 7 : 7.8)
        expect(control.value, binding).toBe(modifier === 'int' ? '7' : '7.8')
        value(12)
        expect(control.value, binding).toBe('12')
      }
    }
  },
)

test.each(['number', 'range'])(
  'r-model.int overrides automatic numeric conversion on %s inputs',
  (type) => {
    const { control, value } = mountModel(
      `<input type="${type}" step="any" r-model.int="value">`,
    )
    control.value = '7.8'
    control.dispatchEvent(new Event('input'))
    expect(value()).toBe(7)
  },
)

test.each([
  ['', '', ''],
  ['   ', '', ''],
  ['foo', '', ''],
  ['.', '', ''],
  ['-.', '', ''],
  ['+.', '', ''],
  ['-', '', ''],
  ['.5', '', 0.5],
  ['-.5', '', -0.5],
  ['0', 0, 0],
  ['-7.8', -7, -7.8],
  ['+7.8', 7, 7.8],
  ['  7.8  ', 7, 7.8],
  ['007.8', 7, 7.8],
  ['12px', 12, 12],
  ['1e3', 1, 1000],
  ['0x10', 16, 0],
])('r-model numeric modifiers handle %j', (entered, integer, number) => {
  for (const [modifier, expected] of [
    ['int', integer],
    ['number', number],
  ] as const) {
    const { control, value } = mountModel(`<input r-model.${modifier}="value">`)
    control.value = String(entered)
    control.dispatchEvent(new Event('input'))
    expect(value(), modifier).toBe(expected)
    expect(control.value, modifier).toBe(String(expected))
  }
})

test.each([
  'r-model.int.number="value"',
  'r-model.number.int="value"',
  'r-model.int="value, { int: false, number: true }"',
  'r-model.number="value, { int: true, number: false }"',
])('r-model int takes precedence when flags are combined: %s', (binding) => {
  const { control, value } = mountModel(`<input ${binding}>`)
  control.value = '-7.8'
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe(-7)
})

test('r-model.number retains a trailing decimal until the value changes', () => {
  const { control, value } = mountModel('<input r-model.number="value">', 1)
  control.value = '1.'
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe(1)
  expect(control.value).toBe('1.')
  control.value = '1.5'
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe(1.5)
})

test.each(['int', 'number', 'trim'])(
  'r-model.lazy.%s converts on change and removes listeners on unbind',
  (modifier) => {
    const { app, control, value } = mountModel(
      `<input r-model.lazy.${modifier}="value">`,
      'seed',
    )
    control.value = ' 7.8 '
    control.dispatchEvent(new Event('input'))
    expect(value()).toBe('seed')
    control.dispatchEvent(new Event('change'))
    const expected =
      modifier === 'int' ? 7 : modifier === 'number' ? 7.8 : '7.8'
    expect(value()).toBe(expected)
    expect(control.value).toBe(String(expected))
    app.unbind()
    control.value = ' 9.5 '
    for (const type of [
      'compositionstart',
      'input',
      'compositionend',
      'change',
    ]) {
      control.dispatchEvent(new Event(type))
    }
    expect(value()).toBe(expected)
    expect(control.value).toBe(' 9.5 ')
  },
)

test.each([
  'r-model.lazy="value, { number: true }"',
  'r-model.number="value, { lazy: true, number: false }"',
])('r-model merges lazy and numeric options: %s', (binding) => {
  const { control, value } = mountModel(`<input ${binding}>`)
  control.value = '7.8'
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe(0)
  control.dispatchEvent(new Event('change'))
  expect(value()).toBe(7.8)
})

test.each(['int', 'number'])(
  'r-model.%s waits for IME composition to end',
  (modifier) => {
    const { control, value } = mountModel(`<input r-model.${modifier}="value">`)
    control.dispatchEvent(new Event('compositionstart'))
    control.value = '7.8'
    control.dispatchEvent(new Event('input'))
    expect(value()).toBe(0)
    control.dispatchEvent(new Event('compositionend'))
    expect(value()).toBe(modifier === 'int' ? 7 : 7.8)
  },
)

test('r-model uses current expression conversion options together with dot modifiers', () => {
  const options = sref<unknown>({ int: true })
  const { control, value } = mountModel(
    '<input r-model.trim="value, options">',
    0,
    { options },
  )
  for (const [flags, expected] of [
    [{ int: true }, 7],
    [{ number: true }, 7.8],
    [() => ({ int: true }), 7],
    [{ int: false, number: false, trim: false }, '7.8'],
    [null, '7.8'],
  ] as const) {
    options(flags)
    control.value = ' 7.8 '
    control.dispatchEvent(new Event('input'))
    expect(value()).toBe(expected)
  }
})

test('r-model expression trim can be disabled after mounting', () => {
  const options = sref({ trim: true })
  const { control, value } = mountModel(
    '<input r-model="value, options">',
    '',
    {
      options,
    },
  )
  control.value = '  first  '
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe('first')
  options({ trim: false })
  control.value = '  second  '
  control.dispatchEvent(new Event('input'))
  control.dispatchEvent(new Event('change'))
  expect(value()).toBe('  second  ')
  expect(control.value).toBe('  second  ')
})

test.each(['int', 'number', 'trim'])(
  'r-model unwraps reactive %s fields inside an options object',
  (modifier) => {
    const options = ref({ [modifier]: false })
    const { control, value } = mountModel(
      '<input r-model="value, options">',
      '',
      {
        options,
      },
    )
    for (const enabled of [false, true, false]) {
      options()[modifier](enabled)
      control.value = ' 7.8 '
      control.dispatchEvent(new Event('input'))
      const converted =
        modifier === 'int' ? 7 : modifier === 'number' ? 7.8 : '7.8'
      expect(value()).toBe(enabled ? converted : ' 7.8 ')
    }
  },
)

test.each([false, true])(
  'r-model reads the initial value of a reactive lazy field: %s',
  (lazy) => {
    const options = ref({ lazy })
    const { control, value } = mountModel(
      '<input r-model="value, options">',
      '',
      {
        options,
      },
    )
    control.value = 'hello'
    control.dispatchEvent(new Event('input'))
    expect(value()).toBe(lazy ? '' : 'hello')
    control.dispatchEvent(new Event('change'))
    expect(value()).toBe('hello')
  },
)

test.each(['int', 'number', 'trim'])(
  'r-model reacts to inline %s expression options',
  (modifier) => {
    const enabled = ref(false)
    const { control, value } = mountModel(
      `<input r-model="value, { ${modifier}: enabled }">`,
      '',
      { enabled },
    )
    for (const active of [false, true, false]) {
      enabled(active)
      control.value = ' 7.8 '
      control.dispatchEvent(new Event('input'))
      const converted =
        modifier === 'int' ? 7 : modifier === 'number' ? 7.8 : '7.8'
      expect(value()).toBe(active ? converted : ' 7.8 ')
    }
  },
)

test('r-model conversion option changes take effect on the next input event', () => {
  const options = ref({ number: false })
  const { control, value } = mountModel(
    '<input r-model="value, options">',
    '7.8',
    {
      options,
    },
  )
  options().number(true)
  expect(value()).toBe('7.8')
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe(7.8)
  options().number(false)
  expect(value()).toBe(7.8)
  control.dispatchEvent(new Event('input'))
  expect(value()).toBe('7.8')
})

test.each(['input', 'textarea'])(
  'r-model.trim trims %s state during input and the control on change',
  (tag) => {
    const { control, value } = mountModel(
      `<${tag} r-model.trim="value"></${tag}>`,
      'hello',
    )
    // Keep the same state so the model-to-DOM update does not trim the control.
    control.value = '  hello  '
    control.dispatchEvent(new Event('input'))
    expect(value()).toBe('hello')
    control.dispatchEvent(new Event('change'))
    expect(control.value).toBe('hello')
  },
)

test('r-model.number on selects converts numeric options and preserves other values', () => {
  const raw = { id: 1 }
  const { control, value } = mountModel(
    `<select r-model.number="value">
      <option value="7.8">numeric</option>
      <option value="text">text</option>
      <option value="">empty</option>
      <option :value="raw">object</option>
    </select>`,
    '',
    { raw },
  )
  const select = control as HTMLSelectElement
  for (const [index, expected] of [7.8, 'text', '', raw].entries()) {
    select.selectedIndex = index
    select.dispatchEvent(new Event('change'))
    expect(value()).toBe(expected)
  }
  select.selectedIndex = -1
  select.dispatchEvent(new Event('change'))
  expect(value()).toBeUndefined()
})

test.each(['array', 'set'])(
  'r-model.number converts multiple selections while retaining the %s model',
  (kind) => {
    const initial = kind === 'array' ? [] : new Set()
    const { control, value } = mountModel(
      `<select multiple r-model.number="value">
        <option value="1.5">first</option>
        <option value="2.5">second</option>
      </select>`,
      initial,
    )
    const select = control as HTMLSelectElement
    for (const option of select.options) option.selected = true
    select.dispatchEvent(new Event('change'))
    expect(value()).toBe(initial)
    expect(Array.from(value() as Iterable<unknown>)).toEqual([1.5, 2.5])
    for (const option of select.options) option.selected = false
    select.dispatchEvent(new Event('change'))
    expect(value()).toBe(initial)
    expect(Array.from(value() as Iterable<unknown>)).toEqual([])
  },
)

test('r-model select expression number option can be enabled and disabled', () => {
  const options = sref({ number: false })
  const { control, value } = mountModel(
    '<select r-model="value, options"><option value="7.8">value</option></select>',
    '7.8',
    { options },
  )
  for (const enabled of [false, true, false]) {
    options({ number: enabled })
    control.dispatchEvent(new Event('change'))
    expect(value()).toBe(enabled ? 7.8 : '7.8')
  }
})

test('r-model select unwraps reactive number fields inside an options object', () => {
  const options = ref({ number: false })
  const { control, value } = mountModel(
    '<select r-model="value, options"><option value="7.8">value</option></select>',
    '7.8',
    { options },
  )
  for (const enabled of [false, true, false]) {
    options().number(enabled)
    control.dispatchEvent(new Event('change'))
    expect(value()).toBe(enabled ? 7.8 : '7.8')
  }
})

test('r-model.number on selects stays enabled when expression options are false', () => {
  const { control, value } = mountModel(
    '<select r-model.number="value, { number: false }"><option value="7.8">value</option></select>',
    '7.8',
  )
  control.dispatchEvent(new Event('change'))
  expect(value()).toBe(7.8)
})
