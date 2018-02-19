const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "Label",
  new Schema({
    txt: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
