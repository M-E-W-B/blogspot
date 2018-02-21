const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
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
