const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// @NOTE: Owner of a Blog is the user who created it
const blogSchema = new Schema({
  subdomain: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date, default: null },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

blogSchema.index(
  {
    name: "text",
    description: "text"
  },
  { weights: { name: 3, description: 1 } }
);

// set up a mongoose model
module.exports = mongoose.model("Blog", blogSchema);
