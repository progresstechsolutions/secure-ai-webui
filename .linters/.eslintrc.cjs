module.exports = {
  extends: ['next/core-web-vitals', '@typescript-eslint/recommended'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/^#([0-9a-fA-F]{3}){1,2}$/]",
        message: 'Use design tokens instead of hex colors. Import from /vibe/theme.ts'
      },
      {
        selector: "Literal[value=/^\\d+px$/]",
        message: 'Use spacing tokens instead of px values. Import from /vibe/theme.ts'
      }
    ],
    'no-restricted-properties': [
      'error',
      {
        object: 'React',
        property: 'CSSProperties',
        message: 'Use Tailwind classes with design tokens instead of inline styles'
      }
    ]
  }
}
