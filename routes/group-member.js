const { pick } = require("lodash");
const { GroupMember } = require("../models");
const { assertRule } = require("../utils");

module.exports = router => {
  // add a user to a group
  router.post(
    "/group/:groupId/user/:userId",
    assertRule("group_add_user", "Group", req => req.params.groupId),
    (req, res, next) => {
      const { groupId, userId } = req.params;
      const obj = { groupId, userId };
      const groupMember = new GroupMember(obj);

      groupMember
        .save()
        .then(groupMember => res.json(groupMember))
        .catch(next);
    }
  );

  // remove a user from a group
  router.delete(
    "/group/:groupId/user/:userId",
    assertRule("group_remove_user", "Group", req => req.params.groupId),
    (req, res, next) => {
      const { groupId, userId } = req.params;

      GroupMember.findOneAndUpdate(
        { groupId, userId },
        { deletedAt: Date.now() }
      )
        .then(result => res.json(result))
        .catch(next);
    }
  );

  // list all users of a group
  router.get(
    "/group/:groupId/user",
    assertRule("list_group_users", "Group", req => req.params.groupId),
    (req, res, next) => {
      const { groupId } = req.params;

      GroupMember.find({ groupId, deletedAt: { $eq: null } })
        .populate("userId")
        .then(users => res.json(users))
        .catch(next);
    }
  );

  // list all groups of a user
  router.get(
    "/user/:userId/group",
    assertRule("list_user_groups", "User", req => req.params.userId),
    (req, res, next) => {
      const { userId } = req.params;

      GroupMember.find({ userId, deletedAt: { $eq: null } })
        .populate("groupId")
        .then(groups => res.json(groups))
        .catch(next);
    }
  );
};
