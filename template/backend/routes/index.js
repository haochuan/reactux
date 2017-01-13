import { Router } from 'express';

const routes = Router();

routes.get('/test', (req, res) => {
  res.end("test");
});

export default routes;