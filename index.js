const TelegramBot = require('node-telegram-bot-api');

const { config, constants } = require('./config');
const database = require('./db/database');
const { updateUser, getUser } = require('./utils');
const { TrelloApi } = require('./services/trello');
const { showIssues } = require('./services/github');

database.connect();
const bot = new TelegramBot(config.bots.telegram, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  switch (msg.text) {
    case constants.states.setup.state: {
      updateUser(bot, chatId, constants.states.setup.msg, { state: constants.states.setup.state });
      break;
    }
    case constants.states.setUpTrello.state: {
      updateUser(bot, chatId, constants.states.setUpTrello.msg, { state: constants.states.setUpTrello.state });
      break;
    }
    case constants.states.gTrello.state: {
      updateUser(bot, chatId, constants.states.gTrello.msg, { state: constants.states.gTrello.state });
      break;
    }
    case constants.states.setGithub.state: {
      updateUser(bot, chatId, constants.states.setGithub.msg, { state: constants.states.setGithub.state });
      break;
    }
    case constants.states.getIssues.state: {
      updateUser(bot, chatId, constants.states.getIssues.msg, { state: constants.states.getIssues.state });
      break;
    }
    // case constants.states.viewTrello.state: {
    //   getUser(chatId)
    //   .then(doc => {
    //     bot.sendMessage(chatId, `Tu trello token es: ${doc.trelloApiToken}`, { parse_mode: 'markdown' });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     bot.sendMessage(chatId, config.errorMsg, { parse_mode: 'markdown' });
    //   });
    //   break;
    // }
    default: {
      getUser(chatId)
        .then(doc => {
          if (doc) {
            const state = doc.state;
            console.log('user', doc);
            switch (state) {
              case constants.states.setup.state: {
                bot.sendMessage(chatId,config.errorMsg, { parse_mode: 'markdown' });
                break;
              }
              case constants.states.setUpTrello.state: {
                updateUser(bot, chatId, constants.states.setUpTrello.res, 
                  { state: constants.states.setup.state, trelloApiToken: msg.text });
                break;
              }
              case constants.states.gTrello.state: {
                if(doc.trelloApiToken){
                  let trelloApi = new TrelloApi(chatId, doc.trelloApiToken);
                  trelloApi.generateBoardAndLists(msg.text);
                  updateUser(bot, chatId, constants.states.gTrello.res, {state: constants.states.setup.state });
                }else{
                  bot.sendMessage(chatId, constants.states.setUpTrello.err, { parse_mode: 'markdown' });
                }
                break;
              }
              case constants.states.setGithub.state: {
                updateUser(bot, chatId, constants.states.setGithub.res, 
                  {githubUser: msg.text, state: constants.states.setup.state });
                break;
              }
              case constants.states.getIssues.state: {
                if(doc.githubUser){
                  showIssues(bot, chatId, doc.githubUser, msg.text);
                }else{
                  bot.sendMessage(chatId, constants.states.setGithub.err, { parse_mode: 'markdown' });
                }
                break;
              }
              case constants.states.importIssues.state: {
                if(msg.text == 'y' || msg.text == 'Y' && doc.githubUser && doc.trelloApiToken && doc.backlogId) {
                  let trelloApi = new TrelloApi(doc.chatId, doc.trelloApiToken);
                  trelloApi.importIssues(doc);
                  updateUser(bot, chatId, constants.states.importIssues.res, 
                    {state: constants.states.setup.state });
                }else{
                  bot.sendMessage(chatId,config.errorMsg, { parse_mode: 'markdown' });
                }
                break;
              }
              default: {
                bot.sendMessage(chatId,config.errorMsg, { parse_mode: 'markdown' });
              }
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
