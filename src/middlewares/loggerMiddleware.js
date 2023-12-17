function loggerMiddleware(req, _, next) {
  console.log({
    method: req.method,
    path: req.path,
    body: Object.keys(req.body).length ? req.body : undefined,
  });
  next();
}

module.exports = { loggerMiddleware };
