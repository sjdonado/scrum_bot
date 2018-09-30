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

const returnMenu = `Puedes volver a ver el menú con:
/setup - Ver menú`;

exports.constants = {
  states: {
    setup: { 
      state: '/setup', 
      msg: `Puedes controlarme con estos comandos:
    *Trello*
    /setuptrello - Agregar credenciales de trello.
    /gtrello - Generar tablero y listas.
  
    *GitHub*
    /setgithub - Agregar credenciales de github.
    /getissues - Obtener issues e importar a trello.`,
    },
    setUpTrello: { 
      state: '/setuptrello', 
      msg: 'Ingresa tu trello token, si no tienes uno [generalo aquí](https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=f539c73a53faa0ab15abd442925f56e0).',
      res: `Token guardado correctamente, puedes generar un tablero con el siguiente comando:
      /gtrello - Generar tablero y listas`,
      err: `Credenciales de trello no encontradas, puedes ingresarlo con el siguiente comando:
      /setuptrello - Agregar credenciales de trello.`
    },
    gTrello: {
      state: '/gtrello',
      msg: 'Ingrese el nombre del tablero:',
      res: 'Tablero y listas generadas correctamente.' + returnMenu
    },
    // viewTrello: { 
    //   state: '/viewtrello',
    // },
    setGithub: { 
      state: '/setgithub', 
      msg: 'Ingresa tu usuario:',
      res:  'Usuario guardado correctamente. ' + returnMenu,
      err: 'Credenciales de github no encontradas. ' + returnMenu
    },
    getIssues: { 
      state: '/getissues', 
      msg: 'Ingrese el nommbre del repositorio:',
    },
    importIssues: { 
      state: '/importissues', 
      res: 'Importados correctamente. ' + returnMenu,
      err: 'Credenciales incorrectas, ' + returnMenu
    },
  },
  lists: [
    {key: 'backlogId', name: 'Backlog'},
    {key: 'todoId', name: 'To do'},
    {key: 'doneId', name: 'Done'},
  ],
  errorMsg: 'No encontrado.' + returnMenu,
};