require('dotenv').config();

const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  bots: {
    telegram: process.env.TELEGRAM_BOT_TOKEN,
  },
  apis: {
    trello: process.env.TRELLO_API_KEY,
  },
  states: [
    '/setup',
    '/settrello',
    '/setgithub'
  ],
  errorMsg: 'Try again :('
};

module.exports = config;
