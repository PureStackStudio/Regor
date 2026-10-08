import { defineComponent, html, ref } from 'regor'

export function createIs(interactive = false) {
  const SummaryCard = defineComponent(
    html`<article class="directive-card directive-dynamic-card">
      <span class="guide-kicker">SUMMARY COMPONENT</span
      ><strong>Release 1.0</strong>
      <p>A compact view of the upcoming release.</p>
    </article>`,
  )
  const DetailCard = defineComponent(
    html`<article class="directive-card directive-dynamic-card">
      <span class="guide-kicker">DETAIL COMPONENT</span
      ><strong>Release 1.0</strong>
      <ul>
        <li>State and templates connected</li>
        <li>Keyboard interactions reviewed</li>
        <li>Cleanup verified</li>
      </ul>
    </article>`,
  )
  return {
    interactive,
    selected: ref('SummaryCard'),
    components: { SummaryCard, DetailCard },
  }
}

export const isTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="dynamic-card">Component to render</label
    ><select id="dynamic-card" r-model="selected" :disabled="!interactive">
      <option value="SummaryCard">SummaryCard</option>
      <option value="DetailCard">DetailCard</option>
    </select>
  </div>
  <div :is="selected"></div>
  <p class="guide-hint">
    The selected name resolves to a registered component. Changing it mounts the
    other template.
  </p>
</div>`
