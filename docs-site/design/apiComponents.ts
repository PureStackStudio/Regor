import { defineComponent } from 'regor'
import { apiExamples } from '../content/api/demos/examples'

export function defineApiComponents() {
  return Object.fromEntries(
    Object.entries(apiExamples).map(([name, example]) => [
      `Api${name[0].toUpperCase()}${name.slice(1)}`,
      defineComponent<object>(example.template, {
        context: () => example.create(),
      }),
    ]),
  )
}
