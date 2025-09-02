module.exports = {
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-on-brand': 'var(--color-text-on-brand)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)'
      },
      fontFamily: {
        sans: 'var(--font-sans)'
      },
      fontSize: {
        sm: 'var(--text-sm)',
        md: 'var(--text-md)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)'
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)'
      },
      transitionTimingFunction: {
        standard: 'var(--easing-standard)'
      }
    }
  }
}
