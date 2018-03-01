const mongoose = require("mongoose");
const { isFunction } = require("lodash");
const { ObjectId } = mongoose.Types;
const { Rule, GroupMember } = require("../models");

module.exports = (operation, modelname, rowResolver) => {
  return async function(req, res, next) {
    const userId = req.decoded._id;
    const groupMembers = await GroupMember.find({ userId });
    const groupIds = groupMembers.map(gm => gm.groupId);

    const conditions = [
      { accessType: "group", groupId: { $in: groupIds } },
      { accessType: "user", userId }
    ];

    if (isFunction(rowResolver)) {
      const _id = rowResolver(req);
      const Model = mongoose.model(modelname);
      const results = await Model.find({ _id, owner: userId });
      results.length && conditions.push({ accessType: "owner" });
    }

    const rules = await Rule.find({
      operation: { $in: [operation, "*"] },
      modelname,
      $or: conditions
    });

    // console.log(userId);
    // console.log(groupIds);
    // console.log(rules);

    if (rules.length) next();
    else next(new Error("Unauthorized Access"));
  };
};
