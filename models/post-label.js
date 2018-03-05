const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "LabelPost",
  new Schema({
    labelId: {
      type: Schema.Types.ObjectId,
      ref: "Label",
      required: true
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
