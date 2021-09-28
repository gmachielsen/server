const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema({
      image: {},
      video: {},
      title: {
          type: String,
          required: false,
      },
      text: {
          type: String,
          required: false,
      },
      published: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cover", coverSchema)
