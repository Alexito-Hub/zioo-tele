require('./config')
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')
const path = require('path')
const commands = [];

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
    console.log('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
    process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

function loadCommands() {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        commands.push(command);
    }
}

loadCommands();


bot.onText(/(.+)/, (msg) => {
  const prefixes = global.prefix || ['/'];
  const text = msg.text || '';
  const isCmd = prefixes.some(prefix => text.toLowerCase().startsWith(prefix.toLowerCase()));

  if (isCmd) {
    const commandBody = text.slice(prefixes.find(prefix => text.toLowerCase().startsWith(prefix.toLowerCase())).length).trim();
    const [commandName, ...commandArgs] = commandBody.split(/ +/);

    const commandInfo = commands.find(cmd => cmd.commands.includes(commandName.toLowerCase()));
    if (commandInfo) {
      commandInfo.execute(bot, msg.chat.id);
    }
  }
});


bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    switch (data) {
        case 'Menu':
            bot.editMessageText('No se agregaron comandos a la lista de Menu', { chat_id: chatId, message_id: messageId });
            break;
        case 'Juegos':
            bot.editMessageText('Los juegos no están disponibles por el momento', { chat_id: chatId, message_id: messageId });
            break;
    }
});
