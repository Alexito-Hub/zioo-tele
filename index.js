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

  // Definir el teclado en línea con dos botones
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Botón 1', callback_data: 'button1' },
        { text: 'Botón 2', callback_data: 'button2' }
      ],
      [
        { text: 'Configuración', callback_data: 'settings' }
      ]
    ]
  };

  // Convertir el teclado en formato JSON
  const replyMarkup = JSON.stringify(keyboard);

  // Enviar el mensaje con el teclado en línea
  bot.sendMessage(chatId, '¡Hola! Soy tu bot de Telegram.', { reply_markup: replyMarkup });
});

// Manejar los eventos de los botones
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Manejar la lógica según el botón presionado
  switch (data) {
    case 'button1':
      bot.sendMessage(chatId, 'Presionaste el Botón 1');
      break;
    case 'button2':
      bot.sendMessage(chatId, 'Presionaste el Botón 2');
      break;
    case 'settings':
      bot.sendMessage(chatId, 'Aquí puedes configurar tu bot.');
      break;
    default:
      // Manejar cualquier otro caso si es necesario
      break;
  }
});
