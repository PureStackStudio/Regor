import { defineComponent, svg } from 'regor'

export function defineBattery() {
  return defineComponent(
    svg`<svg class="battery" viewBox="0 0 240 140" role="img" aria-label="Battery charge">
      <title>{{ charge }} percent{{ charging ? ', charging' : '' }}</title>
      <rect class="battery-outline" x="12" y="16" width="204" height="88" rx="12" />
      <rect x="216" y="44" width="12" height="32" rx="4" fill="currentColor" />
      <rect
        x="20" y="24" height="72" rx="5"
        :width="charge * 1.88"
        :fill="charge <= 20 ? '#ef4444' : charge <= 50 ? '#f59e0b' : '#22c55e'"
      />
      <path r-if="charging" d="M123 30 99 65H115L105 91 135 53H119Z" fill="currentColor" />
      <text x="114" y="130" text-anchor="middle" fill="currentColor">{{ charge }}%</text>
    </svg>`,
    ['charge', 'charging'],
  )
}
