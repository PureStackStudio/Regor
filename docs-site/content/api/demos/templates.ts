import {
  computed,
  html,
  raw,
  ref,
  svg,
  toFragment,
  toJsonTemplate,
} from 'regor'

export function createTemplates(interactive = false) {
  const message = ref('Hello, Regor')
  const json = computed(() => ({ t: 'p', c: [{ d: message() }] }))
  const serialized = computed(() => JSON.stringify(json(), null, 2))
  const tagged = computed(() => html`<p>${message()}</p>`)
  const rawTagged = computed(() => raw`<p>${message()}</p>`)
  const svgTagged = svg`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`
  const roundTrip = ref('Convert the JSON to a fragment, then back to JSON.')
  const convert = () => {
    const fragment = toFragment(json())
    const element = fragment.firstElementChild!
    roundTrip(JSON.stringify(toJsonTemplate(element), null, 2))
  }
  return {
    interactive,
    message,
    serialized,
    tagged,
    rawTagged,
    svgTagged,
    roundTrip,
    convert,
  }
}

export const templatesTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="template-message">Text to encode</label
    ><input
      id="template-message"
      type="text"
      maxlength="60"
      r-model="message"
      :value="message"
      :disabled="!interactive"
    /><button type="button" @click="convert" :disabled="!interactive">
      JSON → fragment → JSON
    </button>
  </div>
  <div class="directive-zones">
    <article class="directive-card">
      <span class="guide-kicker">HTML / RAW TAGS</span>
      <pre class="api-snapshot" r-text="tagged"></pre>
      <p>raw produces the same string: {{ tagged === rawTagged }}</p>
      <span class="guide-kicker">SVG TAG</span>
      <pre class="api-snapshot" r-text="svgTagged"></pre>
    </article>
    <article class="directive-card">
      <span class="guide-kicker">JSON TEMPLATE</span>
      <pre class="api-snapshot" r-text="serialized"></pre>
      <span class="guide-kicker">ROUND TRIP</span>
      <pre class="api-snapshot" r-text="roundTrip"></pre>
    </article>
  </div>
  <p class="guide-hint">
    Generated strings are shown as text. Tagged templates assemble strings; they
    do not sanitize interpolated values.
  </p>
</div>`
