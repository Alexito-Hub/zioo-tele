const TelegramBot = require('node-telegram-bot-api');

// Obtén el token desde la variable de entorno
const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.error('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

// Manejar comandos
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '¡Hola! Soy tu bot de Telegram.');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Recibí tu mensaje: ' + msg.text);
});
