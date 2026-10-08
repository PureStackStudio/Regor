import { computed, html, isRaw, isRef, markRaw, ref } from 'regor'

export function createRawState(interactive = false) {
  const resource = markRaw({ label: 'External resource' })
  const state = ref({ resource, title: 'Reactive title' })
  return {
    interactive,
    state,
    rawCheck: isRaw(resource),
    sameObject: state().resource === resource,
    nestedIsRef: isRef(resource.label),
    snapshot: computed(() => state().title()),
  }
}

export const rawStateTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="raw-title">Reactive field</label
    ><input
      id="raw-title"
      type="text"
      maxlength="50"
      r-model="state.title"
      :value="snapshot"
      :disabled="!interactive"
    />
    <p class="guide-hint">
      The marked resource keeps its identity and its plain fields during deep
      conversion.
    </p>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">CONVERSION BOUNDARY</span>
    <dl class="directive-values">
      <div>
        <dt>isRaw(resource)</dt>
        <dd>{{ rawCheck }}</dd>
      </div>
      <div>
        <dt>Same resource object</dt>
        <dd>{{ sameObject }}</dd>
      </div>
      <div>
        <dt>isRef(resource.label)</dt>
        <dd>{{ nestedIsRef }}</dd>
      </div>
      <div>
        <dt>Reactive title</dt>
        <dd>{{ snapshot }}</dd>
      </div>
    </dl>
  </div>
</div>`
