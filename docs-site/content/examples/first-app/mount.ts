import { createApp, useScope } from 'regor'
import { createCounter, counterTemplate } from './counter'

const element = document.getElementById('app')
if (element) {
  const app = createApp(
    useScope(() => createCounter(true)),
    { element, template: counterTemplate },
  )

  // When this root is no longer needed:
  // app.unbind()  // Stop bindings and listeners, keeping the DOM.
  // app.unmount() // Stop bindings and listeners, removing the root.
}
