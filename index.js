require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.log('No se proporcionó el token del bot. Asegúrate de establecer la variable de entorno BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

// Almacena el estado de configuración para cada grupo
const groupConfigurations = {};

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

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  switch (data) {
    case 'opcion1':
      bot.editMessageText('Seleccionaste Opción 1', { chat_id: chatId, message_id: messageId });
      break;
    case 'opcion2':
      bot.editMessageText('Seleccionaste Opción 2', { chat_id: chatId, message_id: messageId });
      break;
    case 'configuracion':
      const configuracionOptions = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Cambiar Nombre', callback_data: 'cambiarNombre' },
              { text: 'Cambiar Descripción', callback_data: 'cambiarDescripcion' }
            ]
          ]
        }
      };
      bot.editMessageText('Configuración del grupo:', { chat_id: chatId, message_id: messageId, ...configuracionOptions });
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

// Maneja los mensajes de texto
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Verifica si el chat tiene una configuración pendiente
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
