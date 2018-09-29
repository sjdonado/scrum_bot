require('dotenv').config();

exports.config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  bots: {
    telegram: process.env.TELEGRAM_BOT_TOKEN,
  },
  apis: {
    trello: process.env.TRELLO_API_KEY,
  },
};

exports.constants = {
  states: [
    { 
      state: '/setup', 
      msg: `You can control me by sending these commands:
    *Trello*
    '/settrello' - Set trello account
    *GitHub*
    '/setgithub' - Set trello account`,
      res: ''
    },
    { 
      state: '/settrello', 
      msg: 'trello',
      res: 'Saved'
    },
    { 
      state: '/setgithub', 
      msg: 'github',
      res: 'Saved'
    },
  ],
  errorMsg: 'Try again :('
};