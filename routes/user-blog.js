const UserBlog = require("../models/user-blog");
const { pick } = require("lodash");

module.exports = router => {
  // add blog to user follow list
  router.post("/user/follows/:blogId/blog", (req, res, next) => {
    const obj = pick(req.params, ["blogId"]);

    obj.userId = req.decoded._id;
    obj.createdBy = req.decoded._id;

    const userBlog = new UserBlog(obj);

    userBlog
      .save()
      .then(userBlog => res.json(userBlog))
      .catch(next);
  });

  // remove a blog from user follow list
  router.delete("/user/unfollows/:blogId/blog", (req, res, next) => {
    const blogId = req.params.blogId;
    const userId = req.decoded._id;

    if (!blogId) next(new Error("BlogId was not provided!"));

    UserBlog.remove({ blogId, userId })
      .then(result => res.json(result))
      .catch(next);
  });

  // get all the blogs that a user follows
  // @TODO: pagination is not needed here
  router.get("/user/follows/blog", (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    UserBlog.find({})
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(userBlogs => res.json(userBlogs))
      .catch(next);
  });
};
