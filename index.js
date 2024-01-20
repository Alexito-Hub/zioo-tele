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
  const keyboard = {
    resize_keyboard: true,
    keyboard: [
      ['Menu', 'Configuración'],
    ],
  };

  const options = {
    reply_markup: JSON.stringify(keyboard),
  };

  bot.sendMessage(chatId, '¡Hola! Soy tu bot de Telegram.', options);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toLowerCase();

  if (messageText === 'menu') {
    // Lógica para manejar el botón de menú
    bot.sendMessage(chatId, 'Seleccionaste el botón de Menú.');
  } else if (messageText === 'configuración') {
    // Lógica para manejar el botón de configuración
    bot.sendMessage(chatId, 'Seleccionaste el botón de Configuración.');
  } else {
    bot.sendMessage(chatId, 'Recibí tu mensaje: ' + msg.text);
  }
});
