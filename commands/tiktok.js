// tiktok.js
const { fetchJson } = require('../lib/utils');

module.exports = {
    name: 'tiktok',
    description: 'Descarga videos e imágenes de TikTok',
    commands: ['tiktok', 'tt'],

    async execute(bot, chatId, messageId, args) {
        try {
            if (!args[0]) {
                await bot.sendMessage(chatId, '*tiktok <url>*', { reply_to_message_id: messageId });
                return;
            }

            const tiktokUrl = args[0];
            const response = await fetchJson(`https://iam-zio.replit.app/api/tiktok?key=zio&url=${tiktokUrl}`);

            if (response && response.result) {
                const result = response.result;
                if (result.type === 'video') {
                    await bot.sendVideo(chatId, result.video.noWatermark, {
                        reply_to_message_id: messageId,
                        caption: `⋯⋯ TIK TOK ⋯⋯\n ∘ Autor: ${result.author.name}\n ∘ Likes: ${result.information.likeCount}\n ∘ Comentarios: ${result.information.commentCount}\n ∘ Duración: ${result.video.durationFormatted}\n ∘ Fecha: ${result.information.created_at}\n ∘ Título: ${result.information.title}`
                    });
                } else if (result.type === 'images') {
                    for (const image of result.images) {
                        await bot.sendPhoto(chatId, image.url.url, {
                            reply_to_message_id: messageId,
                            caption: `¡Listo!`
                        });
                    }
                }
            } else {
                console.log('Error al obtener información');
                await bot.sendMessage(chatId, 'No se pudo descargar', { reply_to_message_id: messageId });
            }
        } catch (e) {
            console.error(e);
            await bot.sendMessage(chatId, `${e}`, { reply_to_message_id: messageId });
        }
    },
};
