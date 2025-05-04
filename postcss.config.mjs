export default {
  content: ['./src/**/*.html'],
  defaultExtractor: (content) => {
    const defaultSelectors = content.match(/[A-Za-z0-9_-]+/g) || []
    const extendedSelectors = content.match(/[^<>"'=\\s]+/g) || []
    return defaultSelectors.concat(extendedSelectors)
  },
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
