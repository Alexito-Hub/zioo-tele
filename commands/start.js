// start.js
module.exports = {
  name: "start",
  description: "Esto es el inicio",
  commands: ["start", "iniciar"],
  async execute(bot, chatId) {
    try {
      await bot.sendMessage(chatId, 'Hola, usa /menu para obtener los comandos', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Menu', callback_data: 'Menu' },
              { text: 'Juegos', callback_data: 'Juegos' }
            ]
          ]
        }
      });
    } catch (e) {
      throw e;
    }
  }
};
