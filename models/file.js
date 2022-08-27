const mongoose = require('mongoose');

const fileschema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },

  filename: {
    type: String,
    required: true,
    trim: true,
  },
  filelink: {
    type: String,
    required: true,
    trim: true,
  },
  records: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const fileTable = new mongoose.model('file', fileschema);
module.exports = fileTable;
