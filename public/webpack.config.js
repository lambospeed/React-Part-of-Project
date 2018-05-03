var webpack                    = require('webpack');
var path                       = require('path');
const TsconfigPathsPlugin      = require('tsconfig-paths-webpack-plugin');
const CommonsChunkPlugin       = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin        = require('copy-webpack-plugin');
const DefinePlugin             = require('webpack/lib/DefinePlugin');
const TypedocWebpackPlugin     = require('typedoc-webpack-plugin');

var BUILD_DIR      = path.resolve(__dirname, 'javascripts');
var APP_DIR        = path.resolve(__dirname, './src');
const tsConfigJson = require('./tsconfig.json');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  baseUrl: '/',
  ENV    : ENV,
  host   : HOST,
  port   : PORT
};

var config = {
  devServer: {
    contentBase: '.',
    historyApiFallback: true,
    host: metadata.host,
    port: metadata.port
  },
  devtool: 'source-map',
  entry: {
    main : [
      'webpack-dev-server/client?http://localhost:8080',
      APP_DIR + '/index.tsx'
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    sourceMapFilename: "bundle.map",
    publicPath: '/bundles/'
  },
  module : {
    loaders : [

      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "typings-for-css-modules-loader",
            options: {
              alias: {
                "../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
              },
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [
                "./node_modules/bootstrap-sass/assets/stylesheets",
                "../app/assets/app/stylesheets",
                "./stylesheets"
              ]
            }
          }
        ]
      },
      // All files with a '.ts' or '.tsx' extension will be handled by
      // 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
      // All output '.js' files will have any sourcemaps re-processed
      // by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/,
        loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      { test: /\.html$/,  loader: 'html-loader?caseSensitive=true' },
      { test: /\.(eot|jpg|png|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader' }
    ]
  },
  // &localIdentName=[name]__[local]___[hash:base64:5]
  plugins: [
//    new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity}),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
//    new TypedocWebpackPlugin({tsconfig: './tsconfig.json', out: '../docs'}, './src')
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
//    alias: {
//      app: APP_DIR
//    },
//    modules: [
//      path.join(__dirname, "node_modules")
      //    ],
  },
  // When importing a module whose path matches one of the following,
  // just assume a corresponding global variable exists and use that
  // instead. This is important because it allows us to avoid bundling
  // all of our dependencies, which allows browsers to cache those
  // libraries between builds.
 /* externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }, */
};

module.exports = config;
