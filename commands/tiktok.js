const { fetchJson } = require('../lib/utils');

module.exports = {
    name: 'tiktok',
    description: 'Descarga videos e imágenes de TikTok',
    commands: ['tiktok', 'tt'],

    async execute(bot, msg, args) {
        try {
            if (!args[0]) {
                await bot.sendMessage(msg.chat.id, '*tiktok <url>*', { reply_to_message_id: msg.message_id });
                return;
            }

            await bot.sendMessage(msg.chat.id, '🕛', { reply_to_message_id: msg.message_id });
            const isAudio = args.includes('--audio') || args.includes('-a');

            const tiktokUrl = args[0];
            const response = await fetchJson(`https://iam-zio.replit.app/api/tiktok?key=zio&url=${tiktokUrl}`);

            function roundTime(time) {
                return Math.round(time);
            }

            const responseMs = Date.now();
            const responseTime = roundTime(responseMs - msg.date * 1000);
            const messageRoundTime = (responseTime / 1000).toFixed(3);

            if (response && response.result) {
                const result = response.result;
                if (isAudio) {
                    await bot.sendAudio(msg.chat.id, result.music.url, {
                        caption: `᳃ ¡Listo! - *🧃 ${messageRoundTime} ms*`,
                        reply_to_message_id: msg.message_id,
                    });
                } else if (result.type === 'video') {
                    await bot.sendVideo(msg.chat.id, result.video.noWatermark, {
                        caption: `ㅤ *⋯⋯ TIK TOK ⋯⋯*
 ∘ *Autor:* ${result.author.name}
 ∘ *Likes:* ${result.information.likeCount}
 ∘ *Comentarios:* ${result.information.commentCount}
 ∘ *Duración:* ${result.video.durationFormatted}
 ∘ *Fecha:* ${result.information.created_at}
 ∘ *Titulo:* ${result.information.title}`,
                        reply_to_message_id: msg.message_id,
                    });
                } else if (result.type === 'images') {
                    for (const image of result.images) {
                        await bot.sendPhoto(msg.chat.id, image.url.url, {
                            caption: `᳃ ¡Listo! - *🧃 ${messageRoundTime} ms*`,
                            reply_to_message_id: msg.message_id,
                        });
                    }
                    await bot.sendAudio(msg.chat.id, result.music.url, {
                        caption: `᳃ ¡Listo! - *🧃 ${messageRoundTime} ms*`,
                        reply_to_message_id: msg.message_id,
                    });
                }
                await bot.sendMessage(msg.chat.id, '✅', { reply_to_message_id: msg.message_id });
            } else {
                console.log('Error al obtener información');
                await bot.sendMessage(msg.chat.id, '❎', { reply_to_message_id: msg.message_id });
                await bot.sendMessage(msg.chat.id, 'No se pudo descargar', { reply_to_message_id: msg.message_id });
            }
        } catch (e) {
            console.error(e);
            await bot.sendMessage(msg.chat.id, `${e}`, { reply_to_message_id: msg.message_id });
        }
    },
};
