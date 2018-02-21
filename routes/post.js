const LabelPost = require("../models/label-post");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { pick } = require("lodash");

module.exports = router => {
  // create a post
  router.post("/post", (req, res, next) => {
    const obj = pick(req.body, ["title", "body", "status", "blogId"]);

    obj.createdBy = req.decoded._id;

    const post = new Post(obj);

    post
      .save()
      .then(post => res.json(post))
      .catch(next);
  });

  // delete a post
  router.delete("/post/:id", (req, res, next) => {
    const postId = req.params.id;

    Post.remove({ _id: postId })
      .then(result => res.json(result))
      .catch(next);
  });

  // publish a post
  router.put("/post/:id/publish", (req, res, next) => {
    const { id: postId } = req.params;
    const options = { new: true };
    const obj = {
      status: "PUBLISHED",
      updatedAt: Date.now()
    };

    Post.findByIdAndUpdate(postId, obj, options)
      .then(post => res.json(post))
      .catch(next);
  });

  // edit a post
  router.put("/post/:id", (req, res, next) => {
    const postId = req.params.id;
    const options = { new: true };
    const obj = pick(req.body, ["title", "body"]);

    obj.updatedAt = Date.now();

    Post.findByIdAndUpdate(postId, obj, options)
      .then(post => res.json(post))
      .catch(next);
  });

  // get a post
  router.get("/post/:id", (req, res, next) => {
    const postId = req.params.id;

    Post.findById(postId)
      .then(post => res.json(post))
      .catch(next);
  });

  // get comments of a post
  router.get("/post/:id/comment", (req, res, next) => {
    const postId = req.params.id;
    Comment.find({ postId })
      .then(comments => res.json(comments))
      .catch(next);
  });

  // get full post i.e. comments, labels
  router.get("/post/:id/full", (req, res, next) => {
    const postId = req.params.id;
    const postPromise = Post.findById(postId).lean();
    const commentsPromise = Comment.find({ postId });
    const labelsPromise = LabelPost.find({ postId });

    Promise.all([postPromise, commentsPromise, labelsPromise])
      .then(([post, comments, labels]) => {
        post.comments = comments;
        post.labels = labels;
        res.json(post);
      })
      .catch(next);
  });

  // get all the posts (paginated) in the database
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
