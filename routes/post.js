const Post = require("../models/post");
const { pick } = require("lodash");

module.exports = router => {
  router.post("/post", (req, res, next) => {
    const obj = pick(req.body, ["title", "body", "status"]);

    obj.createdBy = req.decoded._id;

    const post = new Post(obj);

    post
      .save()
      .then(post => res.json(post))
      .catch(next);
  });

  router.delete("/post/:id", (req, res, next) => {
    const postId = req.params.id;

    Post.remove({ _id: postId })
      .then(result => res.json(result))
      .catch(next);
  });

  // seperate api for changing status
  router.put("/post/:id/status/:status", (req, res, next) => {
    const { id: postId, status } = req.params;
    const options = { new: true };
    const obj = {
      status,
      updatedAt: Date.now()
    };

    Blog.findByIdAndUpdate(postId, obj, options)
      .then(post => res.json(post))
      .catch(next);
  });

  router.put("/post/:id", (req, res, next) => {
    const postId = req.params.id;
    const options = { new: true };
    const obj = pick(req.body, ["title", "body"]);

    obj.updatedAt = Date.now();

    Post.findByIdAndUpdate(postId, obj, options)
      .then(post => res.json(post))
      .catch(next);
  });

  router.get("/post/:id", (req, res, next) => {
    const postId = req.params.id;

    Post.findById(postId)
      .then(post => res.json(post))
      .catch(next);
  });

  router.get("/post", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    Post.find({})
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(posts => res.json(posts))
      .catch(next);
  });
};
