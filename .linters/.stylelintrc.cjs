module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-named': 'never',
    'color-no-hex': true,
    'unit-disallowed-list': ['px'],
    'property-disallowed-list': ['background-color', 'color', 'border-color'],
    'declaration-property-value-disallowed-list': {
      '/^(background|color|border).*$/': ['/^#/', '/^rgb/', '/^hsl/']
    }
  }
}
