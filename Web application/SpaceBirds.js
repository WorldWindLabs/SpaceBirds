/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
"use strict";

// Tell World Wind to log only warnings and errors.
//WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create the World Window.
var wwd = new WorldWind.ObjectWindow("canvasOne");
wwd.navigator.lookAtLocation.altitude = 0;
wwd.navigator.range = 5e7;

//Move view controls
var viewControlsLayer = new WorldWind.ViewControlsLayer(wwd);
viewControlsLayer.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.80, WorldWind.OFFSET_FRACTION, 0.96);
viewControlsLayer.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.80, WorldWind.OFFSET_FRACTION, 0.96);

var coordinates = new WorldWind.CoordinatesDisplayLayer(wwd);
coordinates.latText.attributes.color = WorldWind.Color.WHITE;
coordinates.lonText.attributes.color = WorldWind.Color.WHITE;
coordinates.elevText.attributes.color = WorldWind.Color.WHITE;
coordinates.eyeText.attributes.color = WorldWind.Color.WHITE;

//Add imagery layers.
var layers = [
  {layer: new WorldWind.BMNGOneImageLayer(), enabled: true},
 // {layer: new WorldWind.BMNGLayer(), enabled: true},
  {layer: new WorldWind.BingAerialLayer(null), enabled: true},
  {layer: coordinates, enabled: true},
  {layer: viewControlsLayer, enabled: true}
];

for (var l = 0; l < layers.length; l++) {
  layers[l].layer.enabled = layers[l].enabled;
  wwd.addLayer(layers[l].layer);
}

//Activate BMNGLayer in low altitudes
layers[1].layer.maxActiveAltitude = 3e6;
layers[2].layer.minActiveAltitude = 3e6;
//layers[2].layer.maxActiveAltitude = 2e5;
//layers[3].layer.minActiveAltitude = 2e5;


//custom layers
var groundStationsLayer = new WorldWind.RenderableLayer();
var customGSLayer = new WorldWind.RenderableLayer("customGS");
var shapeLayer = new WorldWind.RenderableLayer();
var orbitsHoverLayer = new WorldWind.RenderableLayer();
var modelLayer = new WorldWind.RenderableLayer("Model");
var meshLayer = new WorldWind.RenderableLayer();

var orbitsLayer = new WorldWind.RenderableLayer("Orbit");
var leoSatLayer = new WorldWind.RenderableLayer("LEO Payloads");
var meoSatLayer = new WorldWind.RenderableLayer("MEO Payloads");
var heoSatLayer = new WorldWind.RenderableLayer("HEO Payloads");
var geoSatLayer = new WorldWind.RenderableLayer("GEO Payloads");
var unclassifiedSatLayer = new WorldWind.RenderableLayer("Unclassified Payloads");
var leoRocketLayer = new WorldWind.RenderableLayer("LEO Rocket Bodies");
var meoRocketLayer = new WorldWind.RenderableLayer("MEO Rocket Bodies");
var heoRocketLayer = new WorldWind.RenderableLayer("HEO Rocket Bodies");
var geoRocketLayer = new WorldWind.RenderableLayer("GEO Rocket Bodies");
var unclassifiedRocketLayer = new WorldWind.RenderableLayer("Unclassified Rocket Bodies");
var leoDebrisLayer = new WorldWind.RenderableLayer("LEO Debris");
var meoDebrisLayer = new WorldWind.RenderableLayer("MEO Debris");
var heoDebrisLayer = new WorldWind.RenderableLayer("HEO Debris");
var geoDebrisLayer = new WorldWind.RenderableLayer("GEO Debris");
var unclassifiedDebrisLayer = new WorldWind.RenderableLayer("UnclassifiedDebris");

var leoSatCustom = new WorldWind.RenderableLayer("LEO Payloads");
var meoSatCustom = new WorldWind.RenderableLayer("MEO Payloads");
var heoSatCustom = new WorldWind.RenderableLayer("HEO Payloads");
var geoSatCustom = new WorldWind.RenderableLayer("GEO Payloads");
var unclassifiedSatCustom = new WorldWind.RenderableLayer("Unclassified Payloads");
var leoRocketCustom = new WorldWind.RenderableLayer("LEO Rocket Bodies");
var meoRocketCustom = new WorldWind.RenderableLayer("MEO Rocket Bodies");
var heoRocketCustom = new WorldWind.RenderableLayer("HEO Rocket Bodies");
var geoRocketCustom = new WorldWind.RenderableLayer("GEO Rocket Bodies");
var unclassifiedRocketCustom = new WorldWind.RenderableLayer("Unclassified Rocket Bodies");
var leoDebrisCustom = new WorldWind.RenderableLayer("LEO Debris");
var meoDebrisCustom = new WorldWind.RenderableLayer("MEO Debris");
var heoDebrisCustom = new WorldWind.RenderableLayer("HEO Debris");
var geoDebrisCustom = new WorldWind.RenderableLayer("GEO Debris");
var unclassifiedDebrisCustom = new WorldWind.RenderableLayer("UnclassifiedDebris");

//add custom layers
wwd.addLayer(customGSLayer);
wwd.addLayer(groundStationsLayer);
wwd.addLayer(shapeLayer);
wwd.addLayer(orbitsHoverLayer);
wwd.addLayer(leoSatLayer);
wwd.addLayer(meoSatLayer);
wwd.addLayer(heoSatLayer);
wwd.addLayer(leoRocketLayer);
wwd.addLayer(meoRocketLayer);
wwd.addLayer(heoRocketLayer);
wwd.addLayer(leoDebrisLayer);
wwd.addLayer(meoDebrisLayer);
wwd.addLayer(heoDebrisLayer);
wwd.addLayer(meshLayer);
wwd.addLayer(modelLayer);
wwd.addLayer(orbitsLayer);
wwd.addLayer(unclassifiedSatLayer);
wwd.addLayer(unclassifiedRocketLayer);
wwd.addLayer(unclassifiedDebrisLayer);
wwd.addLayer(geoRocketLayer);
wwd.addLayer(geoDebrisLayer);
wwd.addLayer(geoSatLayer);
//Custom Layers
wwd.addLayer(leoSatCustom);
wwd.addLayer(meoSatCustom);
wwd.addLayer(heoSatCustom);
wwd.addLayer(geoSatCustom);
wwd.addLayer(unclassifiedSatCustom);
wwd.addLayer(leoRocketCustom);
wwd.addLayer(meoRocketCustom);
wwd.addLayer(heoRocketCustom);
wwd.addLayer(geoRocketCustom);
wwd.addLayer(unclassifiedRocketCustom);
wwd.addLayer(leoDebrisCustom);
wwd.addLayer(meoDebrisCustom);
wwd.addLayer(heoDebrisCustom);
wwd.addLayer(geoDebrisCustom);
wwd.addLayer(unclassifiedDebrisCustom);

//Latitude, Longitude, and Altitude
var latitudePlaceholder = document.getElementById('latitude');
var longitudePlaceholder = document.getElementById('longitude');
var altitudePlaceholder = document.getElementById('altitude');
var typePlaceholder = document.getElementById('type');
var idPlaceholder = document.getElementById('id');
var namePlaceholder = document.getElementById('name');
var inclinationPlaceholder = document.getElementById('inclination');
var eccentricityPlaceHolder = document.getElementById('eccentricity');
var revDayPlaceholder = document.getElementById('revDay');
var apogeeplaceholder = document.getElementById('apogee');
var perigeeplaceholder = document.getElementById('perigee');
var periodPlaceholder = document.getElementById('period');
var semiMajorAxisPlaceholder = document.getElementById('majorAxis');
var semiMinorAxisPlaceholder = document.getElementById('minorAxis');
var ownerPlaceholder = document.getElementById('owner');
var launchPlaceholder = document.getElementById('launch');
var orbitPlaceholder = document.getElementById('orbitType');
var operationPlaceholder = document.getElementById('operation');
var trackedPlaceholder = document.getElementById('tracked');
var velocityPlaceholder = document.getElementById('velocity');


//Events to handle updating
var updateTime = 3000;
var updatePermission = true;
addEventListener("mousedown", mouseDown);
addEventListener("mouseup", mouseUp);
addEventListener("touchstart", mouseDown);
addEventListener("touchend", mouseUp);
var timer = null;
addEventListener("wheel", function () {
  mouseDown();
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(mouseUp, 200);
});

function mouseDown() {
  updatePermission = false;
}

function mouseUp() {
  updatePermission = true;
}

//gets position of every satellite
function getPosition(satrec, time) {
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
}

function jday(year, mon, day, hr, minute, sec) {
  'use strict';
  return (367.0 * year -
    Math.floor((7 * (year + Math.floor((mon + 9) / 12.0))) * 0.25) +
    Math.floor(275 * mon / 9.0) +
    day + 1721013.5 +
    ((sec / 60.0 + minute) / 60.0 + hr) / 24.0  //  ut in days
    //#  - 0.5*sgn(100.0*year + mon - 190002.5) + 0.5;
  );
}

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function roundToFour(num) {
  return +(Math.round(num + "e+4") + "e-4");
}

var satVelocity = [];
function getVelocity(satrec, time) {

  var j = jday(time.getUTCFullYear(),
    time.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
    time.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds());
  j += time.getUTCMilliseconds() * 1.15741e-8;


  var m = (j - satrec.jdsatepoch) * 1440.0;
  var pv = satellite.sgp4(satrec, m);
  var vx, vy, vz;

  vx = pv.velocity.x;
  vy = pv.velocity.y;
  vz = pv.velocity.z;

  var satVelocity = Math.sqrt(
    vx * vx +
    vy * vy +
    vz * vz
  );
  return satVelocity;
}

//purifies non-working satellites
function sanitizeSatellites(objectArray) {
  var faultySatellites = 0;
  var resultArray = [];
  var maxSats = objectArray.length;
  updateTime = performance.now();
  var now = new Date();
  var time = new Date(now.getTime());
  for (var i = 0; i < maxSats; i += 1) {
    try {
      var position = getPosition(satellite.twoline2satrec(objectArray[i].TLE_LINE1, objectArray[i].TLE_LINE2), time);
      var velocity = getVelocity(satellite.twoline2satrec(objectArray[i].TLE_LINE1, objectArray[i].TLE_LINE2), time);

    } catch (err) {
     // console.log(objectArray[i].OBJECT_NAME +" is a faulty sat it is " + i);
      faultySatellites += 1;
      // objectArray.splice(i,1);
      // i--;
      continue;
    }

    if(typeof objectArray[i].LAUNCH_DATE === "undefined") continue;
    
    resultArray.push(objectArray[i]);
  }
  updateTime = performance.now() - updateTime;
  console.log(faultySatellites);
  console.log(objectArray.length + " from uncleansed");
  console.log(resultArray.length + " from cleansed");
  return resultArray;
}

//retrieves TLE data
var grndStationsWorker = new Worker("Workers/groundStationsWorker.js");

grndStationsWorker.postMessage("you go first, groundstations servant!");
grndStationsWorker.addEventListener('message', function (event) {
  grndStationsWorker.postMessage('close');
  getGroundStations(event.data);
}, false);

function getGroundStations(groundStations) {
  var satParserWorker = new Worker("Workers/satelliteParseWorker.js");
  satParserWorker.postMessage("work, satellite parser, work!");
  //Retrieval of JSON file data from worker threads. Also, closing such threads.
  satParserWorker.addEventListener('message', function (event) {
    //var satData = event.data;
    satParserWorker.postMessage('close');
    getSatellites(event.data);
  }, false);


  function getSatellites(satellites) {
    var satPac = sanitizeSatellites(satellites);
    satPac.satDataString = JSON.stringify(satPac);

//convert degrees into a string for textContent
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

    //Display sat position
    function updateLLA(position) {
      latitudePlaceholder.textContent = deg2text(position.latitude, 'NS');
      longitudePlaceholder.textContent = deg2text(position.longitude, 'EW');
      altitudePlaceholder.textContent = (Math.round(position.altitude / 10) / 100) + "km";
    }




    /***
     * UI and Switchboard
     */

      //Switch between Main Layers: regular and custom
    var allLayersOff = function () {
        leoSatCustom.enabled = leoSatLayer.enabled;
      console.log(leoSatLayer.enabled);
        console.log(leoSatCustom.enabled);
        meoSatCustom.enabled = meoSatLayer.enabled;
        heoSatCustom.enabled = heoSatLayer.enabled;
        geoSatCustom.enabled = heoSatLayer.enabled;
        unclassifiedSatCustom.enabled = unclassifiedSatLayer.enabled;
        leoRocketCustom.enabled = leoRocketLayer.enabled;
        meoRocketCustom.enabled = meoRocketLayer.enabled;
        heoRocketCustom.enabled = heoRocketLayer.enabled;
        geoRocketCustom.enabled = geoRocketLayer.enabled;
        unclassifiedRocketCustom.enabled = unclassifiedRocketLayer.enabled;
        leoDebrisCustom.enabled = leoDebrisLayer.enabled;
        meoDebrisCustom.enabled = meoDebrisLayer.enabled;
        heoDebrisCustom.enabled = heoDebrisLayer.enabled;
        geoDebrisCustom.enabled = geoDebrisLayer.enabled;
        unclassifiedDebrisCustom.enabled = unclassifiedDebrisLayer.enabled;

      leoSatLayer.enabled = false;
      meoSatLayer.enabled = false;
      heoSatLayer.enabled = false;
      geoSatLayer.enabled = false;
      unclassifiedSatLayer.enabled = false;
      leoRocketLayer.enabled = false;
      meoRocketLayer.enabled = false;
      heoRocketLayer.enabled = false;
      geoRocketLayer.enabled = false;
      unclassifiedRocketLayer.enabled = false;
      leoDebrisLayer.enabled = false;
      meoDebrisLayer.enabled = false;
      heoDebrisLayer.enabled = false;
      geoDebrisLayer.enabled = false;
      unclassifiedDebrisLayer.enabled = false;

      $('#custom').text("CUSTOM ON");
    };

    var allCustomOff = function () {
        leoSatLayer.enabled = leoSatCustom.enabled;
        meoSatLayer.enabled = meoSatCustom.enabled;
        heoSatLayer.enabled = heoSatCustom.enabled;
        geoSatLayer.enabled = geoSatCustom.enabled;
        unclassifiedSatLayer.enabled = unclassifiedSatCustom.enabled;
        leoRocketLayer.enabled = leoRocketCustom.enabled;
        meoRocketLayer.enabled = meoRocketCustom.enabled;
        heoRocketLayer.enabled = heoRocketCustom.enabled;
        geoRocketLayer.enabled = geoRocketCustom.enabled;
        unclassifiedRocketLayer.enabled = unclassifiedRocketCustom.enabled;
        leoDebrisLayer.enabled = leoDebrisCustom.enabled;
        meoDebrisLayer.enabled = meoDebrisCustom.enabled;
        heoDebrisLayer.enabled = heoDebrisCustom.enabled;
        geoDebrisLayer.enabled = geoDebrisCustom.enabled;
        unclassifiedDebrisLayer.enabled = unclassifiedDebrisCustom.enabled;

      leoSatCustom.enabled = false;
      meoSatCustom.enabled = false;
      heoSatCustom.enabled = false;
      geoSatCustom.enabled = false;
      unclassifiedSatCustom.enabled = false;
      leoRocketCustom.enabled = false;
      meoRocketCustom.enabled = false;
      heoRocketCustom.enabled = false;
      geoRocketCustom.enabled = false;
      unclassifiedRocketCustom.enabled = false;
      leoDebrisCustom.enabled = false;
      meoDebrisCustom.enabled = false;
      heoDebrisCustom.enabled = false;
      geoDebrisCustom.enabled = false;
      unclassifiedDebrisCustom.enabled = false;

      $('#custom').text("CUSTOM OFF");
    };

    ////Switchboard for Sat Types
    var orbitToggle = {
        leoP: 1,
        leoR: 3,
        leoD: 0,
        meoP: 1,
        meoR: 3,
        meoD: 0,
        heoP: 1,
        heoR: 3,
        heoD: 0,
        geoP: 1,
        geoR: 3,
        geoD: 0,
        unclassifiedP: 1,
        unclassifiedR: 3,
        unclassifiedD: 0
      };

    leoDebrisLayer.enabled = false;
    meoDebrisLayer.enabled = false;
    heoDebrisLayer.enabled = false;
    geoDebrisLayer.enabled = false;
    unclassifiedDebrisLayer.enabled = false;
    customGSLayer.enabled = false;

    leoSatCustom.enabled = false;
    leoRocketCustom.enabled = false;
    leoDebrisCustom.enabled = false;
    meoSatCustom.enabled = false;
    meoRocketCustom.enabled = false;
    meoDebrisCustom.enabled = false;
    heoSatCustom.enabled = false;
    heoRocketCustom.enabled = false;
    heoDebrisCustom.enabled = false;
    geoSatCustom.enabled = false;
    geoRocketCustom.enabled = false;
    geoDebrisCustom.enabled = false;
    unclassifiedSatCustom.enabled = false;
    unclassifiedRocketCustom.enabled = false;
    unclassifiedDebrisCustom.enabled = false;

    var satNum = satPac.length;
    //Sat Type toggles
    $('#allSats').text('ALL OFF');
    $('#allSats').click(function () {
      if ($(this).text() == "ALL OFF") {
        $(this).text("ALL ON");
        $('#payloads').text("PAYLOADS OFF");
        $('#rockets').text("ROCKETS OFF");
        $('#debris').text("DEBRIS OFF");
        $('#leo').text("LEO ON");
        $('#meo').text("MEO ON");
        $('#heo').text("HEO ON");
        $('#geo').text("GEO ON");
        $('#unclassified').text("UNCLASSIFIED ON");
        if ($("#custom").text() === "CUSTOM ON"){
          leoSatCustom.enabled = true;
          leoRocketCustom.enabled = true;
          leoDebrisCustom.enabled = true;
          meoSatCustom.enabled = true;
          meoRocketCustom.enabled = true;
          meoDebrisCustom.enabled = true;
          heoSatCustom.enabled = true;
          heoRocketCustom.enabled = true;
          heoDebrisCustom.enabled = true;
          geoSatCustom.enabled = true;
          geoRocketCustom.enabled = true;
          geoDebrisCustom.enabled = true;
          unclassifiedSatCustom.enabled = true;
          unclassifiedRocketCustom.enabled = true;
          unclassifiedDebrisCustom.enabled = true;
        } else {
          leoSatLayer.enabled = true;
          leoRocketLayer.enabled = true;
          leoDebrisLayer.enabled = true;
          meoSatLayer.enabled = true;
          meoRocketLayer.enabled = true;
          meoDebrisLayer.enabled = true;
          heoSatLayer.enabled = true;
          heoRocketLayer.enabled = true;
          heoDebrisLayer.enabled = true;
          geoSatLayer.enabled = true;
          geoRocketLayer.enabled = true;
          geoDebrisLayer.enabled = true;
          unclassifiedSatLayer.enabled = true;
          unclassifiedRocketLayer.enabled = true;
          unclassifiedDebrisLayer.enabled = true;
        }
          orbitToggle.leoP = 1;
          orbitToggle.leoR = 3;
          orbitToggle.leoD = 5;
          orbitToggle.meoP = 1;
          orbitToggle.meoR = 3;
          orbitToggle.meoD = 5;
          orbitToggle.heoP = 1;
          orbitToggle.heoR = 3;
          orbitToggle.heoD = 5;
          orbitToggle.geoP = 1;
          orbitToggle.geoR = 3;
          orbitToggle.geoD = 5;
          orbitToggle.unclassifiedP = 1;
          orbitToggle.unclassifiedR = 3;
          orbitToggle.unclassifiedD = 5;
        return orbitToggle;
      } else {
        $(this).text("ALL OFF");
        $('#leo').text("LEO OFF");
        $('#meo').text("MEO OFF");
        $('#heo').text("HEO OFF");
        $('#geo').text("GEO OFF");
        $('#unclassified').text("UNCLASSIFIED OFF");
        leoSatLayer.enabled = false;
        leoRocketLayer.enabled = false;
        leoDebrisLayer.enabled = false;
        meoSatLayer.enabled = false;
        meoRocketLayer.enabled = false;
        meoDebrisLayer.enabled = false;
        heoSatLayer.enabled = false;
        heoRocketLayer.enabled = false;
        heoDebrisLayer.enabled = false;
        geoSatLayer.enabled = false;
        geoRocketLayer.enabled = false;
        geoDebrisLayer.enabled = false;
        unclassifiedSatLayer.enabled = false;
        unclassifiedRocketLayer.enabled = false;
        unclassifiedDebrisLayer.enabled = false;

        leoSatCustom.enabled = false;
        leoRocketCustom.enabled = false;
        leoDebrisCustom.enabled = false;
        meoSatCustom.enabled = false;
        meoRocketCustom.enabled = false;
        meoDebrisCustom.enabled = false;
        heoSatCustom.enabled = false;
        heoRocketCustom.enabled = false;
        heoDebrisCustom.enabled = false;
        geoSatCustom.enabled = false;
        geoRocketCustom.enabled = false;
        geoDebrisCustom.enabled = false;
        unclassifiedSatCustom.enabled = false;
        unclassifiedRocketCustom.enabled = false;
        unclassifiedDebrisCustom.enabled = false;

        orbitToggle.leoP = 0;
        orbitToggle.leoR = 0;
        orbitToggle.leoD = 0;
        orbitToggle.meoP = 0;
        orbitToggle.meoR = 0;
        orbitToggle.meoD = 0;
        orbitToggle.heoP = 0;
        orbitToggle.heoR = 0;
        orbitToggle.heoD = 0;
        orbitToggle.geoP = 0;
        orbitToggle.geoR = 0;
        orbitToggle.geoD = 0;
        orbitToggle.unclassifiedP = 0;
        orbitToggle.unclassifiedR = 0;
        orbitToggle.unclassifiedD = 0;

        return orbitToggle;
      }
    });
    $('#payloads').click(function () {
      if ($(this).text() == "PAYLOADS OFF") {
        $(this).text("PAYLOADS ON");
        if ($('#allSats').text() == "ALL ON") {
          orbitToggle.leoP = 0;
          orbitToggle.leoR = 0;
          orbitToggle.leoD = 0;
          orbitToggle.meoP = 0;
          orbitToggle.meoR = 0;
          orbitToggle.meoD = 0;
          orbitToggle.heoP = 0;
          orbitToggle.heoR = 0;
          orbitToggle.heoD = 0;
          orbitToggle.geoP = 0;
          orbitToggle.geoR = 0;
          orbitToggle.geoD = 0;
          orbitToggle.unclassifiedP = 0;
          orbitToggle.unclassifiedR = 0;
          orbitToggle.unclassifiedD = 0;

          leoRocketLayer.enabled = false;
          leoDebrisLayer.enabled = false;
          meoRocketLayer.enabled = false;
          meoDebrisLayer.enabled = false;
          heoRocketLayer.enabled = false;
          heoDebrisLayer.enabled = false;
          geoRocketLayer.enabled = false;
          geoDebrisLayer.enabled = false;
          unclassifiedRocketLayer.enabled = false;
          unclassifiedDebrisLayer.enabled = false;

          leoSatCustom.enabled = false;
          leoRocketCustom.enabled = false;
          leoDebrisCustom.enabled = false;
          meoSatCustom.enabled = false;
          meoRocketCustom.enabled = false;
          meoDebrisCustom.enabled = false;
          heoSatCustom.enabled = false;
          heoRocketCustom.enabled = false;
          heoDebrisCustom.enabled = false;
          geoSatCustom.enabled = false;
          geoRocketCustom.enabled = false;
          geoDebrisCustom.enabled = false;
          unclassifiedSatCustom.enabled = false;
          unclassifiedRocketCustom.enabled = false;
          unclassifiedDebrisCustom.enabled = false;
        }
        $('#allSats').text("ALL OFF");
        $('#leo').text("LEO ON");
        $('#meo').text("MEO ON");
        $('#heo').text("HEO ON");
        $('#geo').text("GEO ON");
        $('#unclassified').text("UNCLASSIFIED ON");
        if ($("#custom").text() === "CUSTOM ON"){
          leoSatCustom.enabled = true;
          meoSatCustom.enabled = true;
          heoSatCustom.enabled = true;
          geoSatCustom.enabled = true;
          unclassifiedSatCustom.enabled = true;
        } else {
          leoSatLayer.enabled = true;
          meoSatLayer.enabled = true;
          heoSatLayer.enabled = true;
          geoSatLayer.enabled = true;
          unclassifiedSatLayer.enabled = true;
        }
        orbitToggle.leoP = 1;
        orbitToggle.meoP = 1;
        orbitToggle.heoP = 1;
        orbitToggle.geoP = 1;
        orbitToggle.unclassifiedP = 1;
        return orbitToggle;
      } else {
        $(this).text("PAYLOADS OFF");
        orbitToggle.leoP = 0;
        orbitToggle.meoP = 0;
        orbitToggle.heoP = 0;
        orbitToggle.geoP = 0;
        orbitToggle.unclassifiedP = 0;
        leoSatLayer.enabled = false;
        meoSatLayer.enabled = false;
        heoSatLayer.enabled = false;
        geoSatLayer.enabled = false;
        unclassifiedSatLayer.enabled = false;

        leoSatCustom.enabled = false;
        meoSatCustom.enabled = false;
        heoSatCustom.enabled = false;
        geoSatCustom.enabled = false;
        unclassifiedSatCustom.enabled = false;

        return orbitToggle;
      }
    });
    $('#rockets').click(function () {
      if ($(this).text() == "ROCKETS OFF") {
        $(this).text("ROCKETS ON");
        if ($('#allSats').text() == "ALL ON") {
          orbitToggle.leoP = 0;
          orbitToggle.leoR = 0;
          orbitToggle.leoD = 0;
          orbitToggle.meoP = 0;
          orbitToggle.meoR = 0;
          orbitToggle.meoD = 0;
          orbitToggle.heoP = 0;
          orbitToggle.heoR = 0;
          orbitToggle.heoD = 0;
          orbitToggle.geoP = 0;
          orbitToggle.geoR = 0;
          orbitToggle.geoD = 0;
          orbitToggle.unclassifiedP = 0;
          orbitToggle.unclassifiedR = 0;
          orbitToggle.unclassifiedD = 0;
          leoSatLayer.enabled = false;
          leoDebrisLayer.enabled = false;
          meoSatLayer.enabled = false;
          meoDebrisLayer.enabled = false;
          heoSatLayer.enabled = false;
          heoDebrisLayer.enabled = false;
          geoSatLayer.enabled = false;
          geoDebrisLayer.enabled = false;
          unclassifiedSatLayer.enabled = false;
          unclassifiedDebrisLayer.enabled = false;
          leoSatCustom.enabled = false;
          leoRocketCustom.enabled = false;
          leoDebrisCustom.enabled = false;
          meoSatCustom.enabled = false;
          meoRocketCustom.enabled = false;
          meoDebrisCustom.enabled = false;
          heoSatCustom.enabled = false;
          heoRocketCustom.enabled = false;
          heoDebrisCustom.enabled = false;
          geoSatCustom.enabled = false;
          geoRocketCustom.enabled = false;
          geoDebrisCustom.enabled = false;
          unclassifiedSatCustom.enabled = false;
          unclassifiedRocketCustom.enabled = false;
          unclassifiedDebrisCustom.enabled = false;
        }
        $('#allSats').text("ALL OFF");
        $('#leo').text("LEO ON");
        $('#meo').text("MEO ON");
        $('#heo').text("HEO ON");
        $('#geo').text("GEO ON");
        $('#unclassified').text("UNCLASSIFIED ON");
        if ($("#custom").text() === "CUSTOM ON"){
          leoRocketCustom.enabled = true;
          meoRocketCustom.enabled = true;
          heoRocketCustom.enabled = true;
          geoRocketCustom.enabled = true;
          unclassifiedRocketCustom.enabled = true;
        } else {
          leoRocketLayer.enabled = true;
          meoRocketLayer.enabled = true;
          heoRocketLayer.enabled = true;
          geoRocketLayer.enabled = true;
          unclassifiedRocketLayer.enabled = true;
        }
        orbitToggle.leoR = 3;
        orbitToggle.meoR = 3;
        orbitToggle.heoR = 3;
        orbitToggle.geoR = 3;
        orbitToggle.unclassifiedR = 3;
        return orbitToggle;
      } else {
        $(this).text("ROCKETS OFF");
        orbitToggle.leoR = 0;
        orbitToggle.meoR = 0;
        orbitToggle.heoR = 0;
        orbitToggle.heoR = 0;
        orbitToggle.unclassifiedR = 0;
        leoRocketLayer.enabled = false;
        meoRocketLayer.enabled = false;
        heoRocketLayer.enabled = false;
        geoRocketLayer.enabled = false;
        unclassifiedRocketLayer.enabled = false;
        leoRocketCustom.enabled = false;
        meoRocketCustom.enabled = false;
        heoRocketCustom.enabled = false;
        geoRocketCustom.enabled = false;
        unclassifiedRocketCustom.enabled = false;
        return orbitToggle;
      }
    });
    $('#debris').click(function () {
      if ($(this).text() == "DEBRIS OFF") {
        $(this).text("DEBRIS ON");
        if ($('#allSats').text() == "ALL ON") {
          orbitToggle.leoP = 0;
          orbitToggle.leoR = 0;
          orbitToggle.leoD = 0;
          orbitToggle.meoP = 0;
          orbitToggle.meoR = 0;
          orbitToggle.meoD = 0;
          orbitToggle.heoP = 0;
          orbitToggle.heoR = 0;
          orbitToggle.heoD = 0;
          orbitToggle.geoP = 0;
          orbitToggle.geoR = 0;
          orbitToggle.geoD = 0;
          orbitToggle.unclassifiedP = 0;
          orbitToggle.unclassifiedR = 0;
          orbitToggle.unclassifiedD = 0;
          leoSatLayer.enabled = false;
          leoRocketLayer.enabled = false;
          meoSatLayer.enabled = false;
          meoRocketLayer.enabled = false;
          heoSatLayer.enabled = false;
          heoRocketLayer.enabled = false;
          geoSatLayer.enabled = false;
          geoRocketLayer.enabled = false;
          unclassifiedSatLayer.enabled = false;
          unclassifiedRocketLayer.enabled = false;
        }
        $('#allSats').text("ALL OFF");
        $('#leo').text("LEO ON");
        $('#meo').text("MEO ON");
        $('#heo').text("HEO ON");
        $('#geo').text("GEO ON");
        $('#unclassified').text("UNCLASSIFIED ON");
        if ($("#custom").text() === "CUSTOM ON"){
          leoDebrisCustom.enabled = true;
          meoDebrisCustom.enabled = true;
          heoDebrisCustom.enabled = true;
          geoDebrisCustom.enabled = true;
          unclassifiedDebrisCustom.enabled = true;
        } else {
          leoDebrisLayer.enabled = true;
          meoDebrisLayer.enabled = true;
          heoDebrisLayer.enabled = true;
          geoDebrisLayer.enabled = true;
          unclassifiedDebrisLayer.enabled = true;
        }
        orbitToggle.leoD = 5;
        orbitToggle.meoD = 5;
        orbitToggle.heoD = 5;
        orbitToggle.geoD = 5;
        orbitToggle.unclassifiedD = 5;
        return orbitToggle;
      } else {
        $(this).text("DEBRIS OFF");
        orbitToggle.leoD = 0;
        orbitToggle.meoD = 0;
        orbitToggle.heoD = 0;
        orbitToggle.geoD = 0;
        orbitToggle.unclassifiedD = 0;
        leoDebrisLayer.enabled = false;
        meoDebrisLayer.enabled = false;
        heoDebrisLayer.enabled = false;
        geoDebrisLayer.enabled = false;
        unclassifiedDebrisLayer.enabled = false;
        leoDebrisCustom.enabled = false;
        meoDebrisCustom.enabled = false;
        heoDebrisCustom.enabled = false;
        geoDebrisCustom.enabled = false;
        unclassifiedDebrisCustom.enabled = false;
        return orbitToggle;
      }
    });


    //Switch Board for Orbit Types
    function leoToggleOn() {
      if ($("#custom").text() === "CUSTOM ON"){
        switch (orbitToggle.leoP + orbitToggle.leoR + orbitToggle.leoD) {
          case 1:
            leoSatCustom.enabled = true;
            break;
          case 3:
            leoRocketCustom.enabled = true;
            break;
          case 5:
            leoDebrisCustom.enabled = true;
            break;
          case 4:
            leoSatCustom.enabled = true;
            leoRocketCustom.enabled = true;
            break;
          case 6:
            leoSatCustom.enabled = true;
            leoDebrisCustom.enabled = true;
            break;
          case 8:
            leoRocketCustom.enabled = true;
            leoDebrisCustom.enabled = true;
            break;
          case 9:
            leoSatCustom.enabled = true;
            leoRocketCustom.enabled = true;
            leoDebrisCustom.enabled = true;
            break;
        }
      } else {
        switch (orbitToggle.leoP + orbitToggle.leoR + orbitToggle.leoD) {
          case 1:
            leoSatLayer.enabled = true;
            break;
          case 3:
            leoRocketLayer.enabled = true;
            break;
          case 5:
            leoDebrisLayer.enabled = true;
            break;
          case 4:
            leoSatLayer.enabled = true;
            leoRocketLayer.enabled = true;
            break;
          case 6:
            leoSatLayer.enabled = true;
            leoDebrisLayer.enabled = true;
            break;
          case 8:
            leoRocketLayer.enabled = true;
            leoDebrisLayer.enabled = true;
            break;
          case 9:
            leoSatLayer.enabled = true;
            leoRocketLayer.enabled = true;
            leoDebrisLayer.enabled = true;
            break;
        }
      }
    }

    function meoToggleOn() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.meoP + orbitToggle.meoR + orbitToggle.meoD) {
          case 1:
            meoSatCustom.enabled = true;
            break;
          case 3:
            meoRocketCustom.enabled = true;
            break;
          case 5:
            meoDebrisCustom.enabled = true;
            break;
          case 4:
            meoSatCustom.enabled = true;
            meoRocketCustom.enabled = true;
            break;
          case 6:
            meoSatCustom.enabled = true;
            meoDebrisCustom.enabled = true;
            break;
          case 8:
            meoRocketCustom.enabled = true;
            meoDebrisCustom.enabled = true;
            break;
          case 9:
            meoSatCustom.enabled = true;
            meoRocketCustom.enabled = true;
            meoDebrisCustom.enabled = true;
            break;
        }
      } else {
        switch (orbitToggle.meoP + orbitToggle.meoR + orbitToggle.meoD) {
          case 1:
            meoSatLayer.enabled = true;
            break;
          case 3:
            meoRocketLayer.enabled = true;
            break;
          case 5:
            meoDebrisLayer.enabled = true;
            break;
          case 4:
            meoSatLayer.enabled = true;
            meoRocketLayer.enabled = true;
            break;
          case 6:
            meoSatLayer.enabled = true;
            meoDebrisLayer.enabled = true;
            break;
          case 8:
            meoRocketLayer.enabled = true;
            meoDebrisLayer.enabled = true;
            break;
          case 9:
            meoSatLayer.enabled = true;
            meoRocketLayer.enabled = true;
            meoDebrisLayer.enabled = true;
            break;
        }

      }
    }

    function heoToggleOn() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.heoP + orbitToggle.heoR + orbitToggle.heoD) {
          case 1:
            heoSatCustom.enabled = true;
            break;
          case 3:
            heoRocketCustom.enabled = true;
            break;
          case 5:
            heoDebrisCustom.enabled = true;
            break;
          case 4:
            heoSatCustom.enabled = true;
            heoRocketCustom.enabled = true;
            break;
          case 6:
            heoSatCustom.enabled = true;
            heoDebrisCustom.enabled = true;
            break;
          case 8:
            heoRocketCustom.enabled = true;
            heoDebrisCustom.enabled = true;
            break;
          case 9:
            heoSatCustom.enabled = true;
            heoRocketCustom.enabled = true;
            heoDebrisCustom.enabled = true;
            break;
        }
      } else {
      switch (orbitToggle.heoP + orbitToggle.heoR + orbitToggle.heoD) {
        case 1:
          heoSatLayer.enabled = true;
          break;
        case 3:
          heoRocketLayer.enabled = true;
          break;
        case 5:
          heoDebrisLayer.enabled = true;
          break;
        case 4:
          heoSatLayer.enabled = true;
          heoRocketLayer.enabled = true;
          break;
        case 6:
          heoSatLayer.enabled = true;
          heoDebrisLayer.enabled = true;
          break;
        case 8:
          heoRocketLayer.enabled = true;
          heoDebrisLayer.enabled = true;
          break;
        case 9:
          heoSatLayer.enabled = true;
          heoRocketLayer.enabled = true;
          heoDebrisLayer.enabled = true;
          break;
      }
    }
    }

    function geoToggleOn() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.geoP + orbitToggle.geoR + orbitToggle.geoD) {
          case 1:
            geoSatCustom.enabled = true;
            break;
          case 3:
            geoRocketCustom.enabled = true;
            break;
          case 5:
            geoDebrisCustom.enabled = true;
            break;
          case 4:
            geoSatCustom.enabled = true;
            geoRocketCustom.enabled = true;
            break;
          case 6:
            geoSatCustom.enabled = true;
            geoDebrisCustom.enabled = true;
            break;
          case 8:
            geoRocketCustom.enabled = true;
            geoDebrisCustom.enabled = true;
            break;
          case 9:
            geoSatCustom.enabled = true;
            geoRocketCustom.enabled = true;
            geoDebrisCustom.enabled = true;
            break;
        }
      } else {
        switch (orbitToggle.geoP + orbitToggle.geoR + orbitToggle.geoD) {
          case 1:
            geoSatLayer.enabled = true;
            break;
          case 3:
            geoRocketLayer.enabled = true;
            break;
          case 5:
            geoDebrisLayer.enabled = true;
            break;
          case 4:
            geoSatLayer.enabled = true;
            geoRocketLayer.enabled = true;
            break;
          case 6:
            geoSatLayer.enabled = true;
            geoDebrisLayer.enabled = true;
            break;
          case 8:
            geoRocketLayer.enabled = true;
            geoDebrisLayer.enabled = true;
            break;
          case 9:
            geoSatLayer.enabled = true;
            geoRocketLayer.enabled = true;
            geoDebrisLayer.enabled = true;
            break;
        }
      }
    }

    function unclassifiedToggleOn() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD) {
          case 1:
            unclassifiedSatCustom.enabled = true;
            break;
          case 3:
            unclassifiedRocketCustom.enabled = true;
            break;
          case 5:
            unclassifiedDebrisCustom.enabled = true;
            break;
          case 4:
            unclassifiedSatCustom.enabled = true;
            unclassifiedRocketCustom.enabled = true;
            break;
          case 6:
            unclassifiedSatCustom.enabled = true;
            unclassifiedDebrisCustom.enabled = true;
            break;
          case 8:
            unclassifiedRocketCustom.enabled = true;
            unclassifiedDebrisCustom.enabled = true;
            break;
          case 9:
            unclassifiedSatCustom.enabled = true;
            unclassifiedRocketCustom.enabled = true;
            unclassifiedDebrisCustom.enabled = true;
            break;
        }
      } else {
        switch (orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD) {
          case 1:
            unclassifiedSatLayer.enabled = true;
            break;
          case 3:
            unclassifiedRocketLayer.enabled = true;
            break;
          case 5:
            unclassifiedDebrisLayer.enabled = true;
            break;
          case 4:
            unclassifiedSatLayer.enabled = true;
            unclassifiedRocketLayer.enabled = true;
            break;
          case 6:
            unclassifiedSatLayer.enabled = true;
            unclassifiedDebrisLayer.enabled = true;
            break;
          case 8:
            unclassifiedRocketLayer.enabled = true;
            unclassifiedDebrisLayer.enabled = true;
            break;
          case 9:
            unclassifiedSatLayer.enabled = true;
            unclassifiedRocketLayer.enabled = true;
            unclassifiedDebrisLayer.enabled = true;
            break;
        }
      }
    }

    function leoToggleOff() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.leoP + orbitToggle.leoR + orbitToggle.leoD) {
          case 0:
            leoSatCustom.enabled = false;
            leoRocketCustom.enabled = false;
            leoDebrisCustom.enabled = false;
            break;
          case 1:
            leoSatCustom.enabled = false;
            break;
          case 3:
            leoRocketCustom.enabled = false;
            break;
          case 5:
            leoDebrisCustom.enabled = false;

            break;
          case 4:
            leoSatCustom.enabled = false;
            leoRocketCustom.enabled = false;

            break;
          case 6:
            leoSatCustom.enabled = false;
            leoDebrisCustom.enabled = false;
            break;
          case 8:
            leoRocketCustom.enabled = false;
            leoDebrisCustom.enabled = false;
            break;
          case 9:
            leoSatCustom.enabled = false;
            leoRocketCustom.enabled = false;
            leoDebrisCustom.enabled = false;
            break;
        }
      } else {
        switch (orbitToggle.leoP + orbitToggle.leoR + orbitToggle.leoD) {
          case 0:
            leoSatLayer.enabled = false;
            leoRocketLayer.enabled = false;
            leoDebrisLayer.enabled = false;
            break;
          case 1:
            leoSatLayer.enabled = false;
            break;
          case 3:
            leoRocketLayer.enabled = false;
            break;
          case 5:
            leoDebrisLayer.enabled = false;

            break;
          case 4:
            leoSatLayer.enabled = false;
            leoRocketLayer.enabled = false;

            break;
          case 6:
            leoSatLayer.enabled = false;
            leoDebrisLayer.enabled = false;
            break;
          case 8:
            leoRocketLayer.enabled = false;
            leoDebrisLayer.enabled = false;
            break;
          case 9:
            leoSatLayer.enabled = false;
            leoRocketLayer.enabled = false;
            leoDebrisLayer.enabled = false;
            break;
        }
      }
    }

    function meoToggleOff() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.meoP + orbitToggle.meoR + orbitToggle.meoD) {
          case 0:
            meoSatCustom.enabled = false;
            meoRocketCustom.enabled = false;
            meoDebrisCustom.enabled = false;
            break;
          case 1:
            meoSatCustom.enabled = false;
            break;
          case 3:
            meoRocketCustom.enabled = false;
            break;
          case 5:
            meoDebrisCustom.enabled = false;

            break;
          case 4:
            meoSatCustom.enabled = false;
            meoRocketCustom.enabled = false;

            break;
          case 6:
            meoSatCustom.enabled = false;
            meoDebrisCustom.enabled = false;
            break;
          case 8:
            meoRocketCustom.enabled = false;
            meoDebrisCustom.enabled = false;
            break;
          case 9:
            meoSatCustom.enabled = false;
            meoRocketCustom.enabled = false;
            meoDebrisCustom.enabled = false;
            break;
        }
      } else {
        switch (orbitToggle.meoP + orbitToggle.meoR + orbitToggle.meoD) {
          case 0:
            meoSatLayer.enabled = false;
            meoRocketLayer.enabled = false;
            meoDebrisLayer.enabled = false;
            break;
          case 1:
            meoSatLayer.enabled = false;
            break;
          case 3:
            meoRocketLayer.enabled = false;
            break;
          case 5:
            meoDebrisLayer.enabled = false;

            break;
          case 4:
            meoSatLayer.enabled = false;
            meoRocketLayer.enabled = false;

            break;
          case 6:
            meoSatLayer.enabled = false;
            meoDebrisLayer.enabled = false;
            break;
          case 8:
            meoRocketLayer.enabled = false;
            meoDebrisLayer.enabled = false;
            break;
          case 9:
            meoSatLayer.enabled = false;
            meoRocketLayer.enabled = false;
            meoDebrisLayer.enabled = false;
            break;
        }
      }
    }

    function heoToggleOff() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.heoP + orbitToggle.heoR + orbitToggle.heoD) {
          case 0:
            heoSatCustom.enabled = false;
            heoRocketCustom.enabled = false;
            heoDebrisCustom.enabled = false;
            break;
          case 1:
            heoSatCustom.enabled = false;
            break;
          case 3:
            heoRocketCustom.enabled = false;
            break;
          case 5:
            heoDebrisCustom.enabled = false;

            break;
          case 4:
            heoSatCustom.enabled = false;
            heoRocketCustom.enabled = false;
            break;
          case 6:
            heoSatCustom.enabled = false;
            heoDebrisCustom.enabled = false;
            break;
          case 8:
            heoRocketCustom.enabled = false;
            heoDebrisCustom.enabled = false;
            break;
          case 9:
            heoSatCustom.enabled = false;
            heoRocketCustom.enabled = false;
            heoDebrisCustom.enabled = false;
            break;
        }
      } else {
        switch (orbitToggle.heoP + orbitToggle.heoR + orbitToggle.heoD) {
          case 0:
            heoSatLayer.enabled = false;
            heoRocketLayer.enabled = false;
            heoDebrisLayer.enabled = false;
            break;
          case 1:
            heoSatLayer.enabled = false;
            break;
          case 3:
            heoRocketLayer.enabled = false;
            break;
          case 5:
            heoDebrisLayer.enabled = false;

            break;
          case 4:
            heoSatLayer.enabled = false;
            heoRocketLayer.enabled = false;
            break;
          case 6:
            heoSatLayer.enabled = false;
            heoDebrisLayer.enabled = false;
            break;
          case 8:
            heoRocketLayer.enabled = false;
            heoDebrisLayer.enabled = false;
            break;
          case 9:
            heoSatLayer.enabled = false;
            heoRocketLayer.enabled = false;
            heoDebrisLayer.enabled = false;
            break;
        }
      }
    }

    function geoToggleOff() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD) {
          case 0:
            geoSatCustom.enabled = false;
            geoRocketCustom.enabled = false;
            geoDebrisCustom.enabled = false;
            break;
          case 1:
            geoSatCustom.enabled = false;
            break;
          case 3:
            geoRocketCustom.enabled = false;
            break;
          case 5:
            geoDebrisCustom.enabled = false;

            break;
          case 4:
            geoSatCustom.enabled = false;
            geoRocketCustom.enabled = false;
            break;
          case 6:
            geoSatCustom.enabled = false;
            geoDebrisCustom.enabled = false;
            break;
          case 8:
            geoRocketCustom.enabled = false;
            geoDebrisCustom.enabled = false;
            break;
          case 9:
            geoSatCustom.enabled = false;
            geoRocketCustom.enabled = false;
            geoDebrisCustom.enabled = false;
            break;
        }
      } else {
        switch (orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD) {
          case 0:
            geoSatLayer.enabled = false;
            geoRocketLayer.enabled = false;
            geoDebrisLayer.enabled = false;
            break;
          case 1:
            geoSatLayer.enabled = false;
            break;
          case 3:
            geoRocketLayer.enabled = false;
            break;
          case 5:
            geoDebrisLayer.enabled = false;

            break;
          case 4:
            geoSatLayer.enabled = false;
            geoRocketLayer.enabled = false;
            break;
          case 6:
            geoSatLayer.enabled = false;
            geoDebrisLayer.enabled = false;
            break;
          case 8:
            geoRocketLayer.enabled = false;
            geoDebrisLayer.enabled = false;
            break;
          case 9:
            geoSatLayer.enabled = false;
            geoRocketLayer.enabled = false;
            geoDebrisLayer.enabled = false;
            break;
        }
      }
    }

    function unclassifiedToggleOff() {
      if ($("#custom").text() === "CUSTOM ON") {
        switch (orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD) {
          case 0:
            unclassifiedSatCustom.enabled = false;
            unclassifiedRocketCustom.enabled = false;
            unclassifiedDebrisCustom.enabled = false;
            break;
          case 1:
            unclassifiedSatCustom.enabled = false;
            break;
          case 3:
            unclassifiedRocketCustom.enabled = false;
            break;
          case 5:
            unclassifiedDebrisCustom.enabled = false;

            break;
          case 4:
            unclassifiedSatCustom.enabled = false;
            unclassifiedRocketCustom.enabled = false;
            break;
          case 6:
            unclassifiedSatCustom.enabled = false;
            unclassifiedDebrisCustom.enabled = false;
            break;
          case 8:
            unclassifiedRocketCustom.enabled = false;
            unclassifiedDebrisCustom.enabled = false;
            break;
          case 9:
            unclassifiedSatCustom.enabled = false;
            unclassifiedRocketCustom.enabled = false;
            unclassifiedDebrisCustom.enabled = false;
            break;
        }
      } else {
        switch (orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD) {
          case 0:
            unclassifiedSatLayer.enabled = false;
            unclassifiedRocketLayer.enabled = false;
            unclassifiedDebrisLayer.enabled = false;
            break;
          case 1:
            unclassifiedSatLayer.enabled = false;
            break;
          case 3:
            unclassifiedRocketLayer.enabled = false;
            break;
          case 5:
            unclassifiedDebrisLayer.enabled = false;

            break;
          case 4:
            unclassifiedSatLayer.enabled = false;
            unclassifiedRocketLayer.enabled = false;
            break;
          case 6:
            unclassifiedSatLayer.enabled = false;
            unclassifiedDebrisLayer.enabled = false;
            break;
          case 8:
            unclassifiedRocketLayer.enabled = false;
            unclassifiedDebrisLayer.enabled = false;
            break;
          case 9:
            unclassifiedSatLayer.enabled = false;
            unclassifiedRocketLayer.enabled = false;
            unclassifiedDebrisLayer.enabled = false;
            break;
        }
      }
    }

    //Range Toggles
    $('#leo').click(function () {
      if ($(this).text() == "LEO OFF") {
        $(this).text("LEO ON");
        leoToggleOn();
      } else {
        $(this).text("LEO OFF");
        leoToggleOff();
      }
    });
    $('#meo').click(function () {
      if ($(this).text() == "MEO OFF") {
        $(this).text("MEO ON");
        meoToggleOn();
      } else {
        $(this).text("MEO OFF");
        meoToggleOff();
      }
    });
    $('#heo').click(function () {
      if ($(this).text() == "HEO OFF") {
        $(this).text("HEO ON");
        heoToggleOn();
      } else {
        $(this).text("HEO OFF");
        heoToggleOff();
      }
    });
    $('#geo').click(function () {
      if ($(this).text() == "GEO OFF") {
        $(this).text("GEO ON");
        geoToggleOn();
      } else {
        $(this).text("GEO OFF");
        geoToggleOff();
      }
    });
    $('#unclassified').click(function () {
      if ($(this).text() == "UNCLASSIFIED OFF") {
        $(this).text("UNCLASSIFIED ON");
        unclassifiedToggleOn();
      } else {
        $(this).text("UNCLASSIFIED OFF");
        unclassifiedToggleOff();
      }
    });
    //custom toggle
    var customYearCon = false;
    $('#custom').click(function () {
      if ($(this).text() == "CUSTOM ON") {
        customYearCon = false;
        allCustomOff();
      } else {
        allLayersOff();
      }
    });
    //gs toggle
    $('#gStations').click(function () {
      if ($(this).text() == "GS ON") {
        $(this).text("GS OFF");
        groundStationsLayer.enabled = false;
        var gsToggleButtons = document.getElementById('gsButtonToggle');
        gsToggleButtons.style.display = "none";
      } else {
        $(this).text("GS ON");
        groundStationsLayer.enabled = true;
        var gsToggleButtons = document.getElementById('gsButtonToggle');
        gsToggleButtons.style.display = "inline";
      }
    });

    //turn of custom gs layer
    $('#customGS').click(function () {
      if ($(this).text() == "CUSTOM GS ON") {
        $(this).text("CUSTOM GS OFF");
        customGSLayer.enabled = false;
      } else {
        $(this).text("CUSTOM GS ON");
        customGSLayer.enabled = true;
      }
    });
    // Add the station and its horizon to the custom layer
    $('#clearStations').click(function () {
      customGSLayer.removeAllRenderables();
      while (groundsIndex.length > 0) {
        groundsIndex.pop();
      }
      $('#customStatus').text("CLEARED GS LAYER");
      window.setTimeout(function () {
        $('#customStatus').text("");
      }, 2000)
    });

// Implementing the perfect scrollbar
    $('#sidebar-wrapper').perfectScrollbar();
    $('#sidebar-wrapper-right').perfectScrollbar();

//toggle minimization of left nav bar
    $("#min_button").click(function () {
      if ($(this).html() == "+") {
        $(this).html("-");
      }
      else {
        $(this).html("+");
      }
      $("#box").slideToggle();
    });

//toggle minimization of right nav bar
    $("#min_button_right").click(function () {
      if ($(this).html() == "+") {
        $(this).html("-");
      }
      else {
        $(this).html("+");
      }
      $("#box_right").slideToggle();
    });

    $('#min_button2').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var searchStack = document.getElementById('searchStack');
        searchStack.style.display = "none";
      } else {
        $(this).html("-");
        var searchStack = document.getElementById('searchStack');
        searchStack.style.display = "block";
      }
    });

    $('#min_button3').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var typeStack = document.getElementById('typeStack');
        typeStack.style.display = "none";
      } else {
        $(this).html("-");
        var typeStack = document.getElementById('typeStack');
        typeStack.style.display = "block";
      }
    });

    $('#min_button4').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var orbitStack = document.getElementById('orbitStack');
        orbitStack.style.display = "none";
      } else {
        $(this).html("-");
        var orbitStack = document.getElementById('orbitStack');
        orbitStack.style.display = "block";
      }
    });

    $('#min_button5').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var gsStack = document.getElementById('gsStack');
        gsStack.style.display = "none";
      } else {
        $(this).html("-");
        var gsStack = document.getElementById('gsStack');
        gsStack.style.display = "block";
      }
    });

    $('#min_button6').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var generalStack = document.getElementById('generalStack');
        generalStack.style.display = "none";
      } else {
        $(this).html("-");
        var generalStack = document.getElementById('generalStack');
        generalStack.style.display = "block";
      }
    });

    $('#min_button7').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var infoStack = document.getElementById('infoStack');
        infoStack.style.display = "none";
      } else {
        $(this).html("-");
        var infoStack = document.getElementById('infoStack');
        infoStack.style.display = "block";
      }
    });

    $('#min_button8').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var positionStack = document.getElementById('positionStack');
        positionStack.style.display = "none";
      } else {
        $(this).html("-");
        var positionStack = document.getElementById('positionStack');
        positionStack.style.display = "block";
      }
    });

    $('#min_button9').click(function () {
      if ($(this).html() == "-") {
        $(this).html("+");
        var extraStack = document.getElementById('extraStack');
        extraStack.style.display = "none";
      } else {
        $(this).html("-");
        var extraStack = document.getElementById('extraStack');
        extraStack.style.display = "block";
      }
    });


    /***
     Ground Stations Layer
     ***/
    groundStationsLayer.enabled = false;
    var gsPlacemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    var gsHighlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(gsPlacemarkAttributes);

    gsPlacemarkAttributes.imageSource = "assets/icons/ground-station.png";
    gsPlacemarkAttributes.imageScale = 0.25;
    gsPlacemarkAttributes.imageOffset = new WorldWind.Offset(
      WorldWind.OFFSET_FRACTION, 0.3,
      WorldWind.OFFSET_FRACTION, 0.0);
    gsPlacemarkAttributes.imageColor = WorldWind.Color.WHITE;
    gsPlacemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
      WorldWind.OFFSET_FRACTION, 0.5,
      WorldWind.OFFSET_FRACTION, 1.0);
    gsPlacemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

    var gsNames = [];
    var gsOrg = [];
    var groundStation = [];
    for (var g = 0, len = groundStations.length; g < len; g++) {
      gsNames.push(groundStations[g].NAME);
      gsOrg.push(groundStations[g].ORGANIZATION);
      groundStation[g] = new WorldWind.Position(groundStations[g].LATITUDE,
        groundStations[g].LONGITUDE,
        groundStations[g].ALTITUDE);
      var gsPlacemark = new WorldWind.Placemark(groundStation[g]);

      gsPlacemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
      gsPlacemark.label = groundStation.NAME;
      gsPlacemark.attributes = gsPlacemarkAttributes;
      gsPlacemark.highlightAttributes = gsHighlightPlacemarkAttributes;
      groundStationsLayer.addRenderable(gsPlacemark);
    }

    var addCustomGS = function (gsind) {
      var indexCheck = groundsIndex.indexOf(gsind);
      if (indexCheck === -1) {
        groundsIndex.unshift(gsind);
        var gsAttributes = new WorldWind.ShapeAttributes(null);
        gsAttributes.outlineColor = new WorldWind.Color(0, 255, 255, 1);
        gsAttributes.interiorColor = new WorldWind.Color(0, 255, 255, 0.2);

        var shape = new WorldWind.SurfaceCircle(new WorldWind.Location(groundStations[groundsIndex[0]].LATITUDE,
          groundStations[groundsIndex[0]].LONGITUDE), 150e4, gsAttributes);

        var gsPlacemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        var gsHighlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(gsPlacemarkAttributes);

        gsPlacemarkAttributes.imageSource = "assets/icons/ground-station.png";
        gsPlacemarkAttributes.imageScale = 0.25;
        gsPlacemarkAttributes.imageOffset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.3,
          WorldWind.OFFSET_FRACTION, 0.0);
        gsPlacemarkAttributes.imageColor = WorldWind.Color.WHITE;
        gsPlacemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.5,
          WorldWind.OFFSET_FRACTION, 1.0);
        gsPlacemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

        var gsPlacemark = new WorldWind.Placemark(new WorldWind.Position(groundStations[groundsIndex[0]].LATITUDE,
          groundStations[groundsIndex[0]].LONGITUDE, groundStations[groundsIndex[0]].ALTITUDE));

        gsPlacemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        gsPlacemark.label = groundStation.NAME;
        gsPlacemark.attributes = gsPlacemarkAttributes;
        gsPlacemark.highlightAttributes = gsHighlightPlacemarkAttributes;

        customGSLayer.addRenderable(gsPlacemark);
        customGSLayer.addRenderable(shape);

        $('#customStatus').text("ADDED " + groundStations[groundsIndex[0]].NAME.toUpperCase() + " TO CUSTOM GS LAYER");
        window.setTimeout(function () {
          $('#customStatus').text("");
        }, 2000)
      } else {
        $('#customStatus').text("ALREADY ON CUSTOM LAYER");
        window.setTimeout(function () {
          $('#customStatus').text("");
        }, 2000)
      }
    };
    var groundsIndex = [];
    var toGsStation = function (gsind) {
      //GS information display
      populateGSInfo(groundStations[gsind]);

      //moves to GS location
      wwd.goTo(new WorldWind.Location(groundStations[gsind].LATITUDE, groundStations[gsind].LONGITUDE));
    };




    /***Satellite Propagation***/
    //plots all sats
    renderSats(satPac);
    function renderSats(satData) {
      trackedPlaceholder.textContent = satData.length;
      var satNames = [];
      var satOwner = [];
      var satDate = [];
      var satSite = [];
      var satStatus = [];
      var now = new Date();
      var everyCurrentPosition = [];
      for (var j = 0; j < satNum; j++) {
        var currentPosition = null;
        var time = new Date(now.getTime());

        try {
          var velocity = getVelocity(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
          var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
        } catch (err) {
          console.log(err + ' in renderSats, sat ' + j +  " " + satPac[j].OBJECT_NAME);
          continue;
        }
        try {
          satVelocity.push(velocity);
          currentPosition = new WorldWind.Position(position.latitude,
            position.longitude,
            position.altitude);
        everyCurrentPosition.push(currentPosition);
        satSite.push(satData[j].LAUNCH_SITE);
        satNames.push(satData[j].OBJECT_NAME);
        satOwner.push(satData[j].OWNER);
        satStatus.push(satData[j].OPERATIONAL_STATUS);
        satDate[j] = satData[j].LAUNCH_DATE.substring(0, 4);
        } catch (err) {
          console.log(err + ' in renderSats, sat ' + j);
          console.log(satData[j].OBJECT_NAME);
          continue;
        }
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightPlacemarkAttributes.imageScale = 0.4;

        //add colored image depending on sat type
        switch (satData[j].OBJECT_TYPE) {
          case "PAYLOAD":
            placemarkAttributes.imageSource = "assets/icons/blue_dot.png";
            placemarkAttributes.imageScale = 0.3;
            break;
          case "ROCKET BODY":
            placemarkAttributes.imageSource = "assets/icons/yellow_dot.png";
            placemarkAttributes.imageScale = 0.3;
            break;
          default:
            placemarkAttributes.imageSource = "assets/icons/red_dot.png";
            placemarkAttributes.imageScale = 0.2;
            highlightPlacemarkAttributes.imageScale = 0.3;
        }

        placemarkAttributes.imageOffset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.5,
          WorldWind.OFFSET_FRACTION, 0.5);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.5,
          WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;


        var placemark = new WorldWind.Placemark(everyCurrentPosition[j]);
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.attributes = placemarkAttributes;
        placemark.highlightAttributes = highlightPlacemarkAttributes;

        //Defines orbit ranges
        if (satData[j].OBJECT_TYPE === "PAYLOAD") {
          if (satData[j].ORBIT_TYPE === "Low Earth Orbit") {
            leoSatLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Middle Earth Orbit") {
            meoSatLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Geosynchronous") {
            geoSatLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Highly Elliptical Orbit") {
            heoSatLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Unclassified") {
            unclassifiedSatLayer.addRenderable(placemark);
          } else {
            console.log(satData[j].ORBIT_TYPE);
          }
        } else if (satData[j].OBJECT_TYPE === "ROCKET BODY") {
          if (satData[j].ORBIT_TYPE === "Low Earth Orbit") {
            leoRocketLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Middle Earth Orbit") {
            meoRocketLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Geosynchronous") {
            geoRocketLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Highly Elliptical Orbit") {
            heoRocketLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Unclassified") {
            unclassifiedRocketLayer.addRenderable(placemark);
          } else {
            console.log(satData[j].ORBIT_TYPE);
          }
        } else if (satData[j].OBJECT_TYPE === "DEBRIS") {
          if (satData[j].ORBIT_TYPE === "Low Earth Orbit") {
            leoDebrisLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Middle Earth Orbit") {
            meoDebrisLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Geosynchronous") {
            geoDebrisLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Highly Elliptical Orbit") {
            heoDebrisLayer.addRenderable(placemark);
          } else if (satData[j].ORBIT_TYPE === "Unclassified") {
            unclassifiedDebrisLayer.addRenderable(placemark);
          } else {
            console.log(satData[j].ORBIT_TYPE);
          }
        }

        wwd.redraw();
      }

      //UI button to clear custom sat layer
      $('#clearCustom').click(function () {
        isOwner = false;
        isOperationalStatus = false;
        isLaunchYear = false;
        isLaunchSite = false;
        while (customLayerSats.length > 0) {
          customLayerSats.pop();
        }
        while (indexCheck.length > 0) {
          indexCheck.pop();
        }
        $("#nameSearch").jqxComboBox('clearSelection');
        $("#yearSearch").jqxComboBox('clearSelection');
        $("#siteSearch").jqxComboBox('clearSelection');
        $("#ownerSearch").jqxComboBox('clearSelection');
        $("#statusSearch").jqxComboBox('clearSelection');
        $('#yearRangeSlider').jqxSlider('setValue', 1958, 2016);
        clearAllCustomLayers();
        $('#customStatus').text("CLEARED CUSTOM LAYER");
        window.setTimeout(function () {
          $('#customStatus').text("");
        }, 2000)
      });

      //Add individual sats to custom layer
      var indexCheck = [];
      var indexChecked = null;
      var customLayerSats = [];
      var addCustomSat = function (index) {
        indexChecked = indexCheck.indexOf(index);
        if (indexChecked === -1) {
          customLayerSats.push(index);
          indexCheck.unshift(index);


          var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
          var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
          highlightPlacemarkAttributes.imageScale = 0.4;

          //add colored image depending on sat type
          switch (satData[indexCheck[0]].OBJECT_TYPE) {
            case "PAYLOAD":
              placemarkAttributes.imageSource = "assets/icons/blue_dot.png";
              placemarkAttributes.imageScale = 0.3;
              break;
            case "ROCKET BODY":
              placemarkAttributes.imageSource = "assets/icons/yellow_dot.png";
              placemarkAttributes.imageScale = 0.3;
              break;
            default:
              placemarkAttributes.imageSource = "assets/icons/red_dot.png";
              placemarkAttributes.imageScale = 0.2;
              highlightPlacemarkAttributes.imageScale = 0.3;
          }

          placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 0.5);
          placemarkAttributes.imageColor = WorldWind.Color.WHITE;
          placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
          placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;


          var placemark = new WorldWind.Placemark(everyCurrentPosition[indexCheck[0]]);
          placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          placemark.attributes = placemarkAttributes;
          placemark.highlightAttributes = highlightPlacemarkAttributes;

          //Defines orbit ranges
          if (satData[indexCheck[0]].OBJECT_TYPE === "PAYLOAD") {
            if (satData[indexCheck[0]].ORBIT_TYPE === "Low Earth Orbit") {
              leoSatCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Middle Earth Orbit") {
              meoSatCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Geosynchronous") {
              geoSatCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Highly Elliptical Orbit") {
              heoSatCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Unclassified") {
              unclassifiedSatCustom.addRenderable(placemark);
            } else {
              console.log(satData[indexCheck[0]].ORBIT_TYPE);
            }
          } else if (satData[indexCheck[0]].OBJECT_TYPE === "ROCKET BODY") {
            if (satData[indexCheck[0]].ORBIT_TYPE === "Low Earth Orbit") {
              leoRocketCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Middle Earth Orbit") {
              meoRocketCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Geosynchronous") {
              geoRocketCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Highly Elliptical Orbit") {
              heoRocketCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Unclassified") {
              unclassifiedRocketCustom.addRenderable(placemark);
            } else {
              console.log(satData[indexCheck[0]].ORBIT_TYPE);
            }
          } else if (satData[indexCheck[0]].OBJECT_TYPE === "DEBRIS") {
            if (satData[indexCheck[0]].ORBIT_TYPE === "Low Earth Orbit") {
              leoDebrisCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Middle Earth Orbit") {
              meoDebrisCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Geosynchronous") {
              geoDebrisCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Highly Elliptical Orbit") {
              heoDebrisCustom.addRenderable(placemark);
            } else if (satData[indexCheck[0]].ORBIT_TYPE === "Unclassified") {
              unclassifiedDebrisCustom.addRenderable(placemark);
            } else {
              console.log(satData[indexCheck[0]].ORBIT_TYPE);
            }
          }

          $('#customStatus').text("ADDED " + satData[indexCheck[0]].OBJECT_NAME + " TO CUSTOM LAYER");
          window.setTimeout(function () {
            $('#customStatus').text("");
          }, 2000);
        } else {
          $('#customStatus').text("ALREADY ADDED TO CUSTOM LAYER");
          window.setTimeout(function () {
            $('#customStatus').text("");
          }, 2000);
        }
      };


      // Interval to Update all Satellite Positions
      var updatePositions = setInterval(function () {
        if (!updatePermission)
          return;

        for (var indx = 0; indx < satNum; indx += 1) {
          var timeSlide = $('#timeEvent').jqxSlider('value');
          var now = new Date();
          var time = new Date(now.getTime() + timeSlide * 60000);
          $('#timeValue').html(new Date(now.getTime() + timeSlide * 60000));
          try {
            var position = getPosition(satellite.twoline2satrec(satData[indx].TLE_LINE1, satData[indx].TLE_LINE2), time);
            satVelocity[indx] = getVelocity(satellite.twoline2satrec(satData[indx].TLE_LINE1, satData[indx].TLE_LINE2), time);

          } catch (err) {
            console.log(err + ' in updatePositions interval, sat ' + indx + satPac[indx].OBJECT_NAME);
            continue;
          }
          try {
            everyCurrentPosition[indx].latitude = position.latitude;
            everyCurrentPosition[indx].longitude = position.longitude;
            everyCurrentPosition[indx].altitude = position.altitude;
          } catch (err) {
            //TODO: Handle deorbited sats
          }
        }
        wwd.redraw();
      }, updateTime * 1.5);


      /***
       * Search bars and sliders *
       * ***/

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      gsNames.sort();
      // Create search box for GS's
      $("#gsNameSearch").jqxComboBox({
        source: gsNames,
        displayMember: "NAME",
        placeHolder: "GS NAME",
        width: 220,
        height: 30,
        theme: 'shinyblack'
      });
      // trigger the select event.
      $("#gsNameSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#gsNameLog").children().remove();
            var searchGSat = -1;
            for (var i = 0; i < gsNames.length; i += 1){
              if (groundStations[i].NAME === item.label){
                searchGSat = i;
                break;
              }
            }
            customYearCon = true;
            endFollow();
            toGsStation(searchGSat);
          }
        }
      });

      //create satellite site search
      var org = gsOrg.filter(onlyUnique);
      $("#gsOrgSearch").jqxComboBox({
        source: org,
        displayMember: "ORGANIZATION",
        placeHolder: "ORGANIZATION",
        width: 220,
        height: 30,
        theme: 'shinyblack'
      });
      // trigger the select event.
      $("#gsOrgSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#gsOrgLog").children().remove();
            customYearCon = true;
            customGSLayer.removeAllRenderables();
            for (var i = 0; i < satNum; i += 1) {
              if (gsOrg[i] === item.label) {
                addCustomGS(i);
              }
            }
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            customGSLayer.enabled = true;
            $("#customGS").text("CUSTOM GS ON");
          }
        }
      });

      var isOwner = false, isOperationalStatus = false,
          isLaunchSite = false, isLaunchYear = false;

      //create satellite owner search
      var owner = satOwner.filter(onlyUnique); // returns ['a', 1, 2, '1'];
      owner.sort();
      $("#ownerSearch").jqxComboBox({
        source: owner,
        placeHolder: "OWNER",
        width: 220,
        height: 30,
        theme: 'shinyblack'

      });
      // trigger the select event.
      $("#ownerSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#ownerLog").children().remove();
            $('#yearRangeSlider').jqxSlider('setValue', 1958, 2016);
            isOwner = item.label;
            indexCheck = [];
            customYearCon = true;
            customLayerSats = [];
            populateCustomSatLayer(satData, isOwner, isLaunchYear,
                isLaunchSite, isOperationalStatus, addCustomSat);
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
          }
        }
      });

      //create satellite owner search
      var year = satDate.filter(onlyUnique); // returns ['a', 1, 2, '1'];
      $("#yearSearch").jqxComboBox({
        source: year,
        displayMember: "LAUNCH YEAR",
        placeHolder: "LAUNCH YEAR",
        width: 220,
        height: 30,
        theme: 'shinyblack'
      });
      // trigger the select event.
      $("#yearSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#yearLog").children().remove();
            isLaunchYear = item.label;
            indexCheck = [];
            customYearCon = true;
            customLayerSats = [];
            $('#yearRangeSlider').jqxSlider('setValue', 1958, 2016);
            populateCustomSatLayer(satData, isOwner, isLaunchYear,
                isLaunchSite, isOperationalStatus, addCustomSat);
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
          }
        }
      });

      //create satellite site search
      var site = satSite.filter(onlyUnique);
      site.sort();
      $("#siteSearch").jqxComboBox({
        source: site,
        displayMember: "LAUNCH SITE",
        placeHolder: "LAUNCH SITE",
        width: 220,
        height: 30,
        theme: 'shinyblack'
      });
      // trigger the select event.
      $("#siteSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#siteLog").children().remove();
            customYearCon = true;
            isLaunchSite = item.label;
            indexCheck = [];
            customLayerSats = [];
            $('#yearRangeSlider').jqxSlider('setValue', 1958, 2016);
            populateCustomSatLayer(satData, isOwner, isLaunchYear,
                isLaunchSite, isOperationalStatus, addCustomSat);
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
          }
        }
      });

      //create satellite site search
      var status = satStatus.filter(onlyUnique);
      status.sort();
      $("#statusSearch").jqxComboBox({
        source: status,
        displayMember: "OPERATIONAL STATUS",
        placeHolder: "OPERATIONAL STATUS",
        width: 220,
        height: 30,
        theme: 'shinyblack'
      });
      // trigger the select event.
      $("#statusSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#statusLog").children().remove();
            isOperationalStatus = item.label;
            indexCheck = [];
            customYearCon = true;
            customLayerSats = [];
            $('#yearRangeSlider').jqxSlider('setValue', 1958, 2016);
            populateCustomSatLayer(satData, isOwner, isLaunchYear,
                isLaunchSite, isOperationalStatus, addCustomSat);
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
          }
        }
      });

      // Create search box for Satellites
      satNames.sort();
      $("#nameSearch").jqxComboBox({
        source: satNames,
        displayMember: "OBJECT_NAME",
        placeHolder: "SATELLITE NAME",
        width: 220,
        height: 30,
        theme: 'shinyblack'
      });
      // trigger the select event.
      $("#nameSearch").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#nameLog").children().remove();
            endFollow();
            endMesh();
            endOrbit();
            endExtra();
            var searchSat = -1;
            for (var i = 0; i < satNum; i += 1){
              if (satData[i].OBJECT_NAME === item.label){
                searchSat = i;
                break;
              }
            }
            toCurrentPosition(searchSat);
            meshToCurrentPosition(searchSat);
            createOrbit(searchSat);
            extraData(searchSat);
            createCollada(searchSat);
            typePlaceholder.textContent = satData[searchSat].OBJECT_TYPE;
            idPlaceholder.textContent = satData[searchSat].OBJECT_ID;
            namePlaceholder.textContent = satData[searchSat].OBJECT_NAME;
          }
        }
      });

      //Time Control slider
      $("#timeEvent").jqxSlider({
        theme: 'shinyblack',
        value: 0,
        max: 10080,
        min: -10080,
        mode: 'fixed',
        ticksFrequency: 1440,
        width: "viewport",
        showMinorTicks: true,
        minorTicksFrequency: 240,
        showTickLabels: true
      });
      $('#timeEvent').bind('change', function (event) {
        $('#timeValue').html(new Date(now.getTime() + event.args.value * 60000));
      });
      $('#timeReset').on('click', function () {
        $('#timeEvent').jqxSlider('setValue', 0);
      });

      $('#orbitValue').html(new Date(now.getTime() + 98 * 60000));
      $('#orbitValueMin').html("Date of future orbit path endpoint");
      //Orbit length/time slider
      $("#orbitEvent").jqxSlider({
        theme: 'shinyblack',
        value: 98,
        max: 10080,
        min: 0,
        ticksFrequency: 1440,
        width: "viewport",
        showButtons: true
      });
      $('#orbitEvent').bind('change', function (event) {
        $('#orbitValue').html(new Date(now.getTime() + event.args.value * 60000));
      });

      $('#orbitValue2').html(new Date(now.getTime() - 98 * 60000));
      $('#orbitValueMin2').html("Date of past orbit path endpoint");
      //Orbit length/time slider
      $("#orbitEvent2").jqxSlider({
        theme: 'shinyblack',
        value: 98,
        max: 10080,
        min: 0,
        ticksFrequency: 1440,
        width: "viewport",
        showButtons: true
      });
      $('#orbitEvent2').bind('change', function (event) {
        $('#orbitValue2').html(new Date(now.getTime() - event.args.value * 60000));
      });

      $("#yearRangeSlider").jqxSlider({
        theme: 'shinyblack',
        mode: "fixed",
        values: [1958, 2016],
        min: 1958,
        max: 2016,
        step: 1,
        tooltip: true,
        ticksFrequency: 5,
        rangeSlider: true,
        width: "viewport"
      });
      var values = $('#yearRangeSlider').jqxSlider('values');
      $("#yearRangeSlider").bind('change', function () {
        while (indexCheck.length > 0){
          indexCheck.pop();
        }
        clearAllCustomLayers();
        allLayersOff();
        if (customYearCon === true) {
          for (var i = 0; i < customLayerSats.length; i += 1) {
            if (satDate[customLayerSats[i]] >= values[0] && satDate[customLayerSats[i]] <= values[1]) {
              addCustomSat(customLayerSats[i]);
            }
          }
        } else {
          while (customLayerSats.length > 0){
            customLayerSats.pop();
          }
          clearAllCustomLayers();
          allLayersOff();
          for (var ind = 0; ind < satNum; ind += 1) {
            if (satDate[ind] >= values[0] && satDate[ind] <= values[1]) {
              addCustomSat(ind);
            }
          }
        }
      });



      /****
       * Click-handle functions
       */
        //follow satellite on click
        // Move to sat position on click and redefine navigator positioning
      var startFollow;
      var followIndex = 0;
      var toCurrentPosition = function (ind) {
        endFollow();
        var toggleButtons = document.getElementById('buttonToggle');
        toggleButtons.style.display = "inline";
        var satPos = everyCurrentPosition[ind];
        //Changes center point of view.
        wwd.navigator.lookAtLocation.altitude = satPos.altitude;
        startFollow = window.setInterval(function () {
          try {
            var position = getPosition(satellite.twoline2satrec(satData[ind].TLE_LINE1, satData[ind].TLE_LINE2), new Date());
          } catch (err) {
            console.log(err + ' in toCurrentPosition, sat ' + ind);
            //continue;
          }
          //change view position
          wwd.navigator.lookAtLocation.latitude = satPos.latitude;
          wwd.navigator.lookAtLocation.longitude = satPos.longitude;
          updateLLA(position);
        });
        followIndex = ind;
      };
      var endFollow = function () {     //ends startFollow window.setInterval
        clearInterval(startFollow);
      };

      $('#follow').click(function () {
        if ($(this).text() == "FOLLOW OFF") {
          $(this).text("FOLLOW ON");
          toCurrentPosition(followIndex);
        }
        else {
          $(this).text("FOLLOW OFF");
          endFollow();
        }
      });

      //Mesh-cone to follow sat position
      var startMesh;                                    //allows to end window interval
      var meshToCurrentPosition = function (index) {
        endMesh();
        startMesh = window.setInterval(function () {
          meshLayer.removeAllRenderables();
          var attributes = new WorldWind.ShapeAttributes(null);
          attributes.outlineColor = new WorldWind.Color(28, 255, 47, 1);
          attributes.interiorColor = new WorldWind.Color(28, 255, 47, 0.1);
          var earthRadius = WorldWind.WWMath.max(
            globe.equatorialRadius,
            globe.polarRadius);
          var radiusToHorizon = Math.abs(WorldWind.WWMath.horizonDistanceForGlobeRadius(
            earthRadius,
            everyCurrentPosition[index].altitude));
          if (radiusToHorizon > earthRadius) {
            radiusToHorizon = earthRadius;
          }
          var shape = new WorldWind.SurfaceCircle(new WorldWind.Location(
            everyCurrentPosition[index].latitude,
            everyCurrentPosition[index].longitude),
            radiusToHorizon,
            attributes);

          meshLayer.addRenderable(shape);
        });
      };
      var endMesh = function () {
        clearInterval(startMesh);
        meshLayer.removeAllRenderables();
      };


      //create past and future orbit on click
      var startOrbit;
      var createOrbit = function (index) {
        endOrbit();
        startOrbit = window.setInterval(function () {
          var orbitRange = $('#orbitEvent').jqxSlider('value');
          var orbitRangePast = $('#orbitEvent2').jqxSlider('value');
          var timeSlide = $('#timeEvent').jqxSlider('value');

          orbitsLayer.removeAllRenderables();
          var now = new Date();
          var pastOrbit = [];
          var futureOrbit = [];
          for (var i = -orbitRangePast; i <= orbitRange; i++) {
            var time = new Date(now.getTime() + (i * 60000) + (timeSlide * 60000));
            try {
              var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), time);
            } catch (err) {
              console.log(err + ' in createOrbit, sat ' + index);
              continue;
            }

            if (i <= 0) {
              pastOrbit.push(position);
            }
            if (i >= 0) {
              futureOrbit.push(position);
            }
          }

          // Orbit Path
          var pastOrbitPathAttributes = new WorldWind.ShapeAttributes(null);
          pastOrbitPathAttributes.outlineColor = WorldWind.Color.RED;
          pastOrbitPathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);

          var futureOrbitPathAttributes = new WorldWind.ShapeAttributes(null);//pastAttributes
          futureOrbitPathAttributes.outlineColor = WorldWind.Color.GREEN;
          futureOrbitPathAttributes.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);

          //plot orbit on click
          var pastOrbitPath = new WorldWind.Path(pastOrbit);
          pastOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          pastOrbitPath.attributes = pastOrbitPathAttributes;
          pastOrbitPath.useSurfaceShapeFor2D = true;


          var futureOrbitPath = new WorldWind.Path(futureOrbit);
          futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          futureOrbitPath.attributes = futureOrbitPathAttributes;
          futureOrbitPath.useSurfaceShapeFor2D = true;

          orbitsLayer.addRenderable(pastOrbitPath);
          orbitsLayer.addRenderable(futureOrbitPath);
        });
      };
      var endOrbit = function () {
        clearInterval(startOrbit);
        orbitsLayer.removeAllRenderables();
      };


      //Get additional info of satellite on click and hover handles
      var startExtra;
      var extraData = function (index) {
        endExtra();
        startExtra = window.setInterval(function () {
          try {
            var satStuff = satellite.twoline2satrec( //perform and store sat init calcs
              satData[index].TLE_LINE1, satData[index].TLE_LINE2);
          } catch (err) {
            console.log('Possible deorbiting sat: ' + satData[index].NORAD_CAT_ID + ' in startExtra interval');
          }
          var extra = {};
          extra.inclination = satData[index].INCLINATION;  //rads
          extra.eccentricity = satData[index].ECCENTRICITY;
          extra.meanMotion = satData[index].MEAN_MOTION;
          extra.semiMajorAxis = Math.pow(8681663.653 / extra.meanMotion, (2 / 3));
          extra.semiMinorAxis = extra.semiMajorAxis * Math.sqrt(1 - Math.pow(extra.eccentricity, 2));
          extra.apogee = satData[index].APOGEE;
          extra.perigee = satData[index].PERIGEE;
          extra.period = satData[index].PERIOD;

          revDayPlaceholder.textContent = roundToTwo(extra.meanMotion) + " rev/day";
          semiMajorAxisPlaceholder.textContent = roundToTwo(extra.semiMajorAxis) + " km";
          semiMinorAxisPlaceholder.textContent = roundToTwo(extra.semiMinorAxis) + " km";
          velocityPlaceholder.textContent = (roundToTwo(satVelocity[index])) + " km/s";
        });
      };
      var endExtra = function () {
        clearInterval(startExtra);
      };


      //create 3D collada model
      var createCollada = function (index) {
        if (satNames[index] === "ISS (ZARYA)") {
          var satPos = everyCurrentPosition[index];
          var colladaLoader = new WorldWind.ColladaLoader(satPos);
          colladaLoader.init({dirPath: 'assets/collada-models/'});
          colladaLoader.load('ISS.dae', function (scene) {
            scene.scale = 10000;
            modelLayer.addRenderable(scene);
          });
        }
      };

      var highlightedItems = [];
      var satIndex;
      var gsIndex;

      var handleClick = function (recognizer) {
        // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
        // the mouse or tap location.
        var x = recognizer.clientX,
          y = recognizer.clientY;

        var redrawRequired = highlightedItems.length > 0;

        // De-highlight any highlighted placemarks.
        for (var h = 0; h < highlightedItems.length; h++) {
          highlightedItems[h].highlighted = false;
          orbitsLayer.enabled = false;

          var toggleButtons = document.getElementById('buttonToggle');
          toggleButtons.style.display = "none";
          orbitsHoverLayer.removeAllRenderables();
          modelLayer.removeAllRenderables();
          orbitsHoverLayer.enabled = true;
          $('#follow').text('FOLLOW OFF');
          $('#mesh').text('HORIZON OFF');
          $('#orbit').text('ORBIT OFF');
          $('#collada').text('3D MODEL OFF');
          endFollow();
          endOrbit();
          endMesh();
          endHoverOrbit();
          endExtra();
          satIndex = null;
          gsIndex = null;
        }
        highlightedItems = [];

        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        var rectRadius = 1,
          pickPoint = wwd.canvasCoordinates(x, y),
          pickRectangle = new WorldWind.Rectangle(pickPoint[0] - rectRadius, pickPoint[1] + rectRadius,
            2 * rectRadius, 2 * rectRadius);

        var pickList = wwd.pickShapesInRegion(pickRectangle);

        // If only one thing is picked and it is the terrain, tell the world window to go to the picked location.
        if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
          var toggleButtons = document.getElementById('buttonToggle');
          toggleButtons.style.display = "none";
          var groundPosition = pickList.objects[0].position;
          orbitsHoverLayer.removeAllRenderables();
          orbitsHoverLayer.enabled = true;
          modelLayer.removeAllRenderables();
          $('#follow').text('FOLLOW OFF');
          $('#mesh').text('HORIZON OFF');
          $('#orbit').text('ORBIT OFF');
          $('#collada').text('3D MODEL OFF');
          orbitsLayer.enabled = false;

          wwd.goTo(new WorldWind.Location(groundPosition.latitude, groundPosition.longitude));
        }

        if (pickList.objects.length > 0) {
          for (var p = 0; p < pickList.objects.length; p++) {
            if (pickList.objects[p].isOnTop) {
              // Highlight the items picked.
              pickList.objects[p].userObject.highlighted = true;
              highlightedItems.push(pickList.objects[p].userObject);

              //Populate Info window with proper data
              var position = pickList.objects[p].position;
                satIndex = everyCurrentPosition.indexOf(position);
                gsIndex = groundStation.indexOf(position);
              orbitsLayer.enabled = true;
              if (satIndex > -1) {
                endHoverOrbit();
                orbitsHoverLayer.enabled = false;
                extraData(satIndex);
                $('#mesh').text("HORIZON ON");
                meshToCurrentPosition(satIndex);
                $('#mesh').click(function () {
                  if ($(this).text() == "HORIZON OFF") {
                    $(this).text("HORIZON ON");
                    meshToCurrentPosition(satIndex);
                  }
                  else {
                    $(this).text("HORIZON OFF");
                    endMesh();
                  }
                });

                $('#follow').text('FOLLOW ON');

                toCurrentPosition(satIndex);

                createOrbit(satIndex);
                $('#orbit').text('ORBIT ON');
                $('#orbit').click(function () {
                  if ($(this).text() == "ORBIT OFF") {
                    $(this).text("ORBIT ON");
                    createOrbit(satIndex);
                  }
                  else {
                    $(this).text("ORBIT OFF");
                    endOrbit();
                  }
                });

                createCollada(satIndex);
                $('#collada').text('MODEL ON');
                $('#collada').click(function () {
                  if ($(this).text() == "MODEL OFF") {
                    $(this).text("MODEL ON");
                    createCollada(satIndex);
                  } else {
                    $(this).text("MODEL OFF");
                    modelLayer.removeAllRenderables();
                  }
                });
              }
              else if (gsIndex > -1) {
                toGsStation(gsIndex);

              }

              //Redraw highlighted items
              wwd.redraw();
            }
          }
        }
      };

      $('#end').click(function(){
        var toggleButtons = document.getElementById('buttonToggle');
        toggleButtons.style.display = "none";
        orbitsHoverLayer.removeAllRenderables();
        modelLayer.removeAllRenderables();
        orbitsHoverLayer.enabled = true;
        endFollow();
        endOrbit();
        endMesh();
        endHoverOrbit();
        endExtra();
        satIndex = null;
        gsIndex = null;
      });

      // Listen for mouse clicks.
      var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

      // Listen for taps on mobile devices.
      var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);

      wwd.redraw();

        $('#customSat').click(function () {
          addCustomSat(satIndex);
        });
        $('#addStation').click(function () {
          $("#customGS").text('CUSTOM GS ON');
          customGSLayer.enabled = true;
          addCustomGS(gsIndex);
        });

      /**
       * Pick-Handle Functions
       *
       */
        //Generate pick handle orbit separately as to not interfere with click handle orbit
      var startHoverOrbit;
      var createHoverOrbit = function (index) {
        startHoverOrbit = window.setInterval(function () {
          orbitsHoverLayer.removeAllRenderables();
          var timeSlide = $('#timeEvent').jqxSlider('value');
          var now = new Date();
          var pastOrbit = [];
          var futureOrbit = [];
          for (var i = -98; i <= 98; i++) {
            var time = new Date(now.getTime() + (i * 60000) + (timeSlide * 60000));
            try {
              var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), time);
            } catch (err) {
              console.log(err + ' in createHoverOrbit, sat ' + index);
              continue;
            }

            if (i < 0) {
              pastOrbit.push(position);
            } else if (i > 0) {
              futureOrbit.push(position);
            } else {
              pastOrbit.push(position);
              futureOrbit.push(position);
            }
          }

          // Orbit Path
          var pastOrbitPathAttributes = new WorldWind.ShapeAttributes(null);
          pastOrbitPathAttributes.outlineColor = WorldWind.Color.RED;
          pastOrbitPathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);

          var futureOrbitPathAttributes = new WorldWind.ShapeAttributes(null);//pastAttributes
          futureOrbitPathAttributes.outlineColor = WorldWind.Color.GREEN;
          futureOrbitPathAttributes.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);

          //plot orbit on click
          var pastOrbitPath = new WorldWind.Path(pastOrbit);
          pastOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          pastOrbitPath.attributes = pastOrbitPathAttributes;
          pastOrbitPath.useSurfaceShapeFor2D = true;

          var futureOrbitPath = new WorldWind.Path(futureOrbit);
          futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          futureOrbitPath.attributes = futureOrbitPathAttributes;
          futureOrbitPath.useSurfaceShapeFor2D = true;

          orbitsHoverLayer.addRenderable(pastOrbitPath);
          orbitsHoverLayer.addRenderable(futureOrbitPath);
        });
      };
      var endHoverOrbit = function () {
        clearInterval(startHoverOrbit);
        orbitsHoverLayer.removeAllRenderables();
      };


      /**
       * Pick-handle
       *
       */
        //Highlight on hover
        // Now set up to handle picking.
      var highlightedItems = [];

      var handlePick = function (recognizer) {
        // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
        // the mouse or tap location.
        var x = recognizer.clientX,
          y = recognizer.clientY;

        var redrawRequired = highlightedItems.length > 0;

        // De-highlight any highlighted placemarks.
        for (var h = 0; h < highlightedItems.length; h++) {
          highlightedItems[h].highlighted = false;
          endExtra();
          endHoverOrbit();

        }
        highlightedItems = [];

        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        var rectRadius = 1,
          pickPoint = wwd.canvasCoordinates(x, y),
          pickRectangle = new WorldWind.Rectangle(pickPoint[0] - rectRadius, pickPoint[1] + rectRadius,
            2 * rectRadius, 2 * rectRadius);

        var pickList = wwd.pickShapesInRegion(pickRectangle);

        if (pickList.objects.length > 0) {
          for (var p = 0; p < pickList.objects.length; p++) {
            if (pickList.objects[p].isOnTop) {
              // Highlight the items picked.
              pickList.objects[p].userObject.highlighted = true;
              highlightedItems.push(pickList.objects[p].userObject);

              //Populate Info window with proper data
              var position = pickList.objects[p].position,
                satIndex = everyCurrentPosition.indexOf(position),
                gsIndex = groundStation.indexOf(position);
              if (satIndex > -1) {
                populateSatInfo(satData[satIndex]);
                endExtra();
                endHoverOrbit();
                extraData(satIndex);
                createHoverOrbit(satIndex);
                updateLLA(everyCurrentPosition[satIndex]);
              }
              else if (gsIndex > -1) {
                populateGSInfo(groundStations[gsIndex]);
              }

              //Redraw highlighted items
              wwd.redraw();
            }
          }
        }
      };

      // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
      wwd.addEventListener("mousemove", handlePick);

      // Listen for taps on mobile devices and highlight the placemarks that the user taps.
      var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

      wwd.redraw();
    }
  }
}

function populateGSInfo(groundStation) {
  typePlaceholder.textContent = "GROUND STATION";
  namePlaceholder.textContent = groundStation.NAME.toUpperCase();
  ownerPlaceholder.textContent = groundStation.ORGANIZATION.toUpperCase();
  idPlaceholder.textContent = "";
  latitudePlaceholder.textContent = groundStation.LATITUDE;
  longitudePlaceholder.textContent = groundStation.LONGITUDE;
  altitudePlaceholder.textContent = groundStation.ALTITUDE;
  inclinationPlaceholder.textContent = "";
  eccentricityPlaceHolder.textContent = "";
  revDayPlaceholder.textContent = "";
  apogeeplaceholder.textContent = "";
  perigeeplaceholder.textContent = "";
  periodPlaceholder.textContent = "";
  semiMajorAxisPlaceholder.textContent = "";
  semiMinorAxisPlaceholder.textContent = "";
  velocityPlaceholder.textContent = "";
  launchPlaceholder.textContent = "";
  operationPlaceholder.textContent = "";
  orbitPlaceholder.textContent = "";
}

function populateSatInfo(satellite) {
  typePlaceholder.textContent = satellite.OBJECT_TYPE;
  idPlaceholder.textContent = satellite.OBJECT_ID;
  namePlaceholder.textContent = satellite.OBJECT_NAME;
  ownerPlaceholder.textContent = satellite.OWNER;
  launchPlaceholder.textContent = satellite.LAUNCH_SITE;
  orbitPlaceholder.textContent = satellite.ORBIT_TYPE;
  inclinationPlaceholder.textContent = roundToTwo(Number(satellite.INCLINATION)) + " °";
  eccentricityPlaceHolder.textContent = roundToFour(Number(satellite.ECCENTRICITY));
  apogeeplaceholder.textContent = roundToTwo(Number(satellite.APOGEE)) + " km";
  perigeeplaceholder.textContent = roundToTwo(Number(satellite.PERIGEE)) + " km";
  periodPlaceholder.textContent = roundToTwo(Number(satellite.PERIOD)) + " minutes";
  operationPlaceholder.textContent = satellite.OPERATIONAL_STATUS;
}

function populateCustomSatLayer(satData, owner, launchYear, launchSite, operationalStatus, addCustomSatCallback, customYearCon){
  clearAllCustomLayers();
  for (var i = 0; i < satData.length; i++){
    if ((!owner || owner === satData[i].OWNER) &&
        (!launchYear || launchYear === satData[i].LAUNCH_DATE.substring(0, 4)) &&
        (!launchSite || launchSite === satData[i].LAUNCH_SITE) &&
        (!operationalStatus || operationalStatus === satData[i].OPERATIONAL_STATUS))
    {
      addCustomSatCallback(i);
    }
  }
}

function clearAllCustomLayers(){
  leoSatCustom.removeAllRenderables();
  leoRocketCustom.removeAllRenderables();
  leoDebrisCustom.removeAllRenderables();
  meoSatCustom.removeAllRenderables();
  meoRocketCustom.removeAllRenderables();
  meoDebrisCustom.removeAllRenderables();
  heoSatCustom.removeAllRenderables();
  heoRocketCustom.removeAllRenderables();
  heoDebrisCustom.removeAllRenderables();
  geoSatCustom.removeAllRenderables();
  geoRocketCustom.removeAllRenderables();
  geoDebrisCustom.removeAllRenderables();
  unclassifiedSatCustom.removeAllRenderables();
  unclassifiedRocketCustom.removeAllRenderables();
  unclassifiedDebrisCustom.removeAllRenderables();
}

/** projection toggle**/
// Globe
var globe = wwd.globe;
globe.elevationModel = new WorldWind.ZeroElevationModel();

// Map
var map = new WorldWind.Globe2D();
map.elevationModel = new WorldWind.ZeroElevationModel();
map.projection = new WorldWind.ProjectionEquirectangular();

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

var layerManger = new LayerManager(wwd);
wwd.redraw();
