import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import {
     SESSION_ID, BOT_NAME, BOT_VERSION, PREFIX,
    OWNER_NUMBER, AUTO_READ, AUTO_TYPING, REPLY_IN_DM_ONLY, OWNER_ONLY,
    RECONNECT_INTERVAL, KEEP_ALIVE_INTERVAL, SESSION_RETRY_INTERVAL
} from './settings.js';
import { autoViewAndLikeStatus } from './status/status.js';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import express from 'express';

const api = express();
const API_PORT = process.env.API_PORT || 3001;
const SESSION_MANAGER_URL = 'https://lexluthermd.onrender.com';
api.use(express.json());

// Status
api.get('/status', (req, res) => {
    res.json({
        bot: BOT_NAME,
        version: BOT_VERSION,
        status: sock?.user ? 'connected' : 'disconnected',
        number: sock?.user?.id?.split(':')[0] || null,
        uptime: process.uptime()
    });
});

// Send message
api.post('/send', async (req, res) => {
    try {
        const { jid, message } = req.body;
        if (!jid || !message) return res.status(400).json({ error: 'jid and message required' });
        await sock.sendMessage(jid, { text: message });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Restart bot
api.post('/restart', async (req, res) => {
    res.json({ success: true, message: 'Restarting...' });
    if (fs.existsSync(AUTH_DIR)) fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    isFirstConnect = true;
    setTimeout(() => startBot(), 2000);
});


const logger = pino({ level: 'silent' });
const AUTH_DIR = `./bot_session/${SESSION_ID}`;

async function fetchSessionFromManager() {
    try {
        console.log(`🔄 Fetching session [${SESSION_ID}] from manager...`);
        const { data } = await axios.get(`${SESSION_MANAGER_URL}/api/session/${SESSION_ID}/auth`);
        return data.files;
    } catch (error) {
        console.error('❌ Could not fetch session from manager:', error.message);
        return null;
    }
}

function saveSessionLocally(files) {
    try {
        if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
        for (const [filename, content] of Object.entries(files)) {
            fs.writeFileSync(path.join(AUTH_DIR, filename), content, 'utf-8');
        }
        console.log('💾 Session saved locally');
    } catch (error) {
        console.error('❌ Could not save session locally:', error.message);
    }
}

function hasLocalSession() {
    return fs.existsSync(path.join(AUTH_DIR, 'creds.json'));
}

async function getAuthState() {
    if (hasLocalSession()) {
        console.log('📂 Using local session');
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
        return { state, saveCreds };
    }

    let files = await fetchSessionFromManager();
    while (!files) {
        console.log(`⏳ Retrying manager in ${SESSION_RETRY_INTERVAL / 1000}s...`);
        await new Promise(r => setTimeout(r, SESSION_RETRY_INTERVAL));
        files = await fetchSessionFromManager();
    }

    saveSessionLocally(files);
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    return { state, saveCreds };
}

let sock;
let isFirstConnect = true;

async function startBot() {
    const { state, saveCreds } = await getAuthState();
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        logger,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        browser: Browsers.macOS('Chrome'),
        printQRInTerminal: false,
        markOnlineOnConnect: true,
        getMessage: async () => ({ conversation: '' }),
        syncFullHistory: false,
        retryRequestDelayMs: 2000,
        maxMsgRetryCount: 5,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: KEEP_ALIVE_INTERVAL,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log(`✅ ${BOT_NAME} v${BOT_VERSION} connected!`);
            if (isFirstConnect) {
                isFirstConnect = false;
                await sock.sendMessage(`${OWNER_NUMBER}@s.whatsapp.net`, {
                    text: `🟢 *${BOT_NAME} v${BOT_VERSION} is connected*`
                });
            }
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const reason = lastDisconnect?.error?.message || 'Unknown';
            console.log(`🔌 Disconnected — reason: ${reason} (code: ${statusCode})`);

            if (statusCode === DisconnectReason.loggedOut) {
                console.log('🚪 Logged out — clearing local session...');
                if (fs.existsSync(AUTH_DIR)) fs.rmSync(AUTH_DIR, { recursive: true, force: true });
                isFirstConnect = true;
                setTimeout(() => startBot(), RECONNECT_INTERVAL);
            } else if (statusCode === DisconnectReason.restartRequired) {
                setTimeout(() => startBot(), 3000);
            } else {
                console.log(`🔄 Reconnecting in ${RECONNECT_INTERVAL / 1000}s...`);
                setTimeout(() => startBot(), RECONNECT_INTERVAL);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
    
        for (const msg of messages) {
            if (!msg.message) continue;
            if (msg.key.fromMe) continue;
            if (msg.key.remoteJid === 'status@broadcast') {
                await autoViewAndLikeStatus(msg);
            }

            const from = msg.key.remoteJid;
            const isGroup = from.endsWith('@g.us');
            const isChannel = from.endsWith('@newsletter');

// Baileys 7 — use senderPn for real phone number, fallback to participant/remoteJid
             const senderPn = msg.key.senderPn; // real phone number JID in Baileys 7
             const senderJid = isGroup 
             ? (msg.key.participant || msg.key.senderPn)
             : (senderPn || from);
             const senderNumber = senderJid
             ?.replace('@s.whatsapp.net', '')
             ?.replace('@lid', '') || 'Unknown';

             const senderName = msg.pushName || 'Unknown';
             const isOwner = senderNumber === OWNER_NUMBER;
             const body =
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                msg.message?.imageMessage?.caption ||
                msg.message?.videoMessage?.caption || '';
    
            // Log every incoming message
            console.log(`─────────────────────────────────`);
            console.log(`📨 From    : ${isGroup ? 'Group' : isChannel ? 'Channel' : 'DM'}`);
            console.log(`👤 Name    : ${senderName}`);
            console.log(`📞 Number  : ${senderNumber}`);
            console.log(`💬 Message : ${body || '[media/no text]'}`);
            console.log(`🆔 JID     : ${from}`);
            console.log(`👑 Owner   : ${isOwner}`);
            console.log(`─────────────────────────────────`);
    
            if (AUTO_READ) await sock.readMessages([msg.key]);
            if (AUTO_TYPING && body.startsWith(PREFIX)) await sock.sendPresenceUpdate('composing', from);
            if (!body.startsWith(PREFIX)) continue;
    
            const args = body.slice(PREFIX.length).trim().split(/\s+/);
            const command = args.shift().toLowerCase();
    
            switch (command) {
                case 'ping':
                    await sock.sendMessage(from, { text: '🏓 Pong!' }, { quoted: msg });
                    break;
    
                case 'alive':
                    await sock.sendMessage(from, {
                        text: `✅ *${BOT_NAME} v${BOT_VERSION}*\n\n> Running 24/7\n> Prefix: ${PREFIX}\n> Owner: ${OWNER_NUMBER}`
                    }, { quoted: msg });
                    break;
    
                default:
                    break;
            }
        }
    });
}

process.on('uncaughtException', (err) => console.error('💥 Uncaught Exception:', err.message));
process.on('unhandledRejection', (err) => console.error('💥 Unhandled Rejection:', err?.message || err));

console.log(`🚀 Starting ${BOT_NAME} v${BOT_VERSION}...`);
export { sock };
api.listen(API_PORT, () =>{ 
    console.log(`🌐 Bot API running on port ${API_PORT}`);
    startBot();

});
