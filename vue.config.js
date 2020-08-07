module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/',
  pwa: {
    start_url: "https://clt-cnctools.netlify.app/",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}