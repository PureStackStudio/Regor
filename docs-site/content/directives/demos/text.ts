import { html, ref } from 'regor'

export function createText(interactive = false) {
  return { interactive, message: ref('Hello, Regor.') }
}

export const textTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="text-message">Your message</label
    ><input
      id="text-message"
      type="text"
      maxlength="100"
      r-model="message"
      :value="message"
      :disabled="!interactive"
    />
    <p class="guide-hint">
      Try typing &lt;strong&gt;Hello&lt;/strong&gt;. It stays text.
    </p>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">TEXT CONTENT / LIVE</span
    ><output
      class="directive-output"
      r-text="message"
      aria-live="polite"
    ></output>
  </div>
</div>`
