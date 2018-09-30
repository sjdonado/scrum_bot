const {
  Model,
} = require('./model');

exports.createOrUpdate = body => 
  Model.updateOne({ chatId: body.chatId }, body, { upsert: true } );

exports.get = chatId =>
  Model.findOne({chatId});
