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
  githubApiToken: {
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
