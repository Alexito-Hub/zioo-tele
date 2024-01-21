// commands/responseTime.js

module.exports = {
  name: "responseTime",
  description: "Muestra el tiempo de respuesta en segundos",
  commands: ["/responsetime"],
  async execute(bot, chatId, messageId) {
    const startTime = process.hrtime();
    
    try {
      const responseMessage = await bot.sendMessage(chatId, 'Calculando el tiempo de respuesta...');
      
      setTimeout(async () => {
        const endTime = process.hrtime(startTime);
        const responseTimeInSeconds = (endTime[0] + endTime[1] / 1e9).toFixed(4);

        await bot.editMessageText(`El tiempo de respuesta es de ${responseTimeInSeconds} segundos.`, {
          chat_id: chatId,
          message_id: responseMessage.message_id
        });
      }, 1000); // Espera 1 segundo antes de enviar el segundo mensaje
    } catch (e) {
      throw e;
    }
  }
};
