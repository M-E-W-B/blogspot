const { pick } = require("lodash");
const { Group } = require("../models");
const { assertRule } = require("../utils");

module.exports = router => {
  // create a group
  router.post("/group", assertRule("create", "Group"), (req, res, next) => {
    const obj = pick(req.body, ["name"]);

    obj.owner = req.decoded._id;

    const group = new Group(obj);

    group
      .save()
      .then(group => res.json(group))
      .catch(next);
  });

  // delete a group
  router.delete(
    "/group/:id",
    assertRule("delete", "Group", req => req.params.id),
    (req, res, next) => {
      const groupId = req.params.id;

      Group.remove({ _id: groupId })
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // update a group
  router.put(
    "/group/:id",
    assertRule("update", "Group", req => req.params.id),
    (req, res, next) => {
      const groupId = req.params.id;
      const options = { new: true };
      const obj = pick(req.body, ["name"]);

      Group.findByIdAndUpdate(groupId, obj, options)
        .then(group => res.json(group))
        .catch(next);
    }
  );

  // group details
  router.get("/group/:id", (req, res, next) => {
    const groupId = req.params.id;

    Group.findById(groupId)
      .then(group => res.json(group))
      .catch(next);
  });

  // list of groups
  router.get("/group", (req, res, next) => {
    Group.find({})
      .then(groups => res.json(groups))
      .catch(next);
  });
};
