const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/*/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
    },
    colors: {
      primary: colors.sky[600],
      'primary-content': colors.sky[50],
      'primary-focus': colors.sky[700],
      'primary-palette': colors.sky,
      neutral: colors.slate[500],
      'neutral-content': colors.slate[50],
      'neutral-focus': colors.slate[600],
      'neutral-palette': colors.slate,
      success: colors.green[500],
      'success-content': colors.green[50],
      'success-focus': colors.green[600],
      'success-palette': colors.green,
      info: colors.blue[500],
      'info-content': colors.blue[50],
      'info-focus': colors.blue[600],
      'info-palette': colors.blue,
      warning: colors.amber[500],
      'warning-content': colors.amber[50],
      'warning-focus': colors.amber[600],
      'warning-palette': colors.amber,
      error: colors.red[500],
      'error-content': colors.red[50],
      'error-focus': colors.red[600],
      'error-palette': colors.red,
      'base-100': colors.slate[100],
      'base-100-content': colors.slate[700],
      'base-150': colors.slate[200],
      'base-150-content': colors.slate[800],
      'base-50': colors.slate[50],
      'base-50-content': colors.slate[600],
      'base-palette': colors.slate,
      transparent: colors.transparent,
      inherit: colors.inherit,
      current: colors.current,
      black: colors.black,
      white: colors.white,
    },
  },
  plugins: [],
}

