require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.log('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
  process.exit(1);
}

// Función para realizar solicitudes a la API de TikTok
exports.fetchJson = async (url, options = {}) => {
  try {
    options = options || {};
    const res = await axios({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
      },
      ...options
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/^\/tiktok (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tiktokUrl = match[1];

  // Construir la URL completa para la API de TikTok
  const apiUrl = `https://iam-zio.replit.app/api/tiktok?key=zio&url=${encodeURIComponent(tiktokUrl)}`;

  try {
    // Obtener datos de la API de TikTok
    const tiktokData = await exports.fetchJson(apiUrl);

    // Procesar y enviar la información al usuario
    const message = `**Autor:** ${tiktokData.result.author.name}\n**Título:** ${tiktokData.result.information.title}\n**Me gusta:** ${tiktokData.result.information.likeCount}\n**Reproducciones:** ${tiktokData.result.information.playCount}\n**Enlace de descarga:** [Descargar]( ${tiktokData.result.video.noWatermark} )`;
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error al obtener datos de la API de TikTok:', error);
    bot.sendMessage(chatId, 'Error al obtener datos de la API de TikTok. Por favor, inténtalo de nuevo más tarde.');
  }
});
