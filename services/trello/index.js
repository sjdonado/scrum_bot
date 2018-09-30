const Trello = require('node-trello');
const { config, constants } = require('../../config');
const { createOrUpdate } = require('../../users/controller');
const { getIssues, getContributors } = require('../github');

exports.TrelloApi = class TrelloApi {
  constructor(chatId, token) {
    this.chatId = chatId;
    this.trello = new Trello(config.apis.trello, token);
  }
  
  setTrelloToken(bot, chatId, token) {
    this.get('/1/members/me')
      .then(doc => {
        console.log(doc);
        createOrUpdate(bot, chatId, constants.states.setUpTrello.res, 
          { state: constants.states.initial.state, trelloId: doc.id, trelloApiToken: token });
        createOrUpdate(null, this.chatId, null, {  });
      })
      .catch(err => {
        console.log(err);
      });
  }

  verifyBoard(bot, chatId, trelloId, name) {
    this.get(`/1/members/${trelloId}/boards`)
      .then(boards => {
        const boardsNames = boards.map(board => board.name);
        if(boardsNames.includes(name.toLowerCase())){
          boards.forEach(board => {
            if(board.name == name) {
              createOrUpdate(bot, chatId, constants.states.setBoard.res, 
                { state: constants.states.initial.state, idBoard: board.id, boardName: board.name });
              return;
            }
          });
        }else{
          bot.sendMessage(chatId, constants.states.setBoard.err, { parse_mode: 'markdown' });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  generateNewBoard (name) {
    this.post('/1/boards/', { name })
      .then(doc => {
        console.log(doc);
        createOrUpdate(null, this.chatId, null, { idBoard: doc.id, boardName: name });
        // this.generateLists(doc.id);
      })
      .catch(err => {
        console.log(err);
      });
  }

  generateLists(bot, idBoard) {
    let promises = [];
    constants.lists.forEach(list => {
      promises.push(this.post(`/1/lists`, { name: list.name, idBoard }));
    });
    Promise.all(promises).then(values => {
      console.log(values);
      values.forEach((value, index) => {
        createOrUpdate(bot, this.chatId, `${value.name} list was generated correctly.`, 
        { [constants.lists[index].key]: value.id, state: constants.states.initial.state });
      });
    });
  }

  addCard(idList, name, opts = {}) {
    let data = { idList, name };
    Object.assign(data, opts);
    return this.post('/1/cards/', data);
  }

  getListCards(idList, callback) {
    this.get(`/1/lists/${idList}/cards`)
      .then(doc => {
        console.log(doc);
        callback(doc);
      })
      .catch(err => {
        console.log(err);
      });
  }

  importIssues (bot, user) {
    this.getListCards(user.idBacklog, cards => {
      getIssues(user.githubUser, user.githubRepo)
      .then(issues => {
          const cardsNames = cards.map(card => card.name);
          let promises = [];
          issues.forEach(issue => {
            if(!cardsNames.includes(issue.name)) 
              promises.push(this.addCard(user.backlogId, issue.title, { urlSource:issue.url }));
          });
          Promise.all(promises).then(values => {
            console.log(values);
            values.forEach(value => {
              createOrUpdate(bot, this.chatId, `${value.name} issue was imported correctly.`, 
                { state: constants.states.initial.state });
            });
          })
          .then(() => {
            bot.sendMessage(user.chatId, constants.states.importIssues.res, { parse_mode: 'markdown' });
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
              this.post('/1/lists/', { name: 'Contributors', idBoard: user.idBoard })
                .then(doc => {
                  console.log(doc);
                  let promises = [];
                  users.forEach(user => {
                    promises.push(this.addCard(doc.id, user.login, {urlSource: user.avatar_url}));
                  Promise.all(promises).then(values => {
                    console.log(values);
                    values.forEach(value => {
                      createOrUpdate(bot, this.chatId, `${value.name} user was imported correctly.`, 
                        { state: constants.states.initial.state });
                    });
                  })
                  .then(() => {
                    bot.sendMessage(user.chatId, constants.states.importContributors.res, { parse_mode: 'markdown' });
                  });
                })
                .catch(err => {
                  console.log(err);
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
  
  get(path) {
    return new Promise((resolve, reject) => {
      this.trello.get(path, (err, doc) => {
        if(err) reject(err);
        resolve(doc);
      });
    });
  }

  post(path, body) {
    return new Promise((resolve, reject) => {
      this.trello.post(path, body, (err, doc) => {
        if(err) reject(err);
        resolve(doc);
      });
    });
  }

  put(path, body) {
    return new Promise((resolve, reject) => {
      this.trello.put(path, body, (err, doc) => {
        if(err) reject(err);
        resolve(doc);
      });
    });
  }
};
