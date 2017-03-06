import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';

import routes from './routes';

const app = express();

/*==================================
=            Middleware            =
==================================*/
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(compression());
app.use(logger('tiny'));
app.use('/static', express.static(path.join(__dirname, '../static'))); // serve static file

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

export default app;
