/**
 *
 * Example route for page
 *
 */

import { Router } from 'express';

const router = Router();

router.route('/info').get(getInfo);

function getInfo(req, res) {
  res.status(200).send('INFO PAGE');
}

export default router;
