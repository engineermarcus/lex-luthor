# LEX LUTHOR MD

<p align="center">
  <img src="https://pin.it/6xyvfDedM" width="40%" />
</p>

**Make sure you fork and star please**

[![Fork](https://img.shields.io/github/forks/engineermarcus/lex-luthor?style=for-the-badge&color=black)](https://github.com/engineermarcus/lex-luthor/fork)

Your WhatsApp contacts have no idea what's about to hit them.

---

[![Session](https://img.shields.io/website?url=https%3A%2F%2Flexluthermd.onrender.com&style=for-the-badge&logo=render&label=GET+SESSION&color=black)](https://lexluthermd.onrender.com)

---

## WHAT IT DOES

Reads your statuses. Likes them too. Converts your terrible memes into stickers. Translates messages you were too proud to admit you didn't understand. Scrapes Instagram profiles. Downloads YouTube audio and video. Responds to commands while you sleep.

It doesn't need your supervision. That's the point.

---

## KEY FEATURES

| Feature | Details |
|---|---|
| Status automation | Views and reacts automatically |
| Sticker conversion | Images, videos, GIFs — all fair game |
| Translation | .swahili, .english, .french — reply or type |
| Text to speech | .tts — reply or type |
| Instagram scraping | .ig — profile info, followers, bio |
| YouTube downloads | .play, .audio, .video — audio and video |
| Group management | Kick, mute, antilink, welcome/goodbye |
| Fun commands | Memes, jokes, 8ball, insults and more |
| Anti-delete | Catches deleted messages and exposes them |
| Owner only mode | Lock all commands to owner only |
| **Auto-reconnect** | Survives crashes and server downtime |
| **Health monitoring** | Self-healing and stays alive 24/7 |

---

## 🚀 DEPLOY ON RENDER (RECOMMENDED - STABLE)

### Prerequisites
1. Get your session ID from [here](https://lexluthermd.onrender.com)
2. Fork this repository

### Deploy Steps

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your forked GitHub repository
3. Render will auto-detect the `render.yaml` and `Dockerfile`
4. Set these environment variables:

| Key | Value |
|---|---|
| `SESSION_ID` | Your session ID from session manager |
| `OWNER_NUMBER` | Your WhatsApp number (without +) |
| `COOKIE_CONTENT` | *(Optional)* Your Instagram cookies for `.ig` command |

5. Click **Deploy**

### ⚠️ IMPORTANT: Keep it Alive 24/7

Render's free tier sleeps after 15 minutes of inactivity. **You MUST set up UptimeRobot** to keep your bot running 24/7.

#### Setup UptimeRobot (Takes 2 minutes):

1. **Go to** 👉 [https://uptimerobot.com](https://uptimerobot.com)
2. **Create a free account** (no credit card needed)
3. **Click "Add New Monitor"**
4. **Fill in:**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Lex Luthor Bot
   - **URL:** `https://your-app-name.onrender.com/ping`
     - Replace `your-app-name` with your actual Render app name
     - Example: `https://lexluthor-abc123.onrender.com/ping`
   - **Monitoring Interval:** 5 minutes
5. **Click "Create Monitor"**

**Done!** Your bot will now stay alive 24/7. UptimeRobot will ping it every 5 minutes, preventing Render from putting it to sleep. 🔥

---

## DEPLOY ON TERMUX

```sh
# Give storage permissions
termux-setup-storage

# Update system packages 
apt update && apt upgrade -y

# Install essentials 
apt install git nodejs ffmpeg libwebp python3 micro vim -y

# Clone the repository 
git clone https://github.com/engineermarcus/lexluthor && cd lexluthor

# Install dependencies
npm install

# Edit settings.js directly (add your SESSION_ID and OWNER_NUMBER)
micro settings.js

# Run the bot 
npm run luthor
```

> `Ctrl+S` to save. `Ctrl+Q` to quit.

---

## DEPLOY VPS / CODESPACES / LOCAL MACHINE

```sh
# Clone the repo
git clone https://github.com/engineermarcus/lexluthor && cd lexluthor

# Install dependencies 
npm install

# Edit settings.js with your SESSION_ID and OWNER_NUMBER
nano settings.js

# Run
npm run luthor
```

### Keep it alive with PM2:
```sh
npm install -g pm2
pm2 start main.js --name luthor
pm2 save
pm2 startup
```

---

## DEPLOY WITH DOCKER

```sh
# Clone
git clone https://github.com/engineermarcus/lexluthor && cd lexluthor

# Build the docker image 
docker build -t lexluthor .

# Run it
docker run -d --name luthor --restart unless-stopped -p 3001:3001 lexluthor
```

---

## 🛠️ CONFIGURATION

Edit `settings.js` directly or set environment variables:

```javascript
// Essential
export const SESSION_ID = 'your_session_id_here';
export const OWNER_NUMBER = '254700000000'; // No + sign

// Bot identity
export const BOT_NAME = 'Luthor MD';
export const OWNER_NAME = 'Your Name';

// Access control
export const OWNER_ONLY = true; // true = only owner can use commands

// Features (true/false)
export const WELCOME = true;
export const GOODBYE = true;
export const ANTI_DELETE = true;
export const ANTI_LINK = true;
export const AUTO_VIEW_STATUS = true;
export const AUTO_LIKE_STATUS = true;

// Auto Presence (typing, recording, online, none)
export const AUTO_PRESENCE = 'recording';

// Customize messages
export const WELCOME_MESSAGE = '👋 Welcome {name}, we are happy to have you here';
export const GOODBYE_MESSAGE = '👋 Goodbye {name}';

// Instagram (optional)
export const COOKIE_CONTENT = 'your_instagram_cookie_content';
// Navigate to instagram.com, login, use the "cookies.txt LOCALLY" extension, export cookies, paste content here
```

---

## 📡 API ENDPOINTS

Your bot exposes these endpoints:

- `GET /status` - Check bot status
- `GET /ping` - Keepalive endpoint (use for UptimeRobot)
- `POST /send` - Send messages programmatically
- `POST /restart` - Restart the bot

---

## 📝 COMMANDS

### Core
- `.ping` - Check if bot is alive
- `.alive` - Bot status with uptime
- `.menu` / `.help` - Show all commands

### Media Downloads
- `.play <query>` - Download audio with thumbnail
- `.audio <query>` - Download plain audio
- `.video <query>` / `.mp4 <query>` - Download video

### Social Media
- `.ig <username>` - Instagram profile info, followers, bio, pfp

### Utility
- `.sticker` / `.s` - Convert image/video to sticker (reply to media)
- `.toimg` / `.toimage` - Convert sticker to image
- `.tts <text>` - Text to speech
- `.english` / `.swahili` / `.french` / `.spanish` / `.arabic` / `.german` - Translate (reply or type)

### Fun
- `.meme` - Random meme
- `.joke` - Dad joke
- `.8ball <question>` - Magic 8 ball
- `.insult` - Roast someone
- `.yesno` - Yes or no with GIF
- `.bs` - Corporate nonsense generator
- `.bored` - Activity suggestion

### Group (Owner Only)
- `.kick` - Kick user (reply) — **Needs admin**
- `.mute` - Mute user (reply) — **Needs admin**
- `.unmute` - Unmute user
- `.muteall` - Mute entire group — **Needs admin**
- `.unmuteall` - Unmute group
- `.stalk` - DM a user (reply)
- `.stalkall` - DM all members

**Note:** Welcome/Goodbye work without admin privileges.

---

## 🔒 SECURITY NOTES

- Never share your `SESSION_ID`
- Don't commit `settings.js` with your real credentials to GitHub
- Never push your `COOKIE_CONTENT` — add it as an environment variable on Render
- The bot stores session data in `bot_session/` — this is gitignored
- Your phone can be off — bot runs independently

---

## 🐛 TROUBLESHOOTING

### Bot not connecting?
- Make sure your `SESSION_ID` is valid
- Get a fresh session from the session manager if needed

### `.ig` not working?
- Set `COOKIE_CONTENT` in your environment variables
- Navigate to instagram.com, login, use the **cookies.txt LOCALLY** browser extension, export and paste the content

### Welcome/Goodbye not working?
- Make sure `WELCOME` and `GOODBYE` are `true` in settings.js
- Bot doesn't need admin for welcome/goodbye

### Bot keeps going offline on Render?
- **Did you set up UptimeRobot?** This is MANDATORY for Render free tier
- Make sure the ping URL is correct: `https://your-app.onrender.com/ping`

### Commands not responding?
- Check your `PREFIX` in settings.js (default is `.`)
- If `OWNER_ONLY` is `true`, only the owner number can run commands

### YouTube downloads failing?
- The PO Token server (`bgutil-ytdlp-pot-provider`) must be running
- Check container logs for `PO Token server started on port 4416`

---

## 💡 PRO TIPS

- **Bot works even when your phone is off** — session is stored on the server
- **Set `AUTO_PRESENCE` to `'recording'`** for a cooler status effect
- **Use PM2 on VPS** for automatic restarts if bot crashes
- **UptimeRobot is mandatory** for Render free tier
- **Set `OWNER_ONLY` to `true`** to keep the bot private

---

## 🤝 CONTRIBUTING

Pull requests are welcome. For major changes, please open an issue first.

---

## ⚖️ LICENSE

MIT — Do whatever you want, just don't blame me.

---

## 💬 SUPPORT

Having issues? Open an issue on GitHub.

---

*Neiman Tech — 2025. Lex Luthor MD was not built for amateurs.*