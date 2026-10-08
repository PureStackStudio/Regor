import { defineComponent } from 'regor'
import { directiveExamples } from '../content/directives/demos/examples'

export function defineDirectiveComponents() {
  return Object.fromEntries(
    Object.entries(directiveExamples).map(([name, example]) => [
      `Directive${name[0].toUpperCase()}${name.slice(1)}`,
      defineComponent<object>(example.template, {
        context: () => example.create(),
      }),
    ]),
  )
}
