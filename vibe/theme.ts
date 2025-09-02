import colors from "./tokens/color.json"
import spacing from "./tokens/spacing.json"
import radius from "./tokens/radius.json"
import typography from "./tokens/typography.json"
import motion from "./tokens/motion.json"

export const toCssVars = () => ({
  ":root": {
    "--color-brand": colors.brand.primary,
    "--color-accent": colors.brand.accent,
    "--color-accent-light": colors.brand.accentLight,
    "--color-text": colors.text.default,
    "--color-text-muted": colors.text.muted,
    "--color-text-on-brand": colors.text.onBrand,
    "--color-bg": colors.surface.bg,
    "--color-surface": colors.surface.elevated,
    "--color-border": colors.surface.border,
    "--color-success": colors.states.success,
    "--color-warning": colors.states.warning,
    "--color-danger": colors.states.danger,
    "--color-info": colors.states.info,
    "--radius-sm": radius.sm,
    "--radius-md": radius.md,
    "--radius-lg": radius.lg,
    "--radius-xl": radius.xl,
    "--space-1": spacing[1],
    "--space-2": spacing[2],
    "--space-3": spacing[3],
    "--space-4": spacing[4],
    "--space-6": spacing[6],
    "--space-8": spacing[8],
    "--space-12": spacing[12],
    "--space-16": spacing[16],
    "--font-sans": typography.fontFamily.sans,
    "--text-sm": typography.sizes.sm,
    "--text-md": typography.sizes.md,
    "--text-lg": typography.sizes.lg,
    "--text-xl": typography.sizes.xl,
    "--text-2xl": typography.sizes["2xl"],
    "--duration-fast": motion.duration.fast,
    "--duration-base": motion.duration.base,
    "--easing-standard": motion.easing.standard,
  },
})

export const theme = {
  color: {
    bg: "var(--color-bg)",
    surface: "var(--color-surface)",
    text: "var(--color-text)",
    textMuted: "var(--color-text-muted)",
    textOnBrand: "var(--color-text-on-brand)",
    brand: "var(--color-brand)",
    accent: "var(--color-accent)",
    accentLight: "var(--color-accent-light)",
    border: "var(--color-border)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
    info: "var(--color-info)",
  },
  space: {
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    6: "var(--space-6)",
    8: "var(--space-8)",
    12: "var(--space-12)",
    16: "var(--space-16)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  },
  font: {
    sans: "var(--font-sans)",
  },
  text: {
    sm: "var(--text-sm)",
    md: "var(--text-md)",
    lg: "var(--text-lg)",
    xl: "var(--text-xl)",
    "2xl": "var(--text-2xl)",
  },
  duration: {
    fast: "var(--duration-fast)",
    base: "var(--duration-base)",
  },
  easing: {
    standard: "var(--easing-standard)",
  },
}
