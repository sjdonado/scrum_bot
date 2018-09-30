const config = require('./../config/');
const usersController = require('../users/controller');

exports.updateUser = (bot, chatId, responseMsg, body = {}) => {
  Object.assign(body, {chatId});
  usersController.createOrUpdate(body)
    .then(doc => {
      console.log(doc);
      if(bot && responseMsg) bot.sendMessage(chatId, responseMsg, { parse_mode: 'markdown' });
    })
    .catch(err => {
      console.log(err);
      if(bot) bot.sendMessage(chatId, config.errorMsg, { parse_mode: 'markdown' });
    });
};

exports.getUser = chatId => usersController.get(chatId);
