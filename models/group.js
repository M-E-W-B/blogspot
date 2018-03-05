const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
// @NOTE: Owner of a group is the one who created it
module.exports = mongoose.model(
  "Group",
  new Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
