const express = require('express');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const path = require('path');
const historyApiFallback = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');

// DEV
const isDev = process.env.NODE_ENV !== 'production';

// PORT
const PORT = process.env.PORT || 5000;

// Routes
const rootRoutes = require('./routes/');
const apiRoutes = require('./routes/api');

//DB Connect
mongoose.connect(keys.mongoURI);

// Init
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Init Routes
app.use('/', rootRoutes);
app.use('/api', apiRoutes);

if (isDev) {
  const compiler = webpack(webpackConfig);
  app.use(
    historyApiFallback({
      verbose: false
    })
  );
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      contentBase: path.resolve(__dirname, '../client/public'),
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    })
  );
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
