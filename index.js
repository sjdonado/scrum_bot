const TelegramBot = require('node-telegram-bot-api');

const { config, constants } = require('./config');
const database = require('./db/database');
const { TrelloApi } = require('./services/trello');
const { showIssues, verifyRepo, verifyUser } = require('./services/github');
const { createOrUpdate, get, create, update } = require('./users/controller');
const { showConfigList } = require('./utils');

database.connect();
const bot = new TelegramBot(config.bots.telegram, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  get(chatId)
    .then(user => user ? user : create({chatId, state: constants.states.initial.state }))
    .then(user => {
      if(msg.text.split("")[0] == '/' && user.state != constants.states.initial.state){
        update({ chatId, state: constants.states.initial.state });
        return Object.assign(user, 
          { state: constants.states.initial.state });
      }
      return user;
    })
    .then(user => {
      switch (msg.text) {
        case constants.states.setup.state: {
          createOrUpdate(bot, chatId, constants.states.setup.msg, { state: constants.states.initial.state });
          break;
        }
        case constants.states.setUpTrello.state: {
          createOrUpdate(bot, chatId, constants.states.setUpTrello.msg, { state: constants.states.setUpTrello.state });
          break;
        }
        case constants.states.newBoard.state: {
          createOrUpdate(bot, chatId, constants.states.newBoard.msg, { state: constants.states.newBoard.state });
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
        case constants.states.setBoard.state: {
          createOrUpdate(bot, chatId, constants.states.setBoard.msg, { state: constants.states.setBoard.state });
          break;
        }
        default: {
          const state = user.state;
          // console.log('user', user);
          switch (state) {
            case constants.states.initial.state: {
              switch(msg.text){
                case constants.states.getIssues.state: {
                  if(user.githubUser){
                    showIssues(bot, chatId, user.githubUser, user.githubRepo);
                  }else{
                    bot.sendMessage(chatId, constants.states.setGithub.err, { parse_mode: 'markdown' });
                  }
                  break;
                }
                case constants.states.importIssues.state: {
                  if(user.githubUser && user.trelloApiToken && user.idBoard && user.idBacklog) {
                    let trelloApi = new TrelloApi(user.chatId, user.trelloApiToken);
                    trelloApi.importIssues(bot, user);
                  }else{
                    bot.sendMessage(chatId, constants.states.importIssues.err, { parse_mode: 'markdown' });
                  }
                  break;
                }
                case constants.states.viewConfig.state: {
                  createOrUpdate(bot, chatId, showConfigList(user, constants.returnMenu), {state: constants.states.initial.state });
                  break;
                }
                case constants.states.importContributors.state: {
                  if(user.githubUser && user.trelloApiToken && user.idBoard) {
                    let trelloApi = new TrelloApi(user.chatId, user.trelloApiToken);
                    trelloApi.importContributors(bot, user);
                  }else{
                    bot.sendMessage(chatId, constants.states.importContributors.err, { parse_mode: 'markdown' });
                  }
                  break;
                }
                case constants.states.gLists.state: {
                  if(user.trelloApiToken && user.idBoard) {
                    let trelloApi = new TrelloApi(user.chatId, user.trelloApiToken);
                    trelloApi.generateLists(bot, chatId, user.idBoard);
                  }else{
                    bot.sendMessage(chatId, constants.states.gLists.err, { parse_mode: 'markdown' });
                  }
                  break;
                }
                default: {
                  bot.sendMessage(chatId, constants.notFoundMsg, { parse_mode: 'markdown' });
                  break;
                }
              }
              break;
            }
            case constants.states.setUpTrello.state: {
              let trelloApi = new TrelloApi(chatId, msg.text);
              trelloApi.setTrelloToken(bot, chatId, msg.text);
              break;
            }
            case constants.states.newBoard.state: {
              if(user.trelloApiToken){
                let trelloApi = new TrelloApi(chatId, user.trelloApiToken);
                trelloApi.generateNewBoard(msg.text);
                createOrUpdate(bot, chatId, constants.states.newBoard.res, {state: constants.states.initial.state });
              }else{
                bot.sendMessage(chatId, constants.states.newBoard.err, { parse_mode: 'markdown' });
              }
              break;
            }
            case constants.states.setGithub.state: {
              verifyUser(bot, chatId, msg.text);
              // createOrUpdate(bot, chatId, constants.states.setGithub.res, 
              //   {githubUser: msg.text, state: constants.states.initial.state });
              break;
            }
            case constants.states.setRepo.state: {
              if(user.githubUser) {
                verifyRepo(bot, user.chatId, user.githubUser, msg.text);
              }else{
                bot.sendMessage(user.chatId, constants.states.setGithub.err, { parse_mode: 'markdown' });
              }
              break;
            }
            case constants.states.setBoard.state: {
              let trelloApi = new TrelloApi(chatId, user.trelloApiToken);
              trelloApi.verifyBoard(bot, chatId, user.trelloId, msg.text);
              break;
            }
            default: {
              bot.sendMessage(chatId, constants.notFoundMsg, { parse_mode: 'markdown' });
            }
          }
        }
      }
    })
    .catch(err => {
      console.log(err);
      // createOrUpdate(bot, chatId, constants.states.setup.msg, { state: constants.states.initial.state });
      bot.sendMessage(chatId, constants.errorMsg, { parse_mode: 'markdown' });
    });
});
