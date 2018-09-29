const Trello = require('node-trello');
const config = require('../../config');

module.exports.ApiTrello = class ApiTrello {
  constructor(token) {
    this.trello = new Trello(config.apis.trello, token);
  }

  getInfo () {
    this.trello.get('/1/members/me', function(err, data) {
      if (err) throw err;
      console.log(data);
    });
  }

  example() {
    this.trello.get('/1/members/me', { cards: 'open' }, function(err, data) {
      if (err) throw err;
      console.log(data);
    });
  }
};