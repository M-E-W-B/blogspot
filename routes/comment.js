const { Comment } = require("../models");
const { pick } = require("lodash");
const { assertRule } = require("../utils");

module.exports = router => {
  // add a comment to a post
  router.post("/comment", (req, res, next) => {
    const obj = pick(req.body, ["txt", "postId"]);

    obj.owner = req.decoded._id;

    const comment = new Comment(obj);

    comment
      .save()
      .then(comment => res.json(comment))
      .catch(next);
  });

  // delete a comment
  router.delete(
    "/comment/:id",
    assertRule("delete", "Comment", req => req.params.id),
    (req, res, next) => {
      const commentId = req.params.id;

      Comment.findByIdAndUpdate(commentId, { deletedAt: Date.now() })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // edit a comment
  router.put(
    "/comment/:id",
    assertRule("update", "Comment", req => req.params.id),
    (req, res, next) => {
      const commentId = req.params.id;
      const options = { new: true, runValidators: true };
      const obj = pick(req.body, ["txt"]);

      obj.updatedAt = Date.now();

      Comment.findByIdAndUpdate(commentId, obj, options)
        .then(comment => res.json(comment))
        .catch(next);
    }
  );

  // get a comment
  router.get("/comment/:id", (req, res, next) => {
    const commentId = req.params.id;

    Comment.findById(commentId)
      .then(comment => res.json(comment))
      .catch(next);
  });

  // list of all comments (paginated) in the database
  router.get("/comment", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    Comment.find({ deletedAt: { $eq: null } })
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(comments => res.json(comments))
      .catch(next);
  });
};
