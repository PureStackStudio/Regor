import { html, ref } from 'regor'

export function createBind(interactive = false) {
  const title = ref('Launch your next idea')
  const enabled = ref(true)
  const clicks = ref(0)
  return {
    interactive,
    title,
    enabled,
    clicks,
    increment: () => clicks(clicks() + 1),
  }
}

export const bindTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="bind-title">Button title and accessible name</label
    ><input
      id="bind-title"
      type="text"
      maxlength="80"
      r-model="title"
      :value="title"
      :disabled="!interactive"
    /><label class="guide-check"
      ><input type="checkbox" r-model="enabled" :disabled="!interactive" />
      Enable the button</label
    >
  </div>
  <div class="directive-card">
    <button
      class="directive-bound-button"
      type="button"
      :title="title"
      :aria-label="title"
      .disabled="!enabled || !interactive"
      @click="increment"
    >
      Try the binding
    </button>
    <dl class="directive-values">
      <div>
        <dt>title</dt>
        <dd>{{ title }}</dd>
      </div>
      <div>
        <dt>disabled</dt>
        <dd>{{ !enabled }}</dd>
      </div>
      <div>
        <dt>Clicks</dt>
        <dd>{{ clicks }}</dd>
      </div>
    </dl>
  </div>
</div>`
