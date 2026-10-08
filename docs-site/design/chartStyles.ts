import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { regorColors } from './skin'

const mono = "'Cascadia Code', 'SFMono-Regular', Consolas, monospace"

export function registerChartStyles(root: Style, palette: ThemePalette) {
  const t = palette.semanticTone
  root.select('.signal-demo').css({ paddingTop: '0' })
  root.select('.signal-dashboard').css({
    border: `1px solid ${t.neutral.border.default}`,
    borderRadius: '16px',
    background: t.neutral.canvas,
    color: t.neutral.text.default,
    overflow: 'hidden',
    boxShadow: palette.effect.softShadow,
  })
  root.select('.signal-toolbar').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '28px 32px',
    borderBottom: `1px solid ${t.neutral.border.subtle}`,
  })
  root.select('.signal-kicker').css({
    color: t.accent.text.default,
    font: `11px/1.5 ${mono}`,
    letterSpacing: '1.5px',
  })
  root.select('.signal-toolbar h3').css({
    fontSize: '20px',
    marginTop: '7px',
    letterSpacing: '-0.5px',
    color: t.neutral.text.default,
  })
  root.select('.signal-actions').css({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  })
  root.select('.signal-status').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginRight: '10px',
    color: t.neutral.text.subtle,
    font: `10px/1.5 ${mono}`,
    whiteSpace: 'nowrap',
  })
  root.select('.signal-status i').css({
    width: '6px',
    height: '6px',
    background: t.neutral.text.subtle,
    borderRadius: '50%',
  })
  root.select('.signal-status.is-live i').css({
    background: regorColors.signal,
    boxShadow: `0 0 0 4px ${regorColors.signal}16`,
  })
  root.select('.signal-button').css({
    padding: '9px 12px',
    border: `1px solid ${t.neutral.border.default}`,
    borderRadius: '6px',
    background: t.neutral.surface.rest.bgcolor,
    color: t.neutral.text.default,
    fontSize: '12px !important',
    lineHeight: '1.4',
    transition: 'border-color 160ms',
  })
  root
    .select('.signal-button:hover')
    .css({ borderColor: t.accent.text.default })
  root
    .select(
      '.signal-dashboard button:disabled, .signal-dashboard input:disabled, .signal-dashboard select:disabled',
    )
    .css({ cursor: 'default', opacity: '0.6' })
  root.select('.signal-controls').css({
    display: 'flex',
    alignItems: 'end',
    flexWrap: 'wrap',
    gap: '24px',
    padding: '24px 32px',
  })
  root.select('.signal-field').css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    width: '170px',
    font: `10px/1.5 ${mono}`,
    color: t.neutral.text.subtle,
  })
  root.select('.signal-field select').css({
    width: '100%',
    border: `1px solid ${t.neutral.border.default}`,
    borderRadius: '6px',
    background: t.neutral.surface.rest.bgcolor,
    color: t.neutral.text.default,
    padding: '9px',
    font: '12px/1.5 inherit',
  })
  root.select('.signal-dashboard input[type=range]').css({
    accentColor: regorColors.signal,
    cursor: 'pointer',
    minWidth: '0',
    height: '18px',
    margin: '0',
  })
  root
    .select('.signal-intensity input')
    .css({ width: '100%', marginBlock: '8px !important' })
  root.select('.signal-legend').css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
    flexWrap: 'wrap',
    paddingBottom: '3px',
  })
  root.select('.signal-chip').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    border: `1px solid ${t.neutral.border.default}`,
    borderRadius: '6px',
    padding: '8px 11px',
    background: 'transparent',
    color: t.neutral.text.default,
    fontSize: '12px !important',
    lineHeight: '1.4',
  })
  root.select('.signal-chip i, .signal-readouts i').css({
    background: 'var(--signal-color)',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    flexShrink: '0',
  })
  root.select('.signal-chip.is-hidden').css({ opacity: '0.45' })
  root.select('.signal-chip:hover').css({ borderColor: 'var(--signal-color)' })
  root.select('.signal--search').set('--signal-color', regorColors.signal)
  root.select('.signal--events').set('--signal-color', '#efb1df')
  root.select('.signal--jobs').set('--signal-color', '#f2f3ed')
  root.select('.signal-metrics').css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    gap: '24px',
    padding: '4px 32px 24px',
  })
  root.select('.signal-metrics > div > span').css({
    display: 'block',
    color: t.neutral.text.subtle,
    font: `10px/1.5 ${mono}`,
  })
  root.select('.signal-metrics strong').css({
    display: 'block',
    marginTop: '8px',
    fontSize: '30px',
    fontWeight: '550',
    lineHeight: '1.2',
    letterSpacing: '-1px',
    fontVariantNumeric: 'tabular-nums',
  })
  root.select('.signal-metrics small').css({
    fontSize: '11px',
    color: t.neutral.text.subtle,
    fontWeight: '400',
    letterSpacing: '0',
  })
  root
    .select('.signal-plot')
    .css({ position: 'relative', marginInline: '16px' })
  root.select('.signal-svg').css({
    display: 'block',
    width: '100%',
    height: 'auto',
    overflow: 'visible',
    touchAction: 'pan-y',
  })
  root
    .select('.signal-svg text')
    .css({ font: `10px/1 ${mono}`, fill: t.neutral.text.subtle })
  root.select('.signal-grid line').css({
    stroke: t.neutral.border.subtle,
    strokeDasharray: '3 6',
    vectorEffect: 'non-scaling-stroke',
  })
  root
    .select('.signal-axis-label')
    .css({ fontSize: '8px !important', letterSpacing: '1px' })
  root.select('.signal-line').css({
    fill: 'none',
    stroke: 'var(--signal-color)',
    strokeWidth: '2.2px',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  })
  root.select('.signal-stop').css({ stopColor: 'var(--signal-color)' })
  root.select('.signal-cursor').css({
    stroke: t.neutral.text.subtle,
    strokeDasharray: '3 5',
    strokeOpacity: '0.45',
    vectorEffect: 'non-scaling-stroke',
  })
  root.select('.signal-point').css({
    fill: t.neutral.canvas,
    stroke: 'var(--signal-color)',
    strokeWidth: '2px',
    vectorEffect: 'non-scaling-stroke',
  })
  root.select('.signal-empty').css({
    position: 'absolute',
    top: '40%',
    left: '0',
    right: '0',
    textAlign: 'center',
    fontSize: '13px',
    color: t.neutral.text.subtle,
  })
  root.select('.signal-inspector').css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '18px 32px',
    borderTop: `1px solid ${t.neutral.border.subtle}`,
  })
  root.select('.signal-sample').css({
    color: t.neutral.text.subtle,
    font: `10px/1.5 ${mono}`,
    whiteSpace: 'nowrap',
  })
  root.select('.signal-readouts').css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '18px',
    fontSize: '12px',
  })
  root.select('.signal-readouts > span').css({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    color: t.neutral.text.subtle,
  })
  root.select('.signal-readouts strong').css({
    color: 'var(--signal-color)',
    font: `12px/1.5 ${mono}`,
    minWidth: '24px',
  })
  root.select('.signal-scrubber').css({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    font: `10px/1.5 ${mono}`,
    color: t.neutral.text.subtle,
    marginLeft: 'auto',
  })
  root.select('.signal-scrubber input').css({ width: '120px' })
  root.select('.signal-footnote').css({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '12px 32px',
    background: t.neutral.surfaceAlt.rest.bgcolor,
    color: t.neutral.text.subtle,
    font: `9px/1.5 ${mono}`,
  })
  root.select('.signal-source').css({
    marginTop: '16px',
    border: `1px solid ${t.neutral.border.subtle}`,
    borderRadius: '10px',
    background: t.neutral.surface.rest.bgcolor,
    overflow: 'hidden',
  })
  root.select('.signal-source summary').css({
    padding: '18px 24px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  })
  root.select('.signal-source summary span').css({
    float: 'right',
    color: t.neutral.text.subtle,
    font: `10px/1.8 ${mono}`,
  })
  root
    .select('.signal-source .tabs__panel-body')
    .css({ maxHeight: '420px', overflowY: 'auto' })
  root.select('.signal-source pre').css({
    margin: '0 !important',
    fontSize: '12px',
    border: '0',
    borderRadius: '0',
  })
  root.select('.signal-demo-note').css({
    marginTop: '18px !important',
    fontSize: '12px',
    color: t.neutral.text.subtle,
  })
  root
    .select('.signal-demo-note a')
    .css({ textDecoration: 'underline !important', textUnderlineOffset: '3px' })
  const mobile = root.media('max-width: 760px')
  mobile.select('.signal-toolbar').css({
    alignItems: 'start',
    flexDirection: 'column',
    padding: '22px',
    gap: '18px',
  })
  mobile.select('.signal-controls').css({ padding: '20px 22px', gap: '18px' })
  mobile.select('.signal-field').css({ width: 'calc(50% - 9px)' })
  mobile.select('.signal-legend').css({ marginLeft: '0', width: '100%' })
  mobile.select('.signal-metrics').css({ padding: '0 22px 20px', gap: '12px' })
  mobile.select('.signal-metrics strong').css({ fontSize: '24px' })
  mobile
    .select('.signal-metrics small')
    .css({ display: 'block', marginTop: '3px' })
  mobile.select('.signal-plot').css({ marginInline: '4px' })
  mobile.select('.signal-svg').css({ minHeight: '180px' })
  mobile.select('.signal-inspector').css({ padding: '16px 22px', gap: '12px' })
  mobile.select('.signal-readouts').css({ width: '100%', gap: '12px' })
  mobile.select('.signal-scrubber').css({ marginLeft: '0', width: '100%' })
  mobile.select('.signal-scrubber input').css({ flex: '1' })
  mobile
    .select('.signal-footnote')
    .css({ padding: '12px 22px', flexDirection: 'column', gap: '4px' })
  mobile.select('.signal-source summary span').css({ display: 'none' })
}
