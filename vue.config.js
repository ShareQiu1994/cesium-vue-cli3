const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers'; 

module.exports = {
    baseUrl:'./',
    assetsDir:'./static',
    chainWebpack: config => {
        config
          .node.set('fs', 'empty').end()
          .resolve.alias.set('cesium', path.resolve(__dirname, cesiumSource)).end().end()
          .amd({
            toUrlUndefined: true
          })
          .module
          .set('unknownContextCritical', false)
          .rule()
          .include
          .add(path.resolve(__dirname, cesiumSource))
          .end()
          .post()
          .pre()
          .test(/\.js$/)
          .use('strip')
          .loader('strip-pragma-loader')
          .options({
            pragmas: {
              debug: false
            }
          })
          .end()
          .end()
      },
    configureWebpack: config => {
        let plugins = [];
        if (process.env.NODE_ENV === 'production') {
                plugins =  [
                    new webpack.DefinePlugin({
                      'CESIUM_BASE_URL': JSON.stringify('static') 
                    }),
                    new CopyWebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'static/Workers' } ]),
                    new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'static/Assets' } ]),
                    new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'static/Widgets' } ]), 
                    // new webpack.optimize.CommonsChunkPlugin({
                    //     name: 'cesium',
                    //     minChunks: function (module) {
                    //       return module.context && module.context.indexOf('cesium') !== -1
                    //     }
                    //   })
                ]
        } else {
                plugins = [
                    new webpack.DefinePlugin({
                      'CESIUM_BASE_URL': JSON.stringify('') 
                    }),
                    new CopyWebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' } ]),
                    new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets' } ]),
                    new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' } ]),
                ]
        }

        return {
            // module:{
            //     unknownContextCritical: false 
            // },
            // resolve: {
            //     alias: {
            //         cesium: path.resolve(__dirname, cesiumSource)
            //     }
            // },
            // output: {
            //     sourcePrefix: ''
            // },
            // amd: {
            //     toUrlUndefined: true
            // },
            // node: {
            //     fs: 'empty'
            // },
            plugins:plugins
        }
      } 
  }