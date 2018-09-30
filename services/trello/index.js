const Trello = require('node-trello');
const { config, constants } = require('../../config');
const { createOrUpdate } = require('../../users/controller');
const { getIssues, getContributors } = require('../github');

exports.TrelloApi = class TrelloApi {
  constructor(chatId, token) {
    this.chatId = chatId;
    this.trello = new Trello(config.apis.trello, token);
  }

  generateBoardAndLists (name) {
    this.trello.post('/1/boards/', { name }, (err, doc) => {
      if (err) throw err;
      createOrUpdate(null, this.chatId, null, { idBoard: doc.id });
      this.generateLists(doc.id);
    });
  }

  generateLists(idBoard) {
    this.trello.get(`/1/boards/${idBoard}/lists`, (err, doc) => {
      if (err) throw err;
      console.log(doc);
      doc.forEach((list, index) => {
        createOrUpdate(null, this.chatId, null, { [constants.lists[index].key]: list.id });
        this.trello.put(`/1/lists/${list.id}`, { name: constants.lists[index].name}, (err, doc) => {
          if (err) throw err;
          console.log(doc);
        });
      });
    });
  }

  addCard(idList, name, opts = {}) {
    let data = { idList, name };
    Object.assign(data, opts);
    this.trello.post('/1/cards/', data, (err, doc) => {
      if (err) throw err;
      console.log(doc);
    });
  }

  getListCards(idList, callback) {
    this.trello.get(`/1/lists/${idList}/cards`, (err, doc) => {
      if (err) throw err;
      callback(doc);
    });
  }

  importIssues (bot, user, repo) {
    this.getListCards(user.backlogId, cards => {
      getIssues(user.githubUser, repo)
      .then(issues => {
          const cardsNames = cards.map(card => card.name);
          issues.forEach(issue => {
            if(!cardsNames.includes(issue.name)) this.addCard(user.backlogId, issue.title);
          });
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(user.chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
      });
    });
  }

  importContributors (bot, user){
    getContributors(bot, user.chatId, user.githubUser, user.githubRepo)
      .then(res => {
        if(res.status == 200) {
          res.json()
            .then(users => {
              this.trello.post('/1/lists/', { name: 'Contributors', idBoard: user.idBoard }, (err, doc) => {
                if (err) throw err;
                users.forEach(user => {
                  this.addCard(doc.id, user.login, {urlSource: user.avatar_url});
                });
                bot.sendMessage(user.chatId, 'All rignt :)', { parse_mode: 'markdown' });
              });
            })
            .catch(res => {
              console.log(res);
              bot.sendMessage(user.chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
            });
        }
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(user.chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
      });
  }
};