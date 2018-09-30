const fetch = require('node-fetch');
const { constants } = require('../../config');
const { updateUser } = require('../../utils');

exports.showIssues = (bot, chatId, user, repo) => {
  fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
    .then(res => res.json())
    .then(doc => {
      if(doc && doc.length > 0) {
        bot.sendMessage(chatId, 'Issues list. Import to backlog? (y/n)', { parse_mode: 'markdown' });
        doc.forEach(issue => {
          console.log(issue);
          bot.sendMessage(chatId, `Title: ${issue.title}asdasdasasdasd, Comments: ${issue.comments}`, { parse_mode: 'markdown' });
        });
        updateUser(bot, chatId, null, 
          {githubRepo: repo, state: constants.states.importIssues.state });
      }else{
        bot.sendMessage(chatId, constants.states.setGithub.err, { parse_mode: 'markdown' });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIssues = (user, repo) => {
  return fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
    .then(res => res.json());
};