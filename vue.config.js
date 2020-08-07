module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/',
  pwa: {
    start_url: "https://pensive-villani-5ff91b.netlify.app/",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}