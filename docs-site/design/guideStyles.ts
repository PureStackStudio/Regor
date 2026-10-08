import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export function registerGuideStyles(root: Style, palette: ThemePalette) {
  const t = palette.semanticTone
  const ink = t.neutral.text.default
  const muted = t.neutral.text.subtle
  const edge = t.neutral.border.subtle
  const accent = t.accent.text.default
  root
    .select('.guide-map, .guide-orientation, .guide-example, .guide-callout')
    .css({ marginBlock: '24px' })
  root.select('.guide-map').css({ gap: '16px' })
  root.select('.guide-map .panel').css({ height: '100%' })
  root.select('.guide-map h3').css({ margin: '12px 0 8px', fontSize: '20px' })
  root.select('.guide-map p').css({
    margin: '0 0 18px',
    fontSize: '14px',
    lineHeight: '1.7',
    color: muted,
  })
  root.select('.guide-map a').css({ fontWeight: '600' })
  root.select('.template-doc .guide-map a.btn').css({ color: accent })
  root
    .select('.guide-orientation p, .guide-callout p')
    .css({ margin: '8px 0 0' })
  root.select('.guide-example').css({
    border: `1px solid ${edge}`,
    borderRadius: '14px',
    overflow: 'hidden',
  })
  root.select('.guide-example-heading').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '20px 24px',
    borderBottom: `1px solid ${edge}`,
  })
  root
    .select('.guide-example-heading strong')
    .css({ fontSize: '16px', letterSpacing: '-0.3px' })
  root.select('.guide-example .tabs').css({ margin: '0' })
  root
    .select('.guide-example pre')
    .css({ maxHeight: '480px', overflow: 'auto' })
  root.select('.guide-example-note').css({
    margin: '0',
    padding: '16px 24px',
    borderTop: `1px solid ${edge}`,
    fontSize: '13px',
    color: muted,
  })
  root.select('.guide-demo').css({
    padding: '24px',
    background: t.neutral.canvas,
    color: ink,
    fontSize: '14px',
    lineHeight: '1.6',
  })
  root
    .select('.guide-demo, .guide-demo *')
    .css({ boxSizing: 'border-box', minWidth: '0' })
  root.select('.guide-demo p').css({ fontSize: '14px', margin: '12px 0 0' })
  root.select('.guide-demo--split').css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '28px',
  })
  root.select('.guide-controls').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '12px',
  })
  root.select('.guide-controls > label:not(.guide-check)').css({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    fontWeight: '600',
  })
  root
    .select(
      '.guide-demo input:not([type="checkbox"]):not([type="range"]), .guide-demo select',
    )
    .css({
      width: '100%',
      padding: '10px 12px',
      border: `1px solid ${t.neutral.border.default}`,
      borderRadius: '6px',
      background: t.neutral.surface.rest.bgcolor,
      color: ink,
      font: 'inherit',
    })
  root
    .select(
      '.guide-demo input[type="range"], .guide-demo input[type="checkbox"]',
    )
    .css({ accentColor: accent })
  root
    .select('.guide-demo input[type="range"]')
    .css({ width: '100%', margin: '2px 0 12px' })
  root.select('.guide-check').css({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  })
  root.select('.guide-demo button').css({
    padding: '9px 14px',
    border: `1px solid ${t.neutral.border.default}`,
    borderRadius: '6px',
    background: t.neutral.surface.rest.bgcolor,
    color: ink,
    font: 'inherit',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  })
  root.select('.guide-demo button:hover').css({ borderColor: accent })
  root
    .select('.guide-demo :is(button, input, select):focus-visible')
    .css({ outline: `2px solid ${accent}`, outlineOffset: '3px' })
  root
    .select('.guide-demo :is(button, input, select):disabled')
    .css({ opacity: '0.55', cursor: 'default' })
  root.select('.guide-readout').css({
    padding: '24px',
    background: t.accent.surface.rest.bgcolor,
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  })
  root.select('.guide-kicker, .guide-slot-label').css({
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1.1px',
    color: accent,
  })
  root.select('.guide-total').css({
    display: 'block',
    fontSize: '42px',
    lineHeight: '1.2',
    letterSpacing: '-2px',
    fontWeight: '700',
    margin: '14px 0 20px',
    fontVariantNumeric: 'tabular-nums',
  })
  root.select('.guide-readout dl').css({ margin: '0' })
  root
    .select('.guide-readout dl > div')
    .css({ display: 'flex', justifyContent: 'space-between', gap: '12px' })
  root
    .select('.guide-readout dd')
    .css({ margin: '0', fontVariantNumeric: 'tabular-nums' })
  root
    .select('.guide-readout p, .guide-hint')
    .css({ color: muted, fontSize: '12px' })
  root.select('.guide-filter').css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
    gap: '16px',
  })
  root
    .select('.guide-filter label')
    .css({ display: 'grid', gap: '8px', fontWeight: '600' })
  root.select('.guide-result-count').css({ fontSize: '12px', color: muted })
  root
    .select('.guide-service-list')
    .css({ listStyle: 'none', padding: '0', margin: '16px 0' })
  root.select('.guide-service-list li').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px 0',
    margin: '0',
    borderBottom: `1px solid ${edge}`,
  })
  root
    .select('.guide-service-list small')
    .css({ display: 'block', color: muted, fontSize: '12px' })
  root.select('.guide-service-list button').css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    alignSelf: 'center',
  })
  root.select('.guide-service-list i').css({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: t.warning.text.default,
  })
  root.select('.guide-service-list .is-healthy i').css({ background: accent })
  root.select('.guide-empty').css({ padding: '24px 0' })
  root.select('.guide-empty button').css({ marginTop: '12px' })
  root.select('.guide-profile-preview').css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '16px',
  })
  root.select('.guide-profile').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '24px',
    border: `1px solid ${edge}`,
    borderRadius: '10px',
    background: t.neutral.surface.rest.bgcolor,
  })
  root.select('.guide-avatar').css({
    display: 'grid',
    placeItems: 'center',
    width: '56px',
    height: '56px',
    flexShrink: '0',
    borderRadius: '16px',
    background: t.accent.surface.rest.bgcolor,
    color: accent,
    fontSize: '20px',
    fontWeight: '700',
  })
  root
    .select('.guide-profile h3')
    .css({ fontSize: '20px', margin: '0', overflowWrap: 'anywhere' })
  root.select('.guide-profile p').css({ margin: '4px 0 0', color: muted })
  root.select('.guide-profile footer').css({
    width: '100%',
    paddingTop: '12px',
    borderTop: `1px solid ${edge}`,
    fontSize: '12px',
  })
  root.select('.guide-slot-label').css({ fontSize: '9px', marginBottom: '4px' })
  root.select('.guide-profile.is-compact').css({
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '16px',
    gap: '10px',
  })
  root.select('.guide-profile.is-compact .guide-avatar').css({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    fontSize: '14px',
  })
  root.select('.guide-profile.is-compact h3').css({ fontSize: '16px' })
  root.select('.guide-session-bar').css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  })
  root
    .select('.guide-session-bar > span')
    .css({ color: muted, fontSize: '12px' })
  root.select('.guide-ticker').css({ color: accent })
  root.select('.guide-metrics').css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '16px',
    marginBlock: '24px',
  })
  root.select('.guide-metrics > div').css({
    padding: '16px',
    borderRadius: '8px',
    background: t.accent.surface.rest.bgcolor,
  })
  root.select('.guide-metrics output').css({
    display: 'block',
    fontSize: '30px',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
  })
  root.select('.guide-metrics span').css({ fontSize: '12px', color: muted })
  root.select('.guide-event').css({
    borderLeft: `3px solid ${accent}`,
    padding: '8px 12px',
    background: t.neutral.surface.rest.bgcolor,
    overflowWrap: 'anywhere',
  })
  root
    .media('max-width: 640px')
    .select('.guide-demo--split, .guide-filter')
    .css({ gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' })
  root
    .media('max-width: 640px')
    .select('.guide-demo, .guide-example-heading')
    .css({ padding: '18px' })
  root.media('max-width: 640px').select('.guide-metrics').css({ gap: '8px' })
  root
    .media('max-width: 640px')
    .select('.guide-metrics > div')
    .css({ padding: '12px 8px' })
}
