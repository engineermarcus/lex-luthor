import 'dotenv/config';

// ─── Session Handler ───────────────────────────────────────────────────────────

export const SESSION_ID = process.env.SESSION_ID || ''; // e.g. "apple-river-stone"

// ─── Bot Identity ──────────────────────────────────────────────────────────────
export const BOT_NAME = process.env.BOT_NAME || 'Luthor MD';
export const BOT_VERSION = process.env.BOT_VERSION || '1.5.0';
export const OWNER_NUMBER = process.env.OWNER_NUMBER || '254725693306'; // your number, no +
export const OWNER_NAME = process.env.OWNER_NAME || 'Neiman Marcus';

// ─── Command Settings ──────────────────────────────────────────────────────────
export const PREFIX = process.env.PREFIX || '.'; // command prefix e.g. .ping .help

// ─── Behaviour ─────────────────────────────────────────────────────────────────
export const AUTO_READ = process.env.AUTO_READ || true;        // mark messages as read automatically
export const AUTO_PRESENCE = process.env.AUTO_PRESENCE || 'recording'; // typing, recording, online, none
export const REPLY_IN_DM_ONLY = process.env.REPLY_IN_DM_ONLY || false; // if true, bot ignores group messages
export const OWNER_ONLY = process.env.OWNER_ONLY || true;       //only owner can use commands
export const AUTO_VIEW_STATUS = process.env.AUTO_VIEW_STATUS || true;
export const AUTO_LIKE_STATUS = process.env.AUTO_LIKE_STATUS || true;
export const WELCOME = process.env.WELCOME || true;
export const GOODBYE = process.env.GOODBYE || true;
export const WELCOME_MESSAGE = process.env.WELCOME_MESSAGE || '👀 *{name}* just walked in. The group will never be the same.';
export const GOODBYE_MESSAGE = process.env.GOODBYE_MESSAGE || '🚪 *{name}* left. Noted. Moving on.';
export const STALK_MESSAGE = process.env.STALK_MESSAGE || "Hey 👋 don't act surprised, you knew this day would come.";
export const ANTI_DELETE = process.env.ANTI_DELETE || true;
export const ANTI_LINK = process.env.ANTI_LINK || true;


// ─── Connection ────────────────────────────────────────────────────────────────
export const RECONNECT_INTERVAL = process.env.RECONNECT_INTERVAL || 5000;  // ms to wait before reconnecting
export const KEEP_ALIVE_INTERVAL = process.env.KEEP_ALIVE_INTERVAL || 15000; // ms between WA ping to stay online
export const SESSION_RETRY_INTERVAL = process.env.SESSION_RETRY_INTERVAL || 10000; // ms to wait before retrying manager

//______________________ instagram cookie handler (OPTIONAL) _______________________________________________
// navigate to instagram.com login to your account, download cookies.txt LOCALLY extention, then export cookies
// On render paste the cookie contents in the environmental variables 
export const COOKIE_CONENT = process.env.COOKIE_CONENT || "your_instgram_cookie_content"; 
