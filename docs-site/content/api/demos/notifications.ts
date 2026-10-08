import { html, observe, pause, ref, resume, trigger } from 'regor'

export function createNotifications(interactive = false) {
  const source = ref(0),
    stored = ref(0),
    seen = ref(0),
    callbacks = ref(0),
    paused = ref(false)
  observe(source, (value) => {
    seen(value)
    callbacks(callbacks() + 1)
  })
  return {
    interactive,
    stored,
    seen,
    callbacks,
    paused,
    write: () => {
      source(source() + 1)
      stored(source())
    },
    pauseSource: () => {
      pause(source)
      paused(true)
    },
    resumeSource: () => {
      resume(source)
      paused(false)
    },
    notify: () => trigger(source),
  }
}

export const notificationsTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="write" :disabled="!interactive">
      Write +1</button
    ><button
      type="button"
      @click="pauseSource"
      :disabled="!interactive || paused"
    >
      Pause</button
    ><button
      type="button"
      @click="resumeSource"
      :disabled="!interactive || !paused"
    >
      Resume</button
    ><button type="button" @click="notify" :disabled="!interactive || paused">
      Trigger
    </button>
  </div>
  <div class="guide-metrics">
    <div><output>{{ stored }}</output><span>Stored value</span></div>
    <div><output>{{ seen }}</output><span>Observer's last value</span></div>
    <div><output>{{ callbacks }}</output><span>Callbacks</span></div>
  </div>
  <p class="guide-event">
    Notifications are {{ paused ? 'paused' : 'active' }}.
  </p>
  <p class="guide-hint">
    Pause, write, then resume and trigger. The stored value and the last
    observed value show different responsibilities.
  </p>
</div>`
