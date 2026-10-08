import { html, ref } from 'regor'

export function createModel(interactive = false) {
  const name = ref('Ada')
  const seats = ref(3)
  const email = ref(true)
  const plan = ref('Team')
  const reset = () => {
    name('Ada')
    seats(3)
    email(true)
    plan('Team')
  }
  return { interactive, name, seats, email, plan, reset }
}

export const modelTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="model-name">Name · trim option</label
    ><input
      id="model-name"
      type="text"
      maxlength="40"
      r-model="name, { trim: true }"
      :value="name"
      :disabled="!interactive"
    />
    <label for="model-seats">Seats · .number</label
    ><input
      id="model-seats"
      type="range"
      min="1"
      max="12"
      r-model.number="seats"
      :value="seats"
      :disabled="!interactive"
    />
    <label for="model-plan">Plan</label
    ><select id="model-plan" r-model="plan" :disabled="!interactive">
      <option>Solo</option>
      <option selected>Team</option>
      <option>Studio</option>
    </select>
    <label class="guide-check"
      ><input
        type="checkbox"
        r-model="email"
        :checked="email"
        :disabled="!interactive"
      />
      Email updates</label
    ><button type="button" @click="reset" :disabled="!interactive">
      Reset from state
    </button>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">FORM STATE / TWO WAYS</span>
    <dl class="directive-values">
      <div>
        <dt>Name</dt>
        <dd>{{ name || 'Not set' }}</dd>
      </div>
      <div>
        <dt>Seats</dt>
        <dd>{{ seats }}</dd>
      </div>
      <div>
        <dt>Plan</dt>
        <dd>{{ plan }}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{{ email ? 'Enabled' : 'Disabled' }}</dd>
      </div>
    </dl>
    <p>Controls update state. Resetting state updates the controls.</p>
  </div>
</div>`
