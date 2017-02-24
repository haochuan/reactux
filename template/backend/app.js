import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import favicon from "serve-favicon";
// webpack
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import routes from "./routes";
import webpackConfig from "../webpack.config";

import env from "./config/env";

const app = express();

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

const port = env.port;

if (env.name === "dev") {
  let compiler = webpack(webpackConfig);
  let webpackMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quite: true,
    contentBase: "src",
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(webpackMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.get("/", function response(req, res) {
    res.write(
      webpackMiddleware.fileSystem.readFileSync(
        path.join(__dirname, "../frontend/dist/index.html")
      )
    );
    res.end();
  });
} else if (env.name === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("/", function response(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
} else {
  // test here
}

// Routes
app.use("/api/v1", routes.api_v1);

export default app;
