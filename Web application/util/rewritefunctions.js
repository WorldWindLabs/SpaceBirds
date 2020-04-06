"use strict"

//Abstraction of an orbital body
function orbitalBody(satelliteData){
  this.intlDes = satelliteData.OBJECT_ID;
  this.objectName = satelliteData.OBJECT_NAME;
  this.noradID = satelliteData.NORAD_CAT_ID;
  this.objectType = satelliteData.OBJECT_TYPE;
  this.orbitalPeriod = satelliteData.PERIOD;
  this.inclination = satelliteData.INCLINATION;
  this.apogee = satelliteData.APOGEE;
  this.perigee = satelliteData.PERIGEE;
  this.eccentricity = satelliteData.ECCENTRICITY;
  this.meanMotion = satelliteData.MEAN_MOTION;
  this.tleLine1 = satelliteData.TLE_LINE1;
  this.tleLine2 = satelliteData.TLE_LINE2;
  this.launchDate = satelliteData.LAUNCH_DATE;
  this.launchSite = satelliteData.LAUNCH_SITE;
  this.owner = satelliteData.OWNER;
  this.orbitType = satelliteData.ORBIT_TYPE;
  this.operationalStatus = satelliteData.OPERATIONAL_STATUS;

  this.latitude = null;
  this.longitude = null;
  this.altitude = null;
  this.collada3dModel = retrieve3dModelPath(satelliteData.OBJECT_ID);
}


function obtainExecutionTime(functionToMeasure){
  var timeSpent;
  var start = performance.now();
  functionToMeasure();
  var end = performance.now();
  timeSpent = end - start;
  return timeSpent;
}

function deg2text(deg, letters) {
  var letter;
  if (deg < 0) {
      letter = letters[1]
  } else {
      letter = letters[0]
  }
  var position = Math.abs(deg);
  var degrees = Math.floor(position);
  position -= degrees;
  position *= 60;
  var minutes = Math.floor(position);
  position -= minutes;
  position *= 60;
  var seconds = Math.floor(position * 100) / 100;
  return degrees + "° " + minutes + "' " + seconds + "\" " + letter;
}

// Orbit Propagation (MIT License, see https://github.com/shashwatak/satellite-js)
function getPosition (satrec, time) {
  var position_and_velocity = satellite.propagate(satrec,
    time.getUTCFullYear(),
    time.getUTCMonth() + 1,
    time.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds());
  var position_eci = position_and_velocity["position"];

  var gmst = satellite.gstime_from_date(time.getUTCFullYear(),
    time.getUTCMonth() + 1,
    time.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds());

  var position_gd = satellite.eci_to_geodetic(position_eci, gmst);
  var latitude = satellite.degrees_lat(position_gd["latitude"]);
  var longitude = satellite.degrees_long(position_gd["longitude"]);
  var altitude = position_gd["height"] * 1000;

  return new WorldWind.Position(latitude, longitude, altitude);
};

function generatePlacemark(orbitalBody){
  var placemarkPosition = new WorldWind.Position(orbitalBody.latitude, orbitalBody.longitude, orbitalBody.altitude);
  var placemark = new WorldWind.Placemark(placemarkPosition);
  var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

  var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
  highlightAttributes.imageScale = 0.90;
  highlightAttributes.imageSource = "assets/icons/dot-green.png";
  placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

  switch(orbitalBody.objectType) {
    case "PAYLOAD":
      placemarkAttributes.imageSource = "assets/icons/blue_dot.png";
      placemarkAttributes.imageScale = 0.3;
      break;
    case "ROCKET BODY":
      placemarkAttributes.imageSource = "assets/icons/yellow_dot.png";
      placemarkAttributes.imageScale = 0.3;
      break;
    case "DEBRIS":
      placemarkAttributes.imageSource = "assets/icons/red_dot.png";
      placemarkAttributes.imageScale = 0.2;
      break;
  }

  placemark.attributes = placemarkAttributes;
  placemark.highlightAttributes = highlightAttributes;

  return placemark;
}

function satelliteUpdating(callbackFunction, timerID, delay){
  clearInterval(timerID);
  satUpdateTimer = setInterval(callbackFunction, delay);
}

function retrieve3dModelPath(intlDes){
  var modelPath = "nothing here yet";
  return modelPath;
}

var FixedLocation = function(wwd) {
    this._wwd = wwd;
};
