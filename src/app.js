// launch with node src/app.js

const { Telegraf } = require("telegraf");
const { decodeCode } = require("./decodeUrgency");
const { vehicles } = require("./vehicles");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/credenziali.env" });

const previousEmergencies = [];
const emergencies = [];
const subscribers = [];

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// echo user text messages
bot.on("message", (ctx) => textManager(ctx));

console.log("config bot");
bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

function sendMessageToSubscribers(text) {
  subscribers.forEach((subscriber) => {
    bot.telegram.sendMessage(subscriber.chatId, text);
  });
}

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
    // remove the subscriber with the chat id
    subscribers = subscribers.filter((subscriber) => {
      return subscriber.chatId !== ctx.chat.id;
    });
  }
  if (ctx.message.text === "Monterenzio41!!!!") {
    ctx.reply(
      "Password accettata, scrivi il mezzo a cui desideri sottoscrivere le notifiche TUTTO IN MAIUSCOLO. /stop per cancellare"
    );
    // print chat id
    console.log(ctx.chat.id);
    console.log(ctx.message.from.username);

    // add subscriber
    subscribers.push({
      chatId: ctx.chat.id,
      username: ctx.message.from.username,
    });
  }
  if (ctx.message.text.includes(",")) {
    const splitted = ctx.message.text.split(",");
    // mezzi da sottoscrivere

    ctx.reply("mezzi sottoscritti");
    console.log(ctx.chat.id);
    console.log(ctx.message.from.username);
  }
}

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// add cors middleware
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/hello", (req, res) => {
  const sentData = req.query;
  console.log(req.query);
  res.send("Hello World!");
});

app.post("/data", (req, res) => {
  console.log(req.body.dati);
  // parse json that was stringified
  const data = JSON.parse(req.body.dati);

  handleEmergencyData(data);
  res.send("ok");
});

app.listen(13000, () => {
  console.log("Bot app listening on port 13000!");
});

function handleEmergencyData(json) {
  // json is an array of Emergency objects
  json.forEach((emergency) => {
    if (emergency?.address !== undefined) {
      // if emergency has a vehicleData, if it has a vehicle not in the list,
      // discard it

      emergencies.push(emergency);
    }
  });

  // CHECK IF NEW EMERGENCY
  emergencies.forEach((emergency) => {
    if (!previousEmergencies.includes(emergency.emergencyId)) {
      // NEW Emergency!
      // send message to subscribers
      console.log("new emergency: " + emergency.emergencyId);
    } else {
      // OLD Emergency!
      // CHECK IF CHANGE PRIORITY
      if (
        previousEmergencies[emergency.emergencyId].codex !== emergency.codex
      ) {
        // CHANGE CODEX!
        // send message to subscribers
        console.log("change codex");
      }
      // CHECK CHANGE VEHICLES
      if (
        previousEmergencies[emergency.emergencyId].vehicle !== emergency.vehicle
      ) {
        // CHANGE VEHICLES!
        // send message to subscribers
        console.log("change codex");
      }
    }
  });

  // send message to subscribers
  // sendMessageToSubscribers("bot online");
}

function messageNewEmergency(emergency) {
  let emergencyString = "";
  // example
  // 🚑ALERT! EMERGENZA N° 021815 alle 12:29 IN CORSO
  // SC01V località OZZANO DELL'EMILIA CAPOLUOGO - OZZANO DELL'EMILIA PARCO DELLA RESISTENZA PARCO DELLA RESISTENZA
  // Il mezzo assegnato all'intervento è la macchina MONTERENZIO41 in STRADA con patologia TRAuMATICA codice VERDE
  // link a openstreetmap
  emergencyString =
    `🚑ALERT! EMERGENZA N° ${emergency.emergencyId} alle ${emergency.timeDelayed} IN CORSO ` +
    `\n ${emergency.localityMunicipality} ${emergency.address} \n Il mezzo assegnato all'intervento è la macchina ${emergency.vehicle} ` +
    `in STRADA con patologia ${emergency.patology} codice ${emergency.codex} \n link a openstreetmap `;
  console.log("new emergency");
  return emergencyString;
}

function messageEndEmergency() {
  // example
  // EMERGENZA N° 021717 -> KC03R - Mezzo MONTERENZIO41 si è liberato alle 11:30, codice VERDE, luogo OZZANO DELL'EMILIA
  console.log("end emergency");
}

function messageChangeCode() {
  // example
  // 🚑ALERT! EMERGENZA N° 021815 ha cambiato codice colore gravità da VERDE a GIALLO alle ore 12:38
  console.log("change code");
}

function messageChangeNumberOfVehicles() {
  console.log("change number of vehicles");
}

function messageEmergencyInStandBy() {
  console.log("emergency in standby");
}
