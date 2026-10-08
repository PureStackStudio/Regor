import type { Style } from '@purestack/ts-css'
import {
  styleBuilder,
  themes,
  type ThemeMode,
  type ThemePalette,
} from '@purestack/ts-style'
import { regorColors } from './skin'
import { registerChartStyles } from './chartStyles'
import { registerGuideStyles } from './guideStyles'
import { registerDirectiveStyles } from './directiveStyles'
import { registerApiStyles } from './apiStyles'

const mono = "'Cascadia Code', 'SFMono-Regular', Consolas, monospace"

export function registerRegorStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerChartStyles(root, palette)
    registerGuideStyles(root, palette)
    registerDirectiveStyles(root, palette)
    registerApiStyles(root, palette)
    const context = createRegorStyleContext(root, theme, palette)
    registerBaseStyles(context)
    registerTopbarStyles(context)
    registerDocumentStyles(context)
    registerHeroStyles(context)
    registerWorkbenchStyles(context)
    registerSectionStyles(context)
    registerFeatureStyles(context)
    registerEcosystemStyles(context)
    registerResourceStyles(context)
    registerClosingStyles(context)
    registerFooterStyles(context)
    registerCopyFeedbackStyles(context)
    registerTabletStyles(context)
    registerMobileTabStyles(context)
    registerMobileLayoutStyles(context)
    registerNarrowScreenStyles(context)
    registerReducedMotionStyles(context)
  })
}

type RegorStyleContext = ReturnType<typeof createRegorStyleContext>

function createRegorStyleContext(
  root: Style,
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const t = palette.semanticTone
  return {
    root,
    theme,
    palette,
    t,
    ink: t.neutral.text.default,
    muted: t.neutral.text.subtle,
    edge: t.neutral.border.subtle,
    accent: t.accent.text.default,
    surface: t.neutral.surface.rest.bgcolor,
  }
}

function registerBaseStyles(context: RegorStyleContext) {
  const { root, theme, palette, t, ink, accent, surface } = context
  root.select(':scope').css({
    scrollPaddingTop: '100px',
    colorScheme: theme === 'dark' ? 'dark' : 'light',
  })
  root
    .select('body')
    .css({ background: t.neutral.canvas, webkitFontSmoothing: 'antialiased' })
  root.select('.regor-home').css({
    margin: '0',
    color: ink,
    fontFamily: palette.font.family.base,
    fontSize: '16px',
    lineHeight: '1.65',
  })
  root
    .select(
      '.regor-home *, .regor-home *::before, .regor-home *::after, .regor-footer *',
    )
    .css({ boxSizing: 'border-box' })
  root.select('.regor-home :is(h1,h2,h3,p,pre)').css({ margin: '0' })
  root
    .select('.regor-home :is(h1,h2,h3)')
    .css({ color: ink, fontWeight: '650' })
  root
    .select('.regor-home a:not(.btn), .regor-footer a')
    .css({ color: 'inherit', textDecoration: 'none' })
  root
    .select(
      '.regor-home :is(a,button,summary):focus-visible, .regor-footer a:focus-visible',
    )
    .css({ outline: `2px solid ${accent}`, outlineOffset: '5px' })
  root.select('.regor-home button').css({ font: 'inherit', cursor: 'pointer' })
  root.select('.regor-home [hidden]').css({ display: 'none !important' })
  root
    .select('.regor-container')
    .css({ width: 'min(1160px, calc(100% - 80px))', marginInline: 'auto' })
  root.select('.regor-skip').css({
    position: 'fixed',
    top: '12px',
    left: '16px',
    zIndex: '100',
    transform: 'translateY(-200%)',
    padding: '10px 18px',
    background: surface,
    border: `1px solid ${accent}`,
    borderRadius: '8px',
  })
  root.select('.regor-skip:focus').css({ transform: 'translateY(0)' })
}

function registerTopbarStyles(context: RegorStyleContext) {
  const { root, t, muted, edge, accent } = context
  root.select('.regor-topbar').css({
    borderBottom: `1px solid ${edge}`,
    background: `color-mix(in srgb, ${t.neutral.canvas} 92%, transparent)`,
    backdropFilter: 'blur(16px)',
  })
  root
    .select('.regor-topbar .site-logo')
    .css({ fontWeight: '750', letterSpacing: '-1px' })
  root.select('.regor-topbar .site-logo__name').css({ lineHeight: '1.4' })
  root.select('.regor-topbar .topbar__controls').css({ gap: '18px' })
  root.select('.regor-topbar .header-nav').css({
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  })
  root.select('.regor-topbar :is(.header-guide,.header-api)').css({
    color: muted,
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: '600',
  })
  root
    .select('.regor-topbar :is(.header-guide,.header-api):hover')
    .css({ color: accent })
}

function registerDocumentStyles(context: RegorStyleContext) {
  const { root, muted, edge, accent } = context
  root
    .select('.template-doc .doc-content')
    .css({ fontSize: '16px', lineHeight: '1.85' })
  root
    .select('.template-doc .doc-main')
    .css({ paddingTop: '42px', paddingBottom: '60px' })
  root
    .select('.template-doc .doc-content > :is(h2,h3)')
    .css({ letterSpacing: '-0.5px', marginTop: '40px', lineHeight: '1.3' })
  root.select('.template-doc .doc-content > h2').css({ fontSize: '26px' })
  root.select('.template-doc .doc-content > h3').css({ fontSize: '20px' })
  root.select('.template-doc .doc-content pre').css({
    fontSize: '13px',
    lineHeight: '1.8',
    padding: '22px',
    borderRadius: '10px',
  })
  root
    .select('.template-doc .doc-sidebar, .template-doc .doc-toc')
    .css({ fontSize: '13px' })
  root.select('.regor-doc-heading').css({
    paddingBottom: '28px',
    marginBottom: '28px',
    borderBottom: `1px solid ${edge}`,
  })
  root.select('.regor-breadcrumb').css({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: muted,
    font: `11px/1.5 ${mono}`,
    marginBottom: '20px',
  })
  root
    .select('.regor-breadcrumb a')
    .css({ color: muted, textDecoration: 'none' })
  root.select('.regor-breadcrumb a:hover').css({ color: accent })
  root.select('.regor-doc-heading h1').css({
    fontSize: 'clamp(32px, 4vw, 44px)',
    fontWeight: '700',
    letterSpacing: '-1.5px',
    lineHeight: '1.15',
    margin: '0',
  })
  root
    .select('.regor-doc-heading > p')
    .css({ color: muted, marginTop: '16px', fontSize: '17px' })
}

function registerHeroStyles(context: RegorStyleContext) {
  const { root, theme, t, ink, muted, edge, accent, surface } = context
  root.select('.regor-home .topbar__toggle').css({ display: 'none' })
  root.select('.regor-hero').css({
    position: 'relative',
    isolation: 'isolate',
    paddingBlock: '100px 76px',
  })
  root.select('.regor-hero::before').css({
    content: '""',
    position: 'absolute',
    zIndex: '-1',
    inset: '0',
    background: `radial-gradient(ellipse at 84% 40%, ${t.accent.tone}22, transparent 54%)`,
    pointerEvents: 'none',
  })
  root.select('.hero-layout').css({
    display: 'grid',
    gridTemplateColumns: '1fr 1.03fr',
    gap: '64px',
    alignItems: 'center',
  })
  root.select('.eyebrow').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    color: accent,
    font: `600 11px/1.5 ${mono}`,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  })
  root.select('.release-dot').css({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: accent,
    boxShadow: `0 0 0 4px ${t.accent.tone}14`,
  })
  root.select('.regor-hero h1').css({
    marginTop: '24px',
    fontSize: 'clamp(54px, 6vw, 80px)',
    letterSpacing: '-4px',
    lineHeight: '1.02',
    fontWeight: '700',
  })
  root.select('.regor-hero h1 span').css({
    color: theme === 'light' ? regorColors.onSignal : regorColors.signal,
    background:
      theme === 'light'
        ? `linear-gradient(transparent 12%, ${regorColors.signal} 12%, ${regorColors.signal} 96%, transparent 96%)`
        : 'none',
  })
  root.select('.hero-copy').css({
    marginTop: '28px !important',
    color: muted,
    fontSize: '18px',
    maxWidth: '450px',
    lineHeight: '1.75',
  })
  root
    .select('.hero-actions')
    .css({ gap: '12px', marginTop: '30px', flexWrap: 'wrap' })
  root.select('.regor-home .hero-actions .btn, .regor-home .closing .btn').css({
    minHeight: '48px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '650',
    borderRadius: '8px',
  })
  root.select('.install-line').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '24px',
    marginTop: '25px',
    padding: '9px 12px 9px 16px',
    background: surface,
    border: `1px solid ${edge}`,
    borderRadius: '8px',
    color: muted,
  })
  root
    .select('.install-line code')
    .css({ font: `12px/1.5 ${mono}`, color: ink })
  root
    .select('.install-line code > span:first-child')
    .css({ color: accent, marginRight: '10px' })
  root.select('.install-copy').css({
    border: '0',
    background: 'transparent',
    color: muted,
    fontSize: '11px !important',
    padding: '5px',
    borderRadius: '4px',
  })
  root.select('.install-copy:hover').css({ color: accent })
  root.select('.hero-footnote').css({
    marginTop: '16px !important',
    font: `10px/1.5 ${mono}`,
    color: muted,
  })
}

function registerWorkbenchStyles(context: RegorStyleContext) {
  const { root, palette, t, ink, muted, edge, accent, surface } = context
  root.select('.workbench').css({
    minWidth: '0',
    background: surface,
    border: `1px solid ${edge}`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: palette.effect.floatingShadow,
    transform: 'rotate(1deg)',
  })
  root.select('.workbench-bar').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: `1px solid ${edge}`,
    font: `10px/1.4 ${mono}`,
    color: muted,
  })
  root.select('.window-dots').css({ display: 'flex', gap: '5px' })
  root.select('.window-dots i').css({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: t.neutral.border.default,
  })
  root.select('.window-dots i:first-child').css({ background: t.accent.tone })
  root
    .select('.workbench .code-block')
    .css({ margin: '0', border: '0', borderRadius: '0', boxShadow: 'none' })
  root.select('.workbench pre').css({
    padding: '24px',
    fontSize: '12px',
    lineHeight: '1.85',
    borderRadius: '0',
    minHeight: '235px',
    overflowX: 'auto',
  })
  root.select('.workbench .tabs__content').css({ padding: '0' })
  root.select('.live-preview').css({
    padding: '26px',
    borderTop: `1px solid ${edge}`,
    background: t.neutral.surfaceAlt.rest.bgcolor,
  })
  root.select('.preview-label').css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: muted,
    font: `10px/1.5 ${mono}`,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  })
  root.select('.preview-label .release-dot').css({
    background: t.secondary.text.default,
    boxShadow: 'none',
    width: '5px',
    height: '5px',
  })
  root.select('.counter-row').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '18px',
  })
  root
    .select('.counter-readout')
    .css({ display: 'flex', alignItems: 'baseline', gap: '12px' })
  root.select('.counter-value').css({
    fontSize: '52px',
    fontWeight: '600',
    lineHeight: '1',
    letterSpacing: '-3px',
    color: accent,
    fontVariantNumeric: 'tabular-nums',
  })
  root.select('.counter-caption').css({ fontSize: '12px', color: muted })
  root
    .select('.counter-buttons')
    .css({ display: 'flex', alignItems: 'center', gap: '8px' })
  root.select('.counter-increment').css({
    background: t.accent.button.rest.bgcolor,
    color: t.accent.button.rest.text,
    border: `1px solid ${t.accent.button.rest.border}`,
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '13px !important',
    fontWeight: '650 !important',
  })
  root
    .select('.counter-increment:hover')
    .css({ background: t.accent.button.hover.bgcolor })
  root.select('.counter-reset').css({
    border: `1px solid ${edge}`,
    background: surface,
    color: ink,
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '12px !important',
  })
  root.select('.workbench-caption').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '11px 20px',
    borderTop: `1px solid ${edge}`,
    font: `10px/1.5 ${mono}`,
    color: muted,
  })
}

function registerSectionStyles(context: RegorStyleContext) {
  const { root, muted, edge, accent } = context
  root.select('.proof-strip').css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    paddingBlock: '28px',
    borderBlock: `1px solid ${edge}`,
    gap: '24px',
  })
  root
    .select('.proof-strip > div')
    .css({ display: 'flex', alignItems: 'center', gap: '14px' })
  root
    .select('.proof-strip .icon')
    .css({ color: accent, width: '22px', height: '22px' })
  root
    .select('.proof-strip strong')
    .css({ display: 'block', fontSize: '13px', fontWeight: '650' })
  root.select('.proof-strip small').css({
    display: 'block',
    color: muted,
    fontSize: '11px',
    marginTop: '2px',
  })
  root.select('.regor-section').css({ paddingBlock: '96px' })
  root.select('.section-heading').css({
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-between',
    gap: '32px',
    marginBottom: '36px',
  })
  root.select('.regor-home h2').css({
    marginTop: '16px',
    fontSize: 'clamp(32px, 3.6vw, 46px)',
    letterSpacing: '-1.8px',
    lineHeight: '1.13',
  })
  root
    .select('.section-heading > p')
    .css({ maxWidth: '310px', color: muted, fontSize: '14px' })
}

function registerFeatureStyles(context: RegorStyleContext) {
  const { root, muted, edge, accent, surface } = context
  root.select('.feature-grid').css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    border: `1px solid ${edge}`,
    borderRadius: '14px',
    overflow: 'hidden',
    background: surface,
  })
  root.select('.regor-feature').css({ padding: '30px', minWidth: '0' })
  root
    .select('.regor-feature + .regor-feature')
    .css({ borderLeft: `1px solid ${edge}` })
  root
    .select('.feature-meta')
    .css({ color: accent, font: `11px/1.5 ${mono}`, marginBottom: '36px' })
  root.select('.feature-meta .icon').css({ width: '25px', height: '25px' })
  root
    .select('.regor-feature h3')
    .css({ fontSize: '20px', letterSpacing: '-0.5px', lineHeight: '1.3' })
  root.select('.regor-feature p').css({
    marginTop: '14px',
    fontSize: '14px',
    color: muted,
    lineHeight: '1.8',
  })
  root.select('.feature-link').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    marginTop: '24px',
    color: `${accent} !important`,
    fontSize: '12px',
    fontWeight: '600',
  })
  root.select('.feature-link span').css({
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
  })
  root.select('.feature-link:hover').css({
    textDecoration: 'underline !important',
    textUnderlineOffset: '4px',
  })
}

function registerEcosystemStyles(context: RegorStyleContext) {
  const { root, palette, t, ink, muted, edge, accent, surface } = context
  root.select('.ecosystem').css({
    position: 'relative',
    background: t.neutral.surfaceAlt.rest.bgcolor,
    borderBlock: `1px solid ${edge}`,
    overflow: 'hidden',
  })
  root.select('.ecosystem-layout').css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'center',
  })
  root.select('.ecosystem-copy > p').css({
    marginTop: '22px',
    color: muted,
    fontSize: '15px',
    maxWidth: '420px',
  })
  root
    .select('.ecosystem-copy > p strong')
    .css({ color: ink, fontWeight: '650' })
  root.select('.ecosystem-links').css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    marginTop: '24px',
    fontSize: '13px',
  })
  root.select('.ecosystem-links a').css({
    color: `${accent} !important`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
  })
  root
    .select('.cycle-diagram')
    .css({ position: 'relative', padding: '30px 0', textAlign: 'center' })
  root.select('.cycle-nodes').css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    position: 'relative',
    zIndex: '1',
  })
  root.select('.cycle-node').css({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '8px',
    padding: '28px 12px',
    border: `1px solid ${edge}`,
    borderRadius: '16px',
    background: surface,
    boxShadow: palette.effect.softShadow,
  })
  root.select('.cycle-mark').css({ font: `600 32px/1 ${mono}`, color: accent })
  root
    .select('.cycle-node:last-child .cycle-mark')
    .css({ color: t.secondary.text.default })
  root.select('.cycle-mark .icon').css({ width: '36px', height: '36px' })
  root
    .select('.cycle-node strong')
    .css({ marginTop: '12px', fontSize: '22px', letterSpacing: '-0.7px' })
  root.select('.cycle-node small').css({ color: muted, fontSize: '11px' })
  root.select('.cycle-path').css({
    position: 'absolute',
    top: '-2px',
    left: '10%',
    width: '80%',
    height: 'calc(100% + 4px)',
    border: `1px solid ${t.accent.border.default}`,
    borderRadius: '70px',
    pointerEvents: 'none',
  })
  root.select('.cycle-label').css({
    position: 'absolute',
    zIndex: '2',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '3px 12px',
    color: accent,
    background: t.neutral.surfaceAlt.rest.bgcolor,
    font: `10px/1.5 ${mono}`,
    whiteSpace: 'nowrap',
  })
  root.select('.cycle-label:first-child').css({ top: '-12px' })
  root
    .select('.cycle-label:last-child')
    .css({ bottom: '-12px', color: t.secondary.text.default })
  root.select('.cycle-note').css({
    marginTop: '32px !important',
    color: muted,
    font: `10px/1.5 ${mono}`,
  })
}

function registerResourceStyles(context: RegorStyleContext) {
  const { root, t, muted, edge, accent, surface } = context
  root
    .select('.resource-grid')
    .css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' })
  root.select('.regor-resource').css({
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    padding: '25px',
    border: `1px solid ${edge}`,
    borderRadius: '10px',
    background: surface,
    transition: 'border-color 160ms, transform 160ms',
  })
  root.select('.regor-resource:hover').css({
    borderColor: t.accent.border.default,
    transform: 'translateY(-2px)',
  })
  root.select('.resource-number').css({
    color: accent,
    font: `11px/1.5 ${mono}`,
    alignSelf: 'start',
    paddingTop: '3px',
  })
  root.select('.regor-resource > div').css({ flex: '1', minWidth: '0' })
  root
    .select('.regor-resource h3')
    .css({ fontSize: '17px', letterSpacing: '-0.3px' })
  root.select('.regor-resource p').css({
    color: muted,
    fontSize: '12px',
    marginTop: '5px',
    lineHeight: '1.6',
  })
  root
    .select('.regor-resource > .icon')
    .css({ color: muted, flexShrink: '0', width: '18px', height: '18px' })
}

function registerClosingStyles(context: RegorStyleContext) {
  const { root } = context
  root.select('.closing').css({
    textAlign: 'center',
    padding: '56px 24px',
    marginBottom: '76px',
    borderRadius: '16px',
    border: `1px solid ${regorColors.signal}`,
    background: regorColors.signal,
  })
  root.select('.closing h2').css({ margin: '0', color: regorColors.onSignal })
  root.select('.closing p').css({ color: '#3c4c20', marginBlock: '18px 26px' })
  root.select('.regor-home .closing .btn').css({
    background: regorColors.onSignal,
    borderColor: regorColors.onSignal,
    color: regorColors.signal,
  })
  root.select('.regor-home .closing .btn:hover').css({ background: '#2d3c16' })
}

function registerFooterStyles(context: RegorStyleContext) {
  const { root, ink, muted, edge, accent } = context
  root.select('.regor-footer').css({
    borderTop: `1px solid ${edge}`,
    paddingBlock: '40px 24px',
    color: muted,
    fontSize: '12px',
  })
  root.select('.footer-inner, .footer-colophon').css({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    alignItems: 'center',
  })
  root.select('.footer-brand').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '25px',
    color: `${ink} !important`,
    fontWeight: '750',
    letterSpacing: '-1px',
  })
  root
    .select('.footer-brand > .icon, .footer-wordmark > span')
    .css({ color: accent })
  root.select('.footer-brand .icon').css({ width: '26px', height: '26px' })
  root.select('.footer-inner p').css({ margin: '6px 0 0', fontSize: '12px' })
  root
    .select('.footer-inner nav')
    .css({ display: 'flex', gap: '16px', flexWrap: 'wrap' })
  root.select('.footer-colophon').css({
    borderTop: `1px solid ${edge}`,
    paddingTop: '20px',
    marginTop: '30px',
    fontSize: '10px',
  })
  root.select('.regor-footer .footer-actions').css({
    gap: '16px',
    flexShrink: '0',
    flexWrap: 'wrap',
  })
  root
    .select('.footer-actions > a, .footer-actions [data-consent-settings]')
    .css({
      whiteSpace: 'nowrap',
    })
  root.select('.footer-actions .consent-settings-teleport-area').css({
    display: 'inline-flex',
    alignItems: 'center',
  })
  root.select('.regor-footer .footer-colophon [data-consent-settings]').css({
    font: 'inherit',
    color: 'inherit',
    background: 'transparent !important',
    border: 'none !important',
    outline: 'none !important',
    borderRadius: '0',
    padding: '0 !important',
    margin: '0',
    minHeight: '0',
    boxShadow: 'none !important',
  })
  root
    .select('.regor-footer .footer-colophon [data-consent-settings]:hover')
    .css({ color: accent })
  root
    .select(
      '.regor-footer .footer-colophon [data-consent-settings]:focus-visible',
    )
    .css({
      color: accent,
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    })
  root.select('.regor-footer a:hover').css({ color: accent })
}

function registerCopyFeedbackStyles(context: RegorStyleContext) {
  const { root, muted } = context
  root
    .select('.copy-status')
    .css({ minHeight: '18px', fontSize: '11px', color: muted })
}

function registerTabletStyles(context: RegorStyleContext) {
  const { root } = context
  root.media('max-width: 1000px').select('.hero-layout').css({ gap: '36px' })
  root
    .media('max-width: 1000px')
    .select('.regor-hero h1')
    .css({ fontSize: '62px', letterSpacing: '-3px' })
  root
    .media('max-width: 1000px')
    .select('.ecosystem-layout')
    .css({ gap: '40px' })
  root
    .media('max-width: 1000px')
    .select('.regor-feature')
    .css({ padding: '24px' })
}

function registerMobileTabStyles(context: RegorStyleContext) {
  const { root, ink, muted, edge, accent } = context
  const mobile = root.media('max-width: 760px')
  const mobileTabs = ':is(.regor-home, .template-doc) .tabs'
  mobile
    .select(mobileTabs)
    .css({ padding: '12px', gap: '0', boxShadow: 'none' })
  mobile
    .select(`${mobileTabs} > .tabs__select-wrap, ${mobileTabs} .tabs__overflow`)
    .css({ display: 'none' })
  mobile
    .select(`${mobileTabs}.tabs--enhanced > .tabs__tabs-row`)
    .css({ display: 'flex' })
  mobile
    .select(`${mobileTabs} .tabs__tab-buttons`)
    .css({ overflowX: 'auto', gap: '0', scrollbarWidth: 'thin' })
  mobile.select(`${mobileTabs} > .tabs__list`).css({
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '0',
  })
  mobile
    .select(`${mobileTabs} .tabs__tab, ${mobileTabs} .tabs__tab-buttons > .btn`)
    .css({
      display: 'inline-flex',
      minWidth: '0',
      minHeight: '44px',
      padding: '10px 8px',
      font: `600 11px/1.4 ${mono}`,
      border: '0',
      borderBottom: '2px solid transparent !important',
      borderRadius: '0',
      background: 'transparent',
      boxShadow: 'none !important',
      color: `${muted} !important`,
    })
  mobile
    .select(
      `${mobileTabs} .tabs__control:checked + .tabs__tab, ${mobileTabs} .tabs__tab-buttons > .btn[aria-selected="true"]`,
    )
    .css({
      color: `${accent} !important`,
      borderBottomColor: `${accent} !important`,
    })
  mobile
    .select(`${mobileTabs}.tabs--enhanced .tabs__tab`)
    .css({ display: 'none' })
  mobile
    .select(`${mobileTabs} .tabs__tab-buttons > .btn[hidden]`)
    .css({ display: 'inline-flex !important' })
  mobile.select(`${mobileTabs} .tabs__tab:hover`).css({ color: ink })
  mobile.select(`${mobileTabs} .tabs__panel`).css({
    borderTop: `1px solid ${edge}`,
  })
  mobile.select('.workbench .tabs').css({ padding: '0' })
  mobile.select('.workbench pre').css({ padding: '20px 16px' })
}

function registerMobileLayoutStyles(context: RegorStyleContext) {
  const { root, edge } = context
  const mobile = root.media('max-width: 760px')
  mobile.select('.regor-container').css({ width: 'calc(100% - 40px)' })
  mobile.select('.regor-hero').css({ paddingBlock: '54px 48px' })
  mobile
    .select('.hero-layout, .ecosystem-layout')
    .css({ gridTemplateColumns: 'minmax(0, 1fr)', gap: '44px' })
  mobile
    .select('.regor-hero h1')
    .css({ fontSize: 'clamp(48px, 10vw, 68px)', letterSpacing: '-2.8px' })
  mobile.select('.hero-copy').css({ fontSize: '16px', maxWidth: '480px' })
  mobile.select('.workbench').css({ transform: 'none' })
  mobile
    .select('.proof-strip')
    .css({ gridTemplateColumns: '1fr', gap: '20px', paddingBlock: '24px' })
  mobile.select('.regor-section').css({ paddingBlock: '58px' })
  mobile.select('.section-heading').css({ display: 'block' })
  mobile
    .select('.section-heading > p')
    .css({ marginTop: '20px', maxWidth: '420px' })
  mobile
    .select('.feature-grid, .resource-grid')
    .css({ gridTemplateColumns: '1fr' })
  mobile
    .select('.regor-feature + .regor-feature')
    .css({ borderLeft: '0', borderTop: `1px solid ${edge}` })
  mobile.select('.feature-meta').css({ marginBottom: '22px' })
  mobile.select('.cycle-diagram').css({
    marginBlock: '15px 0',
    maxWidth: '500px',
    width: '100%',
    marginInline: 'auto',
  })
  mobile.select('.closing').css({ padding: '40px 20px', marginBottom: '48px' })
  mobile
    .select('.footer-inner')
    .css({ alignItems: 'start', flexDirection: 'column' })
  mobile.select('.footer-colophon').css({
    alignItems: 'start',
    flexDirection: 'column',
    gap: '12px',
  })
  mobile.select('.regor-footer .footer-actions').css({
    width: '100%',
    justifyContent: 'space-between',
    gap: '8px 16px',
  })
  mobile.select('.regor-topbar .header-nav').css({ gap: '12px' })
  mobile.select('.regor-topbar .topbar__controls').css({ gap: '12px' })
  mobile.select('.template-doc .doc-main').css({ paddingTop: '24px' })
  mobile.select('.template-doc .doc-content').css({ fontSize: '15px' })
}

function registerNarrowScreenStyles(context: RegorStyleContext) {
  const { root } = context
  root
    .media('max-width: 380px')
    .select('.regor-topbar .header-api')
    .css({ display: 'none' })
  root
    .media('max-width: 380px')
    .select('.regor-hero h1')
    .css({ fontSize: '40px' })
  root.media('max-width: 380px').select('.counter-row').css({ gap: '10px' })
  root
    .media('max-width: 380px')
    .select('.live-preview')
    .css({ padding: '20px' })
}

function registerReducedMotionStyles(context: RegorStyleContext) {
  const { root } = context
  root
    .media('prefers-reduced-motion: reduce')
    .select('.regor-home *, .regor-home *::before, .regor-home *::after')
    .css({
      transition: 'none !important',
      animation: 'none !important',
      scrollBehavior: 'auto !important',
    })
}
