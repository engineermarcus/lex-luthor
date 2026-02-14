import { AUTO_VIEW_STATUS, AUTO_LIKE_STATUS } from '../settings.js';

export async function autoViewAndLikeStatus(sock, msg) {
    try {
        if (AUTO_VIEW_STATUS) {
            await sock.readMessages([msg.key]);
            console.log(`👁️ Viewed status from: ${msg.pushName || msg.key.participant}`);
        }

        if (AUTO_LIKE_STATUS) {
            const participant = msg.key.participant;
            if (!participant) return;

            setTimeout(async () => {
                try {
                    await sock.sendMessage(participant, {
                        react: { text: '❤️', key: msg.key }
                    });
                    console.log(`❤️ Liked status from: ${msg.pushName || participant}`);
                } catch (err) {
                    console.error('Like error:', err.message);
                }
            }, 30000); // 30s delay like their script
        }
    } catch (error) {
        console.error('Status error:', error.message);
    }
}