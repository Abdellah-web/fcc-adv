const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    required: true
  },
  updated_on: {
    type: Date,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  open: {
    type: Boolean,
    required: true,
    default: true
  },
  status_text: {
    type: String
  }
})

module.exports = mongoose.model('issueModel', issueSchema);