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
        "create",
        "update",
        "delete",
        "update_blog_status",
        "read",
        // "read_full",
        // "list_blog_posts",
        "list_user_blogs",
        "group_add_user",
        "group_remove_user",
        "list_user_groups",
        "list_group_users",
        "publish_post",
        "post_add_label",
        "post_remove_label",
        // "list_post_labels",
        // "list_post_comments",
        "post_publish",
        "user_feed",
        "user_follow_blog",
        "user_unfollow_blog",
        "list_user_follow_blogs",
        "*"
      ]
    },
    modelname: String,
    accessType: {
      type: String,
      enum: ["owner", "group", "user"]
    },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
