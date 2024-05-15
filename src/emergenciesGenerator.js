// launch with node src/emergenciesGenerator.js
// this script generates a random list of emergencies
// then add or remove one or two from the list
// then send data using axios

const axios = require("axios");

const vehicles = require("./vehicles");

const vehicleList = vehicles.vehicles;

const randomVehicle =
  vehicleList[Math.floor(Math.random() * vehicleList.length)];

console.log("random vehicle: " + randomVehicle);

function generateRandomVehicle() {
  const vehicleObject = {
    vehicleCode: vehicleList[Math.floor(Math.random() * vehicleList.length)],
  };

  return vehicleObject;
}

function generateRandomCodex() {
  const codexList = ["KC19G", "KC19H", "KC19I", "KC19J"];
  return codexList[Math.floor(Math.random() * codexList.length)];
}

function generateRandomVehicleAssegnation() {
  const vehicleList = [];
  // a random times between 0 and 2 times, add a generateRandomVehicle to the list
  const times = Math.floor(Math.random() * 3);

  for (let i = 0; i < times; i++) {
    vehicleList.push(generateRandomVehicle());
  }

  // if vehicle list has 0 elements return null
  if (vehicleList.length === 0) {
    return null;
  }
  return vehicleList;
}

// function generate random emergency
function generateRandomEmergency() {
  // generate random urgency
  const emergency = {
    address: "VIA RONCAGLIO, 21 Piano: R",
    emergencyId: Math.floor(Math.random() * 1000000),
    timeDelayed: Math.floor(Math.random() * 24),
    localityMunicipality: "BOLOC",
    codex: generateRandomCodex(),
    district: "ZONA BLU 4 - BO LOC 2023 07",
    criticity: "G",
    eventCoord: {
      class: "it.eng.area118.dumpdp.model.LatLonDM",
      latD: 44,
      latM: 32.23339088586016,
      lonD: 11,
      lonM: 21.164510289911966,
    },
    manageVehicleForSynoptics: generateRandomVehicleAssegnation(),
  };

  return emergency;
}
console.log(generateRandomEmergency());
