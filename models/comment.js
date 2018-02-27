const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
// @NOTE: Owner of a Comment is the user who created it
module.exports = mongoose.model(
  "Comment",
  new Schema({
    txt: { type: String, required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
