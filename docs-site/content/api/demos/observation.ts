import { html, observe, observeMany, observerCount, ref } from 'regor'

export function createObservation(interactive = false) {
  const left = ref(0),
    right = ref(0)
  const single = ref(0),
    multiple = ref(0),
    listening = ref(true)
  const count = ref(0)
  const stopSingle = observe(left, () => single(single() + 1))
  const stopMany = observeMany([left, right], () => multiple(multiple() + 1))
  // These source refs are not rendered directly, so this count isolates our observers.
  const refresh = () => count(observerCount(left))
  const values = ref('0 / 0')
  const bumpLeft = () => {
    left(left() + 1)
    values(`${left()} / ${right()}`)
    refresh()
  }
  const bumpRight = () => {
    right(right() + 1)
    values(`${left()} / ${right()}`)
    refresh()
  }
  const stop = () => {
    stopSingle()
    stopMany()
    listening(false)
    refresh()
  }
  refresh()
  return {
    interactive,
    values,
    single,
    multiple,
    listening,
    count,
    bumpLeft,
    bumpRight,
    stop,
  }
}

export const observationTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="bumpLeft" :disabled="!interactive">
      Update left</button
    ><button type="button" @click="bumpRight" :disabled="!interactive">
      Update right</button
    ><button type="button" @click="stop" :disabled="!interactive || !listening">
      Stop observers
    </button>
  </div>
  <p>Source values: <strong>{{ values }}</strong></p>
  <div class="guide-metrics">
    <div>
      <output>{{ single }}</output><span>observe · left callbacks</span>
    </div>
    <div>
      <output>{{ multiple }}</output><span>observeMany · callbacks</span>
    </div>
    <div><output>{{ count }}</output><span>Observers on left</span></div>
  </div>
  <p class="guide-hint">
    After stopping, source values still change but the callback counts stay put.
  </p>
</div>`
