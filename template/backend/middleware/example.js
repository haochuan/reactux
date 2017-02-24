/**
 *
 * Example custom middlewre
 * console request ip address
 *
 */

export default function(req, res, next) {
  console.log(req.ip);
  next();
}
