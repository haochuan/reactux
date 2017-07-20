/**
 *
 * Example route for page
 *
 */

import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
router.route('/getReadme').get(getReadme);

function getReadme(req, res) {
  // will call this endpoint in '/src/react/containers/App'
  const doc = fs.readFileSync(
    path.resolve(__dirname, '../../../README.md'),
    'utf8'
  );
  res.status(200).json(doc);
}

export default router;
