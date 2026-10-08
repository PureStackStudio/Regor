import {
  type ThemePalette,
  type ThemeSkin,
  themeSkins,
} from '@purestack/ts-style'
import { merge } from '@purestack/ts-util'

type Tone = ThemePalette['semanticTone']['neutral']

// One vivid signal against quiet, warm neutrals. Never blue or navy.
export const regorColors = {
  signal: '#d2fa56',
  signalHover: '#e1ff86',
  signalActive: '#bfe840',
  onSignal: '#18200e',
  light: {
    canvas: '#f6f5ee',
    surface: '#fffef8',
    surfaceAlt: '#eeeee4',
    hover: '#e9ecdf',
    active: '#e0e5d3',
    ink: '#20251c',
    muted: '#606957',
    border: '#d1d7c7',
    subtle: '#e0e4d8',
    accentInk: '#44601c',
    accentSurface: '#f0f6dd',
    accentBorder: '#c0d497',
  },
  dark: {
    canvas: '#101211',
    surface: '#1c1f1d',
    surfaceAlt: '#151816',
    hover: '#272c28',
    active: '#30362f',
    ink: '#f2f3ed',
    muted: '#aeb3a9',
    border: '#3c423a',
    subtle: '#2d322c',
    accentInk: '#d2fa56',
    accentSurface: '#242f15',
    accentBorder: '#465d26',
  },
} as const

function state(background: string, border: string, text: string) {
  return { background, bgcolor: background, border, text }
}

function createNeutral(dark: boolean): Tone {
  const c = dark ? regorColors.dark : regorColors.light
  const text = { default: c.ink, subtle: c.muted }
  const border = { default: c.border, subtle: c.subtle, focus: c.accentInk }
  const disabled = state(c.surfaceAlt, c.subtle, c.muted)
  const surface = {
    rest: state(c.surface, c.subtle, c.ink),
    hover: state(c.hover, c.border, c.ink),
    active: state(c.active, c.border, c.ink),
    disabled,
    focusRing: c.accentInk,
  }
  return {
    tone: c.ink,
    canvas: c.canvas,
    canvascolor: c.canvas,
    spotlight: { field: c.canvas, light: `${regorColors.signal}12` },
    overlay: dark ? '#080b06cc' : '#20251c44',
    text,
    border,
    root: { text, border },
    surface,
    surfaceAlt: { ...surface, rest: state(c.surfaceAlt, c.subtle, c.ink) },
    button: {
      ...surface,
      rest: state(c.surfaceAlt, c.border, c.ink),
    },
  }
}

function createAccent(dark: boolean, neutral: Tone): Tone {
  const c = dark ? regorColors.dark : regorColors.light
  const text = { default: c.accentInk, subtle: c.muted }
  const border = {
    default: c.accentBorder,
    subtle: c.subtle,
    focus: c.accentInk,
  }
  const surface = {
    rest: state(c.accentSurface, c.accentBorder, c.ink),
    hover: state(dark ? '#303e1c' : '#e6efcc', c.accentInk, c.ink),
    active: state(dark ? '#394c20' : '#dcebb9', c.accentInk, c.ink),
    disabled: neutral.surface.disabled,
    focusRing: c.accentInk,
  }
  return {
    tone: regorColors.signal,
    canvas: c.accentSurface,
    canvascolor: c.accentSurface,
    spotlight: { field: c.accentSurface, light: `${regorColors.signal}20` },
    overlay: neutral.overlay,
    text,
    border,
    root: { text, border },
    surface,
    surfaceAlt: surface,
    button: {
      rest: state(regorColors.signal, regorColors.signal, regorColors.onSignal),
      hover: state(
        regorColors.signalHover,
        regorColors.signalHover,
        regorColors.onSignal,
      ),
      active: state(
        regorColors.signalActive,
        regorColors.signalActive,
        regorColors.onSignal,
      ),
      disabled: neutral.button.disabled,
      focusRing: c.accentInk,
    },
  }
}

function createCompanion(dark: boolean, neutral: Tone): Tone {
  const ink = dark ? '#efb1df' : '#8c286f'
  const fill = dark ? '#efb1df' : '#a43483'
  const field = dark ? '#30212c' : '#f9eef5'
  const edge = dark ? '#604050' : '#e3c6d9'
  const text = { default: ink, subtle: neutral.text.subtle }
  const border = { default: edge, subtle: edge, focus: ink }
  const surface = {
    rest: state(field, edge, ink),
    hover: state(field, ink, ink),
    active: state(field, ink, ink),
    disabled: neutral.surface.disabled,
    focusRing: ink,
  }
  return {
    tone: fill,
    canvas: field,
    canvascolor: field,
    spotlight: { field, light: `${fill}20` },
    overlay: neutral.overlay,
    text,
    border,
    root: { text, border },
    surface,
    surfaceAlt: surface,
    button: {
      rest: state(fill, fill, dark ? '#281722' : '#ffffff'),
      hover: state(
        dark ? '#f7c5e9' : '#8c286f',
        fill,
        dark ? '#281722' : '#ffffff',
      ),
      active: state(fill, fill, dark ? '#281722' : '#ffffff'),
      disabled: neutral.button.disabled,
      focusRing: ink,
    },
  }
}

function createPalette(dark: boolean): ThemePalette {
  const standard = themeSkins.standard.create()
  const neutral = createNeutral(dark)
  const accent = createAccent(dark, neutral)
  const companion = createCompanion(dark, neutral)
  const invisible = state('transparent', 'transparent', neutral.text.default)
  const ghost = {
    ...neutral,
    canvas: 'transparent',
    canvascolor: 'transparent',
    surface: { ...neutral.surface, rest: invisible },
    button: { ...neutral.button, rest: invisible },
  }
  return merge(dark ? standard.dark : standard.light, {
    accent: regorColors.signal,
    font: {
      family: {
        base: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      },
    },
    radii: { sm: '6px', md: '10px', lg: '16px' },
    semanticTone: {
      neutral,
      accent,
      ghost,
      secondary: companion,
      feature: companion,
    },
    effect: {
      panelShadow: 'none',
      softShadow: dark ? '0 8px 28px #00000022' : '0 8px 28px #28321b08',
      floatingShadow: dark ? '0 28px 80px #00000055' : '0 28px 80px #28321b14',
      glowPrimary: `0 0 48px ${regorColors.signal}18`,
      glowSecondary: `0 0 32px ${companion.tone}12`,
      accentShadow: `0 8px 24px ${regorColors.signal}18`,
      focusGlow: `0 0 0 3px ${regorColors.signal}44`,
    },
  })
}

export const regorSkin: ThemeSkin = {
  create: () => ({ light: createPalette(false), dark: createPalette(true) }),
}
