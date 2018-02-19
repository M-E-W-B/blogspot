const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "Post",
  new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["DRAFTED", "PUBLISHED"]
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
