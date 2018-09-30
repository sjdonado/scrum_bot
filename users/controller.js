const {
  Model,
} = require('./model');

const { constants } = require('./../config/');

exports.createOrUpdate = (bot, chatId, responseMsg, body = {}) => {
    Object.assign(body, {chatId});
    Model.updateOne({ chatId: body.chatId }, body, { upsert: true } )
      .then(doc => {
        console.log(doc);
        if(bot && responseMsg) bot.sendMessage(chatId, responseMsg, { parse_mode: 'markdown' });
      })
      .catch(err => {
        console.log(err);
        if(bot) bot.sendMessage(chatId, constants.errorMsg, { parse_mode: 'markdown' });
      });
};

exports.create = body =>
  Model.create(body);

exports.findOneAndUpdate = body =>
  Model.findOneAndUpdate({ chatId: body.chatId }, body);

exports.update = body =>
  Model.update({ chatId: body.chatId }, body);

exports.get = chatId =>
  Model.findOne({chatId});
