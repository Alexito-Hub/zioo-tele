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
    const isCmd = msg.text && prefixes.some(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase()));
    const command = isCmd
      ? msg.text.split(' ')[0].slice(prefixes.find(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase())).length).toLowerCase()
      : msg.text.trim().split(' ')[0].toLowerCase();
    
    const chatId = msg.chat.id;
    const messageId = msg.message_id
    const args = msg.text.split(' ').slice(1)
    const commandInfo = commands.find(cmd => cmd.commands.includes(command));
    
    if (commandInfo) {
        commandInfo.execute(bot, chatId, messageId, args);
        
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

bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members;

    newMembers.forEach((member) => {
        const welcomeMessage = `¡Bienvenido al grupo, ${member.first_name}! 🎉`;
        bot.sendMessage(chatId, welcomeMessage);
    });
});

console.log('El bot está activo y esperando eventos.');