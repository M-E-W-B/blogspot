const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "Blog",
  new Schema({
    subdomain: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
