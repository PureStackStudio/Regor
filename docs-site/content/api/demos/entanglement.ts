import { entangle, html, ref } from 'regor'

export function createEntanglement(interactive = false) {
  const left = ref('Shared title'),
    right = ref('')
  const linked = ref(true)
  const stop = entangle(left, right)
  return {
    interactive,
    left,
    right,
    linked,
    disconnect: () => {
      stop()
      linked(false)
    },
  }
}

export const entanglementTemplate = html` <div class="guide-demo">
  <div class="guide-filter">
    <label
      >Left ref<input
        type="text"
        maxlength="50"
        r-model="left"
        :value="left"
        :disabled="!interactive" /></label
    ><label
      >Right ref<input
        type="text"
        maxlength="50"
        r-model="right"
        :value="right"
        :disabled="!interactive"
    /></label>
  </div>
  <div class="guide-session-bar api-actions">
    <button
      type="button"
      @click="disconnect"
      :disabled="!interactive || !linked"
    >
      Disconnect the refs</button
    ><span>{{ linked ? 'Two-way link active' : 'Refs are independent' }}</span>
  </div>
  <p class="guide-hint">
    Edit either side. Disconnect the link, then edit again.
  </p>
</div>`
