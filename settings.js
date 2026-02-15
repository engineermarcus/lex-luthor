import 'dotenv/config';

// ─── Session Handler ───────────────────────────────────────────────────────────

export const SESSION_ID = process.env.SESSION_ID || 'Neiman_quick-bright-lamp'; // e.g. "apple-river-stone"

// ─── Bot Identity ──────────────────────────────────────────────────────────────
export const BOT_NAME = process.env.BOT_NAME || 'Luthor MD';
export const BOT_VERSION = process.env.BOT_VERSION || '1.0.0';
export const OWNER_NUMBER = process.env.OWNER_NUMBER || '254725693306'; // your number, no +
export const OWNER_NAME = process.env.OWNER_NAME || 'Neiman Marcus';

// ─── Command Settings ──────────────────────────────────────────────────────────
export const PREFIX = process.env.PREFIX || '.'; // command prefix e.g. .ping .help

// ─── Behaviour ─────────────────────────────────────────────────────────────────
export const AUTO_READ = process.env.AUTO_READ || true;        // mark messages as read automatically
export const AUTO_PRESENCE = process.env.AUTO_PRESENCE || 'typing'; // typing, recording, online, none
export const REPLY_IN_DM_ONLY = process.env.REPLY_IN_DM_ONLY || false; // if true, bot ignores group messages
export const OWNER_ONLY = process.env.OWNER_ONLY || false;       // if true, only owner can use commands
export const AUTO_VIEW_STATUS = process.env.AUTO_VIEW_STATUS || true;
export const AUTO_LIKE_STATUS = process.env.AUTO_LIKE_STATUS || true;
export const WELCOME = process.env.WELCOME || true;
export const GOODBYE = process.env.GOODBYE || true;
export const WELCOME_MESSAGE = process.env.WELCOME_MESSAGE || '👋 Welcome @{name} to the group!';
export const GOODBYE_MESSAGE = process.env.GOODBYE_MESSAGE || '👋 Goodbye @{name}, we will miss you!';
export const STALK_MESSAGE = process.env.STALK_MESSAGE || 'Hello 👋, How is your day going ?'
export const ANTI_DELETE = process.env.ANTI_DELETE || true;
export const ANTI_LINK = process.env.ANTI_LINK || true;


// ─── Connection ────────────────────────────────────────────────────────────────
export const RECONNECT_INTERVAL = process.env.RECONNECT_INTERVAL || 5000;  // ms to wait before reconnecting
export const KEEP_ALIVE_INTERVAL = process.env.KEEP_ALIVE_INTERVAL || 15000; // ms between WA ping to stay online
export const SESSION_RETRY_INTERVAL = process.env.SESSION_RETRY_INTERVAL || 10000; // ms to wait before retrying manager