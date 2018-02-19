const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model(
  "User",
  new Schema({
    name: { type: String, required: true },
    about: { type: String },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /\S+@\S+\.\S+/.test(v);
        }
      }
    },
    website: {
      type: String,
      validate: function(v) {
        return /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(
          v
        );
      }
    },
    image: { type: String },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"]
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  })
);
