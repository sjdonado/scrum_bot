const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const fields = {
  chatId: {
    type: Number,
    required: true,
  },
  trelloApiToken: {
    type: String,
  },
  githubUser: {
    type: String,
  },
  githubRepo: {
    type: String,
  },
  state: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
  },
  backlogId: {
    type: String,
  },
  todoId: {
    type: String,
  },
  doneId: {
    type: String,
  },
};

const user = new Schema(fields, {
  timestamps: true,
});

user.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  return doc;
};

module.exports = {
  Model: mongoose.model('user', user),
};
