import { expect, test } from 'vitest'

import {
  cref,
  flatten,
  html,
  isRaw,
  markRaw,
  raw,
  ref,
  sref,
  svg,
} from '../../src'

test('flatten converts nested refs', () => {
  const obj = ref({ a: ref(1), b: { c: sref(2) } })
  expect(flatten(obj)).toStrictEqual({ a: 1, b: { c: 2 } })

  const arr = ref([ref(1), sref(2)])
  expect(flatten(arr)).toStrictEqual([1, 2])

  const set = ref(new Set([ref(3)]))
  expect(Array.from(flatten(set) as Set<any>)).toStrictEqual([3])

  const map = ref(new Map([['k', ref(4)]]))
  const flatMap = flatten(map) as Map<string, any>
  expect(flatMap.get('k')).toBe(4)
})

test('flatten preserves ref terminal object values', () => {
  const date = new Date('2026-01-01T00:00:00.000Z')
  const regexp = /regor/g
  const promise = Promise.resolve(1)
  const error = new Error('regor')
  const node = document.createTextNode('regor')

  const flat = flatten({
    date: ref(date),
    nested: {
      regexp,
      promise,
      error,
      node,
    },
  }) as any

  expect(flat.date).toBe(date)
  expect(flat.nested.regexp).toBe(regexp)
  expect(flat.nested.promise).toBe(promise)
  expect(flat.nested.error).toBe(error)
  expect(flat.nested.node).toBe(node)
})

test('cref preserves terminal object values in the copied ref', () => {
  const date = new Date('2026-01-01T00:00:00.000Z')
  const regexp = /regor/g
  const promise = Promise.resolve(1)
  const error = new Error('regor')
  const node = document.createTextNode('regor')
  const source = {
    date,
    regexp,
    promise,
    error,
    node,
  }

  const r = cref(source)

  expect(r().date()).toBe(date)
  expect(r().regexp()).toBe(regexp)
  expect(r().promise()).toBe(promise)
  expect(r().error()).toBe(error)
  expect(r().node()).toBe(node)
  expect(source.date).toBe(date)
  expect(source.regexp).toBe(regexp)
  expect(source.promise).toBe(promise)
  expect(source.error).toBe(error)
  expect(source.node).toBe(node)
})

test('markRaw marks object as raw', () => {
  const obj = markRaw({ a: 1 })
  expect(isRaw(obj)).toBe(true)
  expect(isRaw({})).toBe(false)
})

test('html/raw and svg tag helpers build strings', () => {
  const value = 'world'
  expect(html`hello ${value}`).toBe('hello world')
  expect(raw`a${1}b${2}`).toBe('a1b2')
  expect(svg`<svg><text>${value}</text></svg>`).toBe(
    '<svg><text>world</text></svg>',
  )
})
