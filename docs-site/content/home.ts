import { createApp, html, ref } from 'regor'
import './examples/signal-chart'

const count = ref(0)
createApp(
  {
    count,
    increment: () => count(count() + 1),
    reset: () => count(0),
  },
  {
    selector: '#counter',
    template: html`<div class="counter-readout">
        <output
          class="counter-value"
          aria-label="Counter value"
          aria-live="polite"
          r-text="count"
          >0</output
        >
        <span class="counter-caption">count</span>
      </div>
      <div class="counter-buttons">
        <button class="counter-increment" type="button" @click="increment">
          +1
        </button>
        <button class="counter-reset" type="button" @click="reset">
          Reset
        </button>
      </div>`,
  },
)

const status = document.getElementById('copy-status')
for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-copy]',
)) {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy ?? '')
    if (!source) return
    try {
      await navigator.clipboard.writeText(source.textContent?.trim() ?? '')
      if (status) status.textContent = 'Install command copied.'
    } catch {
      const range = document.createRange()
      range.selectNodeContents(source)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      if (status)
        status.textContent = 'Command selected. Use your browser’s Copy action.'
    }
  })
}
