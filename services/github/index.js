const fetch = require('node-fetch');
const { constants } = require('../../config');
const { createOrUpdate } = require('../../users/controller');

exports.showIssues = (bot, chatId, username, repo) => {
  fetch(`https://api.github.com/repos/${username}/${repo}/issues`)
    .then(res => res.json())
    .then(doc => {
      if(doc && doc.length > 0) {
        bot.sendMessage(chatId, `Issues list of ${repo}`, { parse_mode: 'markdown' });
        doc.forEach(issue => {
          console.log(issue);
          bot.sendMessage(chatId, `Title: ${issue.title}, Comments: ${issue.comments}`, { parse_mode: 'markdown' });
        });
        createOrUpdate(bot, chatId, constants.states.getIssues.res, {state: constants.states.setup.state });
      }else{
        bot.sendMessage(chatId, constants.states.getIssues.err, { parse_mode: 'markdown' });
      }
    })
    .catch(err => {
      console.log(err);
      bot.sendMessage(chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
    });
};

exports.verifyRepo = (bot, chatId, username, repo) => {
  fetch(`https://api.github.com/repos/${username}/${repo}`)
    .then(res => res.json())
    .then(doc => {
      if(doc.id) {
        createOrUpdate(bot, chatId, constants.states.setRepo.res, {githubRepo: repo, state: constants.states.setup.state });
      }else{
        createOrUpdate(bot, chatId, constants.states.setRepo.err, {});
      }
    })
    .catch(err => {
      console.log(err);
      bot.sendMessage(chatId, constants.states.errorMsg, { parse_mode: 'markdown' });
    });
};

exports.getIssues = (user, repo) => {
  return fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
    .then(res => res.json());
};