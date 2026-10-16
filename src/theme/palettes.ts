// Raw color values for each color mode. Components never read these directly; they use the
// CSS variable references in `theme.ts`, so switching modes needs no React re-render.
// Run `yarn check:contrast` after changing any value here.

export const colorNames = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const

export type ColorName = (typeof colorNames)[number]

export type ColorPalette = {
  /** Solid background */
  main: string
  hover: string
  active: string
  /** Text on top of `main`, `hover` and `active` */
  contrastText: string
  /** Text/border color for outline and ghost buttons */
  text: string
  /** Tinted background for outline/ghost hover */
  subtle: string
  /** Tinted background for outline/ghost pressed */
  subtleActive: string
}

export type Palette = {
  colors: Record<ColorName, ColorPalette>
  background: {
    /** Page background */
    page: string
    /** Raised surfaces such as cards and panels */
    card: string
  }
  text: {
    default: string
    muted: string
  }
  /** Decorative dividers and card outlines. Too faint for control boundaries; use `field.border`. */
  border: string
  /** Form fields such as Input */
  field: {
    background: string
    /** Meets 3:1 against its surroundings, as WCAG requires for control boundaries */
    border: string
    borderHover: string
    placeholder: string
    disabledBackground: string
  }
  focusRing: string
}

export const lightPalette: Palette = {
  colors: {
    primary: {
      main: '#2563eb',
      hover: '#1d4ed8',
      active: '#1e40af',
      contrastText: '#ffffff',
      text: '#1d4ed8',
      subtle: '#eff6ff',
      subtleActive: '#dbeafe',
    },
    secondary: {
      main: '#475569',
      hover: '#334155',
      active: '#1e293b',
      contrastText: '#ffffff',
      text: '#334155',
      subtle: '#f1f5f9',
      subtleActive: '#e2e8f0',
    },
    success: {
      main: '#15803d',
      hover: '#166534',
      active: '#14532d',
      contrastText: '#ffffff',
      text: '#15803d',
      subtle: '#f0fdf4',
      subtleActive: '#dcfce7',
    },
    danger: {
      main: '#dc2626',
      hover: '#b91c1c',
      active: '#991b1b',
      contrastText: '#ffffff',
      text: '#b91c1c',
      subtle: '#fef2f2',
      subtleActive: '#fee2e2',
    },
    warning: {
      main: '#fbbf24',
      hover: '#f59e0b',
      active: '#d97706',
      contrastText: '#1c1917',
      text: '#b45309',
      subtle: '#fffbeb',
      subtleActive: '#fef3c7',
    },
    info: {
      main: '#0e7490',
      hover: '#155e75',
      active: '#164e63',
      contrastText: '#ffffff',
      text: '#0e7490',
      subtle: '#ecfeff',
      subtleActive: '#cffafe',
    },
  },
  background: {
    page: '#f8fafc',
    card: '#ffffff',
  },
  text: {
    default: '#0f172a',
    muted: '#475569',
  },
  border: '#e2e8f0',
  field: {
    background: '#ffffff',
    border: '#64748b',
    borderHover: '#334155',
    placeholder: '#64748b',
    disabledBackground: '#f1f5f9',
  },
  focusRing: '#2563eb',
}

// Solid fills keep their light-mode values: they already contrast with their label and stand
// out on a dark page. Outline/ghost colors switch to lighter tints so they read on dark surfaces.
export const darkPalette: Palette = {
  colors: {
    primary: {
      ...lightPalette.colors.primary,
      text: '#93c5fd',
      subtle: 'rgba(96, 165, 250, 0.12)',
      subtleActive: 'rgba(96, 165, 250, 0.2)',
    },
    secondary: {
      ...lightPalette.colors.secondary,
      main: '#64748b',
      hover: '#475569',
      active: '#334155',
      text: '#cbd5e1',
      subtle: 'rgba(203, 213, 225, 0.1)',
      subtleActive: 'rgba(203, 213, 225, 0.16)',
    },
    success: {
      ...lightPalette.colors.success,
      text: '#4ade80',
      subtle: 'rgba(74, 222, 128, 0.12)',
      subtleActive: 'rgba(74, 222, 128, 0.2)',
    },
    danger: {
      ...lightPalette.colors.danger,
      text: '#fca5a5',
      subtle: 'rgba(248, 113, 113, 0.12)',
      subtleActive: 'rgba(248, 113, 113, 0.2)',
    },
    warning: {
      ...lightPalette.colors.warning,
      text: '#fbbf24',
      subtle: 'rgba(251, 191, 36, 0.12)',
      subtleActive: 'rgba(251, 191, 36, 0.2)',
    },
    info: {
      ...lightPalette.colors.info,
      text: '#22d3ee',
      subtle: 'rgba(34, 211, 238, 0.12)',
      subtleActive: 'rgba(34, 211, 238, 0.2)',
    },
  },
  background: {
    page: '#0f172a',
    card: '#1e293b',
  },
  text: {
    default: '#f1f5f9',
    muted: '#94a3b8',
  },
  border: '#334155',
  field: {
    background: '#0f172a',
    border: '#64748b',
    borderHover: '#94a3b8',
    placeholder: '#94a3b8',
    disabledBackground: '#1e293b',
  },
  focusRing: '#60a5fa',
}
