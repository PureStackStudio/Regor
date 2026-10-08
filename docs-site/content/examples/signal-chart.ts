import { createApp, observe, onMounted, onUnmounted, useScope } from 'regor'
import { createChartModel } from './chart-model'
import { chartTemplate } from './chart-view'

const root = document.getElementById('signal-chart')
if (root) {
  createApp(
    useScope(() => {
      const model = createChartModel(true)
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
      if (reducedMotion.matches) model.running(false)
      let visible = false
      let frame = 0
      let lastTime = 0

      // Regor owns the state and SVG bindings. The browser supplies a frame clock.
      const tick = (time: number) => {
        if (lastTime === 0) lastTime = time
        if (time - lastTime >= 32) {
          model.phase(model.phase() + Math.min(time - lastTime, 80) / 1000)
          lastTime = time
        }
        frame = requestAnimationFrame(tick)
      }
      const reconcile = () => {
        cancelAnimationFrame(frame)
        frame = 0
        lastTime = 0
        if (visible && model.running() && !document.hidden)
          frame = requestAnimationFrame(tick)
      }
      const visibility = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting)
          reconcile()
        },
        { threshold: 0.1 },
      )
      const motionChanged = () => {
        if (reducedMotion.matches) model.running(false)
      }
      const resize = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width
        if (width > 0) model.width(width)
      })
      observe(model.running, reconcile)
      onMounted(() => {
        visibility.observe(root)
        const svg = root.querySelector('.signal-svg')
        if (svg) resize.observe(svg)
        document.addEventListener('visibilitychange', reconcile)
        reducedMotion.addEventListener('change', motionChanged)
      })
      onUnmounted(() => {
        cancelAnimationFrame(frame)
        visibility.disconnect()
        resize.disconnect()
        document.removeEventListener('visibilitychange', reconcile)
        reducedMotion.removeEventListener('change', motionChanged)
      })
      return model
    }),
    { element: root, template: chartTemplate },
  )
}
