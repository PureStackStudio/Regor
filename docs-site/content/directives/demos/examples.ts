import { createText, textTemplate } from './text'
import { createHtml, htmlTemplate } from './html'
import { createBind, bindTemplate } from './bind'
import { createModel, modelTemplate } from './model'
import { createOn, onTemplate } from './on'
import { createShow, showTemplate } from './show'
import { createClass, classTemplate } from './class'
import { createStyle, styleTemplate } from './style'
import { createIf, ifTemplate } from './if'
import { createFor, forTemplate } from './for'
import { createIs, isTemplate } from './is'
import { createContext, contextTemplate } from './context'
import { createRef, refTemplate } from './ref'
import { createPre, preTemplate } from './pre'
import { createTeleport, teleportTemplate } from './teleport'

export const directiveExamples = {
  text: { create: createText, template: textTemplate },
  html: { create: createHtml, template: htmlTemplate },
  bind: { create: createBind, template: bindTemplate },
  model: { create: createModel, template: modelTemplate },
  on: { create: createOn, template: onTemplate },
  show: { create: createShow, template: showTemplate },
  class: { create: createClass, template: classTemplate },
  style: { create: createStyle, template: styleTemplate },
  if: { create: createIf, template: ifTemplate },
  for: { create: createFor, template: forTemplate },
  is: { create: createIs, template: isTemplate },
  context: { create: createContext, template: contextTemplate },
  ref: { create: createRef, template: refTemplate },
  pre: { create: createPre, template: preTemplate },
  teleport: { create: createTeleport, template: teleportTemplate },
} as const
