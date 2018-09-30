const TelegramBot = require('node-telegram-bot-api');

const { config, constants } = require('./config');
const database = require('./db/database');
const { TrelloApi } = require('./services/trello');
const { showIssues, verifyRepo } = require('./services/github');
const { createOrUpdate, get } = require('./users/controller');

database.connect();
const bot = new TelegramBot(config.bots.telegram, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  switch (msg.text) {
    case constants.states.setup.state: {
      createOrUpdate(bot, chatId, constants.states.setup.msg, { state: constants.states.setup.state });
      break;
    }
    case constants.states.setUpTrello.state: {
      createOrUpdate(bot, chatId, constants.states.setUpTrello.msg, { state: constants.states.setUpTrello.state });
      break;
    }
    case constants.states.gTrello.state: {
      createOrUpdate(bot, chatId, constants.states.gTrello.msg, { state: constants.states.gTrello.state });
      break;
    }
    case constants.states.setGithub.state: {
      createOrUpdate(bot, chatId, constants.states.setGithub.msg, { state: constants.states.setGithub.state });
      break;
    }
    case constants.states.setRepo.state: {
      createOrUpdate(bot, chatId, constants.states.setRepo.msg, { state: constants.states.setRepo.state });
      break;
    }
    case constants.states.getIssues.state: {
      get(chatId)
        .then(doc => {
          if(doc.githubUser){
            showIssues(bot, chatId, doc.githubUser, doc.githubRepo);
          }else{
            bot.sendMessage(chatId, constants.states.setGithub.err, { parse_mode: 'markdown' });
          }
        })
        .catch(err => {
          console.log(err);
          bot.sendMessage(chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
        });
      break;
    }
    case constants.states.importIssues.state: {
      get(chatId)
        .then(doc => {
          if(doc.githubUser && doc.trelloApiToken && doc.backlogId) {
            let trelloApi = new TrelloApi(doc.chatId, doc.trelloApiToken);
            trelloApi.importIssues(bot, doc, msg.text);
            createOrUpdate(bot, chatId, constants.states.importIssues.res, 
              {state: constants.states.setup.state });
          }else{
            bot.sendMessage(chatId, constants.notFoundMsg, { parse_mode: 'markdown' });
          }
        })
        .catch(err => {
          console.log(err);
          bot.sendMessage(chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
        });
      break;
    }
    default: {
      get(chatId)
        .then(doc => {
          if (doc) {
            const state = doc.state;
            console.log('user', doc);
            switch (state) {
              case constants.states.setup.state: {
                bot.sendMessage(chatId, constants.notFoundMsg, { parse_mode: 'markdown' });
                break;
              }
              case constants.states.setUpTrello.state: {
                createOrUpdate(bot, chatId, constants.states.setUpTrello.res, 
                  { state: constants.states.setup.state, trelloApiToken: msg.text });
                break;
              }
              case constants.states.gTrello.state: {
                if(doc.trelloApiToken){
                  let trelloApi = new TrelloApi(chatId, doc.trelloApiToken);
                  trelloApi.generateBoardAndLists(msg.text);
                  createOrUpdate(bot, chatId, constants.states.gTrello.res, {state: constants.states.setup.state });
                }else{
                  bot.sendMessage(chatId, constants.states.setUpTrello.err, { parse_mode: 'markdown' });
                }
                break;
              }
              case constants.states.setGithub.state: {
                createOrUpdate(bot, chatId, constants.states.setGithub.res, 
                  {githubUser: msg.text, state: constants.states.setup.state });
                break;
              }
              case constants.states.setRepo.state: {
                if(doc.githubUser) {
                  verifyRepo(bot, doc.chatId, doc.githubUser, msg.text);
                }else{
                  bot.sendMessage(doc.chatId, constants.states.setGithub.err, { parse_mode: 'markdown' });
                }
                break;
              }
              case constants.states.getIssues.state: {

                break;
              }
              default: {
                bot.sendMessage(chatId, constants.notFoundMsg, { parse_mode: 'markdown' });
              }
            }
          }else {
            createOrUpdate(bot, chatId, constants.states.setup.msg, { state: constants.states.setup.state });
          }
        })
        .catch(err => {
          console.log(err);
          bot.sendMessage(chatId, constants.errorMsg, { parse_mode: 'markdown' });
        });
    }
  }

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
});
