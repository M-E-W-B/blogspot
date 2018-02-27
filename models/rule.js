const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
// @NOTE: No Owner in here
module.exports = mongoose.model(
  "Rule",
  new Schema({
    description: String,
    operation: {
      type: String,
      enum: [
        "CREATE",
        "READ",
        "UPDATE",
        "DELETE",
        "LIST",
        "LIST_USER_GROUPS",
        "LIST_GROUP_USERS",
        "USER_FEED",
        "FOLLOW_BLOG",
        "UNFOLLOW_BLOG",
        "LIST_FOLLOW_BLOG",
        "*"
      ]
    },
    modelname: String,
    accessType: {
      type: String,
      enum: ["OWNER", "GROUP", "USER"]
    },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
  })
);
