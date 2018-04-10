const { pick } = require("lodash");
const { Blog, UserFollowBlog, Post } = require("../models");
const { assertRule } = require("../utils");

module.exports = router => {
  // create a blog
  router.post("/blog", (req, res, next) => {
    const obj = pick(req.body, ["subdomain", "name", "description", "status"]);

    obj.owner = req.decoded._id;

    const blog = new Blog(obj);

    blog
      .save()
      .then(blog => res.json(blog))
      .catch(next);
  });

  // delete a blog
  router.delete(
    "/blog/:id",
    assertRule("delete", "Blog", req => req.params.id),
    (req, res, next) => {
      const blogId = req.params.id;

      Blog.findByIdAndUpdate(blogId, { deletedAt: Date.now() })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // mark the status of a blog i.e. active, inactive
  router.put(
    "/blog/:id/status/:status",
    assertRule("update_blog_status", "Blog", req => req.params.id),
    (req, res, next) => {
      const { id: blogId, status } = req.params;
      const options = { new: true, runValidators: true };
      const obj = {
        status,
        updatedAt: Date.now()
      };

      Blog.findByIdAndUpdate(blogId, obj, options)
        .then(blog => res.json(blog))
        .catch(next);
    }
  );

  // update a blog
  router.put(
    "/blog/:id",
    assertRule("update", "Blog", req => req.params.id),
    (req, res, next) => {
      const blogId = req.params.id;
      const options = { new: true, runValidators: true };
      const obj = pick(req.body, ["name", "description"]);

      obj.updatedAt = Date.now();

      Blog.findByIdAndUpdate(blogId, obj, options)
        .then(blog => res.json(blog))
        .catch(next);
    }
  );

  // basic blog details
  router.get("/blog/:id", (req, res, next) => {
    const blogId = req.params.id;

    Blog.findById(blogId)
      .then(blog => res.json(blog))
      .catch(next);
  });

  // get full blog i.e. no. of posts, no. of followers
  router.get("/blog/:id/full", (req, res, next) => {
    const blogId = req.params.id;
    const blogPromise = Blog.findById(blogId).lean();
    const postCountPromise = Post.count({ blogId });
    const followerCountPromise = UserFollowBlog.count({ blogId });

    Promise.all([blogPromise, postCountPromise, followerCountPromise])
      .then(([blog, postCount, followerCount]) => {
        blog.postCount = postCount;
        blog.followerCount = followerCount;
        res.json(blog);
      })
      .catch(next);
  });

  // list of all posts of a blog (paginated)
  router.get("/blog/:blogId/post", (req, res, next) => {
    const { blogId } = req.params;
    const { sort, status = "active", search } = req.query;
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    let scoreObj = {};
    let sortOptions = {};
    let searchOptions = { status, deletedAt: { $eq: null } };

    if (search) {
      sortOptions = scoreObj = { score: { $meta: "textScore" } };
      searchOptions.$text = {
        $search: search
      };
    } else if (sort) {
      sortOptions = { [sort]: 1 };
    }

    if (blogId) searchOptions.blogId = blogId;

    Post.find(searchOptions, scoreObj)
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(blogs => res.json(blogs))
      .catch(next);
  });

  // list of all blogs of user
  router.get(
    "/user/:userId/blog",
    assertRule("list_user_blogs", "User", req => req.params.userId),
    (req, res, next) => {
      const { status = "active", sort } = req.query;
      const sortOptions = sort ? { [sort]: 1 } : {};
      const userId = req.decoded._id;

      Blog.find({ owner: userId, status, deletedAt: { $eq: null } })
        .sort(sortOptions)
        .then(blogs => res.json(blogs))
        .catch(next);
    }
  );

  // list of all blogs (paginated)
  router.get("/blog", assertRule("list", "Blog"), (req, res, next) => {
    const { sort, status = "active", search } = req.query;
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    let scoreObj = {};
    let sortOptions = {};
    let searchOptions = { status, deletedAt: { $eq: null } };

    if (search) {
      sortOptions = scoreObj = { score: { $meta: "textScore" } };
      searchOptions.$text = {
        $search: search
      };
    } else if (sort) {
      sortOptions = { [sort]: 1 };
    }

    Blog.find(searchOptions, scoreObj)
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(blogs => res.json(blogs))
      .catch(next);
  });
};
