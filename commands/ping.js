// commands/responseTime.js

module.exports = {
  name: "Ping",
  description: "Muestra el tiempo de respuesta en milisegundos",
  commands: ["ping", "ms"],
  async execute(bot, chatId) {
    const startTime = new Date();
    
    try {
      await bot.sendMessage(chatId, 'Calculando el tiempo de respuesta...');
    } catch (e) {
      throw e;
    }

    const endTime = new Date();
    const responseTime = endTime - startTime;
    bot.editMessageText(`El tiempo de respuesta es de ${responseTime} milisegundos.`, { chat_id: chatId, message_id: messageId });
  }
};
