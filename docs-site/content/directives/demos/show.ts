import { html, ref } from 'regor'

export function createShow(interactive = false) {
  const visible = ref(true)
  return { interactive, visible, toggle: () => visible(!visible()) }
}

export const showTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="toggle" :disabled="!interactive">
      {{ visible ? 'Hide details' : 'Show details' }}</button
    ><span>display: {{ visible ? 'visible' : 'none' }}</span>
  </div>
  <section class="directive-card directive-show-details" r-show="visible">
    <label class="guide-controls"
      >A local draft<input
        type="text"
        value="This draft stays in the same DOM node."
        :disabled="!interactive"
    /></label>
  </section>
  <p class="guide-hint">
    Edit the draft, hide it, and show it again. The element stays mounted; its
    display changes.
  </p>
</div>`
