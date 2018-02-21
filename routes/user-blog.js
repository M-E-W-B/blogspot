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

    UserBlog.remove({ blogId, userId })
      .then(result => res.json(result))
      .catch(next);
  });

  // get all the blogs that a user follows
  router.get("/user/follows/blog", (req, res, next) => {
    const userId = req.decoded._id;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    UserBlog.find({ userId })
      .sort(sortOptions)
      .populate("blogId")
      .then(userBlogs => res.json(userBlogs))
      .catch(next);
  });
};
