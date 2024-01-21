module.exports = {
  name: "ping",
  description: "Muestra el tiempo de respuesta en milisegundos",
  commands: ["/ping"],
  async execute(bot, chatId) {
    try {
      const responseMessage = await bot.sendMessage(chatId, 'Calculando el tiempo de respuesta...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      function roundTime(time) {
          return Math.round(time);
       }
      const responseMs = Date.now();
      const messageTimestamp = responseMessage.date * 1000;
      const responseTime = roundTime(responseMs - messageTimestamp);
      const formattedResponseTime = parseFloat((responseTime / 1000).toFixed(3));

      await bot.editMessageText(`El tiempo de respuesta es de ${formattedResponseTime} segundos.`, {
        chat_id: chatId,
        message_id: responseMessage.message_id
      });
    } catch (e) {
      throw e;
    }
  }
};
