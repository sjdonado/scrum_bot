exports.showConfigList = (user, returnMenu) => {
  const msg = 
  `Config list: 
  - *Trello api token:* ${user.trelloApiToken || 'Not found'}
  - *Trello board:* ${user.boardName || 'Not found'}
  - *Github user:* ${user.githubUser || 'Not found'}
  - *Github repo:* ${user.githubRepo || 'Not found'}
  ` + returnMenu;
  return msg;
};