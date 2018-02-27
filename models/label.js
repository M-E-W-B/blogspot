const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// @NOTE: Owner of a Label is the user who created it
const labelSchema = new Schema({
  txt: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

labelSchema.index({
  txt: "text"
});

// set up a mongoose model
module.exports = mongoose.model("Label", labelSchema);
