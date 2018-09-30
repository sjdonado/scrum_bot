const Trello = require('node-trello');
const { config, constants } = require('../../config');
const { createOrUpdate } = require('../../users/controller');
const { getIssues } = require('../github');

exports.TrelloApi = class TrelloApi {
  constructor(chatId, token) {
    this.chatId = chatId;
    this.trello = new Trello(config.apis.trello, token);
  }

  generateBoardAndLists (name) {
    this.trello.post('/1/boards/', { name }, (err, doc) => {
      if (err) throw err;
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

  addCard(idList, name, desc) {
    this.trello.post('/1/cards/', { idList, name, desc }, (err, doc) => {
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
            if(!cardsNames.includes(issue.name)) this.addCard(user.backlogId, issue.title, '');
          });
      })
      .catch(err => {
        console.log(err);
        bot.sendMessage(user.chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
      });
    });
  }
};