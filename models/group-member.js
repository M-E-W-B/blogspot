const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
// @NOTE: No Owner in here
module.exports = mongoose.model(
  "GroupMember",
  new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date, default: null },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
