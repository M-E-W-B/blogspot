const LabelPost = require("../models/label-post");
const { pick } = require("lodash");

module.exports = router => {
  // add a label to a post
  router.post("/post/:postId/label/:labelId", (req, res, next) => {
    const obj = pick(req.params, ["postId", "labelId"]);

    obj.createdBy = req.decoded._id;

    const labelPost = new LabelPost(obj);

    labelPost
      .save()
      .then(labelPost => res.json(labelPost))
      .catch(next);
  });

  // delete a label from a post
  router.delete("/post/:postId/label/:labelId", (req, res, next) => {
    const { labelId, postId } = req.params;

    LabelPost.remove({ labelId, postId })
      .then(result => res.json(result))
      .catch(next);
  });

  // get all labels of a post
  router.get("/post/:postId/label", (req, res, next) => {
    const { postId } = req.params;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    LabelPost.find({ postId })
      .populate("labelId")
      .sort(sortOptions)
      .then(labelPosts => res.json(labelPosts))
      .catch(next);
  });
};
