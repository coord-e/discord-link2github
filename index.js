const rp = require('request-promise')
const Discord = require('discord.js')
const client = new Discord.Client()
const Redis = require("redis")
const redis = Redis.createClient()
const {promisify} = require('util')
const pget = promisify(redis.get).bind(redis)
const pset = promisify(redis.set).bind(redis)

redis.on("error", (err) => {
  console.error("Redis Error: " + err);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const check_url = async (url) => {
  try {
    await rp(url)
    return true
  } catch (e) {
    return false
  }
}

const reply_with_repo = (msg, repo, issueorpr) => {
  const baseurl = `https://github.com/${repo}`
  const issueurl = `${baseurl}/issues/${issueorpr}`
  const prurl = `${baseurl}/pulls/${issueorpr}`
  if(check_url(issueurl)) {
    msg.channel.send(issueurl)
  } else if (check_url(prurl)) {
    msg.channel.send(prurl)
  }
}

client.on('message', async msg => {
  if (msg.isMemberMentioned(client.user)) {
    const match = msg.cleanContent.match(/set to ([a-zA-Z\-]+\/[a-zA-Z\-.]+)/)
    if (!match) {
      msg.reply('Invalid! format: "set to User/Repo"')
      return
    }
    const repo = match[1]
    await pset(msg.channel.toString(), repo)
    msg.reply(`set to ${repo}`)
    return
  }

  {
    const match = msg.cleanContent.match(/([a-zA-Z\-]+)\/([a-zA-Z\-.]+)#(\d+)/)
    if (match) {
      const repo = `${match[1]}/${match[2]}`
      reply_with_repo(msg, repo, match[3])
      return
    }
  }

  {
    const match = msg.cleanContent.match(/(#|GH-)(\d+)/)
    if (match) {
      const repo = await pget(msg.channel.toString())
      if (!repo) {
        msg.reply('Please set repo first')
        return
      }
      const issueorpr = match[2]
      reply_with_repo(msg, repo, issueorpr)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
