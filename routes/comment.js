const Comment = require("../models/comment");
const { pick } = require("lodash");

module.exports = router => {
  router.post("/comment", (req, res, next) => {
    const obj = pick(req.body, ["txt", "postId"]);

    obj.createdBy = req.decoded._id;

    const comment = new Comment(obj);

    comment
      .save()
      .then(comment => res.json(comment))
      .catch(next);
  });

  router.delete("/comment/:id", (req, res, next) => {
    const commentId = req.params.id;

    Comment.remove({ _id: commentId })
      .then(result => res.json(result))
      .catch(next);
  });

  router.put("/comment/:id", (req, res, next) => {
    const commentId = req.params.id;
    const options = { new: true };
    const obj = pick(req.body, ["txt"]);

    obj.updatedAt = Date.now();

    Comment.findByIdAndUpdate(commentId, obj, options)
      .then(comment => res.json(comment))
      .catch(next);
  });

  router.get("/comment/:id", (req, res, next) => {
    const commentId = req.params.id;

    Comment.findById(commentId)
      .then(comment => res.json(comment))
      .catch(next);
  });

  router.get("/comment", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    Comment.find({})
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(comments => res.json(comments))
      .catch(next);
  });
};
