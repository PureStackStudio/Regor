import { computed, html, ref } from 'regor'

export function createStyle(interactive = false) {
  const fill = ref(65)
  const rounded = ref(true)
  const barStyle = computed(() => ({
    width: `${fill()}%`,
    borderRadius: rounded() ? '12px' : '0px',
  }))
  return { interactive, fill, rounded, barStyle }
}

export const styleTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="style-fill">Fill <strong>{{ fill }}%</strong></label
    ><input
      id="style-fill"
      type="range"
      min="5"
      max="100"
      r-model.number="fill"
      :value="fill"
      :disabled="!interactive"
    /><label class="guide-check"
      ><input
        type="checkbox"
        r-model="rounded"
        :checked="rounded"
        :disabled="!interactive"
      />
      Rounded corners</label
    >
  </div>
  <div class="directive-bar-track">
    <div class="directive-bar" :style="barStyle">{{ fill }}%</div>
  </div>
  <p class="guide-hint">
    A computed style object controls width and borderRadius.
  </p>
</div>`
