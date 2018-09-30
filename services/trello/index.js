const Trello = require('node-trello');
const { config, constants } = require('../../config');
const { updateUser } = require('../../utils');
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
        updateUser(null, this.chatId, null, { [constants.lists[index].key]: list.id });
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

  importIssues (user) {
    getIssues(user.githubUser, user.githubRepo)
    .then(doc => {
      console.log(doc);
      doc.forEach(issue => {
        this.addCard(user.backlogId, issue.title, '');
      });
    })
    .catch(err => {
      console.log(err);
    });
  }
};