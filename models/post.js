const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  photo: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    max: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Post", postSchema);
