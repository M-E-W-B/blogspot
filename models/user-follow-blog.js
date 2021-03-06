const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
// `user` follows `blog`
module.exports = mongoose.model(
  "UserBlog",
  new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true
    },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
