import { html, ref, sref } from 'regor'

export function createRef(interactive = false) {
  const input = sref<HTMLInputElement | null>(null)
  const focused = ref(false)
  return {
    interactive,
    input,
    focused,
    focus: () => input()?.focus(),
    onFocus: () => focused(true),
    onBlur: () => focused(false),
  }
}

export const refTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="referenced-input">Referenced input</label
    ><input
      id="referenced-input"
      type="text"
      placeholder="Focus me with the button"
      :ref="input"
      @focus="onFocus"
      @blur="onBlur"
      :disabled="!interactive"
    /><button type="button" @click="focus" :disabled="!interactive">
      Focus the input
    </button>
  </div>
  <p class="guide-event" role="status">
    {{ focused ? 'The referenced input has focus.' : 'Click the button to focus
    the input directly.' }}
  </p>
</div>`
