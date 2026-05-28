import { type Directive } from '../api/types'
import { camelize } from '../common/common'
import {
  isArray,
  isNullOrUndefined,
  isObject,
  isString,
} from '../common/is-what'
import { toBoolean } from '../common/toBoolean'
import { warning, WarningType } from '../log/warnings'
import { unref } from '../reactivity/unref'

const xlinkNS = 'http://www.w3.org/1999/xlink'

const booleanAttributes: any = {
  itemscope: 2,
  allowfullscreen: 2,
  formnovalidate: 2,
  ismap: 2,
  nomodule: 2,
  novalidate: 2,
  readonly: 2,
  async: 1,
  autofocus: 1,
  autoplay: 1,
  controls: 1,
  default: 1,
  defer: 1,
  disabled: 1,
  hidden: 1,
  inert: 1,
  loop: 1,
  open: 1,
  required: 1,
  reversed: 1,
  scoped: 1,
  seamless: 1,
  checked: 1,
  muted: 1,
  multiple: 1,
  selected: 1,
}

/**
 * @internal
 */
const updateAttr = (
  el: HTMLElement,
  values: any[],
  previousValues?: any[],
  option?: any,
  previousOption?: any,
  flags?: string[],
): void => {
  if (option) {
    option = unref(option)
    if (flags && flags.includes('camel')) option = camelize(option as string)
    patchAttr(
      el,
      option as string,
      unref(values[0]),
      unref(previousOption) as string,
    )
    return
  }
  // supports
  // k,v,k,v
  // [k,v],[k,v]...
  // {k,v},{k,v}...
  const len = values.length
  for (let i = 0; i < len; ++i) {
    const next = values[i]
    if (isArray(next)) {
      const previousKey = unref(previousValues?.[i]?.[0])
      const key = unref(next[0])
      const value = unref(next[1])
      patchAttr(el, key, value, previousKey)
    } else if (isObject(next)) {
      for (const item of Object.entries(next)) {
        const key = item[0]
        const value = unref(item[1])
        const p = unref(previousValues?.[i])
        const previousKey = p && key in p ? key : undefined
        patchAttr(el, key, value, previousKey)
      }
    } else {
      const previousKey = unref(previousValues?.[i])
      const key = unref(values[i++])
      const value = unref(values[i])
      patchAttr(el, key, value, previousKey)
    }
  }
}

export const attrDirective: Directive = {
  mount: () => ({
    update: ({ el, values, previousValues, option, previousOption, flags }) => {
      updateAttr(
        el,
        values as any[],
        previousValues as any[] | undefined,
        option,
        previousOption,
        flags,
      )
    },
  }),
}

export const patchAttr = (
  el: HTMLElement,
  key: string,
  value: any,
  previousKey?: string,
): void => {
  if (previousKey && previousKey !== key) {
    el.removeAttribute(previousKey)
  }

  if (isNullOrUndefined(key)) {
    warning(WarningType.KeyIsEmpty, 'r-bind', el)
    return
  }

  if (!isString(key)) {
    warning(
      WarningType.ErrorLog,
      `Attribute key is not string at ${el.outerHTML}`,
      key,
    )
    return
  }

  if (key.startsWith('xlink:')) {
    if (isNullOrUndefined(value)) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length))
    } else {
      el.setAttributeNS(xlinkNS, key, value)
    }
    return
  }

  if (isNullOrUndefined(value)) {
    el.removeAttribute(key)
    return
  }

  if (key in booleanAttributes) {
    if (toBoolean(value)) {
      el.setAttribute(key, '')
    } else {
      el.removeAttribute(key)
    }
    return
  }

  el.setAttribute(key, value)
}
