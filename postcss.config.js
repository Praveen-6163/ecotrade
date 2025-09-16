export default (ctx) => {
  // Only apply PostCSS plugins to files outside of node_modules
  if (ctx.file && ctx.file.includes('node_modules')) {
    return {
      plugins: []
    }
  }

  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  }
}
