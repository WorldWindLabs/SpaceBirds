var fs = require('fs'); //IO filesystem module for node.js
var orbitalBodies = require('./unfilteredTLE.json'); //Currently orbiting satellites' TLE
var satcat = require('./SATCAT.json'); //Catalog with every sat launch in history, with country data
var launchSites = require('./launchSites.json')

//Arrays to store objects by object type. Unnecesary as of now but may be useful later.
var payloads = [];
var rocketStages = [];
var debris = [];
var unknown = [];

//Crap and unnecesary OOP implementation of a cleaning function
//wastes a lot of memory/CPU but it keeps the main filter easy to understand.
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

//TODO: Stop using slow, awful linear search. It takes ages to execute. Should use something better later.
// this thing is easily readable, though.
for(var i = 0, numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  var start = clock();
  for (var j = 0, numSatcat = satcat.length; j < numSatcat; j += 1){
    //Adding new fields from SATCAT.json to our customized TLE.json
    if(orbitalBodies[i].NORAD_CAT_ID === satcat[j].NORAD_CAT_ID)
    {
      //Add new keys to TLE json
      orbitalBodies[i].COUNTRY = satcat[j].COUNTRY; //Country or organization that launched the satellite
      orbitalBodies[i].LAUNCH = satcat[j].LAUNCH; //Launch full date: YYYY-MM-DD
      orbitalBodies[i].LAUNCH_NUM = satcat[j].LAUNCH_NUM; //Consecutive order of launch e.g. Sputnik 1 is launch 1 (with 2 objects)
      orbitalBodies[i].LAUNCH_YEAR = satcat[j].LAUNCH_YEAR; //Launch year only (may be useful to avoid string processing)
      orbitalBodies[i].LAUNCH_PIECE = satcat[j].LAUNCH_PIECE; //Pieces in orbit of the same launch e.g. Sputnik 1 had 2 pieces: rocket and payload
      //Retrieve the launch site name from the file launchSites.json
      //Still linear search crap, but the launchSites .json file is short
      for(var k = 0, numLaunchSites = launchSites.length; k < numLaunchSites; k += 1){
        if(satcat[j].SITE === launchSites[k].SITE_CODE){
          orbitalBodies[i].LAUNCH_SITE = launchSites[k].LAUNCH_SITE;
        }
      }
    }
  }
  //var duration = clock(start);
  //console.log('Time spent on ' + i + ' cycle ' + duration);
}


function printFilteredFile(tleJson, type, finishingCallback){
  var str; //To stringify JSON arrays
  str = JSON.stringify(tleJson);
  if(tleJson.length > 0){
    fs.writeFile(type + '.json', str,
      function(err){
        if(err) return console.log(err);
        console.log('File ' + type + '.json created.');
        finishingCallback();
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

//Check out for other object types. For instance, it happens that there's a "TBA" type.
// for(var i = 1; i < orbitalBodies.length; i += 1){
//   if((orbitalBodies[i].OBJECT_TYPE !== "PAYLOAD") &&
//      (orbitalBodies[i].OBJECT_TYPE !== "ROCKET BODY") &&
//      (orbitalBodies[i].OBJECT_TYPE !== "DEBRIS") ){
//         console.log(orbitalBodies[i].OBJECT_TYPE);
//      }
// }

//Counter. Note that we're wasting memory by storing the different object types
//in their own array, but it may be useful later to provide different json files.
console.log("From a total of " + orbitalBodies.length +
 " currently orbiting bodies we have: ");
console.log(" - " + payloads.length + " payloads");
console.log(" - " + rocketStages.length + " rocket stages");
console.log(" - " + debris.length + " debris objects");
console.log(" - " + unknown.length + " uknwown objects");

printFilteredFile(orbitalBodies, 'TLE', function(){
  console.log(" + - + - + - + - + - FINISHED - + - + - + - + - + - + ")
});

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}
