import { computed, ref, sref } from 'regor'

const samples = 60
const vertical = { top: 24, bottom: 264, ceiling: 240 }
const definitions = [
  { id: 'search', label: 'Search', base: 112, amplitude: 32, offset: 0 },
  { id: 'events', label: 'Events', base: 76, amplitude: 25, offset: 2.4 },
  { id: 'jobs', label: 'Jobs', base: 42, amplitude: 17, offset: 4.6 },
] as const

interface Point {
  x: number
  y: number
}

function smoothPath(points: Point[]) {
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 1; i < points.length; i++) {
    const before = points[Math.max(0, i - 2)]
    const start = points[i - 1]
    const end = points[i]
    const after = points[Math.min(points.length - 1, i + 1)]
    const control1 = {
      x: start.x + (end.x - before.x) / 6,
      y: start.y + (end.y - before.y) / 6,
    }
    const control2 = {
      x: end.x - (after.x - start.x) / 6,
      y: end.y - (after.y - start.y) / 6,
    }
    path += ` C ${control1.x.toFixed(2)} ${control1.y.toFixed(2)}, ${control2.x.toFixed(2)} ${control2.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
  }
  return path
}

export function createChartModel(interactive = false) {
  const phase = ref(0)
  const intensity = ref(100)
  const workload = ref('steady')
  const running = ref(interactive)
  const enabled = sref<string[]>(definitions.map((s) => s.id))
  const selected = ref<number | null>(null)
  const width = ref(980)
  const plot = computed(() => ({ ...vertical, left: 58, right: width() - 36 }))
  const index = computed(() => selected() ?? samples - 1)
  const cursorX = computed(
    () =>
      plot().left + (index() / (samples - 1)) * (plot().right - plot().left),
  )
  const signals = computed(() =>
    definitions.map((s) => ({ ...s, enabled: enabled().includes(s.id) })),
  )
  const series = computed(() => {
    const time = phase()
    const scale = intensity() / 100
    const mode = workload()
    const bounds = plot()
    return definitions
      .filter((s) => enabled().includes(s.id))
      .map((signal) => {
        const values = Array.from({ length: samples }, (_, i) => {
          const x = i / (samples - 1)
          const wave = Math.sin(i * 0.15 + time * 0.7 + signal.offset)
          const detail = Math.sin(i * 0.39 - time * 0.4 + signal.offset) * 0.22
          const surge =
            mode === 'launch'
              ? Math.exp(
                  -(((x - (0.58 + Math.sin(time * 0.3) * 0.14)) / 0.13) ** 2),
                ) * 66
              : 0
          const pulse =
            mode === 'waves' ? Math.sin(i * 0.28 + time * 1.3) * 22 : 0
          return Math.max(
            4,
            Math.min(
              bounds.ceiling - 4,
              (signal.base +
                (wave + detail) * signal.amplitude +
                surge +
                pulse) *
                scale,
            ),
          )
        })
        const points = values.map((value, i) => ({
          x: bounds.left + (i / (samples - 1)) * (bounds.right - bounds.left),
          y:
            bounds.bottom -
            (value / bounds.ceiling) * (bounds.bottom - bounds.top),
        }))
        const line = smoothPath(points)
        return {
          ...signal,
          values,
          points,
          line,
          area: `${line} L ${bounds.right} ${bounds.bottom} L ${bounds.left} ${bounds.bottom} Z`,
        }
      })
  })
  const readout = computed(() =>
    series().map((s) => ({
      id: s.id,
      label: s.label,
      value: Math.round(s.values[index()]),
      x: s.points[index()].x,
      y: s.points[index()].y,
    })),
  )
  const average = computed(() =>
    Math.round(
      series().reduce(
        (sum, s) => sum + s.values.reduce((a, b) => a + b, 0) / samples,
        0,
      ),
    ),
  )
  const peak = computed(() =>
    Math.round(Math.max(0, ...series().flatMap((s) => s.values))),
  )
  const status = computed(() =>
    !interactive ? 'Static preview' : running() ? 'Live simulation' : 'Paused',
  )
  const sampleLabel = computed(
    () => `Sample ${String(index() + 1).padStart(2, '0')} / ${samples}`,
  )
  const description = computed(
    () =>
      `${series().length} visible streams. Average combined rate ${average()} events per second. Peak stream rate ${peak()} events per second. ${status()}.`,
  )

  return {
    interactive,
    phase,
    intensity,
    workload,
    running,
    signals,
    series,
    readout,
    average,
    peak,
    status,
    sampleLabel,
    description,
    selected,
    index,
    cursorX,
    plot,
    width,
    grid: [0, 60, 120, 180, 240].map((value) => ({
      value,
      y:
        vertical.bottom -
        (value / vertical.ceiling) * (vertical.bottom - vertical.top),
    })),
    ticks: computed(() =>
      [0, 14, 29, 44, 59].map((i) => ({
        x: plot().left + (i / (samples - 1)) * (plot().right - plot().left),
        label: String(i + 1).padStart(2, '0'),
      })),
    ),
    toggle: (id: string) => {
      const current = enabled()
      if (current.includes(id)) {
        enabled(current.filter((s) => s !== id))
      } else enabled([...current, id])
    },
    togglePlayback: () => running(!running()),
    newWindow: () => phase(phase() + 12),
    selectSample: (event: Event) =>
      selected((event.target as HTMLInputElement).valueAsNumber),
    inspect: (event: PointerEvent) => {
      const rect = (
        event.currentTarget as SVGSVGElement
      ).getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * width()
      const bounds = plot()
      selected(
        Math.max(
          0,
          Math.min(
            samples - 1,
            Math.round(
              ((x - bounds.left) / (bounds.right - bounds.left)) *
                (samples - 1),
            ),
          ),
        ),
      )
    },
    followLatest: () => selected(null),
  }
}

export type ChartModel = ReturnType<typeof createChartModel>
