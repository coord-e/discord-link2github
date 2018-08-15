const rp = require('request-promise')
const Discord = require('discord.js')
const client = new Discord.Client()
const Redis = require('redis')
const redis = Redis.createClient(process.env.REDIS_URL)
const {promisify} = require('util')
const pget = promisify(redis.get).bind(redis)
const pset = promisify(redis.set).bind(redis)

redis.on('error', (err) => {
  console.error('Redis Error: ' + err)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const checkUrl = async (url) => {
  try {
    const res = await rp({url, method: 'HEAD', followRedirect: false})
    return true
  } catch (e) {
    return false
  }
}

const replyWithRepo = async (msg, repo, issueorpr) => {
  const baseurl = `https://github.com/${repo}`
  const issueurl = `${baseurl}/issues/${issueorpr}`
  const prurl = `${baseurl}/pull/${issueorpr}`
  if (await checkUrl(issueurl)) {
    msg.channel.send(issueurl)
  } else if (await checkUrl(prurl)) {
    msg.channel.send(prurl)
  }
}

client.on('message', async msg => {
  if (msg.isMemberMentioned(client.user)) {
    const match = msg.cleanContent.match(/set to ([a-zA-Z-]+\/[a-zA-Z-.]+)/)
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
    const re = /([a-zA-Z-]+)\/([a-zA-Z-.]+)#(\d+)/g
    let match
    while ((match = re.exec(msg.cleanContent)) !== null) {
      const repo = `${match[1]}/${match[2]}`
      await replyWithRepo(msg, repo, match[3])
      return
    }
  }

  {
    const re = /(?:#|GH-)(\d+)/g
    let match
    while ((match = re.exec(msg.cleanContent)) !== null) {
      const repo = await pget(msg.channel.toString())
      if (!repo) {
        msg.reply('Please set repo first')
        return
      }
      const issueorpr = match[1]
      await replyWithRepo(msg, repo, issueorpr)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
