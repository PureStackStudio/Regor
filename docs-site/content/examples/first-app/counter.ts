import { html, ref } from 'regor'

export function createCounter(interactive = false) {
  const count = ref(0)
  return {
    interactive,
    count,
    increment: () => count(count() + 1),
    reset: () => count(0),
  }
}

export const counterTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <strong>Change state. Watch the DOM.</strong>
    <p>The buttons update a ref. Regor updates the text bound to it.</p>
    <div class="guide-session-bar">
      <button type="button" @click="increment" :disabled="!interactive">
        Increment
      </button>
      <button type="button" @click="reset" :disabled="!interactive">
        Reset
      </button>
    </div>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">YOUR FIRST REF / COUNT</span>
    <output
      class="guide-total"
      aria-label="Counter value"
      aria-live="polite"
      r-text="count"
    ></output>
    <p>One ref, an event handler, and a text binding.</p>
  </div>
</div>`
