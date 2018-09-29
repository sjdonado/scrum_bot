const TelegramBot = require('node-telegram-bot-api');

const config = require('./config');
const database = require('./database');
const { updateUser } = require('./utils');
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
    case config.states[0]: {
      const responseMsg =
        ` Welcome ${msg.from.first_name}, You can control me by sending these commands:
        *Trello*
        ${config.states[1]} - Set trello account
        *GitHub*
        /setgithub - Set trello account
        `;
      updateUser(bot, chatId, responseMsg, { state: config.states[0] });
      break;
    }
    case config.states[1]: {
      // const apiTrello = new ApiTrello();
      const responseMsg = 'Works!';
      updateUser(bot, chatId, responseMsg, { state: config.states[1] });
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
    case config.states[2]: {
      // const apiTrello = new ApiTrello();
      const responseMsg = 'Works!';
      updateUser(bot, chatId, responseMsg, { state: config.states[2] });
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
      console.log('default');
    }
  }

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
});
