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
    trim: true,
  },
  trelloId: {
    type: String,
    trim: true,
  },
  githubUser: {
    type: String,
    trim: true,
  },
  githubRepo: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
  },
  idBoard: {
    type: String,
    trim: true,
  },
  boardName: {
    type: String,
    trim: true,
  },
  idBacklog: {
    type: String,
    trim: true,
  },
  idTodo: {
    type: String,
    trim: true,
  },
  idDone: {
    type: String,
    trim: true,
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
