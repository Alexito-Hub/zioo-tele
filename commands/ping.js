// commands/responseTime.js

module.exports = {
  name: "Ping",
  description: "Muestra el tiempo de respuesta en milisegundos",
  commands: ["ping"],
  async execute(bot, chatId, messageId) {
    const startTime = new Date();
    
    try {
      // Edita el mensaje existente para mostrar un mensaje de carga
      await bot.editMessageText('Calculando el tiempo de respuesta...', { chat_id: chatId, message_id: messageId });
    } catch (e) {
      throw e;
    }

    const endTime = new Date();
    const responseTime = endTime - startTime;

    // Edita el mensaje existente para mostrar el tiempo de respuesta
    bot.editMessageText(`El tiempo de respuesta es de ${responseTime} milisegundos.`, { chat_id: chatId, message_id: messageId });
  }
};
