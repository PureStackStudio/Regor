import { persist, ref, useScope } from 'regor'

// Call in the browser when mounting the app that owns these preferences.
export function createPreferences() {
  return useScope(() => ({
    compact: persist(ref(false), 'regor-example:preferences:v1'),
  }))
}
