// This script processes a JSON file obtained from the 

var fs = require('fs'); //IO filesystem module for node.js
var orbitalBodies = require('./PruebaTLE.json'); //Unfiltered TLE JSON file to read
var payloads = [];
var rocketStages = [];
var debris = [];
var unclassified = [];
var everythingButDebris = [];


for(i in orbitalBodies){
  orbitalBodies[i].clean = function(){
    delete this.ORDINAL;
    delete this.COMMENT;
    delete this.ORIGINATOR;
    delete this.NORAD_CAT_ID;
    //delete this.OBJECT_TYPE;
    delete this.CLASSIFICATION_TYPE;
    delete this.EPOCH;
    delete this.EPOCH_MICROSECONDS;
    delete this.MEAN_MOTION;
    delete this.ECCENTRICITY;
    delete this.INCLINATION;
    delete this.RA_OF_ASC_NODE;
    delete this.ARG_OF_PERICENTER;
    delete this.MEAN_ANOMALY;
    delete this.EPHEMERIS_TYPE;
    delete this.ELEMENT_SET_NO;
    delete this.REV_AT_EPOCH;
    delete this.BSTAR;
    delete this.MEAN_MOTION_DOT;
    delete this.MEAN_MOTION_DDOT;
    delete this.FILE;
    delete this.TLE_LINE0;
    delete this.OBJECT_ID;
    delete this.OBJECT_NUMBER;
    delete this.SEMIMAJOR_AXIS;
    //delete this.PERIOD;
    delete this.APOGEE;
    delete this.PERIGEE;
  }
}

// Generic function to stringify JSON arrays and store them into a file.
function storeFilteredTLE(tleJson, type){
  var str; 
  str = JSON.stringify(tleJson);
  if(tleJson.length > 0){
    fs.writeFile(type + 'TLE.json', str,
      function(err){
        if(err) return console.log(err);
        console.log('File ' + type + 'TLE.json created.');
    });
  } else {
    console.log('No objects of type ' + type + ' were filtered');
    console.log('something went wrong.')
  }
}

// Review if there are bodies of types other than payloads, rocket bodies, and generic debris.
// Some objects are awaiting classification and ar marked as type TBA ("To Be Announced").
for(var i = 1, unclassifiedObjectCount = 0 ; i < orbitalBodies.length; i += 1){
  if((orbitalBodies[i].OBJECT_TYPE !== "PAYLOAD") &&
     (orbitalBodies[i].OBJECT_TYPE !== "ROCKET BODY") &&
     (orbitalBodies[i].OBJECT_TYPE !== "DEBRIS") &&
     (orbitalBodies[i].OBJECT_TYPE !== "TBA")) {
    unclassifiedObjectCount += 1;
  }
  console.log("Encountered object of type" + orbitalBodies[i].OBJECT_TYPE);
}
console.log("Encountered " + unclassifiedObjectCount + " unclassified objects.");

for(i in orbitalBodies){
  switch(orbitalBodies[i].OBJECT_TYPE){
    case "PAYLOAD":
      break;
    case "ROCKET BODY":
      break;
    case "DEBRIS":
      break;
    default:
      break;
  }
}

// Split the TLE data obtained from Space track into different JSON arrays for each body type
// for each option, the OBJECT_TYPE key is deleted before storing
// it in its filtered array in order to reduce file sizes

for(i in orbitalBodies){
  if(orbitalBodies[i].OBJECT_TYPE === "PAYLOAD" ){
    orbitalBodies[i].clean();
    payloads.push(orbitalBodies[i]);
  } else if (orbitalBodies[i].OBJECT_TYPE === "ROCKET BODY") {
    orbitalBodies[i].clean();
    rocketStages.push(orbitalBodies[i]);
  } else if (orbitalBodies[i].OBJECT_TYPE === "DEBRIS") {
    orbitalBodies[i].clean();
    debris.push(orbitalBodies[i]);
  } else if (orbitalBodies[i].OBJECT_TYPE === "UNCLASSIFIED"){
    orbitalBodies[i].clean();
    unclassified.push(orbitalBodies[i]);
  }
}

// Print summary of TLE contents
console.log("From a total of " + orbitalBodies.length + " currently orbiting bodies we have: ");
console.log(" - " + payloads.length + " payloads");
console.log(" - " + rocketStages.length + " rocket stages");
console.log(" - " + debris.length + " debris objects");
console.log(" - " + toBeAnnounced.length + " to be announced objects")
console.log(" - " + unclassified.length + " unclassified objects");

// Store separate JSON files for each type of object.
storeFilteredTLE(orbitalBodies, 'allObjects');
storeFilteredTLE(payloads, 'payloads');
storeFilteredTLE(rocketStages, 'rocketStages');
storeFilteredTLE(debris, 'debris');
storeFilteredTLE(unclassified, 'unclassifiedObjects');
