// const env = process.env.NODE_ENV_MODE;
const path = require('path');

// const webpack = require('webpack');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8098,
    compress: true,
    open: true,
    openPage: '#/pages/aftersale/JAfterSale',
    proxy: {
      '/new/api': {
        target: 'http://mall.jsh.com',
        // target: 'https://new.jsh.com',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // },
        secure: false
      }
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .exclude.add(path.resolve(__dirname, 'src/assets/img/tabbar/'))
      .end();
    config.module
      .rule('images-tab-bar')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .pre()
      .include.add(path.resolve(__dirname, 'src/assets/img/tabbar/'))
      .end()
      .use('url-loader')
      .loader('url-loader')
      .tap(options => ({
        ...options,
        limit: 1,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'static/img/[name].[ext]'
          }
        }
      }))
      .end();
    return config;
  }
};
