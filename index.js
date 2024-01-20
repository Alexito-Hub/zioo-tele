require('dotenv').config()
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('message', (ctx) => {
    
});

bot.command('start', (ctx) => {
  ctx.reply('Welcome to my bot!');
});


bot.startPolling();
