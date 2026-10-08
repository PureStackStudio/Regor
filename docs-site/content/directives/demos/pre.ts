import { html, ref } from 'regor'

export function createPre(interactive = false) {
  return { interactive, message: ref('This part is reactive.') }
}

export const preTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="pre-message">Reactive message</label
    ><input
      id="pre-message"
      type="text"
      maxlength="80"
      r-model="message"
      :value="message"
      :disabled="!interactive"
    />
  </div>
  <div class="directive-zones">
    <div class="directive-card">
      <span class="guide-kicker">NORMAL SUBTREE</span>
      <p class="directive-compiled">{{ message }}</p>
    </div>
    <div class="directive-card" r-pre>
      <span class="guide-kicker">R-PRE SUBTREE</span>
      <p class="directive-literal">{{ message }}</p>
    </div>
  </div>
  <p class="guide-hint">
    The r-pre subtree keeps its literal interpolation syntax.
  </p>
</div>`
