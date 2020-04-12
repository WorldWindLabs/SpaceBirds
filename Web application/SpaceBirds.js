"use strict";
var allOrbitingBodies = []; //Global array with all the orbiting objects
//Event handling to avoid redraw on mousedown to simulate stuttering elimination
var satUpdateTimer = -1; //Global ID of mouse up interval.
var updateLoopTime = 5000; //Default value to update satellites position. It will get optimized in renderEverything()
var updatePermission = false;

//Events for stopping satellite updating while dragging
addEventListener("mousedown", mousedown);
addEventListener("mouseup", mouseup);
addEventListener("touchstart", mousedown);
addEventListener("touchend", mouseup);
var timer = null;
addEventListener("wheel", function() {
  if(satUpdateTimer != null)
    mousedown();
  if(timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(function() {
    mouseup();
  }, 500);
});

WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create the World Window.
var wwd = new WorldWind.WorldWindow("canvasOne");
var highlightController = new WorldWind.HighlightController(wwd);
wwd.navigator.range = 2e7;

//Settings to change projections
var globe = wwd.globe;
globe.elevationModel = new WorldWind.ZeroElevationModel();

var map = new WorldWind.Globe2D();
map.elevationModel = new WorldWind.ZeroElevationModel();
map.projection = new WorldWind.ProjectionMercator();

//Projection toggle
var representationPlaceholder = document.getElementById('representation');

function toggleRepresentation() {
  if (wwd.globe instanceof WorldWind.Globe2D) {
    wwd.globe = globe;
    representationPlaceholder.textContent = '3D';
  } else {
    wwd.globe = map;
    representationPlaceholder.textContent = '2D';
  }
}

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
var groundStationsLayer = new WorldWind.RenderableLayer("Groundstations");
var payloadsLayer = new WorldWind.RenderableLayer("Payloads");
payloadsLayer.pickEnabled = true;
var rocketsLayer = new WorldWind.RenderableLayer("Rocket bodies");
rocketsLayer.pickEnabled = true;
var debrisLayer = new WorldWind.RenderableLayer("Debris");
//var selectedSatsLayer = new WorldWind.RenderableLayer("Selected satellites"); //unused as of now
var orbitsLayer = new WorldWind.RenderableLayer("Orbits");


function getSatellites(satData){
  var faultySatsNumber = 0;
  var orbitalBodiesNumber = 0;
  for(var i = 0, numSatData = satData.length; i < numSatData; i += 1){
    //Cleaning up satellites with problematic TLE data (probably objects that are about to deorbit)
    //TODO: moving this to the node.js backend stuff
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
        payloadsLayer.addRenderable(generatePlacemark(myOrbitalBody));
        allOrbitingBodies.push(myOrbitalBody);
        break;
      case "ROCKET BODY":
        rocketsLayer.addRenderable(generatePlacemark(myOrbitalBody));
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
  wwd.addLayer(payloadsLayer);
  wwd.addLayer(rocketsLayer);
  //wwd.addLayer(debrisLayer);

  //Temporary crap
  var hello = {
    hello: 'world',
    foo: 'bar'
  };
  var qaz = {
      hello: 'stevie',
      foo: 'baz'
  }

  var myArray = [];
  myArray.push(hello,qaz);
  
  var stupidIndex = myArray.indexOf('stevie','hello');
  console.log(stupidIndex);

  var whateverName = allOrbitingBodies[45].OBJECT_NAME;
  var issIndex = allOrbitingBodies.indexOf('VANGUARD 1', 'OBJECT_NAME');
  console.log('index ' + issIndex);
  plotOrbit(issIndex);
  wwd.addLayer(orbitsLayer);

  updateLoopTime = obtainExecutionTime(updatePositions);
  console.log("Updating all satellites' positions took " + updateLoopTime + " ms. " +
      "Now it will be updated every " + updateLoopTime * 3 + " ms.");
  satelliteUpdating(updatePositions, satUpdateTimer, updateLoopTime * 3);
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
  updatePermission = false;
  var payloadCounter = 0;
  var rocketCounter = 0;
  var debrisCounter = 0;

  for (var i = 0, numallOrbitingBodies = allOrbitingBodies.length; i < numallOrbitingBodies; i += 1) {
    var newPosition = getPosition(
      satellite.twoline2satrec(
        allOrbitingBodies[i].tleLine1,
        allOrbitingBodies[i].tleLine2),
      new Date());

    switch (allOrbitingBodies[i].objectType) {
      case "PAYLOAD":
        payloadsLayer.renderables[payloadCounter].position.latitude = newPosition.latitude;
        payloadsLayer.renderables[payloadCounter].position.longitude = newPosition.longitude;
        payloadsLayer.renderables[payloadCounter++].position.altitude = newPosition.altitude;
        break;
      case "ROCKET BODY":
        rocketsLayer.renderables[rocketCounter].position.latitude = newPosition.latitude;
        rocketsLayer.renderables[rocketCounter].position.longitude = newPosition.longitude;
        rocketsLayer.renderables[rocketCounter++].position.altitude = newPosition.altitude;
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
  updatePermission = true;
}

//Events to prevent stuttering (position updating) while zooming or dragging
function mousedown(event) {
  updatePermission = false;
  clearInterval(satUpdateTimer);
}

function mouseup(event) {
  updatePermission = true;
  satelliteUpdating(updatePositions, satUpdateTimer, updateLoopTime);
}

//Yann Voumard's function to obtain a lightsource fixed in space
//lightsource position is hardcoded in here
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

function plotOrbit(orbitalBody){
  var now = new Date();
  var pastOrbit = [];
  var futureOrbit = [];
  var period = Math.round(orbitalBody.orbitalPeriod); //In minutes, rounded so we can get i === 0
  for(var i = -period; i <= period; i++) {
      var time = new Date(now.getTime() + i*60000); //conversion from milliseconds to minutes

      var position = getPosition(satellite.twoline2satrec(orbitalBody.tleLine1, orbitalBody.tleLine2), time)

      if(i < 0) {
          pastOrbit.push(position);
      } else if(i > 0) {
          futureOrbit.push(position);
      } else {
          pastOrbit.push(position);
          futureOrbit.push(position);
      }
  }

  // Orbit Path
  var pathAttributes = new WorldWind.ShapeAttributes(null);
  pathAttributes.outlineColor = WorldWind.Color.RED;
  pathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);
  //pathAttributes.drawVerticals = false;


  var pastOrbitPath = new WorldWind.Path(pastOrbit);
  pastOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
  pastOrbitPath.attributes = pathAttributes;
  pastOrbitPath.extrude = true;
  pastOrbitPath.useSurfaceShapeFor2D = true;

  var pathAttributes = new WorldWind.ShapeAttributes(pathAttributes);
  pathAttributes.outlineColor = WorldWind.Color.GREEN;
  pathAttributes.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);

  var futureOrbitPath = new WorldWind.Path(futureOrbit);
  futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
  futureOrbitPath.attributes = pathAttributes;
  futureOrbitPath.extrude = true;
  futureOrbitPath.useSurfaceShapeFor2D = true;

  orbitsLayer.addRenderable(pastOrbitPath);
  orbitsLayer.addRenderable(futureOrbitPath);
}

//Constantly update satellite updating process time
setInterval(function(){
  if (updatePermission) {
    updateLoopTime = obtainExecutionTime(updatePositions);
  }
}, 20000);

// var refreshLayers = setInterval(function(){
//   plotOrbit(allOrbitingBodies[350]);
//   //orbitsLayer.removeRenderable(0);
//   orbitsLayer.refresh();
// }, updateLoopTime);

$(document).ready(function() {

  // toggle display on/off for list items when header is clicked
    var typeHeading= $("#type_heading");
    var typeBody=$("#type_body");
    var orbitHeading= $("#orbit_heading");
    var orbitBody = $("#orbit_body");

    typeHeading.click(function(){
    if($(this).hasClass("glyphicon-plus")){
      $(this).removeClass("glyphicon-plus");
      $(this).addClass("glyphicon-minus");
    }
    else if($(this).hasClass("glyphicon-minus")){
      $(this).removeClass("glyphicon-minus");
      $(this).addClass("glyphicon-plus");
    }
    typeBody.toggle("slide");
    orbitBody.css("display","none")
    if (orbitHeading.hasClass("glyphicon-minus")){
        orbitHeading.removeClass("glyphicon-minus");
        orbitHeading.addClass("glyphicon-plus");
    }
  });

  orbitHeading.click(function(){
    if($(this).hasClass("glyphicon-plus")){
      $(this).removeClass("glyphicon-plus");
      $(this).addClass("glyphicon-minus");
    }
    else if($(this).hasClass("glyphicon-minus")){
      $(this).removeClass("glyphicon-minus");
      $(this).addClass("glyphicon-plus");
    }
    orbitBody.toggle("fast");
    typeBody.css("display","none")

    if(typeHeading.hasClass("glyphicon-minus")){
        typeHeading.removeClass("glyphicon-minus");
        typeHeading.addClass("glyphicon-plus");

    }
  });

});
