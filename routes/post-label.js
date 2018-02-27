const { PostLabel } = require("../models");
const { pick } = require("lodash");
const { assertRule } = require("../utils");

module.exports = router => {
  // add a label to a post
  router.post(
    "/post/:postId/label/:labelId",
    assertRule("CREATE", "Post", req => req.params.id),
    (req, res, next) => {
      const obj = pick(req.params, ["postId", "labelId"]);

      obj.owner = req.decoded._id;

      const postLabel = new PostLabel(obj);

      postLabel
        .save()
        .then(postLabel => res.json(postLabel))
        .catch(next);
    }
  );

  // delete a label from a post
  router.delete(
    "/post/:postId/label/:labelId",
    assertRule("DELETE", "Post", req => req.params.id),
    (req, res, next) => {
      const { labelId, postId } = req.params;

      PostLabel.remove({ labelId, postId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // get all labels of a post
  router.get("/post/:postId/label", (req, res, next) => {
    const { postId } = req.params;
    const sortOptions = req.query.sort ? { [req.query.sort]: 1 } : {};

    PostLabel.find({ postId })
      .populate("labelId")
      .sort(sortOptions)
      .then(postLabels => res.json(postLabels))
      .catch(next);
  });
};
