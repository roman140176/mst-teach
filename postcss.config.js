export default {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 1920,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: true,
      exclude: [/node_modules/],
    },
  },
}
