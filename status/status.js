import { AUTO_VIEW_STATUS, AUTO_LIKE_STATUS } from '../settings.js';

export async function autoViewAndLikeStatus(sock, msg) {
    if (!msg || !msg.key) return;

    try {
        // Real phone number is in remoteJidAlt in Baileys 7
        const senderJid = msg.key.remoteJidAlt || msg.key.participant;
        const senderName = msg.pushName || msg.verifiedBizName || 'Unknown';

        if (AUTO_VIEW_STATUS) {
            await sock.readMessages([msg.key]);
            console.log(`👁️ Viewed status from: ${senderName} (${senderJid?.split('@')[0]})`);
        }

        if (AUTO_LIKE_STATUS) {
            if (!senderJid) return;
            setTimeout(async () => {
                try {
                    await sock.sendMessage(senderJid, {
                        react: { text: '❤️', key: msg.key }
                    });
                    console.log(`❤️ Liked status from: ${senderName}`);
                } catch (err) {
                    console.error('Like error:', err.message);
                }
            }, 3000);
        }
    } catch (error) {
        console.error('Status error:', error.message);
    }
}