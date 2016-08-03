var fs = require('fs'); //IO filesystem module for node.js
var orbitalBodies = require('./TLE.json'); //Unfiltered TLE JSON file to read
var payloads = [];
var rocketStages = [];
var debris = [];
var unknown = [];
var everythingButDebris = [];


//Crap and unnecesary OOP implementation of a cleaning function
//wastes a lot of memory/CPU but it keeps the main loop easy to understand.
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

function printFilteredTLE(tleJson, type){
  var str; //To stringify JSON arrays
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

for(i in orbitalBodies){
  switch(orbitalBodies[i].OBJECT_TYPE){
    case "PAYLOAD":
      break;
    case "ROCKET BODY":
      break;
    case "DEBRIS":
      break;
    case default:
      break;
  }
}

//Check out for other object types. It happens that there's a "TBA" type.
for(var i = 1; i < orbitalBodies.length; i += 1){
  if((orbitalBodies[i].OBJECT_TYPE !== "PAYLOAD") && (orbitalBodies[i].OBJECT_TYPE !== "ROCKET BODY") && (orbitalBodies[i].OBJECT_TYPE !== "DEBRIS") ){
    console.log(orbitalBodies[i].OBJECT_TYPE);
  }
}

//Filter
//for each option, the OBJECT_TYPE key is deleted before storing
//it in its filtered array in order to reduce file sizes
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
  } else if (orbitalBodies[i].OBJECT_TYPE === "UNKNOWN"){
    orbitalBodies[i].clean();
    unknown.push(orbitalBodies[i]);
  }
}

console.log("From a total of " + orbitalBodies.length + " currently orbiting bodies we have: ");
console.log(" - " + payloads.length + " payloads");
console.log(" - " + rocketStages.length + " rocket stages");
console.log(" - " + debris.length + " debris objects");
console.log(" - " + unknown.length + " uknwown objects");

printFilteredTLE(orbitalBodies, 'allObjects');
printFilteredTLE(payloads, 'payloads');
printFilteredTLE(rocketStages, 'rocketStages');
printFilteredTLE(debris, 'debris');
printFilteredTLE(unknown, 'unknownObjects');
