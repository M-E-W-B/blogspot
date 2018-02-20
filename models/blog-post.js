const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "BlogPost",
  new Schema({
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
