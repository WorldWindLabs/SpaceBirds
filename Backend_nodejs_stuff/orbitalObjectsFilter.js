var fs = require('fs'); //IO filesystem module for node.js

var orbitalBodies = require('./testTLE.json'); //FOR TESTING Currently orbiting satellites' TLE
//var orbitalBodies = require('./basicTLE.json'); //Currently orbiting satellites' TLE
var satcat = require('./SATCAT.json'); //Catalog with every sat launch in history, with country data
var launchSites = require('./launchSites.json'); //To retrieve launch site names from SATCAT codes
var countries = require('./countries.json'); //To retrieve country/owner name from SATCAT codes
var operationalSats = require('./non_automated_data/operationalSats.json'); //To retrieve operational status

//Many many counters.
var payloads,
    rocketStages,
    debris,
    unknownType;

var operational,
    nonoperational,
    partOperational,
    backup,
    spare,
    extended,
    partial,
    unknownStatus;

//Initialize counters
payloads = rocketStages = debris = unknownType = 0
operational = nonoperational = partOperational = backup = spare = extended = decayed = unknownStatus = 0;

//TODO: Stop using slow, awful linear search. It takes ages to execute. Should use something better later.
// this thing is easily readable, though.
console.log(" ");
console.log('Adding additional data to TLE ...');
for(var i = 0, numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  var start = clock();
  for (var j = 0, numSatcat = satcat.length; j < numSatcat; j += 1){
    //Adding new fields from SATCAT.json to our customized TLE.json
    if(orbitalBodies[i].NORAD_CAT_ID === satcat[j].NORAD_CAT_ID)
    {
      //Add new keys to TLE json
      orbitalBodies[i].LAUNCH_DATE = satcat[j].LAUNCH; //Launch full date: YYYY-MM-DD

      //Retrieve the launch site name from the file launchSites.json
      for(var k = 0, numLaunchSites = launchSites.length; k < numLaunchSites; k += 1){
        if(satcat[j].SITE === launchSites[k].SITE_CODE){
          orbitalBodies[i].LAUNCH_SITE = launchSites[k].LAUNCH_SITE;
        }
      }

      //Retrieve the owner name from the file countries.json
      for(var n = 0, numCountries = countries.length; n < numCountries; n += 1){
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
console.log('Obtaining orbit type...');

//Assign orbit type
for(var i = 0, numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  var satellite = orbitalBodies[i]

  if(//GEO: 0.99 <= Mean Motion <= 1.01 and Eccentricity < 0.01
    (satellite.MEAN_MOTION >= 0.99) &&
    (satellite.MEAN_MOTION <= 1.01) &&
    (satellite.ECCENTRICITY < 0.01)
   ){
    satellite.ORBIT_TYPE = "Geosynchronous";
  }

  else if(//MEO: 600 minutes <= Period <= 800 minutes & Eccentricity < 0.25
    // (satellite.MEAN_MOTION >= 1.8) && //Space-track uses this in queries, but not in description
    // (satellite.MEAN_MOTION <= 2.39) && //TODO: Re-review definitions of MEO parameters
    (satellite.PERIOD >= 600) &&
    (satellite.PERIOD <= 800) &&
    (satellite.ECCENTRICITY < 0.25)
  ){
    satellite.ORBIT_TYPE = "Middle Earth Orbit";
  }

  else if(//LEO: Mean Motion > 11.25 & Eccentricity < 0.25
    (satellite.MEAN_MOTION >= 11.25) &&
    (satellite.ECCENTRICITY < 0.25)
  ){
    satellite.ORBIT_TYPE = "Low Earth Orbit";
  }

  else if(//HEO: Eccentricity > 0.25
    (satellite.ECCENTRICITY > 0.25)
  ){
    satellite.ORBIT_TYPE = "Highly Elliptical Orbit";
  }
  else{
    satellite.ORBIT_TYPE = "Unclassified";
  }
}
console.log('Orbit type calculated');
console.log('Obtaining operational status...');

function obtainOperationalStatus(payload){
  var status;
  for(var j = 0, numOperationalSats = operationalSats.length; j < numOperationalSats; j += 1){

    if(operationalSats[j].NORAD_CAT_ID === parseInt(payload.NORAD_CAT_ID)){

      switch(operationalSats[j].OPERATIONAL_STATUS){
        case "+":
          status = "Operational";
          operational++;
          break;
        case "-":
          status = "Nonoperational";
          nonoperational++;
          break;
        case "P":
          status = "Partially operational";
          partOperational++;
          break;
        case "B":
          status = "Backup/Standby";
          backup++;
          break;
        case "S":
          status = "Operational (spare)";
          spare++;
          break;
        case "X":
          status = "Operational (extended mission)";
          extended++;
          break;
        case "D":
          status = "Decayed";
          console.log('Why am I here? <-----------------');
          decayed++;
          break;
        default:
          status = "Unknown";
          unknownStatus++;
      }

    }

  }
  return status;
}

//Filter
//for each option, the OBJECT_TYPE key is deleted before storing
//it in its filtered array in order to reduce file sizes
for(var i = 0, numOrbitalbodies = orbitalBodies.length; i < numOrbitalbodies; i += 1){
  switch(orbitalBodies[i].OBJECT_TYPE){
    case "PAYLOAD":
      orbitalBodies[i].OPERATIONAL_STATUS = obtainOperationalStatus(orbitalBodies[i]);
      payloads++;
      break;
    case "ROCKET BODY":
      orbitalBodies[i].OPERATIONAL_STATUS = "N/A, derelict rocket body";
      rocketStages++;
      break;
    case "DEBRIS":
      orbitalBodies[i].OPERATIONAL_STATUS = "N/A, space debris";
      debris++;
      break;
    default:
      orbitalBodies[i].OPERATIONAL_STATUS = "N/A";
      unknownType++; //Unknown objects, TBA objects
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

//Results
console.log(" ");
console.log("From a total of " + orbitalBodies.length +
 " currently orbiting bodies we have: ");
console.log(" - " + payloads + " payloads");
console.log(" - " + rocketStages + " rocket stages");
console.log(" - " + debris + " debris objects");
console.log(" - " + unknownType + " uknwown objects");
console.log(" ");
console.log("From the payloads: ");
console.log(" - " + operational + " are operational");
console.log(" - " + nonoperational + " are nonoperational");
console.log(" - " + partOperational + " are partially operational");
console.log(" - " + backup + " are backups or in standby mode");
console.log(" - " + spare + " are operational");
console.log(" - " + extended + " are nonoperational");
console.log(" - " + decayed + " are partially operational");
console.log(" - " + unknownStatus + " are backups or in standby mode");

printFilteredFile(orbitalBodies, 'sampleTLE', function(){
  console.log(" ");
  console.log(" + - + - + - + - + - FINISHED - + - + - + - + - + - + ");
  console.log(" ");

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
        console.log(" ");
        finishingCallback();
    });
  } else {
    console.log('No objects of type ' + type + ' were filtered');
    console.log('something went wrong.')
  }
}
