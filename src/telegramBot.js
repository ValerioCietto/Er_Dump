// launch telegramBot.js with node src/telegramBot.js
// link al bot t.me/MrDump_bot

const { Telegraf } = require("telegraf");
// retrieve credentials with dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./src/credenziali.env" });
// use dotenv configs

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// echo user text messages
bot.on("message", (ctx) => textManager(ctx));

console.log("config bot");
bot.launch();
console.log("start bot");
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

function sendMessageToTelegram(chatId, text) {
  bot.telegram.sendMessage(chatId, text);
}

function textManager(ctx) {
  console.log(ctx.message.text);
  if (ctx.message.text === "/start") {
    ctx.reply(
      "Benvenuto in ER dump bot. Scrivi la password per connetterti al servizio"
    );
  }
  if (ctx.message.text === "/stop") {
    ctx.reply(
      "Con questo comando non riceverai più notifiche dal bot. Cancella e crea di nuovo la chat per ricominciare."
    );
  }
  if (ctx.message.text === "D4mp!!") {
    ctx.reply(
      "Password accettata, scrivi il mezzo a cui desideri sottoscrivere le notifiche TUTTO IN MAIUSCOLO. /stop per cancellare"
    );
    // print chat id
    console.log(ctx.chat.id);
    console.log(ctx.message.from.username);
  }
  if (ctx.message.text === "MEZZO1,MEZZO2") {
    ctx.reply("mezzi sottoscritti");
    console.log(ctx.chat.id);
    console.log(ctx.message.from.username);
  }
}

module.exports = { sendMessageToTelegram };
