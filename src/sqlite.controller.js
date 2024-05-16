// launch with node src/sqlite.controller.js

// sqlite controller

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// open database
const db = new sqlite3.Database(
  path.resolve(__dirname, "../db/118er.db"),
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the 118er database.");
  }
);

async function dbCreate() {
  db.run(
    "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, username TEXT, chatId TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXIST subscription (id INTEGER PRIMARY KEY, chatId TEXT, username TEXT, vehicleCode TEXT)"
  );
}

async function addUser(username, chatId) {
  // add user in table user
  db.run(
    "INSERT INTO user (username, chatId) VALUES (?, ?)",
    [username, chatId],
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("user added");
    }
  );
}

async function addSubscription(chatId, username, vehicleCode) {
  db.run(
    "INSERT INTO subscription (chatId, username, vehicleCode) VALUES (?, ?, ?)",
    [chatId, username, vehicleCode],
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("subscription added");
    }
  );
}

async function getSubscribers(vehicleCode) {
  subscribers = [];

  db.each(
    "SELECT * FROM subscription WHERE vehicleCode = ?",
    [vehicleCode],
    (err, row) => {
      if (err) {
        console.error(err.message);
      }

      subscribers.push(row);
    }
  );
  return subscribers;
}

async function removeSubscriber(chatId, vehicleCode) {
  db.run(
    "DELETE FROM subscription WHERE chatId = ? AND vehicleCode = ?",
    [chatId, vehicleCode],
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("subscriptions removed");
    }
  );
}

module.exports = db;
