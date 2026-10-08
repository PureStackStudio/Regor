import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export function registerApiStyles(root: Style, palette: ThemePalette) {
  const t = palette.semanticTone
  root.select('.api-jumps').css({ gap: '8px', marginBlock: '24px' })
  root.select('.api-jumps .btn').css({ fontSize: '12px' })
  root.select('.api-map h3').css({
    fontFamily: "'Cascadia Code', Consolas, monospace",
    fontSize: '18px',
    overflowWrap: 'anywhere',
  })
  root.select('.api-comparison').css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '12px',
  })
  root.select('.api-comparison .directive-card').css({ padding: '16px' })
  root.select('.api-snapshot').css({
    margin: '16px 0 0',
    padding: '16px',
    borderRadius: '8px',
    background: t.neutral.surfaceAlt.rest.bgcolor,
    color: t.neutral.text.default,
    fontSize: '12px',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    maxWidth: '100%',
  })
  root.select('.api-actions').css({ marginTop: '20px' })
  root.select('.guide-metrics.api-metrics-pair').css({
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  })
  root
    .select('.api-comparison p')
    .css({ color: t.neutral.text.subtle, fontSize: '12px' })
  root
    .media('max-width: 640px')
    .select('.api-comparison')
    .css({ gridTemplateColumns: 'minmax(0, 1fr)' })
}
