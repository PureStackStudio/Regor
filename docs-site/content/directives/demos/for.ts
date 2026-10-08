import { html, sref } from 'regor'

const initial = [
  { id: 'design', label: 'Design the interface' },
  { id: 'build', label: 'Connect the state' },
  { id: 'check', label: 'Verify the behavior' },
]

export function createFor(interactive = false) {
  const rows = sref(initial.map((row) => ({ ...row })))
  return {
    interactive,
    rows,
    reverse: () => rows([...rows()].reverse()),
    remove: (id: string) => rows(rows().filter((row) => row.id !== id)),
    reset: () => rows(initial.map((row) => ({ ...row }))),
  }
}

export const forTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="reverse" :disabled="!interactive">
      Reverse order</button
    ><button type="button" @click="reset" :disabled="!interactive">
      Reset list
    </button>
  </div>
  <ul class="guide-service-list">
    <li r-for="row in rows" :key="row.id">
      <div>
        <strong>{{ row.label }}</strong><small>key: {{ row.id }}</small>
      </div>
      <button
        type="button"
        :aria-label="'Remove ' + row.label"
        @click="remove(row.id)"
        :disabled="!interactive"
      >
        Remove
      </button>
    </li>
  </ul>
  <p r-if="rows.length === 0" class="guide-empty">
    The list is empty. Reset it to start again.
  </p>
  <p class="guide-hint">
    Reverse the order: stable keys let Regor reuse the existing row elements.
  </p>
</div>`
