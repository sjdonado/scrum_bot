const database = require('./database');
database.connect();

const { Model } = require('../users/model');

Model.remove()
  .then((data) => {
    console.log(data);
    database.disconnect();
  })
  .catch((err) => {
    console.log(err);
  });