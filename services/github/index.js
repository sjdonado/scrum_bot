const fetch = require('node-fetch');
const { constants } = require('../../config');
const { createOrUpdate } = require('../../users/controller');

exports.showIssues = (bot, chatId, username, repo) => {
  fetch(`${constants.GITHUB_PATH}/repos/${username}/${repo}/issues`)
    .then(res => res.json())
    .then(doc => {
      if(doc && doc.length > 0) {
        bot.sendMessage(chatId, `Issues list of ${repo}`, { parse_mode: 'markdown' });
        doc.forEach(issue => {
          console.log(issue);
          bot.sendMessage(chatId, `- *Title:* ${issue.title}, *Comments:* ${issue.comments}`, { parse_mode: 'markdown' });
        });
        createOrUpdate(bot, chatId, constants.states.getIssues.res, {state: constants.states.initial.state });
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
  fetch(`${constants.GITHUB_PATH}/repos/${username}/${repo}`)
    .then(res => res.json())
    .then(doc => {
      if(doc.id) {
        createOrUpdate(bot, chatId, constants.states.setRepo.res, {githubRepo: repo, state: constants.states.initial.state });
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
  return fetch(`${constants.GITHUB_PATH}/repos/${user}/${repo}/issues`)
    .then(res => res.json());
};

exports.getContributors = (bot, chatId, username, repo) => {
  return fetch(`${constants.GITHUB_PATH}/repos/${username}/${repo}/contributors`);
};