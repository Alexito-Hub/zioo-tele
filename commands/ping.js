// commands/responseTime.js

module.exports = {
  name: "Ping",
  description: "Muestra el tiempo de respuesta en milisegundos",
  commands: ["ping"],
  async execute(bot, chatId, messageId) {
    const startTime = new Date();
    
    try {
      const responseMessage = await bot.sendMessage(chatId, 'Calculando el tiempo de respuesta...');
      const endTime = new Date();
      const responseTime = endTime - startTime;

      await bot.editMessageText(`El tiempo de respuesta es de ${responseTime} milisegundos.`, {
        chat_id: chatId,
        message_id: responseMessage.message_id
      });
    } catch (e) {
      throw e;
    }
  }
};
