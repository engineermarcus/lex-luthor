import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const TEMP_DIR = './temp';
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getQuotedMessage(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
}

function getQuotedKey(msg) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    if (!ctx) return null;
    return {
        remoteJid: msg.key.remoteJid,
        fromMe: false,
        id: ctx.stanzaId,
        participant: ctx.participant
    };
}

async function downloadQuoted(sock, msg) {
    const quoted = getQuotedMessage(msg);
    const key = getQuotedKey(msg);
    if (!quoted || !key) return null;
    const buffer = await downloadMediaMessage(
        { message: quoted, key },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
    );
    return { buffer, quoted };
}

function ffmpeg(args) {
    return new Promise((resolve, reject) => {
        const proc = spawn('ffmpeg', args);
        let stderr = '';
        proc.stderr.on('data', d => stderr += d.toString());
        proc.on('close', code => code === 0 ? resolve() : reject(new Error(stderr)));
        proc.on('error', reject);
    });
}

// ─── Sticker ───────────────────────────────────────────────────────────────────

async function toSticker(sock, msg, from) {
    const result = await downloadQuoted(sock, msg);
    if (!result) return await sock.sendMessage(from, { text: '❌ Reply to an image, video or GIF with .sticker' }, { quoted: msg });

    const { buffer, quoted } = result;
    const isVideo = !!quoted.videoMessage;
    const isGif = quoted.imageMessage?.mimetype === 'image/gif';
    const ext = isVideo ? 'mp4' : isGif ? 'gif' : 'jpg';

    const inputPath = path.join(TEMP_DIR, `input_${Date.now()}.${ext}`);
    const outputPath = path.join(TEMP_DIR, `sticker_${Date.now()}.webp`);

    fs.writeFileSync(inputPath, buffer);

    await sock.sendMessage(from, { text: '🎨 Creating sticker...' }, { quoted: msg });

    try {
        if (isVideo) {
            await ffmpeg([
                '-i', inputPath,
                '-vcodec', 'libwebp',
                '-vf', "scale='if(gt(iw,ih),-1,512)':'if(gt(iw,ih),512,-1)',crop=512:512,fps=10",
                '-lossless', '0', '-compression_level', '6', '-q:v', '35',
                '-loop', '0', '-an', '-vsync', '0', '-t', '7', '-y', outputPath
            ]);
        } else if (isGif) {
            await ffmpeg([
                '-i', inputPath,
                '-vcodec', 'libwebp', '-vf', 'fps=15,scale=512:512:flags=lanczos',
                '-loop', '0', '-compression_level', '6', '-q:v', '75', '-y', outputPath
            ]);
        } else {
            await ffmpeg([
                '-i', inputPath,
                '-vcodec', 'libwebp',
                '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000',
                '-lossless', '0', '-compression_level', '6', '-q:v', '75', '-y', outputPath
            ]);
        }

        await sock.sendMessage(from, { sticker: fs.readFileSync(outputPath) }, { quoted: msg });
    } finally {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
}

// ─── To Image ──────────────────────────────────────────────────────────────────

async function toImage(sock, msg, from) {
    const result = await downloadQuoted(sock, msg);
    if (!result || !result.quoted.stickerMessage) {
        return await sock.sendMessage(from, { text: '❌ Reply to a sticker with .toimg' }, { quoted: msg });
    }

    const inputPath = path.join(TEMP_DIR, `sticker_${Date.now()}.webp`);
    const outputPath = path.join(TEMP_DIR, `image_${Date.now()}.png`);

    fs.writeFileSync(inputPath, result.buffer);

    try {
        await ffmpeg(['-i', inputPath, '-y', outputPath]);
        await sock.sendMessage(from, { image: fs.readFileSync(outputPath) }, { quoted: msg });
    } finally {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
}

// Language name to code mapping
const LANGUAGE_CODES = {
    swahili: 'sw', english: 'en', french: 'fr', spanish: 'es',
    german: 'de', portuguese: 'pt', arabic: 'ar', chinese: 'zh',
    japanese: 'ja', korean: 'ko', italian: 'it', russian: 'ru',
    hindi: 'hi', dutch: 'nl', turkish: 'tr', polish: 'pl',
    swedish: 'sv', norwegian: 'no', danish: 'da', finnish: 'fi',
    greek: 'el', hebrew: 'he', thai: 'th', vietnamese: 'vi',
    indonesian: 'id', malay: 'ms', filipino: 'tl', yoruba: 'yo',
    igbo: 'ig', hausa: 'ha', amharic: 'am', somali: 'so',
    zulu: 'zu', xhosa: 'xh', shona: 'sn', afrikaans: 'af'
};

export const languageCommands = Object.keys(LANGUAGE_CODES);

async function translate(sock, msg, from, command, args) {
    const lang = LANGUAGE_CODES[command.toLowerCase()];
    if (!lang) return;

    // Option 1: text written directly after command
    // Option 2: reply to a message
    let text = args.join(' ');

    if (!text) {
        const quoted = getQuotedMessage(msg);
        text = quoted?.conversation ||
               quoted?.extendedTextMessage?.text ||
               quoted?.imageMessage?.caption ||
               quoted?.videoMessage?.caption || '';
    }

    if (!text) return await sock.sendMessage(from, {
        text: `❌ Write text after the command or reply to a message\nExample: .${command} how are you`
    }, { quoted: msg });

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url);
        const translated = data[0].map(x => x[0]).join('');
        await sock.sendMessage(from, {
            text: `🌐 *${command.charAt(0).toUpperCase() + command.slice(1)}:*\n\n${translated}`
        }, { quoted: msg });
    } catch (err) {
        await sock.sendMessage(from, { text: `❌ Translation failed: ${err.message}` }, { quoted: msg });
    }
}
//-----------TTS------------------------------------------------------------------------------
async function tts(sock, msg, from, args) {
    // Option 1: text written directly after command
    // Option 2: reply to a message
    let text = args.join(' ');

    if (!text) {
        const quoted = getQuotedMessage(msg);
        text = quoted?.conversation ||
               quoted?.extendedTextMessage?.text ||
               quoted?.imageMessage?.caption ||
               quoted?.videoMessage?.caption || '';
    }

    if (!text) return await sock.sendMessage(from, {
        text: '❌ Write text after the command or reply to a message\nExample: .tts hello world'
    }, { quoted: msg });

    try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await sock.sendMessage(from, {
            audio: Buffer.from(response.data),
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: msg });
    } catch (err) {
        await sock.sendMessage(from, { text: `❌ TTS failed: ${err.message}` }, { quoted: msg });
    }
}

// ─── Export ────────────────────────────────────────────────────────────────────

export async function handleUtility(sock, msg, from, command, args) {
    switch (command) {
        case 'sticker':
        case 's':
            await toSticker(sock, msg, from);
            break;
        case 'toimg':
        case 'toimage':
            await toImage(sock, msg, from);
            break;
        case 'tts':
            await tts(sock, msg, from, args);
            break;
        default:
            if (languageCommands.includes(command)) {
                await translate(sock, msg, from, command, args);
            }
            break;
    }
}

export const utilityCommands = ['sticker', 's', 'toimg', 'toimage', 'tts', ...languageCommands];