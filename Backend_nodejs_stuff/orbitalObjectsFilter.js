var fs = require('fs'); //IO filesystem module for node.js
var orbitalBodies = require('./unfilteredTLE.json'); //Currently orbiting satellites' TLE
var satcat = require('./SATCAT.json'); //Catalog with every sat launch in history, with country data
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
    //delete this.NORAD_CAT_ID;
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

for(var i = 0, numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  var start = clock();
  for (var j = 0, numSatcat = satcat.length; j < numSatcat; j += 1){
    if(orbitalBodies[i].NORAD_CAT_ID === satcat[j].NORAD_CAT_ID)
    {
      //Add new keys to TLE json
      orbitalBodies[i].COUNTRY = satcat[j].COUNTRY; //Country or organization that launched the sattelite
      orbitalBodies[i].LAUNCH_YEAR = satcat[j].LAUNCH_YEAR;
      orbitalBodies[i].LAUNCH = satcat[j].LAUNCH; //Launch full date: YYYY-MM-DD
      orbitalBodies[i].LAUNCH_NUM = satcat[j].LAUNCH_NUM; //Consecutive order of launch e.g. Sputnik 1 is launch 1 (with 2 objects)
      orbitalBodies[i].LAUNCH_YEAR = satcat[j].LAUNCH_YEAR; //Launch year only (may be useful to avoid string processing)
      orbitalBodies[i].LAUNCH_PIECE = satcat[j].LAUNCH_PIECE; //Pieces in orbit of the same launch e.g. Sputnik 1 had 2 pieces: rocket and payload
      orbitalBodies[i].SITE = satcat[j].SITE; //Launch site. We don't have the codes yet
    }
  }
  var duration = clock(start);
  console.log('Time spent on ' + i + ' cycle ' + duration);
}


function printFilteredFile(tleJson, type, finishingFunction){
  var str; //To stringify JSON arrays
  str = JSON.stringify(tleJson);
  if(tleJson.length > 0){
    fs.writeFile(type + '.json', str,
      function(err){
        if(err) return console.log(err);
        console.log('File ' + type + '.json created.');
        finishingFunction();
    });
  } else {
    console.log('No objects of type ' + type + ' were filtered');
    console.log('something went wrong.')
  }
}

//Filter
//for each option, the OBJECT_TYPE key is deleted before storing
//it in its filtered array in order to reduce file sizes
for(var i = 0; i < orbitalBodies.length; i+= 1){
  orbitalBodies[i].clean();
  switch(orbitalBodies[i].OBJECT_TYPE){
    case "PAYLOAD":
      payloads.push(orbitalBodies[i]);
      break;
    case "ROCKET BODY":
      rocketStages.push(orbitalBodies[i]);
      break;
    case "DEBRIS":
      debris.push(orbitalBodies[i]);
      break;
    default:
      //Unknown objects, TBA objects
      unknown.push(orbitalBodies[i]);
      break;
  }
}

//Check out for other object types. It happens that there's a "TBA" type.
// for(var i = 1; i < orbitalBodies.length; i += 1){
//   if((orbitalBodies[i].OBJECT_TYPE !== "PAYLOAD") &&
//      (orbitalBodies[i].OBJECT_TYPE !== "ROCKET BODY") &&
//      (orbitalBodies[i].OBJECT_TYPE !== "DEBRIS") ){
//         console.log(orbitalBodies[i].OBJECT_TYPE);
//      }
// }

//Counter. Note that we're wasting memory by storing the different object types
//in their own array, but it may be useful later.
console.log("From a total of " + orbitalBodies.length +
 " currently orbiting bodies we have: ");
console.log(" - " + payloads.length + " payloads");
console.log(" - " + rocketStages.length + " rocket stages");
console.log(" - " + debris.length + " debris objects");
console.log(" - " + unknown.length + " uknwown objects");

printFilteredFile(orbitalBodies, 'TLE', function(){
  console.log(" + - + - + - + - + - + - + - + - + - + - + ")
});

function obtainExecutionTime(functionToMeasure){
  var timeSpent;
  var start = performance.now();
  functionToMeasure();
  var end = performance.now();
  timeSpent = end - start;
  return timeSpent;
}

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}
