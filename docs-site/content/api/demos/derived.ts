import { computed, computeMany, computeRef, html, ref } from 'regor'

export function createDerived(interactive = false) {
  const seats = ref(4)
  const price = ref(25)
  return {
    interactive,
    seats,
    price,
    total: computed(() => seats() * price()),
    double: computeRef(seats, (value) => value * 2),
    combined: computeMany([seats, price], (count, cost) => count + cost),
  }
}

export const derivedTemplate = html` <div class="guide-demo">
  <div class="guide-filter">
    <label
      >Seats · {{ seats }}<input
        type="range"
        min="1"
        max="12"
        r-model.number="seats"
        :value="seats"
        :disabled="!interactive" /></label
    ><label
      >Price · {{ price }}<input
        type="range"
        min="10"
        max="50"
        step="5"
        r-model.number="price"
        :value="price"
        :disabled="!interactive"
    /></label>
  </div>
  <div class="guide-metrics">
    <div>
      <output class="api-derived-total">{{ total }}</output
      ><span>computed · seats × price</span>
    </div>
    <div><output>{{ double }}</output><span>computeRef · seats × 2</span></div>
    <div>
      <output>{{ combined }}</output><span>computeMany · seats + price</span>
    </div>
  </div>
  <p class="guide-hint">
    Three read-only values, three ways to specify their dependencies.
  </p>
</div>`
