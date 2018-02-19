const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "UserBlog",
  new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
    type: {
      type: String,
      enum: ["OWNER", "FOLLOWER"]
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
l;
