const Blog = require("../models/blog");
const { pick } = require("lodash");

module.exports = router => {
  // create a blog
  router.post("/blog", (req, res, next) => {
    const obj = pick(req.body, ["subdomain", "name", "description", "status"]);

    obj.createdBy = req.decoded._id;

    const blog = new Blog(obj);

    blog
      .save()
      .then(blog => res.json(blog))
      .catch(next);
  });

  // delete a blog
  router.delete("/blog/:id", (req, res, next) => {
    const blogId = req.params.id;

    Blog.remove({ _id: blogId })
      .then(result => res.json(result))
      .catch(next);
  });

  // mark the status of a blog i.e. active, inactive
  router.put("/blog/:id/status/:status", (req, res, next) => {
    const { id: blogId, status } = req.params;
    const options = { new: true };
    const obj = {
      status,
      updatedAt: Date.now()
    };

    Blog.findByIdAndUpdate(blogId, obj, options)
      .then(blog => res.json(blog))
      .catch(next);
  });

  // update a blog
  router.put("/blog/:id", (req, res, next) => {
    const blogId = req.params.id;
    const options = { new: true };
    const obj = pick(req.body, ["name", "description"]);

    obj.updatedAt = Date.now();

    Blog.findByIdAndUpdate(blogId, obj, options)
      .then(blog => res.json(blog))
      .catch(next);
  });

  // basic blog details
  router.get("/blog/:id", (req, res, next) => {
    const blogId = req.params.id;

    Blog.findById(blogId)
      .then(blog => res.json(blog))
      .catch(next);
  });

  // get full blog i.e. no. of posts, no. of followers
  // @TODO
  router.get("/blog/:id/full", (req, res, next) => {
    const blogId = req.params.id;
  });

  // list of all blogs (paginated)
  router.get("/blog", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    Blog.find({})
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(blogs => res.json(blogs))
      .catch(next);
  });
};
