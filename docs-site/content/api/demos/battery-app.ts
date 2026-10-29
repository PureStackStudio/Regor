import { createApp, html, ref } from 'regor'
import { defineBattery } from './battery-svg'

export function createBattery() {
  return {
    charge: ref(65),
    charging: ref(false),
    components: { Battery: defineBattery() },
  }
}

export const batteryTemplate = html`<div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="battery-charge">Charge <output>{{ charge }}%</output></label>
    <input
      id="battery-charge"
      type="range"
      min="0"
      max="100"
      r-model.number="charge"
    />
    <label class="guide-check">
      <input type="checkbox" r-model="charging" /> Charging
    </label>
  </div>
  <Battery :charge="charge" :charging="charging" />
</div>`

const element = globalThis.document?.querySelector('#battery-app')
if (element) createApp(createBattery(), { element, template: batteryTemplate })
