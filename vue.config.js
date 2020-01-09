module.exports = {
  publicPath: JSON.stringify(process.env.FRONTEND_PUBLIC_PATH),
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      let _base = args[0]['process.env']
      args[0]['process.env'] = {
        ..._base,
        'BACKEND_HOST': JSON.stringify(process.env.BACKEND_HOST)
      }
      return args
    })
  }
}
