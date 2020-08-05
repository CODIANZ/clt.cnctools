module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/cnctools/',
  pwa: {
    start_url: "https://kandenevsimstaging.blob.core.windows.net/cnctools/index.html",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}