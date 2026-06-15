import { type BindData, type Directive } from '../api/types'
import { rgi } from '../bind/rgi'
import { bindDataSymbol } from '../cleanup/bindDataSymbol'
import { isMap, isObject, isSet } from '../common/is-what'
import { flatten } from '../misc/flatten'

type BindableNode = { [bindDataSymbol]?: BindData }

/**
 * @internal
 */
const updateText = (el: Node, values: unknown[]): void => {
  const value = values[0]
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
  // Note: order is important: [isSet,isMap] should come before [isObject].
  el.textContent = isSet(value)
    ? JSON.stringify(flatten([...value]))
    : isMap(value)
      ? JSON.stringify(flatten([...value]))
      : isObject(value)
        ? JSON.stringify(flatten(value))
        : (value?.toString() ?? '')
}

const moveBindData = (from: Node, to: Node): void => {
  const bindableFrom = from as BindableNode
  const bindData = bindableFrom[bindDataSymbol]
  if (!bindData) return
  ;(to as BindableNode)[bindDataSymbol] = bindData
  bindableFrom[bindDataSymbol] = undefined
}

const createInterpolationTextNode = (el: HTMLElement): Node => {
  if (el.tagName !== 'SPAN') return el
  if (!el.hasAttribute(rgi)) return el
  const parent = el.parentNode
  if (!parent) return el
  const textNode = el.ownerDocument.createTextNode('')
  moveBindData(el, textNode)
  parent.replaceChild(textNode, el)
  return textNode
}

export const textDirective: Directive = {
  mount: ({ el }) => {
    const target = createInterpolationTextNode(el)
    return {
      update: ({ values }) => {
        updateText(target, values)
      },
    }
  },
}
