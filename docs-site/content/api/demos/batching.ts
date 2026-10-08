import { batch, endBatch, html, observe, ref, startBatch } from 'regor'

export function createBatching(interactive = false) {
  const source = ref(0),
    notifications = ref(0),
    value = ref(0)
  const mode = ref('Choose an update strategy.')
  observe(source, () => notifications(notifications() + 1))
  const update = (strategy: string) => {
    notifications(0)
    const writes = () => {
      for (let i = 0; i < 3; i++) source(source() + 1)
    }
    if (strategy === 'batch') batch(writes)
    else if (strategy === 'manual') {
      startBatch()
      try {
        writes()
      } finally {
        endBatch()
      }
    } else writes()
    value(source())
    mode(
      strategy === 'plain'
        ? 'Three separate writes'
        : strategy === 'batch'
          ? 'One batch callback'
          : 'startBatch + finally endBatch',
    )
  }
  return {
    interactive,
    notifications,
    value,
    mode,
    plain: () => update('plain'),
    grouped: () => update('batch'),
    manual: () => update('manual'),
  }
}

export const batchingTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="plain" :disabled="!interactive">
      Three plain writes</button
    ><button type="button" @click="grouped" :disabled="!interactive">
      Use batch</button
    ><button type="button" @click="manual" :disabled="!interactive">
      Start / end batch
    </button>
  </div>
  <div class="guide-metrics api-metrics-pair">
    <div><output>{{ value }}</output><span>Source value</span></div>
    <div>
      <output>{{ notifications }}</output><span>Observer callbacks</span>
    </div>
  </div>
  <p class="guide-event" role="status">{{ mode }}</p>
  <p class="guide-hint">
    Each action adds three. Compare notification counts for the same amount of
    state change.
  </p>
</div>`
