import { html, ref, RegorConfig, type PropValidationMode } from 'regor'

export function createConfiguration(interactive = false) {
  const config = new RegorConfig()
  const policy = ref<PropValidationMode>('throw')
  const applied = ref(config.propValidationMode)
  const apply = () => {
    config.propValidationMode = policy()
    applied(config.propValidationMode)
  }
  return { interactive, config, policy, applied, apply }
}

export const configurationTemplate = html` <div
  class="guide-demo guide-demo--split"
>
  <div class="guide-controls">
    <label for="config-policy">Prop validation policy</label
    ><select id="config-policy" r-model="policy" :disabled="!interactive">
      <option value="throw">throw</option>
      <option value="warn">warn</option>
      <option value="off">off</option></select
    ><button type="button" @click="apply" :disabled="!interactive">
      Apply to this instance
    </button>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">LOCAL REGORCONFIG</span
    ><output class="directive-output" role="status">{{ applied }}</output>
    <p>
      The browser mount passes this instance to createApp. The page's other apps
      keep their own configuration.
    </p>
  </div>
</div>`
