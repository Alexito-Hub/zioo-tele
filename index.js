require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.log('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      keyboard: [
        ['Botón 1', 'Botón 2'],
        ['Configuración'],
      ],
      resize_keyboard: true,
    },
  };

  bot.sendMessage(chatId, '¡Hola! Soy tu bot de Telegram.', options);
});

bot.onText(/Botón 1/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Has seleccionado Botón 1.');
});

bot.onText(/Botón 2/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Has seleccionado Botón 2.');
});

bot.onText(/Configuración/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Opción 1', callback_data: 'opcion1' }],
        [{ text: 'Opción 2', callback_data: 'opcion2' }],
      ],
    },
  };

  bot.sendMessage(chatId, 'Selecciona una opción de configuración:', options);
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'opcion1') {
    bot.editMessageText('Has seleccionado Opción 1.', { chat_id: chatId, message_id: query.message.message_id });
  } else if (query.data === 'opcion2') {
    bot.editMessageText('Has seleccionado Opción 2.', { chat_id: chatId, message_id: query.message.message_id });
  }
});
