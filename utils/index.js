const config = require('./../config/');
const usersController = require('../users/controller');

exports.updateUser = (bot, chatId, responseMsg, body = {}) => {
  Object.assign(body, {chatId});
  usersController.createOrUpdate(body)
    .then(doc => {
      console.log(doc);
      bot.sendMessage(chatId, responseMsg, { parse_mode: 'markdown' });
    })
    .catch(err => {
      console.log(err);
      bot.sendMessage(chatId, config.errorMsg, { parse_mode: 'markdown' });
    });
};

exports.getState = chatId => usersController.get(chatId);