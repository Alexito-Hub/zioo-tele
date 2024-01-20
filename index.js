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
  const entities = msg.entities || [];
  const hasMention = entities.some(entity => entity.type === 'mention' && entity.user.id === bot.me.id);
  
  let command = '';
  if (msg.text) {
    if (hasMention) {
      // Si hay una mención al bot en el mensaje, extrae el comando después de la mención.
      const mentionEndIndex = entities.find(entity => entity.type === 'mention' && entity.user.id === bot.me.id).offset + entities.find(entity => entity.type === 'mention' && entity.user.id === bot.me.id).length;
      command = msg.text.slice(mentionEndIndex).trim().split(' ')[0].toLowerCase();
    } else {
      // Si no hay mención, extrae el comando normalmente.
      command = msg.text.split(' ')[0].slice(prefixes.find(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase())).length).toLowerCase();
    }
  }

  const chatId = msg.chat.id;

  const commandInfo = commands.find(cmd => cmd.commands.includes(command));
  if (commandInfo) {
    commandInfo.execute(bot, chatId);
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
