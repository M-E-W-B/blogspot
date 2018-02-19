const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "LabelPost",
  new Schema({
    labelId: { type: Schema.Types.ObjectId, ref: "Label" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
