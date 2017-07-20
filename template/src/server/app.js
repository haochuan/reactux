import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import historyApiFallback from 'connect-history-api-fallback';

// webpack
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config';

import env from './config/env';
import routes from './routes';

const app = express();

/*==================================
=            Middleware            =
==================================*/
app.use(favicon(path.join(__dirname, '../../', 'favicon.ico')));
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(compression());
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// serve static files
//app.use('/static', express.static(path.join(__dirname, '../static')));

/*=====  End of Middleware  ======*/

/*===========================================
=            Baic Authentication            =
===========================================*/

// app.use(require('node-basicauth')({'haochuan': 'password'}));

/*=====  End of Baic Authentication  ======*/

/*===========================
=            COR            =
===========================*/

// app.use(require('cors')());

/*=====  End of COR  ======*/

// Routes
app.use('/api/v1', routes.api_v1);
app.use('/page', routes.page);

app.use(
  historyApiFallback({
    verbose: false
  })
);

// Load React App
if (env.name === 'production') {
  app.use(express.static(path.resolve(__dirname, '../', 'react')));
  app.get('*', function response(req, res) {
    res.sendFile(path.resolve(__dirname, '../', 'react', 'index.html'));
  });
} else {
  var compiler = webpack(webpackConfig);
  var webpackMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quite: true,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  // =========================
  //   // use historyApiFallback so that routing in SPA works (YO)
  // =========================
  app.use(webpackMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(
      webpackMiddleware.fileSystem.readFileSync(
        path.resolve(__dirname, '../', 'react', 'index.html')
      )
    );
    res.end();
  });
}

export default app;
