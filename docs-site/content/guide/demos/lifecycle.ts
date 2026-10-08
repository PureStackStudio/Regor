import { defineComponent, html, onMounted, onUnmounted, ref } from 'regor'

export function createLifecycle(interactive = false) {
  const active = ref(false)
  const toggle = () => active(!active())
  const ticks = ref(0)
  const starts = ref(0)
  const cleanups = ref(0)
  const lastEvent = ref('Ready. Mount the ticker to start its interval.')
  const SessionTicker = defineComponent(
    html`<p class="guide-ticker">
      Interval running <span aria-hidden="true">●</span>
    </p>`,
    {
      context: () => {
        let timer: ReturnType<typeof setInterval> | undefined
        onMounted(() => {
          starts(starts() + 1)
          lastEvent('onMounted → start interval')
          timer = setInterval(() => ticks(ticks() + 1), 500)
        })
        onUnmounted(() => {
          clearInterval(timer)
          cleanups(cleanups() + 1)
          lastEvent('onUnmounted → clear interval')
        })
        return {}
      },
    },
  )
  // No child is mounted during static rendering, so the build creates no timer.
  return {
    interactive,
    active,
    toggle,
    ticks,
    starts,
    cleanups,
    lastEvent,
    components: { SessionTicker },
  }
}

export const lifecycleTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="toggle" :disabled="!interactive">
      {{ active ? 'Unmount ticker' : 'Mount ticker' }}</button
    ><span>{{ active ? 'Child is mounted' : 'Child is unmounted' }}</span>
  </div>
  <SessionTicker r-if="active" />
  <div class="guide-metrics">
    <div><output>{{ ticks }}</output><span>Total ticks</span></div>
    <div><output>{{ starts }}</output><span>Mounts</span></div>
    <div><output>{{ cleanups }}</output><span>Cleanups</span></div>
  </div>
  <p class="guide-event" role="status">{{ lastEvent }}</p>
  <p class="guide-hint">
    Unmount the child: the tick count stops. Remount it: a fresh interval
    starts. The parent keeps the totals.
  </p>
</div>`
