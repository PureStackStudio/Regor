import { createApp, RegorConfig, useScope } from 'regor'
import { apiExamples } from './examples'

const element = document.getElementById('api-demo')
const name = element?.dataset.example
if (element && name && Object.hasOwn(apiExamples, name)) {
  const example = apiExamples[name as keyof typeof apiExamples]
  const scope = useScope<object>(() => example.create(true))
  const config =
    'config' in scope.context && scope.context.config instanceof RegorConfig
      ? scope.context.config
      : undefined
  createApp(scope, { element, template: example.template }, config)
}
