const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
require('./config');
require('dotenv').config();

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
    console.error('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
    process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });
const commands = loadCommands();

function loadCommands() {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    return commandFiles.map(file => require(path.join(__dirname, 'commands', file)));
}

function processTextMessage(msg) {
    const prefixes = global.prefix || ['/'];
    const isCmd = msg.text && prefixes.some(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase()));
    const command = isCmd
        ? msg.text.split(' ')[0].slice(prefixes.find(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase())).length).toLowerCase()
        : msg.text.trim().split(' ')[0].toLowerCase();
    
    const { chat, message_id } = msg;
    const commandInfo = commands.find(cmd => cmd.commands.includes(command));
    
    if (commandInfo) {
        commandInfo.execute(bot, chat.id, message_id);
    }
}

bot.onText(/(.+)/, processTextMessage);

bot.on('callback_query', (callbackQuery) => {
    const { message, data } = callbackQuery;
    const { chat } = message;

    switch (data) {
        case 'Menu':
            bot.editMessageText('No se agregaron comandos a la lista de Menú', { chat_id: chat.id, message_id: message.message_id });
            break;
        case 'Juegos':
            bot.editMessageText('Los juegos no están disponibles por el momento', { chat_id: chat.id, message_id: message.message_id });
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