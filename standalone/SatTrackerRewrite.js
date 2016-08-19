"use strict";
var allOrbitingBodies = []; //Global array with all the orbiting objects

//Event handling to avoid redraw on mousedown to simulate stuttering elimination
var satUpdateTimer = -1; //Global ID of mouse up interval. Note that mouse button IDs are 0,1,2...

addEventListener("mousedown", mousedown);
addEventListener("mouseup", mouseup);
//addEventListener("mouseout", mouseup);
addEventListener("wheel", mousedown);

WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create the World Window.
var wwd = new WorldWind.WorldWindow("canvasOne");
//wwd.navigator.lookAtLocation.altitude = 0;
wwd.navigator.range = 5e7;

//Add imagery layers.
var layers = [
  {layer: new WorldWind.BMNGOneImageLayer(), enabled: true},
  {layer: new WorldWind.AtmosphereLayer(), enabled: false},
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
var payloadLayer = new WorldWind.RenderableLayer("Payloads");
var rocketLayer = new WorldWind.RenderableLayer("Rocket Bodies");
var debrisLayer = new WorldWind.RenderableLayer("Debris");

//Abstraction of an orbital body
function orbitalBody(satelliteData){
  this.objectName = satelliteData.OBJECT_NAME;
  this.tleLine1 = satelliteData.TLE_LINE1;
  this.tleLine2 = satelliteData.TLE_LINE2;
  this.intlDes = satelliteData.INTLDES;
  this.objectType = satelliteData.OBJECT_TYPE;
  this.orbitalPeriod = satelliteData.PERIOD;
  this.latitude = null;
  this.longitude = null;
  this.altitude = null;
  this.collada3dModel = retrieve3dModelPath(satelliteData.INTLDES);
  this.orbitType = obtainOrbitType(satelliteData);
  this.url = null; //to be added to satellite data. Patrick will provide URLs.
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
  var orbitalBodiesNumber = 0;
  var now = new Date();
  for(var i = 0; i < satData.length; i += 1){
    var time = new Date(now.getTime());
    try{
      var position = getPosition(satellite.twoline2satrec(satData[i].TLE_LINE1, satData[i].TLE_LINE2), time);
    } catch (err) {
      faultySatsNumber += 1;
      continue;
    }
    var myOrbitalBody = new orbitalBody(satData[i]);
    myOrbitalBody.latitude = position.latitude;
    myOrbitalBody.longitude = position.longitude;
    myOrbitalBody.altitude = position.altitude;
    orbitalBodiesNumber += 1;

    switch (myOrbitalBody.objectType){
      case "PAYLOAD":
        payloadLayer.addRenderable(generatePlacemark(myOrbitalBody));
        allOrbitingBodies.push(myOrbitalBody);
        break;
      case "ROCKET BODY":
        rocketLayer.addRenderable(generatePlacemark(myOrbitalBody));
        allOrbitingBodies.push(myOrbitalBody);
        break;
/*      case "DEBRIS":
        debrisLayer.addRenderable(generatePlacemark(myOrbitalBody));
        allOrbitingBodies.push(myOrbitalBody);
        break;*/
      }
  }
  console.log('We have ' + orbitalBodiesNumber + ' orbiting bodies');
  console.log(faultySatsNumber + ' satellites had errors in their TLE.');
  renderEverything();
}

function generatePlacemark(orbitalBody){
  var placemarkPosition = new WorldWind.Position(orbitalBody.latitude, orbitalBody.longitude, orbitalBody.altitude);
  var placemark = new WorldWind.Placemark(placemarkPosition);
  var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
  // placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 1.0);
  // placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

  var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
  highlightAttributes.imageScale = 0.70;
  placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

  switch(orbitalBody.objectType) {
    case "PAYLOAD":
      placemarkAttributes.imageSource = "assets/icons/dot-red.png";
      placemarkAttributes.imageScale = 0.60;
      break;
    case "ROCKET BODY":
      placemarkAttributes.imageSource = "assets/icons/dot-blue.png";
      placemarkAttributes.imageScale = 0.60;
      break;
    default:
      placemarkAttributes.imageSource = "assets/icons/dot-grey.png";
      placemarkAttributes.imageScale = 0.40;
  }

  placemark.attributes = placemarkAttributes;
  placemark.highlightAttributes = highlightAttributes;

  return placemark;
}

function renderEverything(){
  wwd.addLayer(payloadLayer);
  wwd.addLayer(rocketLayer);
  wwd.addLayer(debrisLayer);
  //TODO: Maybe calculate optimal delay?
  //could do a full 15k loop of updatePositions as test
  //to provide optimal delay to update satellites.
  satelliteUpdating(updatePositions, satUpdateTimer, 1000);
}

function satelliteUpdating(callbackFunction, timerID, delay){
  clearInterval(timerID);
  satUpdateTimer = setInterval(callbackFunction, delay);
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



function updatePositions(){
  var payloadCounter = 0;
  var rocketCounter = 0;
  var debrisCounter = 0;

  for (var i = 0; i < allOrbitingBodies.length; i += 1) {
    var newPosition = getPosition(
      satellite.twoline2satrec(
        allOrbitingBodies[i].tleLine1,
        allOrbitingBodies[i].tleLine2),
      new Date());

    switch (allOrbitingBodies[i].objectType) {
      case "PAYLOAD":
        payloadLayer.renderables[payloadCounter].position.latitude = newPosition.latitude;
        payloadLayer.renderables[payloadCounter].position.longitude = newPosition.longitude;
        payloadLayer.renderables[payloadCounter++].position.altitude = newPosition.altitude;
        break;
      case "ROCKET BODY":
        rocketLayer.renderables[rocketCounter].position.latitude = newPosition.latitude;
        rocketLayer.renderables[rocketCounter].position.longitude = newPosition.longitude;
        rocketLayer.renderables[rocketCounter++].position.altitude = newPosition.altitude;
        break;
        /*      case "DEBRIS":
         debrisLayer.renderables[debrisCounter].position.latitude = newPosition.latitude;
         debrisLayer.renderables[debrisCounter].position.longitude = newPosition.longitude;
         debrisLayer.renderables[debrisCounter++].position.altitude = newPosition.altitude;
         break;*/
    }
    //TODO: update positions in allOrbitingBodies
}
  wwd.redraw();
}

function mousedown(event) {
  clearInterval(satUpdateTimer);
}

function mouseup(event) {
  satelliteUpdating(updatePositions, satUpdateTimer, 500);
}

// $(document).ready(function() {
//
// });
