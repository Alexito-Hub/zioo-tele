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
      inline_keyboard: [
        [
          { text: 'Opción 1', callback_data: 'opcion1' },
          { text: 'Opción 2', callback_data: 'opcion2' }
        ],
        [
          { text: 'Configuración', callback_data: 'configuracion' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '¡Hola! Soy tu bot de Telegram.', options);
});

// Manejar las interacciones de los botones
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  // Editar el mensaje según la opción seleccionada
  switch (data) {
    case 'opcion1':
      bot.editMessageText('Seleccionaste Opción 1', { chat_id: chatId, message_id: messageId });
      break;
    case 'opcion2':
      bot.editMessageText('Seleccionaste Opción 2', { chat_id: chatId, message_id: messageId });
      break;
    case 'configuracion':
      bot.editMessageText('Configuración no disponible actualmente.', { chat_id: chatId, message_id: messageId });
      break;
    // Agrega más casos según las opciones del menú
  }
});
