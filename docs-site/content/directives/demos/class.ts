import { html, ref } from 'regor'

export function createClass(interactive = false) {
  return { interactive, highlighted: ref(true), muted: ref(false) }
}

export const classTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label class="guide-check"
      ><input
        type="checkbox"
        r-model="highlighted"
        :checked="highlighted"
        :disabled="!interactive"
      />
      Highlighted</label
    ><label class="guide-check"
      ><input type="checkbox" r-model="muted" :disabled="!interactive" />
      Muted</label
    >
    <p class="guide-hint">
      The base class stays. The object expression toggles two additional
      classes.
    </p>
  </div>
  <article
    class="directive-card directive-class-card"
    :class="{ 'is-highlighted': highlighted, 'is-muted': muted }"
  >
    <span class="guide-kicker">CLASS LIST / REACTIVE</span
    ><strong>One card, changing emphasis.</strong>
    <p>
      {{ highlighted ? 'is-highlighted' : 'No highlight' }} · {{ muted ?
      'is-muted' : 'Full emphasis' }}
    </p>
  </article>
</div>`
