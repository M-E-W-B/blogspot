const { UserFollowBlog } = require("../models");
const { pick } = require("lodash");
const { assertRule } = require("../utils");

module.exports = router => {
  // add blog to user follow list
  router.post(
    "/user/:userId/follows/:blogId/blog",
    assertRule("FOLLOW_BLOG", "User", req => req.params.userId),
    (req, res, next) => {
      const obj = pick(req.params, ["blogId"]);

      obj.userId = req.decoded._id;
      obj.owner = req.decoded._id;

      const userFollowBlog = new UserFollowBlog(obj);

      userFollowBlog
        .save()
        .then(userFollowBlog => res.json(userFollowBlog))
        .catch(next);
    }
  );

  // remove a blog from user follow list
  router.delete(
    "/user/:userId/unfollows/:blogId/blog",
    assertRule("UNFOLLOW_BLOG", "User", req => req.params.userId),
    (req, res, next) => {
      const blogId = req.params.blogId;
      const userId = req.decoded._id;

      UserFollowBlog.remove({ blogId, userId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // get all the blogs that a user follows
  router.get(
    "/user/:userId/follows/blog",
    assertRule("LIST_FOLLOW_BLOG", "User", req => req.params.userId),
    (req, res, next) => {
      const userId = req.decoded._id;
      const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

      UserFollowBlog.find({ userId })
        .sort(sortOptions)
        .populate("blogId")
        .then(userFollowBlogs => res.json(userFollowBlogs))
        .catch(next);
    }
  );
};
