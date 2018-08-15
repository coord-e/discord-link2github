# Link2GitHub


![David](https://img.shields.io/david/coord-e/discord-link2github.svg?style=flat-square)
![David](https://img.shields.io/david/dev/coord-e/discord-link2github.svg?style=flat-square)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/coord-e/discord-link2github/tree/develop)

A Discord bot that links issues/PRs to GitHub automatically

![image](https://raw.githubusercontent.com/wiki/coord-e/discord-link2github/link2github.png)

## Usage

- @botname set to user/repo
  - Use "user/repo" repository in the channel

- Then, bot will automatically sends the link to issue/PR.
  - Details on how to specify the issue/PR can be found in [here](https://help.github.com/articles/autolinked-references-and-urls/)

## Deployment

- You can use the "Deploy to Heroku" button above.
- Otherwise, you can launch the bot with `yarn install && yarn start`
- Link2GitHub uses `DISCORD_TOKEN` environmental variable to specify the bot token.

