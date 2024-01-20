require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.log('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

const groupConfigurations = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Menu', callback_data: 'Menu' },
          { text: 'Juegos', callback_data: 'Juegos' }
        ],
        [
          { text: 'Configuration', callback_data: 'Configuration' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '¡Hola! Soy tu bot de Telegram.', options);
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  switch (data) {
    case 'Menu':
      bot.editMessageText('Nl se agregaron comandos a la lista de Menu', { chat_id: chatId, message_id: messageId });
      break;
    case 'Juegos':
      bot.editMessageText('Los juegos no estan disponibles por el momento', { chat_id: chatId, message_id: messageId });
      break;
    case 'Configuration':
      const buttonConfig = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Cambiar Nombre', callback_data: 'cambiarNombre' },
              { text: 'Cambiar Descripción', callback_data: 'cambiarDescripcion' }
            ]
          ]
        }
      };
      bot.editMessageText('Configuración del grupo:', { chat_id: chatId, message_id: messageId, ...buttonConfig });
      break;
    case 'cambiarNombre':
      // Guarda el estado actual para la configuración del grupo
      groupConfigurations[chatId] = { action: 'cambiarNombre' };
      bot.sendMessage(chatId, 'Por favor, envía el nuevo nombre del grupo.');
      break;
    case 'cambiarDescripcion':
      // Guarda el estado actual para la configuración del grupo
      groupConfigurations[chatId] = { action: 'cambiarDescripcion' };
      bot.sendMessage(chatId, 'Por favor, envía la nueva descripción del grupo.');
      break;
  }
});


bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (groupConfigurations[chatId]) {
    const { action } = groupConfigurations[chatId];
    
    // Pide confirmación antes de realizar cambios
    bot.sendMessage(chatId, `¿Estás seguro de cambiar ${action === 'cambiarNombre' ? 'el nombre' : 'la descripción'} a "${messageText}"?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Sí', callback_data: 'confirmar' },
            { text: 'No', callback_data: 'cancelar' }
          ]
        ]
      }
    });
  }
});

// Maneja las interacciones de los botones de confirmación
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  if (data === 'confirmar') {
    // Realiza cambios en la configuración según la acción guardada
    const { action } = groupConfigurations[chatId];
    delete groupConfigurations[chatId];

    // Aquí deberías implementar la lógica para cambiar el nombre o descripción del grupo

    bot.editMessageText(`${action === 'cambiarNombre' ? 'Nombre' : 'Descripción'} cambiado con éxito.`, { chat_id: chatId, message_id: messageId });
  } else if (data === 'cancelar') {
    // Cancela la acción actual
    delete groupConfigurations[chatId];
    bot.editMessageText('Cambio cancelado.', { chat_id: chatId, message_id: messageId });
  }
});
