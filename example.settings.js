
export const SESSION_ID = 'paste-your-session-id-here'; // e.g. "apple-river-stone"

// ─── Bot Identity ──────────────────────────────────────────────────────────────
export const BOT_NAME = 'Luther MD';
export const BOT_VERSION = '1.0.0';
export const OWNER_NUMBER = '254725693306'; // your number, no +
export const OWNER_NAME = 'Neiman Marcus';// your name 


// ─── Command Settings ──────────────────────────────────────────────────────────
export const PREFIX = '.'; // command prefix e.g. .ping .help

// ─── Behaviour ─────────────────────────────────────────────────────────────────
export const AUTO_READ = true;        // mark messages as read automatically
export const AUTO_TYPING = true;      // show typing indicator before responding
export const REPLY_IN_DM_ONLY = false; // if true, bot ignores group messages
export const OWNER_ONLY = true;       // if true, only owner can use commands
export const AUTO_VIEW_STATUS = true;
export const AUTO_LIKE_STATUS = true;

// ─── Connection ────────────────────────────────────────────────────────────────
export const RECONNECT_INTERVAL = 5000;  // ms to wait before reconnecting
export const KEEP_ALIVE_INTERVAL = 15000; // ms between WA ping to stay online
export const SESSION_RETRY_INTERVAL = 10000; // ms to wait before retrying manager