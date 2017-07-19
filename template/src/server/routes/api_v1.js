/**
 *
 * Example route for API
 *
 */

import { Router } from 'express';

const router = Router();

router.route('/info').get(getInfo);

function getInfo(req, res) {
  res.status(200).json({
    message: 'GET INFO'
  });
}

export default router;
