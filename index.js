const TelegramBot = require('node-telegram-bot-api');

const { config, constants } = require('./config');
const database = require('./database');
const { updateUser, getState } = require('./utils');
// const { ApiTrello } = require('./services/trello/index') ;

database.connect();
const bot = new TelegramBot(config.bots.telegram, { polling: true });

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message
//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  console.log(msg, chatId);

  switch (msg.text) {
    case constants.states[0].state: {
      updateUser(bot, chatId, constants.states[0].msg, { state: constants.states[0].state });
      break;
    }
    case constants.states[1].state: {
      // const apiTrello = new ApiTrello();
      updateUser(bot, chatId, constants.states[1].msg, { state: constants.states[1].state });
      // const responseMsg =
      // ` Welcome ${msg.from.first_name}, You can control me by sending these commands:
      // *Trello*
      // /settrello - Set trello account
      // *GitHub*
      // /setgithub - Set trello account
      // `; 
      // bot.sendMessage(chatId, responseMsg, { parse_mode: 'markdown' });
      break;
    }
    case constants.states[2].state: {
      // const apiTrello = new ApiTrello();
      updateUser(bot, chatId, constants.states[2].msg, { state: constants.states[2].state });
      // const responseMsg =
      // ` Welcome ${msg.from.first_name}, You can control me by sending these commands:
      // *Trello*
      // /settrello - Set trello account
      // *GitHub*
      // /setgithub - Set trello account
      // `; 
      // bot.sendMessage(chatId, responseMsg, { parse_mode: 'markdown' });
      break;
    }
    default: {
      getState(chatId)
        .then(doc => {
          const state = doc.state;
          console.log(state);
          switch (state) {
            case constants.states[0].state: {
              updateUser(bot, chatId, constants.states[0].msg);
              break;
            }
            case constants.states[1].state: {
              updateUser(bot, chatId, constants.states[1].res, { state: constants.states[0].state });
              break;
            }
            case constants.states[2].state: {
              updateUser(bot, chatId, constants.states[2].res, { state: constants.states[0].state });
              break;
            }
            default: {
              console.log('default');
            }
          }
        })
        .catch(err => {
          console.log(err);
          bot.sendMessage(chatId, config.errorMsg, { parse_mode: 'markdown' });
        });
    }
  }

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
});
