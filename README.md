# LEX LUTHER MD BOT 

This is the latest whatsappbot from Neiman Tech @2026
### GET SESSION ID 
[![Website](https://img.shields.io/website?url=https%3A%2F%2Flexluthermd.onrender.com&style=for-the-badge&logo=render&label=LexLutherMD&color=brightgreen)](https://lexluthermd.onrender.com)


## FORK

## KEY FEATURES
- status managemanent 

## DEPLOY ON TERMUX 
- Download Termux From PlayStore 
**SETUP STORAGE**

```sh
termux-setup-storage 
```
**UPDATE**

```sh
apt update && apt upgrade -y
```
**INSTALL DEPENDENCIES**

```sh
apt install git nodejs python3 gh curl wget micro vim
```
**CLONE THE REPOSITORY**

```sh
git clone https://github.com/engineermarcus/lex-luther && cd lex-luther
```
**FINAL SETUP**
*setup the bot according to your preferences Ctrl + S to save and Ctrl + q to quit*

```sh
cp -r example.settings.js settings.js && micro settings.js && npm install
```
**RUN**

```sh
npm run luther
```