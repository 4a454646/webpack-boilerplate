const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app');
const dirImages = path.join(__dirname, 'images');
const dirShared = path.join(__dirname, 'shared');
const dirVideos = path.join(__dirname, 'videos');
const dirFonts = path.join(__dirname, 'fonts');
const dirStyles = path.join(__dirname, 'styles');

module.exports = {
  entry: [
    path.join(dirApp, 'index.js'),
    path.join(dirStyles, 'main.scss')
  ],
  resolve: {
    modules: [
      dirApp,
      dirImages,
      dirShared,
      dirVideos,
      dirFonts,
      'node_modules'
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'shared'
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader
          }
        ]
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: 'http://www.w3.org/2000/svg' }
                              ]
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      })
    ]
  }
};
