const { User } = require("../models");
const { pick } = require("lodash");
const { assertRule } = require("../utils");

module.exports = router => {
  // delete a user
  router.delete(
    "/user/:id",
    assertRule("delete", "User", req => req.params.id),
    (req, res, next) => {
      const userId = req.params.id;

      User.remove({ _id: userId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // get a user
  router.get("/user/:id", (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId)
      .then(user => res.json(user))
      .catch(next);
  });

  // edit basic details of a user
  router.put(
    "/user/:id",
    assertRule("update", "User", req => req.params.id),
    (req, res, next) => {
      const userId = req.params.id;
      const options = { new: true };
      const obj = pick(req.body, [
        "name",
        "about",
        "website",
        "image",
        "gender"
      ]);

      obj.updatedAt = Date.now();

      User.findByIdAndUpdate(userId, obj, options)
        .then(user => res.json(user))
        .catch(next);
    }
  );

  // get all the users (paginated) in the database
  router.get("/user", assertRule("list", "User"), (req, res, next) => {
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
