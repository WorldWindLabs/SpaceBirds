"use strict";
var allOrbitingBodies = []; //Global variable with all the orbiting objects


WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create the World Window.
var wwd = new WorldWind.ObjectWindow("canvasOne");
wwd.navigator.lookAtLocation.altitude = 0;
wwd.navigator.range = 5e7;

//Add imagery layers.
var layers = [
    {layer: new WorldWind.BMNGOneImageLayer(), enabled: true},
    //{layer: new WorldWind.CompassLayer(), enabled: true},
    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
];

for (var l = 0; l < layers.length; l++) {
    layers[l].layer.enabled = layers[l].enabled;
    wwd.addLayer(layers[l].layer);
}

//custom layers
var groundStationsLayer = new WorldWind.RenderableLayer();
//var modelLayer = new WorldWind.RenderableLayer("Model");
//var meshLayer = new WorldWind.RenderableLayer();
//var orbitsLayer = new WorldWind.RenderableLayer("Orbit");
var satellitesLayer = new WorldWind.RenderableLayer("Satellites");
//var meoSatLayer = new WorldWind.RenderableLayer("MEO Satellite");
//var heoSatLayer = new WorldWind.RenderableLayer("HEO Satellite");

//Orbital object attributes
var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 0.5);
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);
placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;
placemarkAttributes.imageScale = 0.35;
var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
highlightAttributes.imageScale = 0.40;

var payloads = new WorldWind.PlacemarkAttributes(placemarkAttributes);
var rocketBodies = new WorldWind.PlacemarkAttributes(placemarkAttributes);
var debris = new WorldWind.PlacemarkAttributes(placemarkAttributes);

payloads.imageSource = "../apps/SatTracker/dot-red.png";
rocketBodies.imageSource = "../apps/SatTracker/dot-blue.png";
debris.imageSource = "../apps/SatTracker/dot-grey.png";

//Abstraction of an orbital body
function orbitalBody(satelliteData){
  this.objectName = satelliteData.OBJECT_NAME;
  this.tleLine1 = satelliteData.TLE_LINE1;
  this.tleLine2 = satelliteData.TLE_LINE2;
  this.intlDes = satelliteData.INTLDES;
  this.objectType = satelliteData.OBJECT_TYPE;
  this.orbitalPeriod = satelliteData.PERIOD;
  this.currentPosition = null;
  this.collada3dModel = retrieve3dModelPath(satelliteData.INTLDES);
  this.orbitType = obtainOrbitType(satelliteData);
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

function getSatellites(satData){
  var faultySatsNumber = 0;
  var now = new Date();
  for(var i = 0; i < satData.length ; i += 1){
    var time = new Date(now.getTime());
     try{
      var position = getPosition(satellite.twoline2satrec(satData[i].TLE_LINE1, satData[i].TLE_LINE2), time);
    } catch (err) {
      faultySatsNumber += 1;
      continue;
    }
    //TODO modularize this inside a function, check out why colored dots aren't loading.

    var myOrbitalBody = new orbitalBody(satData[i]);
    myOrbitalBody.currentPosition = new WorldWind.Position(position.latitude, position.longitude, position.altitude);
    allOrbitingBodies.push(myOrbitalBody);
    var placemark = new WorldWind.Placemark(myOrbitalBody.currentPosition);

    switch(myOrbitalBody.objectType) {
      case 'PAYLOAD':
          placemark.Attributes = payloads;
          break;
      case 'ROCKET BODY':
          placemark.Attributes = rocketBodies;
          break;
      default:
          placemark.Attributes = debris;
    }

    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    placemark.highlightAttributes = highlightAttributes;
    satellitesLayer.addRenderable(placemark);


  }
  console.log('We have ' + allOrbitingBodies.length + ' orbiting bodies');
  console.log(faultySatsNumber + ' satellites had errors in their TLE.');
  wwd.addLayer(satellitesLayer);
// renderEverything();
 for(var j = 0; j < 10; j+=1){
   for(var prop in allOrbitingBodies[j]){
     console.log(' - ' + allOrbitingBodies[j][prop]);
   }
   if(allOrbitingBodies[j].objectType === "ROCKET BODY"){
     console.log('El objeto ' + j + ' es de tipo rocket');
   }
 }

}

function renderEverything(){

}

function retrieve3dModelPath(intlDes){
  var modelPath = "nothing here yet";
  return modelPath;
}

function obtainOrbitType(satOrbit){
  var orbitType = "nothing here yet";
  return orbitType;
}

var satParserWorker = new Worker("Workers/satelliteParseWorker.js");
var grndStationsWorker = new Worker("Workers/groundStationsWorker.js");

//Initiating JSON parsing workers
satParserWorker.postMessage("work, satellite parser, work!");
grndStationsWorker.postMessage("and you too, groundstations servant!");

//Retrieval of JSON file data from worker threads. Also, closing such threads.
satParserWorker.addEventListener('message', function(event){
  var satData = event.data;
  satParserWorker.postMessage('close');
  getSatellites(satData);
}, false);

grndStationsWorker.addEventListener('message', function(event){
  var groundStations = event.data;
  grndStationsWorker.postMessage('close');
}, false);

$(document).ready(function() {

});
