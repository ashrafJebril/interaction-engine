module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.js',
  ],

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        smoke:"#f8f8f8"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
