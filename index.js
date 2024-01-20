require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.log('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/(.+)/, (msg) => {
    const prefixes = global.prefix || ['/'];
    const isCmd = msg.text && prefixes.some(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase()));
    const command = isCmd
      ? msg.text.slice(prefixes.find(prefix => msg.text.toLowerCase().startsWith(prefix.toLowerCase()))).trim().split(' ')[0].toLowerCase()
      : msg.text.trim().split(' ')[0].toLowerCase();

    const chatId = msg.chat.id;

    switch (command) {
        case 'start':
            try {
                bot.sendMessage(chatId, 'Hola, usa /menu para obtener los comandos', { 
                    reply_markup: { 
                        inline_keyboard: [
                            [
                                { text: 'Menu', callback_data: 'Menu' },
                                { text: 'Juegos', callback_data: 'Juegos' } 
                            ]
                        ]
                    }
                });
            } catch (e) {
                throw e;
            }
            break;
        case 'ayuda':
        case 'help':
            bot.sendMessage(chatId, '¡Bienvenido! Puedes usar comandos como /start y otros.');
            break;
        default:
            bot.sendMessage(chatId, 'Comando no reconocido. ¡Prueba /ayuda para obtener ayuda!');
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
