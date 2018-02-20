const User = require("../models/user");
const pick = require("lodash");

module.exports = router => {
  router.delete("/user/:id", (req, res, next) => {
    const userId = req.params.id;

    User.remove({ _id: userId })
      .then(result => res.json(result))
      .catch(next);
  });

  router.get("/user/:id", (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId)
      .then(user => res.json(user))
      .catch(next);
  });

  router.put("/user/:id", (req, res, next) => {
    const userId = req.params.id;
    const options = { new: true };
    const obj = pick(req.body, ["name", "about", "website", "image", "gender"]);

    obj.updatedAt = Date.now();

    User.findByIdAndUpdate(userId, obj, options)
      .then(user => res.json(user))
      .catch(next);
  });

  router.get("/user", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    User.find({})
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(users => res.json(users))
      .catch(next);
  });
};
