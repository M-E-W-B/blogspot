const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// @NOTE: Owner of a Post is the user who created it
const postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  status: {
    type: String,
    enum: ["drafted", "published"],
    required: true
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date, default: null },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

postSchema.index(
  {
    title: "text",
    body: "text"
  },
  { weights: { title: 3, body: 1 } }
);

// set up a mongoose model
module.exports = mongoose.model("Post", postSchema);
