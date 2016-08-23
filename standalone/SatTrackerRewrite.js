"use strict";
var allOrbitingBodies = []; //Global array with all the orbiting objects
//Event handling to avoid redraw on mousedown to simulate stuttering elimination
var satUpdateTimer = -1; //Global ID of mouse up interval. Note that mouse button IDs are 0,1,2...
var updateloopTime = 5000; //Default value to update satellites position. It will get optimized in renderEverything()

//Events for stopping satellite updating while dragging
addEventListener("mousedown", mousedown);
addEventListener("mouseup", mouseup);

WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create the World Window.
var wwd = new WorldWind.WorldWindow("canvasOne");
wwd.navigator.range = 2e7;
wwd.globe.elevationModel = new WorldWind.ZeroElevationModel();

//Add imagery layers.
var layers = [
  {layer: new WorldWind.BMNGOneImageLayer(), enabled: true},
  {layer: new WorldWind.BMNGLayer(), enabled: true},
  {layer: new WorldWind.AtmosphereLayer(), enabled: true},
  {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
  {layer: new WorldWind.ViewControlsLayer(wwd), enabled: false}
];

for (var l = 0; l < layers.length; l++) {
  layers[l].layer.enabled = layers[l].enabled;
  wwd.addLayer(layers[l].layer);
}

//Activate BMNGLayer in low altitudes
layers[1].layer.maxActiveAltitude = 15e6;
layers[2].layer.maxActiveAltitude = 15e7;

//Creating lightsource for atmoshpere effect
FixedLocation.prototype = Object.create(WorldWind.Location.prototype);
layers[2].layer.lightLocation = new FixedLocation(wwd);

//custom layers
var groundStationsLayer = new WorldWind.RenderableLayer();
var payloadLayer = new WorldWind.RenderableLayer("Payloads");
var rocketLayer = new WorldWind.RenderableLayer("Rocket bodies");
var debrisLayer = new WorldWind.RenderableLayer("Debris");
var selectedSatsLayer = new WorldWind.RenderableLayer("Selected satellites");

function getSatellites(satData){
  var faultySatsNumber = 0;
  var orbitalBodiesNumber = 0;
  for(var i = 0; i < satData.length; i += 1){
    //Cleaning up satellites with problematic TLE data (probably objects that are about to deorbit)
    try{
      var initialPosition = getPosition(satellite.twoline2satrec(satData[i].TLE_LINE1, satData[i].TLE_LINE2), new Date());
    } catch (err) {
      faultySatsNumber += 1;
      continue;
    }
    //Now that we're sure which satellites work, instantiate objects with them
    var myOrbitalBody = new orbitalBody(satData[i]);
    myOrbitalBody.latitude = initialPosition.latitude;
    myOrbitalBody.longitude = initialPosition.longitude;
    myOrbitalBody.altitude = initialPosition.altitude;
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
      case "DEBRIS":
        debrisLayer.addRenderable(generatePlacemark(myOrbitalBody));
        allOrbitingBodies.push(myOrbitalBody);
        break;
      }
  }
  console.log('We have ' + orbitalBodiesNumber + ' orbiting bodies');
  console.log(faultySatsNumber + ' satellites had errors in their TLE.');
  renderEverything();
}

function renderEverything(){
  wwd.addLayer(payloadLayer);
  wwd.addLayer(rocketLayer);
  //wwd.addLayer(debrisLayer);

  updateloopTime = obtainExecutionTime(updatePositions);
  console.log("Updating all satellites' positions took " + updateloopTime + " ms. " +
      "Now it will be updated every " + updateloopTime * 3 + " ms.");
  satelliteUpdating(updatePositions, satUpdateTimer, updateloopTime * 3);
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
      case "DEBRIS":
        debrisLayer.renderables[debrisCounter].position.latitude = newPosition.latitude;
        debrisLayer.renderables[debrisCounter].position.longitude = newPosition.longitude;
        debrisLayer.renderables[debrisCounter++].position.altitude = newPosition.altitude;
        break;
    }
    allOrbitingBodies[i].latitude = newPosition.latitude;
    allOrbitingBodies[i].longitude = newPosition.longitude;
    allOrbitingBodies[i].altitude = newPosition.altitude;
  }
  wwd.redraw();
}

function mousedown(event) {
  clearInterval(satUpdateTimer);
}

function mouseup(event) {
  satelliteUpdating(updatePositions, satUpdateTimer, updateloopTime);
}

Object.defineProperties(FixedLocation.prototype, {

  latitude: {
    get: function () {
      return WorldWind.Location.greatCircleLocation(
        this._wwd.navigator.lookAtLocation,
        -70,
        1.1,
        new WorldWind.Location()
      ).latitude;
    }
  },

  longitude: {
    get: function () {
      return WorldWind.Location.greatCircleLocation(
        this._wwd.navigator.lookAtLocation,
        -70,
        1.1,
        new WorldWind.Location()
      ).longitude;
    }
  }

});

//Constantly update satellite updating process time
// setInterval(function(){
//   updateloopTime = obtainExecutionTime(updatePositions);
// }, 20000);

// $(document).ready(function() {
//
// });
