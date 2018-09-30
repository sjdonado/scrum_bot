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

const returnMenu = 
` You can see the menu with the next command:
/setup - Show the menu`;

const menuMsg = 
`You can control me by sending these commands:
*Your info*
/viewconfig - Show config saved.

*Trello*
/setuptrello - Setup trello access token.
/setboard - Setup trello dashboard.
/newboard - Generate new trello dashboard.
/glists - Generate scrum lists.

*GitHub*
/setgithub - Setup github username.
/setrepo - Setup github repository name.
/getissues - Get all the respository issues.
/importissues - Import all the repository issues to trello.
/importcontributors - Get contributors and import to trello.`;

exports.constants = {
  GITHUB_PATH: 'https://api.github.com',
  states: {
    initial: {
      state: null
    },
    setup: { 
      state: '/setup', 
      msg: menuMsg,
    },
    setUpTrello: { 
      state: '/setuptrello', 
      msg: 
      'Enter your trello token, if you do not already have one [click here](https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=f539c73a53faa0ab15abd442925f56e0).',
      res: 
      `Token save was completed correctly, other trello commands:
      /setboard - Setup trello dashboard.
      /newboard - Generate new trello dashboard.
      /glists - Generate scrum lists`,
      err: 'Trello access token not found, please retype' + returnMenu
    },
    setBoard: {
      state: '/setboard',
      msg: 
      'Enter the board name:',
      res: 
       `Board save was completed correctly, you can generate the scrum lists with the next command:
       /glists - Generate scrum lists.`,
      err: 'Board not found, please retype.' + returnMenu
    },
    newBoard: {
      state: '/newboard',
      msg: 
      'Enter the dashboard name:',
      res: 
      `Dashboard was generated correctly, you can generate the scrum lists with the next command:
      /glists - Generate scrum lists.`,
      err: `Trello access token not found, that's can setup with the next command:
      /setuptrello - Setup trello access token.`
    },
    gLists: {
      state: '/glists',
      res: 
      `Lists was generated correctly, you can import the github issues with the next command:
      /importissues - Import all the repository issues to trello.`,
      err: `You need to setup your boards and issues, you can see your config saved with the next command:
      /viewconfig - Show config saved.`
    },
    viewConfig: { 
      state: '/viewconfig',
    },
    setGithub: { 
      state: '/setgithub', 
      msg: 
      'Enter your github username:',
      res: 
       `User save was completed correctly, you can set your github repository with the next command:
       /setrepo - Setup github repository name.`,
      err: 'Username not found, please retype:' + returnMenu
    },
    setRepo: { 
      state: '/setrepo',
      msg: 
      'Enter the repository name:',
      res: 
      `Repository save was completed correctly, you can import all the repository issues with the next command:
      /importissues - Import all the repository issues to trello.`,
      err: 'Repository not found, please retype:' + returnMenu
    },
    getIssues: { 
      state: '/getissues', 
      res: 
      `You can import this issues with the next command:
      /importissues - Import all the repository issues to trello.`,
      err: `This repository not have open issues for your board, you can change the repository with the next command:
      /setrepo - Setup github repository name.`,
    },
    importIssues: { 
      state: '/importissues', 
      msg: 
      'Enter the repository name:',
      res:
      'Import was completed correctly.' + returnMenu,
      err: `You need to setup your boards and issues, you can see your config saved with the next command:
      /viewconfig - Show config saved.`
    },
    importContributors: {
      state: '/importcontributors',
      res: 
      'Import was completed correctly.' + returnMenu,
      err: `You need to setup your boards and issues, you can see your config saved with the next command:
      /viewconfig - Show config saved.`,
      err_empty: `This repository not have contributors, you can change the repository with the next command:
      /setrepo - Setup github repository name.`,
    }
  },
  lists: [
    {key: 'idBacklog', name: 'Backlog'},
    {key: 'idTodo', name: 'To do'},
    {key: 'idDone', name: 'Done'},
  ],
  notFoundMsg: 
  'Action not found.' + returnMenu,
  errorMsg: 
  'Ooops, something went wrong.' + returnMenu,
  returnMenu
};