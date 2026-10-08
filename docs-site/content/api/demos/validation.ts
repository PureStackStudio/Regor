import { defineComponent, html, pval, ref } from 'regor'

export function createValidation(interactive = false) {
  const ValidatorField = defineComponent(
    html` <div class="guide-demo">
      <div class="guide-controls">
        <label for="validation-value">Candidate value</label
        ><input
          id="validation-value"
          type="text"
          maxlength="20"
          r-model="text"
          :value="text"
          :disabled="!interactive"
        /><label class="guide-check"
          ><input
            type="checkbox"
            r-model="asNumber"
            :checked="asNumber"
            :disabled="!interactive"
          />
          Convert to Number before validating</label
        ><button type="button" @click="validate" :disabled="!interactive">
          Validate with pval.isNumber
        </button>
      </div>
      <p class="guide-event" role="status">{{ result }}</p>
      <p class="guide-hint">
        Validators check runtime types. They do not coerce a string into a
        number.
      </p>
    </div>`,
    {
      context: (head) => {
        const text = ref('12'),
          asNumber = ref(true),
          result = ref('Validate the candidate to see its runtime contract.')
        const validate = () => {
          try {
            pval.isNumber(asNumber() ? Number(text()) : text(), 'count', head)
            result('Valid: count is a number.')
          } catch (error) {
            result(error instanceof Error ? error.message : String(error))
          }
        }
        return { interactive, text, asNumber, result, validate }
      },
    },
  )
  return { interactive, components: { ValidatorField } }
}

export const validationTemplate = html`<ValidatorField />`
