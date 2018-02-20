const BlogPost = require("../models/blog-post");
const { pick } = require("lodash");

module.exports = router => {
  // add a post to a blog
  router.post("/blog/:blogId/post/:postId", (req, res, next) => {
    const obj = pick(req.params, ["postId", "blogId"]);

    obj.createdBy = req.decoded._id;

    const blogPost = new BlogPost(obj);

    blogPost
      .save()
      .then(blogPost => res.json(blogPost))
      .catch(next);
  });

  // delete a post from a blog
  router.delete("/blog/:blogId/post/:postId", (req, res, next) => {
    const blogPostId = req.params.id;

    BlogPost.remove({ _id: blogPostId })
      .then(result => res.json(result))
      .catch(next);
  });

  // get all the (paginated) posts of a blog
  router.get("/blog/:blogId/post", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    BlogPost.find({})
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(blogPosts => res.json(blogPosts))
      .catch(next);
  });
};
