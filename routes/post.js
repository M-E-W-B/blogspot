const { Comment, UserFollowBlog, PostLabel, Post } = require("../models");
const { pick } = require("lodash");
const { ObjectId } = require("mongoose").Types;
const { assertRule } = require("../utils");

function isDate(v) {
  return Object.prototype.toString.call(v) === "[object Date]";
}

module.exports = router => {
  // create a post
  router.post(
    "/post",
    assertRule("CREATE", "Blog", req => req.body.blogId),
    (req, res, next) => {
      const obj = pick(req.body, ["title", "body", "status", "blogId"]);

      obj.owner = req.decoded._id;

      const post = new Post(obj);

      post
        .save()
        .then(post => res.json(post))
        .catch(next);
    }
  );

  // delete a post
  router.delete(
    "/post/:id",
    assertRule("DELETE", "Post", req => req.params.id),
    (req, res, next) => {
      const postId = req.params.id;

      Post.remove({ _id: postId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // publish a post
  router.put(
    "/post/:id/publish",
    assertRule("UPDATE", "Post", req => req.params.id),
    (req, res, next) => {
      const { id: postId } = req.params;
      const options = { new: true };
      const obj = {
        status: "PUBLISHED",
        updatedAt: Date.now()
      };

      Post.findByIdAndUpdate(postId, obj, options)
        .then(post => res.json(post))
        .catch(next);
    }
  );

  // edit a post
  router.put(
    "/post/:id",
    assertRule("UPDATE", "Post", req => req.params.id),
    (req, res, next) => {
      const postId = req.params.id;
      const options = { new: true };
      const obj = pick(req.body, ["title", "body"]);

      obj.updatedAt = Date.now();

      Post.findByIdAndUpdate(postId, obj, options)
        .then(post => res.json(post))
        .catch(next);
    }
  );

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
    const labelsPromise = PostLabel.find({ postId });

    Promise.all([postPromise, commentsPromise, labelsPromise])
      .then(([post, comments, labels]) => {
        post.comments = comments;
        post.labels = labels;
        res.json(post);
      })
      .catch(next);
  });

  // get all the posts (paginated) in the database
  // filter by time interval
  router.get("/post", (req, res, next) => {
    const { start, end, sort, search } = req.query;
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    let scoreObj = {};
    let sortOptions = {};
    let searchOptions = {};

    if (search) {
      sortOptions = scoreObj = { score: { $meta: "textScore" } };
      searchOptions = {
        $text: {
          $search: search
        }
      };
    } else if (sort) {
      sortOptions = { [sort]: 1 };
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isDate(startDate) && isDate(endDate) && endDate > startDate) {
      searchOptions.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    Post.find(searchOptions, scoreObj)
      .sort(sortOptions)
      .skip(limit * page - limit)
      .limit(limit)
      .then(posts => res.json(posts))
      .catch(next);
  });

  // list posts from their own blogs and the blogs they follow
  router.get(
    "/user/:userId/feed",
    assertRule("USER_FEED", "User", req => req.params.userId),
    (req, res, next) => {
      const userId = req.decoded._id;

      UserBlog.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "blogId",
            foreignField: "blogId",
            as: "post_docs"
          }
        },
        { $limit: 20 },
        { $unwind: "$post_docs" },
        { $sort: { "post_docs.createdAt": -1 } },
        {
          $match: {
            $or: [
              {
                userId: ObjectId(userId)
              },
              { "post_docs.owner": ObjectId(userId) }
            ],
            "post_docs.status": "PUBLISHED"
          }
        },
        {
          $project: {
            userId: 1,
            "post_docs._id": 1,
            "post_docs.blogId": 1,
            "post_docs.title": 1,
            "post_docs.body": 1,
            "post_docs.status": 1,
            "post_docs.createdAt": 1
          }
        }
      ])
        .then(posts => res.json(posts))
        .catch(next);
    }
  );
};
