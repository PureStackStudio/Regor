import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { regorColors } from './skin'

export function registerDirectiveStyles(root: Style, palette: ThemePalette) {
  const t = palette.semanticTone
  root.select('.directive-output').css({
    display: 'block',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.5',
    marginTop: '16px',
    overflowWrap: 'anywhere',
  })
  root.select('.directive-card').css({
    padding: '20px',
    marginTop: '20px',
    background: t.neutral.surface.rest.bgcolor,
    color: t.neutral.text.default,
    border: `1px solid ${t.neutral.border.subtle}`,
    borderRadius: '10px',
    overflowWrap: 'anywhere',
  })
  root
    .select('.guide-demo--split > .directive-card')
    .css({ marginTop: '0', alignSelf: 'center' })
  root
    .select('.directive-card > strong')
    .css({ display: 'block', fontSize: '18px', marginTop: '12px' })
  root.select('.directive-card kbd').css({
    border: `1px solid ${t.neutral.border.default}`,
    borderRadius: '4px',
    padding: '2px 6px',
  })
  root.select('.directive-values').css({ margin: '18px 0 0' })
  root.select('.directive-values > div').css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '8px 16px',
    padding: '8px 0',
    borderBottom: `1px solid ${t.neutral.border.subtle}`,
  })
  root
    .select('.directive-values dt')
    .css({ color: t.neutral.text.subtle, fontSize: '12px' })
  root
    .select('.directive-values dd')
    .css({ margin: '0', fontWeight: '600', overflowWrap: 'anywhere' })
  root.select('.directive-class-card.is-highlighted').css({
    background: t.accent.surface.rest.bgcolor,
    borderColor: t.accent.border.default,
  })
  root.select('.directive-class-card.is-muted').css({ opacity: '0.55' })
  root.select('.directive-bar-track').css({
    padding: '8px',
    borderRadius: '16px',
    marginTop: '24px',
    background: t.neutral.surfaceAlt.rest.bgcolor,
    border: `1px solid ${t.neutral.border.subtle}`,
  })
  root.select('.directive-bar').css({
    display: 'flex',
    alignItems: 'center',
    minHeight: '64px',
    minWidth: '40px',
    padding: '12px',
    fontWeight: '700',
    color: regorColors.onSignal,
    background: regorColors.signal,
  })
  root.select('.directive-zones').css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  })
  root
    .select('.directive-literal')
    .css({ fontFamily: "'Cascadia Code', Consolas, monospace" })
  root.select('.directive-portal-message').css({
    padding: '16px',
    borderRadius: '6px',
    background: t.accent.surface.rest.bgcolor,
    marginTop: '16px',
    overflowWrap: 'anywhere',
  })
  root.select('.guide-step-title').css({
    display: 'block',
    margin: '12px 0 8px',
    fontSize: '20px',
    lineHeight: '1.4',
  })
  root
    .media('max-width: 640px')
    .select('.directive-zones')
    .css({ gridTemplateColumns: 'minmax(0, 1fr)' })
}
