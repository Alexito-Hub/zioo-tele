require('dotenv').config()
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('message', (ctx) => {
  ctx.reply('Hello there!'); // Replace with your bot's functionality
});

bot.startPolling();
