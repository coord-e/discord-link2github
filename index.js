const rp = require('request-promise');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const chan2repo = new Map()

client.on('message', async msg => {
  if(msg.isMemberMentioned(client.user)) {
  const match = msg.content.match(/"(.+\/.+)"/)
  if (!match) {
    msg.reply("Invalid")
    return
    }
    const repo = match[1]
    chan2repo.set(msg.channel, repo)
    msg.reply(`set to ${repo}`)
    return
  }
  const match = msg.content.match(/#(\d+)/)
  if (match) {
   if(!chan2repo.has(msg.channel)) {
    msg.reply("Please set repo first")
    return
   }
  const issueorpr = match[1]
    try {
      const issueurl = `https://github.com/${chan2repo.get(msg.channel)}/issues/${issueorpr}`
      await rp(issueurl)
      msg.channel.send(issueurl)
    } catch(e) {
      const prurl = `https://github.com/${chan2repo.get(msg.channel)}/pulls/${issueorpr}`
      await rp(prurl)
      msg.channel.send(prurl)
    }
  }
});

client.login('token');
