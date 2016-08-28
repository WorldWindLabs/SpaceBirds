/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
"use strict";

// Tell World Wind to log only warnings and errors.
WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

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
  {layer: new WorldWind.BMNGLayer(), enabled: true},
  {layer: coordinates, enabled: true},
  {layer: viewControlsLayer, enabled: true}
];

for (var l = 0; l < layers.length; l++) {
  layers[l].layer.enabled = layers[l].enabled;
  wwd.addLayer(layers[l].layer);
}

//Activate BMNGLayer in low altitudes
layers[1].layer.maxActiveAltitude = 15e6;
layers[2].layer.maxActiveAltitude = 15e7;


//custom layers
var groundStationsLayer = new WorldWind.RenderableLayer();
var shapeLayer = new WorldWind.RenderableLayer();
var orbitsHoverLayer = new WorldWind.RenderableLayer();
var modelLayer = new WorldWind.RenderableLayer("Model");
var meshLayer = new WorldWind.RenderableLayer();
var orbitsLayer = new WorldWind.RenderableLayer("Orbit");
var customOrbitLayer = new WorldWind.RenderableLayer("Orbit");
var customSatLayer = new WorldWind.RenderableLayer("custom");
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

//add custom layers
wwd.addLayer(groundStationsLayer);
wwd.addLayer(shapeLayer);
wwd.addLayer(orbitsHoverLayer);
wwd.addLayer(customSatLayer);
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
addEventListener("wheel", function() {
  mouseDown();
  if(timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(mouseUp, 200);
});

function mouseDown(){
  updatePermission = false;
}

function mouseUp(){
  updatePermission = true;
}

// Implementing the perfect scrollbar
$('#sidebar-wrapper').perfectScrollbar();
$('#sidebar-wrapper-right').perfectScrollbar();

//toggle minimization of left nav bar
$("#min_button").click(function(){
  if($(this).html() == "-"){
    $(this).html("+");
  }
  else{
    $(this).html("-");
  }
  $("#box").slideToggle();
});

//toggle minimization of right nav bar
$("#min_button_right").click(function(){
  if($(this).html() == "-"){
    $(this).html("+");
  }
  else{
    $(this).html("-");
  }
  $("#box_right").slideToggle();
});

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

function jday(year, mon, day, hr, minute, sec){
  'use strict';
  return (367.0 * year -
    Math.floor((7 * (year + Math.floor((mon + 9) / 12.0))) * 0.25) +
    Math.floor( 275 * mon / 9.0 ) +
    day + 1721013.5 +
    ((sec / 60.0 + minute) / 60.0 + hr) / 24.0  //  ut in days
    //#  - 0.5*sgn(100.0*year + mon - 190002.5) + 0.5;
  );
}

var satVelocity = [];
function getVelocity(satrec , time) {

  var j = jday(time.getUTCFullYear(),
    time.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
    time.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds());
  j += time.getUTCMilliseconds() * 1.15741e-8;



    var m = (j - satrec.jdsatepoch) * 1440.0;
    var pv = satellite.sgp4(satrec, m);
    var vx,vy,vz;

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
  //console.log('Array size before splicing is ' + objectArray.length);
  updateTime = performance.now();
  for (var i = 0; i < maxSats; i += 1) {
    try {
      var position = getPosition(satellite.twoline2satrec(objectArray[i].TLE_LINE1, objectArray[i].TLE_LINE2), new Date());
    } catch (err) {
      faultySatellites += 1;
      // objectArray.splice(i,1);
      // i--;
      continue;
    }
    resultArray.push(objectArray[i]);
  }
  // console.log('we have ' + objectArray.length + ' total satellites');
  // console.log(faultySatellites + ' do not work');
  // console.log('We will keep ' + resultArray.length + ' sanitized satellites.');
  updateTime = performance.now() - updateTime;
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
    //console.log(satPac[0].OBJECT_NAME);

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
 Ground Stations Layer
 ***/
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
    var groundStation = [];
    for (var i = 0, len = groundStations.length; i < len; i++) {
      gsNames[i] = groundStations[i].NAME;

      groundStation[i] = new WorldWind.Position(groundStations[i].LATITUDE,
        groundStations[i].LONGITUDE,
        1e3);
      var gsPlacemark = new WorldWind.Placemark(groundStation[i]);

      gsPlacemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
      gsPlacemark.label = groundStation.NAME;
      gsPlacemark.attributes = gsPlacemarkAttributes;
      gsPlacemark.highlightAttributes = gsHighlightPlacemarkAttributes;
      groundStationsLayer.addRenderable(gsPlacemark);
    }
    // Add the path to a layer and the layer to the World Window's layer list.
    groundStationsLayer.displayName = "Ground Stations";
    groundStationsLayer.enabled = false;


    $('#clearStations').click(function () {
      shapeLayer.removeAllRenderables();
    });

    var groundsIndex = [];
    var toGsStation = function (gsindex) {
        groundsIndex[0] = gsindex;
        //GS information display
        typePlaceholder.textContent = "Ground Station";
        namePlaceholder.textContent = groundStations[groundsIndex[0]].NAME;
        ownerPlaceholder.textContent = groundStations[groundsIndex[0]].ORGANIZATION;
        latitudePlaceholder.textContent = groundStations[groundsIndex[0]].LATITUDE;
        longitudePlaceholder.textContent = groundStations[groundsIndex[0]].LONGITUDE;
        altitudePlaceholder.textContent = groundStations[groundsIndex[0]].ALTITUDE;
        inclinationPlaceholder.textContent = "N/A";
        eccentricityPlaceHolder.textContent = "N/A";
        revDayPlaceholder.textContent = "N/A";
        apogeeplaceholder.textContent = "N/A";
        perigeeplaceholder.textContent = "N/A";
        periodPlaceholder.textContent = "N/A";
        semiMajorAxisPlaceholder.textContent = "N/A";
        semiMinorAxisPlaceholder.textContent = "N/A";

        //moves to GS location
        wwd.goTo(new WorldWind.Location(groundStations[groundsIndex[0]].LATITUDE, groundStations[groundsIndex[0]].LONGITUDE));

        //turn on shape for current GS
        $('#addStation').click(function () {
          var gsAttributes = new WorldWind.ShapeAttributes(null);
          gsAttributes.outlineColor = new WorldWind.Color(0, 255, 255, 1);
          gsAttributes.interiorColor = new WorldWind.Color(0, 255, 255, 0.2);

          var shape = new WorldWind.SurfaceCircle(new WorldWind.Location(groundStations[groundsIndex[0]].LATITUDE,
            groundStations[groundsIndex[0]].LONGITUDE), 150e4, gsAttributes);
          shapeLayer.addRenderable(shape);
        });
    };

/***
 * Satellites
 */
    //Swtich Board for Sat Types
    var orbitToggle = {leoP: 9, leoR: 0, leoD: 0, meoP: 9, meoR: 0, meoD: 0, heoP: 9, heoR: 0, heoD: 0, geoP: 9, geoR: 0, geoD: 0, unclassifiedP: 0, unclassifiedR: 0, unclassifiedD: 0};
    leoDebrisLayer.enabled = false;
    meoDebrisLayer.enabled = false;
    heoDebrisLayer.enabled = false;
    unclassifiedDebrisLayer.enabled = false;
    customSatLayer.enabled = false;

    var satNum = satPac.length;
    //Sat Type toggles
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
        $('#unclassified').text("UNCLASSIFIED ON");
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
        }
        $('#allSats').text("ALL OFF");
        $('#leo').text("LEO ON");
        $('#meo').text("MEO ON");
        $('#heo').text("HEO ON");
        $('#geo').text("GEO ON");
        $('#unclassified').text("UNCLASSIFIED ON");
        leoSatLayer.enabled = true;
        meoSatLayer.enabled = true;
        heoSatLayer.enabled = true;
        geoSatLayer.enabled = true;
        unclassifiedSatLayer.enabled = true;
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
        }
        $('#allSats').text("ALL OFF");
        $('#leo').text("LEO ON");
        $('#meo').text("MEO ON");
        $('#heo').text("HEO ON");
        $('#geo').text("GEO ON");
        $('#unclassified').text("UNCLASSIFIED ON");
        leoRocketLayer.enabled = true;
        meoRocketLayer.enabled = true;
        heoRocketLayer.enabled = true;
        geoRocketLayer.enabled = true;
        unclassifiedRocketLayer.enabled = true;
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
        leoDebrisLayer.enabled = true;
        meoDebrisLayer.enabled = true;
        heoDebrisLayer.enabled = true;
        geoDebrisLayer.enabled = true;
        unclassifiedDebrisLayer.enabled = true;
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
        return orbitToggle;
      }
    });

    //Switch Board for Orbit Types
    function leoToggleOn() {
      console.log(orbitToggle.leoP + orbitToggle.leoR + orbitToggle.leoD);
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

    function meoToggleOn() {
      console.log(orbitToggle.meoP + orbitToggle.meoR + orbitToggle.meoD);
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
          leoSatLayer.enabled = true;
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

    function heoToggleOn() {
      console.log(orbitToggle.heoP + orbitToggle.heoR + orbitToggle.heoD);
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

    function geoToggleOn() {
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

    function unclassifiedToggleOn() {
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

    function leoToggleOff() {
      console.log(orbitToggle.leoP + orbitToggle.leoR + orbitToggle.leoD);
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

    function meoToggleOff() {
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

    function heoToggleOff() {
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

    function geoToggleOff() {
      console.log(orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD);
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

    function unclassifiedToggleOff() {
      console.log(orbitToggle.unclassifiedP + orbitToggle.unclassifiedR + orbitToggle.unclassifiedD);
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
    $('#custom').click(function(){
      if ($(this).text() == "CUSTOM OFF") {
        $(this).text("CUSTOM ON");
        customSatLayer.enabled = true;
      } else {
        $(this).text("CUSTOM OFF");
        customSatLayer.enabled = false;
      }
    });

    $('#gStations').click(function () {
      if ($(this).text() == "GS OFF") {
        $(this).text("GS ON");
        groundStationsLayer.enabled = true;
      } else {
        $(this).text("GS OFF");
        groundStationsLayer.enabled = false;
      }
    });
    renderSats(satPac);

    //plots all sats
    function renderSats(satData) {
      trackedPlaceholder.textContent = satData.length;
      var satNames = [];
      var now = new Date();
      var everyCurrentPosition = [];
      for (var j = 0; j < satNum; j++) {
        var currentPosition = null;
        var time = new Date(now.getTime() + i * 60000);
        getVelocity(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
        var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
        try {
          satVelocity[j] = satVelocity;
          var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
        } catch (err) {
          console.log(err + ' in renderSats, sat ' + j);
          continue;
        }

        currentPosition = new WorldWind.Position(position.latitude,
          position.longitude,
          position.altitude);
        everyCurrentPosition[j] = currentPosition;
        satNames[j] = satData[j].OBJECT_NAME;

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightPlacemarkAttributes.imageScale = 0.5;

        //add colored image depending on sat type
        switch (satData[j].OBJECT_TYPE) {
          case "PAYLOAD":
            placemarkAttributes.imageSource = "assets/icons/red_dot.png";
            placemarkAttributes.imageScale = 0.2;
            break;
          case "ROCKET BODY":
            placemarkAttributes.imageSource = "assets/icons/green_dot.png";
            placemarkAttributes.imageScale = 0.2;
            break;
          default:
            placemarkAttributes.imageSource = "assets/icons/grey_dot.png";
            placemarkAttributes.imageScale = 0.15;
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
            meoSatLayer.addRenderable(placemark);
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

      var customSats = [];
      var customSatStuff = function (index) {
        customSats.push(satData[index]);
        createCustom(index);
      };
      var createCustom = function(index){
        for (var j = 0; j < customSats.length; j++) {
          var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
          var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
          highlightPlacemarkAttributes.imageScale = 0.5;

          //add colored image depending on sat type
          switch (satData[index].OBJECT_TYPE) {
            case "PAYLOAD":
              placemarkAttributes.imageSource = "assets/icons/red_dot.png";
              placemarkAttributes.imageScale = 0.4;
              break;
            case "ROCKET BODY":
              placemarkAttributes.imageSource = "assets/icons/green_dot.png";
              placemarkAttributes.imageScale = 0.4;
              break;
            default:
              placemarkAttributes.imageSource = "assets/icons/grey_dot.png";
              placemarkAttributes.imageScale = 0.35;
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


          var placemark = new WorldWind.Placemark(everyCurrentPosition[index]);
          placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          placemark.attributes = placemarkAttributes;
          placemark.highlightAttributes = highlightPlacemarkAttributes;

          console.log("added" + satData[index].OBJECT_NAME);

          customSatLayer.addRenderable(placemark);
        }
        wwd.redraw();
      };


      // Update all Satellite Positions
      var updatePositions = setInterval(function () {
        if (!updatePermission)
          return;

        for (var indx = 0; indx < satNum; indx += 1) {
          var timeSlide = $('#jqxsliderEvent2').jqxSlider('value');
          var now = new Date();
          var time = new Date(now.getTime() + timeSlide * 60000);
          try {
            var position = getPosition(satellite.twoline2satrec(satData[indx].TLE_LINE1, satData[indx].TLE_LINE2), time);
            satVelocity[indx] = getVelocity(satellite.twoline2satrec(satData[indx].TLE_LINE1, satData[indx].TLE_LINE2), time);

          } catch (err) {
            console.log(err + ' in updatePositions interval, sat ' + indx);
            continue;
          }

          everyCurrentPosition[indx].latitude = position.latitude;
          everyCurrentPosition[indx].longitude = position.longitude;
          everyCurrentPosition[indx].altitude = position.altitude;

        }
        wwd.redraw();
      }, updateTime * 1.5);


      /***
       * HTML interface Controls *
       * ***/

      // Create search box for GS's
      $("#jqxWidget2").jqxComboBox({
        selectedIndex: 0,
        source: groundStations,
        displayMember: "NAME",
        valueMember: "ORGANIZATION",
        width: 220,
        height: 30
      });
      // trigger the select event.
      $("#jqxWidget2").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var valueElement = $("<div></div>");
            valueElement.text("Type: " + item.value);
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#selectionlog2").children().remove();
            $("#selectionlog2").append(labelElement);
            $("#selectionlog2").append(valueElement);
            var searchGSat = gsNames.indexOf(item.label);
            endFollow();
            toGsStation(searchGSat);
          }
        }
      });

      // Create search box for Satellites
      $("#jqxWidget").jqxComboBox({
        selectedIndex: 0,
        source: satData,
        displayMember: "OBJECT_NAME",
        valueMember: "OWNER",
        width: 220,
        height: 30,
        placeHolder: "SATELLITE NAME"
      });
      // trigger the select event.
      $("#jqxWidget").on('select', function (event) {
        if (event.args) {
          var item = event.args.item;
          if (item) {
            var valueElement = $("<div></div>");
            valueElement.text("Owner: " + item.value);
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#selectionlog").children().remove();
            $("#selectionlog").append(labelElement);
            $("#selectionlog").append(valueElement);
            console.log(item.label);
            console.log(satNames[1]);
            endFollow();
            endMesh();
            endOrbit();
            endExtra();
            var searchSat = satNames.indexOf(item.label);
            console.log(searchSat);
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
      $("#jqxsliderEvent2").jqxSlider({
        theme: 'summer',
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
      $('#jqxsliderEvent2').bind('change', function (event) {
        $('#sliderValue2').html(new Date(now.getTime() + event.args.value * 60000));
      });
      $('#jqxButton').on('click', function () {
        $('#jqxsliderEvent2').jqxSlider('setValue', 0);
      });

      //Orbit length/time slider
      $("#jqxsliderEvent").jqxSlider({
        theme: 'summer',
        value: 98,
        max: 10080,
        min: 0,
        mode: 'fixed',
        ticksFrequency: 1440,
        width: "viewport"
      });
      $('#jqxsliderEvent').bind('change', function (event) {
        $('#sliderValue').html(new Date(now.getTime() + event.args.value * 60000));
        $('#sliderValueMin').html('Mins: ' + event.args.value);

      });

      /* //TODO add year range
       $("#jqxRangeSlider").jqxSlider({
       theme: 'summer',
       value: {rangeStart: 1950, rangeEnd: 1960},
       rangeSlider: true,
       width: "viewport",
       min: 1950,
       max: 2016
       }); */

/****
 * Click-handle functions
 */
        //follow satellite on click
        // Move to sat position on click and redefine navigator positioning
      var startFollow;
      var toCurrentPosition = function (index) {
        var satPos = everyCurrentPosition[index];
        //Changes center point of view.
        wwd.navigator.lookAtLocation.altitude = satPos.altitude;
        startFollow = window.setInterval(function () {
          try{
            var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), new Date());
          }catch(err){
            console.log(err + ' in toCurrentPosition, sat ' + indx);
            //continue;
          }
          //change view position
          wwd.navigator.lookAtLocation.latitude = satPos.latitude;
          wwd.navigator.lookAtLocation.longitude = satPos.longitude;
          updateLLA(position);
        });
        $('#customSat').click(function () {
          customSatStuff(index);
        });
      };
      var endFollow = function () {     //ends startFollow window.setInterval
        clearInterval(startFollow);
      };
      $('#follow').click(function () {
        endFollow();
      });


      //Mesh-cone to follow sat position
      var startMesh;                                    //allows to end window interval
      var meshToCurrentPosition = function (index) {
        startMesh = window.setInterval(function () {
          meshLayer.removeAllRenderables();
          var attributes = new WorldWind.ShapeAttributes(null);
          attributes.outlineColor = new WorldWind.Color(28, 255, 47, 1);
          attributes.interiorColor = new WorldWind.Color(28, 255, 47, 0.1);

          var shape = new WorldWind.SurfaceCircle(new WorldWind.Location(everyCurrentPosition[index].latitude,
            everyCurrentPosition[index].longitude), 150e4, attributes);

          meshLayer.addRenderable(shape);
        });
      };
      var endMesh = function () {
        meshLayer.removeAllRenderables();
        clearInterval(startMesh);
      };


      //create past and future orbit on click
      var startOrbit;
      var createOrbit = function (index) {
        startOrbit = window.setInterval(function () {
          var orbitRange = $('#jqxsliderEvent').jqxSlider('value');
          var timeSlide = $('#jqxsliderEvent2').jqxSlider('value');

          orbitsLayer.removeAllRenderables();
          var now = new Date();
          var pastOrbit = [];
          var futureOrbit = [];
          for (var i = -orbitRange; i <= orbitRange; i++) {
            var time = new Date(now.getTime() + (i * 60000) + (timeSlide * 60000));
            try{
              var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), time);
            }catch(err){
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


          var futureOrbitPath = new WorldWind.Path(futureOrbit);
          futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          futureOrbitPath.attributes = futureOrbitPathAttributes;

          orbitsLayer.addRenderable(pastOrbitPath);
          orbitsLayer.addRenderable(futureOrbitPath);
        });
      };
      var endOrbit = function () {
        orbitsLayer.removeAllRenderables();
        clearInterval(startOrbit);
      };


      //Get additional info of satellite on click and hover handles
      var startExtra;
      var extraData = function (index) {
        startExtra = window.setInterval(function () {
          var satStuff = satellite.twoline2satrec( //perform and store sat init calcs
            satData[index].TLE_LINE1, satData[index].TLE_LINE2);
          var extra = {};
          //keplerian elements
          extra.inclination = satStuff.inclo;  //rads
          extra.eccentricity = satStuff.ecco;
          extra.raan = satStuff.nodeo;   //rads
          extra.argPe = satStuff.argpo;  //rads
          extra.meanMotion = satStuff.no * 60 * 24 / (2 * Math.PI);     // convert rads/minute to rev/day

          //fun other data
          extra.semiMajorAxis = Math.pow(8681663.653 / extra.meanMotion, (2 / 3));
          extra.semiMinorAxis = extra.semiMajorAxis * Math.sqrt(1 - Math.pow(extra.eccentricity, 2));
          extra.apogee = extra.semiMajorAxis * (1 + extra.eccentricity) - 6371;
          extra.perigee = extra.semiMajorAxis * (1 - extra.eccentricity) - 6371;
          extra.period = 1440.0 / extra.meanMotion;


          revDayPlaceholder.textContent = extra.meanMotion + "rev/day";
          semiMajorAxisPlaceholder.textContent = extra.semiMajorAxis + "km";
          semiMinorAxisPlaceholder.textContent = extra.semiMinorAxis + "km";
          velocityPlaceholder.textContent = satVelocity[index];

        });
      };
      var endExtra = function () {
        clearInterval(startExtra);
      };


      //create 3D collada model
      var createCollada = function (index) {
        var satPos = everyCurrentPosition[index];
        var colladaLoader = new WorldWind.ColladaLoader(satPos);
        colladaLoader.init({dirPath: 'assets/collada-models/'});
        colladaLoader.load('ISS.dae', function (scene) {
          scene.scale = 10000;
          modelLayer.addRenderable(scene);
        });
      };


      /**
       * Click-handle
       *
       */
        //Highlighting
        // Now set up to handle picking.
      var highlightedItems = [];

      var handleClick = function (recognizer) {
        // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
        // the mouse or tap location.
        var x = recognizer.clientX,
          y = recognizer.clientY;

        var redrawRequired = highlightedItems.length > 0;

        // De-highlight any highlighted placemarks.
        index = null;
        for (var h = 0; h < highlightedItems.length; h++) {
          highlightedItems[h].highlighted = false;
          orbitsHoverLayer.enabled = true;
          endHoverOrbit();
          endOrbit();
          endMesh();
          endFollow();
          endExtra();
          $('#follow').text('FOLLOW OFF');
          $('#mesh').text('MESH OFF');
          $('#orbit').text('ORBIT OFF');
          $('#collada').text('3D MODEL OFF');

          //turns off renderables that were turned on by click
          modelLayer.removeAllRenderables();
        }
        // highlightedItems = [];

        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        var rectRadius = 2,
          pickPoint = wwd.canvasCoordinates(x, y),
          pickRectangle = new WorldWind.Rectangle(pickPoint[0] - rectRadius, pickPoint[1] + rectRadius,
            2 * rectRadius, 2 * rectRadius);

        var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

        // If only one thing is picked and it is the terrain, tell the world window to go to the picked location.
        if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
          var position = pickList.objects[0].position;
          index = null;
          orbitsHoverLayer.removeAllRenderables();
          orbitsHoverLayer.enabled = true;
          endHoverOrbit();
          endExtra();
          endFollow();
          endOrbit();
          endMesh();
          $('#follow').text('FOLLOW OFF');
          $('#mesh').text('MESH OFF');
          $('#orbit').text('ORBIT OFF');
          $('#collada').text('3D MODEL OFF');


          wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));

        }

        var pickList = wwd.pickShapesInRegion(pickRectangle);
        if (pickList.objects.length > 0) {
          redrawRequired = true;
        }

        // Highlight the items picked.
        if (pickList.objects.length > 0) {
          for (var p = 0; p < pickList.objects.length; p++) {
            if (pickList.objects[p].isOnTop) {
              pickList.objects[p].userObject.highlighted = true;
              highlightedItems.push(pickList.objects[p].userObject);
            }

          }
        }

        if (pickList.objects.length == 1 && pickList.objects[0]) {
          var position = pickList.objects[0].position;
          if (position.altitude > 1000) {
            //operationPlaceholder.textContent = satData[index].OPERATIONAL_STATUS;
            endFollow();
            endHoverOrbit();
            endMesh();
            endExtra();
            endOrbit();
            var index = everyCurrentPosition.indexOf(position);
            orbitsHoverLayer.enabled = false;

            extraData(index);
            $('#mesh').text("MESH ON");
            meshToCurrentPosition(index);
            $('#mesh').click(function () {
              if ($(this).text() == "MESH OFF") {
                $(this).text("MESH ON");
                meshToCurrentPosition(index);
              }
              else {
                $(this).text("MESH OFF");
                endMesh();
              }
            });

              toCurrentPosition(index);
            $('#follow').text('FOLLOW ON');
            $('#follow').click(function () {
              if ($(this).text() == "FOLLOW OFF") {
                $(this).text("FOLLOW ON");
                toCurrentPosition(index);
              }
              else {
                $(this).text("FOLLOW OFF");
                endFollow();
              }
            });


            createOrbit(index);
            $('#orbit').text('ORBIT ON');
            $('#orbit').click(function () {
              if ($(this).text() == "ORBIT OFF") {
                $(this).text("ORBIT ON");
                createOrbit(index);
              }
              else {
                $(this).text("ORBIT OFF");
                endOrbit();
              }
            });

            createCollada(index);
            $('#collada').text('MODEL ON');
            $('#collada').click(function () {
              if ($(this).text() == "MODEL OFF") {
                $(this).text("MODEL ON");
                createCollada(index);
              }
              else {
                $(this).text("MODEL OFF");
                modelLayer.removeAllRenderables();
              }
            });


          } else {

            var gsindex = groundStation.indexOf(position);
            toGsStation(gsindex);
            gsindex = groundStation.indexOf(position);
            typePlaceholder.textContent = "Ground Station";
            namePlaceholder.textContent = groundStations[gsindex].NAME;
            ownerPlaceholder.textContent = groundStations[gsindex].OWNER;
            idPlaceholder.textContent = "";
            latitudePlaceholder.textContent = groundStations[gsindex].LATITUDE;
            longitudePlaceholder.textContent = groundStations[gsindex].LONGITUDE;
            altitudePlaceholder.textContent = groundStations[gsindex].ALTITUDE;
            inclinationPlaceholder.textContent = "";
            eccentricityPlaceHolder.textContent = "";
            revDayPlaceholder.textContent = "";
            apogeeplaceholder.textContent = "";
            perigeeplaceholder.textContent = "";
            periodPlaceholder.textContent = "";
            semiMajorAxisPlaceholder.textContent = "";
            semiMinorAxisPlaceholder.textContent = "";
          }
        }

        // Update the window if we changed anything.
        if (redrawRequired) {
          wwd.redraw();
        }
      };

      // Listen for mouse clicks.
      var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

      // Listen for taps on mobile devices.
      var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);



/**
 * Pick-Handle Functions
 *
 */
      //Generate pick handle orbit separately as to not interfere with click handle orbit
      var startHoverOrbit;
      var createHoverOrbit = function (index) {
        startHoverOrbit = window.setInterval(function () {
          orbitsHoverLayer.removeAllRenderables();
          var timeSlide = $('#jqxsliderEvent2').jqxSlider('value');
          var now = new Date();
          var pastOrbit = [];
          var futureOrbit = [];
          for (var i = -98; i <= 98; i++) {
            var time = new Date(now.getTime() + (i * 60000) + (timeSlide * 60000));
            try{
              var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), time);
            }catch(err){
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


          var futureOrbitPath = new WorldWind.Path(futureOrbit);
          futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          futureOrbitPath.attributes = futureOrbitPathAttributes;

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
          redrawRequired = true;
        }


        // Highlight the items picked.
        if (pickList.objects.length > 0) {
          for (var p = 0; p < pickList.objects.length; p++) {
            if (pickList.objects[p].isOnTop) {
              pickList.objects[p].userObject.highlighted = true;
              highlightedItems.push(pickList.objects[p].userObject);
            }

          }
        }

        if (pickList.objects.length == 1 && pickList.objects[0]) {
          var position = pickList.objects[0].position;
          console.log(position);
          if (position.altitude > 1000) {
            var index = everyCurrentPosition.indexOf(position);
            try {
              typePlaceholder.textContent = satData[index].OBJECT_TYPE;
              idPlaceholder.textContent = satData[index].OBJECT_ID;
              namePlaceholder.textContent = satData[index].OBJECT_NAME;
              ownerPlaceholder.textContent = satData[index].OWNER;
              launchPlaceholder.textContent = satData[index].LAUNCH_SITE;
              orbitPlaceholder.textContent = satData[index].ORBIT_TYPE;
              inclinationPlaceholder.textContent = satData[index].INCLINATION + "Deg";
              eccentricityPlaceHolder.textContent = satData[index].ECCENTRICITY;
              apogeeplaceholder.textContent = satData[index].APOGEE + "rev/day";
              perigeeplaceholder.textContent = satData[index].PERIGEE + "rev/day";
              periodPlaceholder.textContent = satData[index].PERIOD + "hh:mm:ss";
              operationPlaceholder.textContent = satData[index].OPERATIONAL_STATUS;


            } catch (err) {
              console.log('error in index ' + index);
            }
            endExtra();
            endHoverOrbit();
            extraData(index);

            createHoverOrbit(index);

            updateLLA(everyCurrentPosition[index]);
          } else {
            var gsindex = groundStation.indexOf(position);
            typePlaceholder.textContent = "Ground Station";
            namePlaceholder.textContent = groundStations[gsindex].NAME;
            ownerPlaceholder.textContent = groundStations[gsindex].OWNER;
            idPlaceholder.textContent = "";
            latitudePlaceholder.textContent = groundStations[gsindex].LATITUDE;
            longitudePlaceholder.textContent = groundStations[gsindex].LONGITUDE;
            altitudePlaceholder.textContent = groundStations[gsindex].ALTITUDE;
            inclinationPlaceholder.textContent = "";
            eccentricityPlaceHolder.textContent = "";
            revDayPlaceholder.textContent = "";
            apogeeplaceholder.textContent = "";
            perigeeplaceholder.textContent = "";
            periodPlaceholder.textContent = "";
            semiMajorAxisPlaceholder.textContent = "";
            semiMinorAxisPlaceholder.textContent = "";
          }

          // Update the window if we changed anything.
          if (redrawRequired) {
            wwd.redraw();
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
