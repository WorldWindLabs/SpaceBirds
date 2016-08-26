var fs = require('fs'); //IO filesystem module for node.js
var orbitalBodies = require('./testTLE.json'); //Currently orbiting satellites' TLE
//var orbitalBodies = require('./basicTLE.json'); //Currently orbiting satellites' TLE
var satcat = require('./SATCAT.json'); //Catalog with every sat launch in history, with country data
var launchSites = require('./launchSites.json'); //To retrieve launch site names from SATCAT codes
var countries = require('./countries.json'); //To retrieve country/owner name from SATCAT codes
var operationalSats = require('./non_automated_data/operationalSats.json'); //To retrieve operational status
//Sats categorized by orbit types. It's probably better to calculate this in the app instead.
// var geoSats = require('./GEO.json');
// var heoSats = require('./HEO.json');
// var meoSats = require('./MEO.json');
// var leoSats = require('./LEO.json');

//Arrays to store objects by object type. Unnecesary as of now but may be useful later.
var payloads = [];
var rocketStages = [];
var debris = [];
var unknown = [];

//TODO: Stop using slow, awful linear search. It takes ages to execute. Should use something better later.
// this thing is easily readable, though.
console.log('Adding additional data to TLE ...');
for(var i = 0; numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  var start = clock();
  for (var j = 0; numSatcat = satcat.length; j < numSatcat; j += 1){
    //Adding new fields from SATCAT.json to our customized TLE.json
    if(orbitalBodies[i].NORAD_CAT_ID === satcat[j].NORAD_CAT_ID)
    {
      //Add new keys to TLE json
      orbitalBodies[i].LAUNCH = satcat[j].LAUNCH; //Launch full date: YYYY-MM-DD
      orbitalBodies[i].LAUNCH_NUM = satcat[j].LAUNCH_NUM; //Consecutive order of launch e.g. Sputnik 1 is launch 1 (with 2 objects)
      orbitalBodies[i].LAUNCH_YEAR = satcat[j].LAUNCH_YEAR; //Launch year only (may be useful to avoid string processing)
      orbitalBodies[i].LAUNCH_PIECE = satcat[j].LAUNCH_PIECE; //Pieces in orbit of the same launch e.g. Sputnik 1 had 2 pieces: rocket and payload

      //Retrieve the launch site name from the file launchSites.json
      for(var k = 0; numLaunchSites = launchSites.length; k < numLaunchSites; k += 1){
        if(satcat[j].SITE === launchSites[k].SITE_CODE){
          orbitalBodies[i].LAUNCH_SITE = launchSites[k].LAUNCH_SITE;
        }
      }

      //Retrieve the owner name from the file countries.json
      for(var n = 0; numCountries = countries.length; n < numCountries; n += 1){
        if(satcat[j].COUNTRY === countries[n].SPADOC_CD){
          orbitalBodies[i].OWNER = countries[n].COUNTRY;
        }
      }
    }
  }
  //var duration = clock(start);
  //console.log('Time spent on ' + i + ' cycle ' + duration);
}
console.log('Owner, country, launch site and launch details added to TLE data.');

//Assign orbit type
for(var i = 0; numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  var satellite = orbitalBodies[i]

  if(//GEO: 0.99 <= Mean Motion <= 1.01 and Eccentricity < 0.01
    (satellite.MEAN_MOTION >= 0.99) &&
    (satellite.MEAN_MOTION <= 1.01) &&
    (satellite.ECCENTRICITY < 0.01)
   ){
    satellite.ORBIT_TYPE = "Geosynchronous";
  }

  else if(//MEO: 600 minutes <= Period <= 800 minutes & Eccentricity < 0.25
    // (satellite.MEAN_MOTION >= 1.8) &&
    // (satellite.MEAN_MOTION <= 2.39) &&
    (satellite.PERIOD >= 600) &&
    (satellite.PERIOD <= 800) &&
    (satellite.ECCENTRICITY < 0.25)
  ){
    satellite.ORBIT_TYPE = "Middle Earth Orbit";
  }

  else if(//LEO: Mean Motion > 11.25 & Eccentricity < 0.25
    (satellite.MEAN_MOTION >= 11.25) &&
    (satellite.ECCENTRICITY < 0.25) &&
  ){
    satellite.ORBIT_TYPE = "Low Earth Orbit";
  }

  else if(//HEO: Eccentricity > 0.25
    (satellite.ECCENTRICITY > 0.25) &&
  ){
    satellite.ORBIT_TYPE = "Highly Elliptical Orbit";
  }

  else{
    satellite.ORBIT_TYPE = "Unclassified orbit";
  }
}

//Filter
//for each option, the OBJECT_TYPE key is deleted before storing
//it in its filtered array in order to reduce file sizes
for(var i = 0; numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
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

printFilteredFile(orbitalBodies, 'updatedTLE', function(){
  console.log(" + - + - + - + - + - FINISHED - + - + - + - + - + - + ")
});

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
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
