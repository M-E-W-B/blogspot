const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema({
  txt: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

labelSchema.index({
  txt: "text"
});

// set up a mongoose model
module.exports = mongoose.model("Label", labelSchema);
