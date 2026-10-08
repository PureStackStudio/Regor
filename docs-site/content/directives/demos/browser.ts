import { createApp, useScope } from 'regor'
import { directiveExamples } from './examples'

const element = document.getElementById('directive-demo')
const name = element?.dataset.example
if (element && name && Object.hasOwn(directiveExamples, name)) {
  const example = directiveExamples[name as keyof typeof directiveExamples]
  createApp<object>(
    useScope<object>(() => example.create(true)),
    { element, template: example.template },
  )
}
