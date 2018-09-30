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
    github: process.env.GITHUB_API_KEY
  },
};

const returnMenu = ` You can see the menu with the next command:
/setup - Show the menu`;

exports.constants = {
  states: {
    setup: { 
      state: '/setup', 
      msg: `You can control me by sending these commands:
    *Your info*
    /viewconfig - Show config saved.

    *Trello*
    /setuptrello - Setup trello access token.
    /gtrello - Generate dashboard and lists.
  
    *GitHub*
    /setgithub - Setup github username.
    /setrepo - Setup github repository name.
    /getissues - Get all the respository issues.
    /importissues - Import all the repository issues to trello.
    /getcontributors - Get contributors and import to trello.`,
    },
    setUpTrello: { 
      state: '/setuptrello', 
      msg: 'Enter your trello token, if you do not already have one [click here](https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=f539c73a53faa0ab15abd442925f56e0).',
      res: `Token save was completed correctly, you can generate dashboard and list with the next command:
      /gtrello - Generate dashboard and lists.`,
      err: `Trello access token not found, that's can setup with the next command:
      /setuptrello - Setup trello access token.`
    },
    gTrello: {
      state: '/gtrello',
      msg: 'Enter the dashboard name:',
      res: 'Dashboard and lists was generated correctly.' + returnMenu
    },
    viewConfig: { 
      state: '/viewconfig',
    },
    setGithub: { 
      state: '/setgithub', 
      msg: 'Enter your github username:',
      res:  'User save save was completed correctly.' + returnMenu,
      err: 'Username not found, please retype.' + returnMenu
    },
    setRepo: { 
      state: '/setrepo',
      msg: 'Enter the repository name:',
      res: `Repository save was completed correctly, you can see all the repository issues with the next command:
      /getissues - Get all the respository issues.`,
      err: 'Repository not found, please retype.' + returnMenu
    },
    getIssues: { 
      state: '/getissues', 
      msg: '',
      res: `You can import this issues with the next command:
      /importissues - Import all the repository issues to trello.`,
      err: `This repository not have open issues, you can change the repository with the next command:
      /importissues - Import all the repository issues to trello.`,
    },
    importIssues: { 
      state: '/importissues', 
      msg: 'Enter the repository name:',
      res: 'Import was completed correctly.' + returnMenu,
      err: 'You need to setup the accounts.' + returnMenu
    },
  },
  lists: [
    {key: 'backlogId', name: 'Backlog'},
    {key: 'todoId', name: 'To do'},
    {key: 'doneId', name: 'Done'},
  ],
  notFoundMsg: 'Action not found.' + returnMenu,
  errorMsg: 'Ooops, something went wrong.' + returnMenu,
};