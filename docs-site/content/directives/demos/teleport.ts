import { html, ref } from 'regor'

export function createTeleport(interactive = false) {
  const active = ref(true)
  return {
    interactive,
    active,
    message: ref('Still bound to the source context.'),
    toggle: () => active(!active()),
  }
}

export const teleportTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="portal-message">Message in the source context</label
    ><input
      id="portal-message"
      type="text"
      maxlength="80"
      r-model="message"
      :value="message"
      :disabled="!interactive"
    /><button type="button" @click="toggle" :disabled="!interactive">
      {{ active ? 'Unmount message' : 'Mount message' }}
    </button>
  </div>
  <div class="directive-zones">
    <section class="directive-card">
      <span class="guide-kicker">SOURCE / DECLARED HERE</span>
      <p>The message's template starts in this region.</p>
      <div
        r-if="active"
        class="directive-portal-message"
        r-teleport="#directive-portal"
      >
        <strong>{{ message }}</strong>
      </div>
    </section>
    <section class="directive-card">
      <span class="guide-kicker">TARGET / RENDERED HERE</span>
      <div id="directive-portal"></div>
    </section>
  </div>
  <p class="guide-hint">
    The element moves to the target. Its bindings still read the source context.
  </p>
</div>`
