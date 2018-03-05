const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

// @NOTE: Owner of a user is the user itself
const userSchema = new Schema({
  name: { type: String, required: true },
  about: { type: String },
  password: {
    type: String,
    required: true
  },
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
    enum: ["male", "female"]
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date, default: null },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

userSchema.post("validate", function(doc, next) {
  doc.owner = doc._id;
  next();
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// set up a mongoose model
module.exports = mongoose.model("User", userSchema);
