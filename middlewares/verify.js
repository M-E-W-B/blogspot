const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = router => {
  router.use(function(req, res, next) {
    const token =
      req.body.token || req.param.token || req.headers["x-access-token"];

    if (token)
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          next(new Error("Failed to authenticate token."));
        } else {
          req.decoded = decoded;
          next();
        }
      });
    else next(new Error("No token provided."));
  });
};
