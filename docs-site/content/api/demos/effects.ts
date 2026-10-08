import { collectRefs, html, ref, silence, watchEffect } from 'regor'

export function createEffects(interactive = false) {
  const tracked = ref(1),
    untracked = ref(10)
  const runs = ref(0),
    cleanups = ref(0),
    result = ref('')
  const collected = ref(0),
    inspected = ref(0)
  watchEffect((onCleanup) => {
    const value = tracked()
    silence(() => {
      runs(runs() + 1)
      result(`${value} + ${untracked()} = ${value + untracked()}`)
    })
    onCleanup?.(() => silence(() => cleanups(cleanups() + 1)))
  })
  const inspect = () => {
    const read = collectRefs(() => tracked() + silence(() => untracked()))
    collected(read.refs.length)
    inspected(read.value)
  }
  inspect()
  return {
    interactive,
    tracked,
    untracked,
    runs,
    cleanups,
    result,
    collected,
    inspected,
    inspect,
    bumpTracked: () => tracked(tracked() + 1),
    bumpUntracked: () => untracked(untracked() + 1),
  }
}

export const effectsTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="bumpTracked" :disabled="!interactive">
      Update tracked</button
    ><button type="button" @click="bumpUntracked" :disabled="!interactive">
      Update silenced read</button
    ><button type="button" @click="inspect" :disabled="!interactive">
      Collect the reads
    </button>
  </div>
  <p>Current refs: <strong>{{ tracked }} / {{ untracked }}</strong></p>
  <p class="guide-event">Last effect: {{ result }}</p>
  <div class="guide-metrics">
    <div><output>{{ runs }}</output><span>Effect runs</span></div>
    <div><output>{{ cleanups }}</output><span>Effect cleanups</span></div>
    <div>
      <output>{{ collected }}</output><span>Collected dependencies</span>
    </div>
  </div>
  <p class="guide-hint">
    The silenced read does not rerun the effect. collectRefs captures one
    dependency and returns the sampled sum: {{ inspected }}.
  </p>
</div>`
