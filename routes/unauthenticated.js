const jwt = require("jsonwebtoken");
const { pick } = require("lodash");
const User = require("../models/user");
const config = require("../config");

module.exports = router => {
  router.post("/login", function(req, res, next) {
    User.findOne({
      email: req.body.email
    })
      .then(user => {
        if (!user) {
          return next(new Error("Authentication failed. User not found."));
        } else if (user) {
          if (!user.validPassword(req.body.password)) {
            return next(new Error("Authentication failed. Wrong password."));
          } else {
            const { _id, name, email } = user;
            const payload = { _id, name, email };

            const token = jwt.sign(payload, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });

            res.json({
              message: "Enjoy your token!",
              user: payload,
              token
            });
          }
        }
      })
      .catch(next);
  });

  router.post("/signup", (req, res, next) => {
    const obj = pick(req.body, [
      "name",
      "about",
      "password",
      "website",
      "image",
      "gender",
      "email"
    ]);

    if (!obj.password) return next(new Error("Password is required!"));

    if (obj.password.length < 6 || obj.password.length > 20)
      return next(new Error("Only 6 to 20 character length allowed!"));

    const user = new User(obj);
    // store encrypted password
    user.password = user.generateHash(obj.password);
    user
      .save()
      .then(user => res.json(user))
      .catch(next);
  });
};
