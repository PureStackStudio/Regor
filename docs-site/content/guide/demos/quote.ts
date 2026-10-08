import { batch, computed, html, ref } from 'regor'

export function createQuote(interactive = false) {
  const quantity = ref(4)
  const unitPrice = ref(25)
  const discounted = ref(false)
  const subtotal = computed(() => quantity() * unitPrice())
  const savings = computed(() => (discounted() ? subtotal() * 0.1 : 0))
  const total = computed(() => subtotal() - savings())
  const money = (value: number) => `$${value.toFixed(2)}`
  const reset = () =>
    batch(() => {
      quantity(4)
      unitPrice(25)
      discounted(false)
    })
  return {
    interactive,
    quantity,
    unitPrice,
    discounted,
    subtotal,
    savings,
    total,
    money,
    reset,
  }
}

export const quoteTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="quote-quantity">Seats <strong>{{ quantity }}</strong></label>
    <input
      id="quote-quantity"
      type="range"
      min="1"
      max="20"
      r-model.number="quantity"
      :value="quantity"
      :disabled="!interactive"
    />
    <label for="quote-price"
      >Price per seat <strong>{{ money(unitPrice) }}</strong></label
    >
    <input
      id="quote-price"
      type="range"
      min="10"
      max="100"
      step="5"
      r-model.number="unitPrice"
      :value="unitPrice"
      :disabled="!interactive"
    />
    <label class="guide-check"
      ><input type="checkbox" r-model="discounted" :disabled="!interactive" />
      Apply a 10% team discount</label
    >
    <button type="button" @click="reset" :disabled="!interactive">
      Reset quote
    </button>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">YOUR TEAM / MONTHLY</span>
    <output class="guide-total" aria-live="polite">{{ money(total) }}</output>
    <dl>
      <div>
        <dt>Subtotal</dt>
        <dd>{{ money(subtotal) }}</dd>
      </div>
      <div>
        <dt>Discount</dt>
        <dd>{{ money(savings) }}</dd>
      </div>
    </dl>
    <p>Two inputs. Three computed values. One connected view.</p>
  </div>
</div>`
