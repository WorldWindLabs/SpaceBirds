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
  //{layer: new WorldWind.BMNGLayer(), enabled: true},
  {layer: new WorldWind.BingAerialLayer(null), enabled: true},
  {layer: coordinates, enabled: true},
  {layer: viewControlsLayer, enabled: true}
];

for (var l = 0; l < layers.length; l++) {
  layers[l].layer.enabled = layers[l].enabled;
  wwd.addLayer(layers[l].layer);
}

//Activate BMNGLayer in low altitudes
layers[1].layer.maxActiveAltitude = 5e6;
//layers[2].layer.maxActiveAltitude = 15e7;
layers[2].layer.minActiveAltitude = 5e6;


//custom layers
var groundStationsLayer = new WorldWind.RenderableLayer();
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
var customSatLayer = new WorldWind.RenderableLayer("custom");
var customGSLayer = new WorldWind.RenderableLayer("customGS");

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
wwd.addLayer(customSatLayer);

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

// Implementing the perfect scrollbar
$('#sidebar-wrapper').perfectScrollbar();
$('#sidebar-wrapper-right').perfectScrollbar();

//toggle minimization of left nav bar
$("#min_button").click(function () {
  console.log("in");
  if ($(this).html() == "-") {
    console.log("inner");
    $(this).html("+");
  }
  else {
    $(this).html("-");
  }
  $("#box").slideToggle();
});

//toggle minimization of right nav bar
$("#min_button_right").click(function () {
  if ($(this).html() == "-") {
    $(this).html("+");
  }
  else {
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
    var gsOrg = [];
    var groundStation = [];
    for (var i = 0, len = groundStations.length; i < len; i++) {
      gsNames.push(groundStations[i].NAME);
      gsOrg.push(groundStations[i].ORGANIZATION)
      groundStation[i] = new WorldWind.Position(groundStations[i].LATITUDE,
        groundStations[i].LONGITUDE,
        groundStations[i].ALTITUDE);
      var gsPlacemark = new WorldWind.Placemark(groundStation[i]);

      gsPlacemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
      gsPlacemark.label = groundStation.NAME;
      gsPlacemark.attributes = gsPlacemarkAttributes;
      gsPlacemark.highlightAttributes = gsHighlightPlacemarkAttributes;
      groundStationsLayer.addRenderable(gsPlacemark);
    }


    // Add the path to a layer and the layer to the World Window's layer list.
    groundStationsLayer.enabled = false;
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


      //turn on shape for current GS
      $('#addStation').click(function () {
        addCustomGS(gsind);
      });
    };
    $('#customGS').click(function () {
      if ($(this).text() == "CUSTOM GS ON") {
        $(this).text("CUSTOM GS OFF");
        customGSLayer.enabled = false;
      } else {
        $(this).text("CUSTOM GS ON");
        customGSLayer.enabled = true;
      }
    });

    var allLayersOff = function () {
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

      $("#payloads").text("PAYLOADS OFF");
      $("#rockets").text("ROCKETS OFF");
      $("#debis").text("PAYLOADS OFF");
      $("#allSats").text("ALL OFF");
      $("#leo").text("LEO OFF");
      $("#meo").text("MEO OFF");
      $("#geo").text("GEO OFF");
      $("#heo").text("HEO OFF");
      $("#unclassified").text("UNCLASSIFIED OFF");
    };

    /***
     * Satellites
     */
      //Swtich Board for Sat Types
    var orbitToggle = {
        leoP: 9,
        leoR: 0,
        leoD: 0,
        meoP: 9,
        meoR: 0,
        meoD: 0,
        heoP: 9,
        heoR: 0,
        heoD: 0,
        geoP: 9,
        geoR: 0,
        geoD: 0,
        unclassifiedP: 0,
        unclassifiedR: 0,
        unclassifiedD: 0
      };

    leoDebrisLayer.enabled = false;
    meoDebrisLayer.enabled = false;
    heoDebrisLayer.enabled = false;
    geoDebrisLayer.enabled = false;
    unclassifiedDebrisLayer.enabled = false;
    customSatLayer.enabled = false;
    customGSLayer.enabled = false;

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

    function heoToggleOn() {
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
    $('#custom').click(function () {
      if ($(this).text() == "CUSTOM ON") {
        $(this).text("CUSTOM OFF");
        customSatLayer.enabled = false;
      } else {
        $(this).text("CUSTOM ON");
        customSatLayer.enabled = true;
      }
    });

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
    renderSats(satPac);

    //plots all sats
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
        var time = new Date(now.getTime() + i * 60000);

        try {
          getVelocity(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
          satVelocity[j] = satVelocity;
          var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
        } catch (err) {
          console.log(err + ' in renderSats, sat ' + j + satPac[j].OBJECT_NAME);
          continue;
        }

        currentPosition = new WorldWind.Position(position.latitude,
          position.longitude,
          position.altitude);
        try {
        everyCurrentPosition.push(currentPosition);
        satSite.push(satData[j].LAUNCH_SITE);
        satNames.push(satData[j].OBJECT_NAME);
        satOwner.push(satData[j].OWNER);
        satStatus.push(satData[j].OPERATIONAL_STATUS);
        satDate[j] = satData[j].LAUNCH_DATE.substring(0, 4);
        } catch (err) {
          console.log(err + ' in renderSats, sat ' + j);
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

      $('#clearCustom').click(function () {
        while (indexCheck.length > 0) {
          indexCheck.pop();
        }
        customSatLayer.removeAllRenderables();
        $('#customStatus').text("CLEARED CUSTOM LAYER");
        window.setTimeout(function () {
          $('#customStatus').text("");
        }, 2000)
      });

      var indexCheck = [];
      var indexChecked = null;
      var addCustomSat = function (index) {
        indexChecked = indexCheck.indexOf(index);
        if (indexChecked === -1) {
          indexCheck.unshift(index);

          var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
          var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
          highlightPlacemarkAttributes.imageScale = 0.5;

          //add colored image depending on sat type
          switch (satData[indexCheck[0]].OBJECT_TYPE) {
            case "PAYLOAD":
              placemarkAttributes.imageSource = "assets/icons/blue_dot.png";
              placemarkAttributes.imageScale = 0.4;
              break;
            case "ROCKET BODY":
              placemarkAttributes.imageSource = "assets/icons/yellow_dot.png";
              placemarkAttributes.imageScale = 0.4;
              break;
            default:
              placemarkAttributes.imageSource = "assets/icons/red_dot.png";
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


          var placemark = new WorldWind.Placemark(everyCurrentPosition[indexCheck[0]]);
          placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          placemark.attributes = placemarkAttributes;
          placemark.highlightAttributes = highlightPlacemarkAttributes;

          customSatLayer.addRenderable(placemark);


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


      // Update all Satellite Positions
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
       * HTML interface Controls *
       * ***/

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      // Create search box for GS's
      $("#gsNameSearch").jqxComboBox({
        source: groundStations,
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
            var searchGSat = gsNames.indexOf(item.label);
            endFollow();
            toGsStation(searchGSat);
            allLayersOff();
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

      //create satellite owner search
      var owner = satOwner.filter(onlyUnique); // returns ['a', 1, 2, '1'];
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

            for (var i = 0; i < satNum; i += 1) {
              if (satData[i].OWNER === item.label) {
                addCustomSat(i);
              }
            }
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
            customSatLayer.enabled = true;
            $("#custom").text("CUSTOM ON");
          }
        }
      });

      //create satellite owner search
      var year = satDate.filter(onlyUnique); // returns ['a', 1, 2, '1'];
      $("#yearSearch").jqxComboBox({
        //selectedIndex: 0,
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

            for (var i = 0; i < (satNum - 1); i += 1) {
              if (satDate[i] === item.label) {
                addCustomSat(i);
              }
            }
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
            customSatLayer.enabled = true;
            $("#custom").text("CUSTOM ON");
          }
        }
      });

      //create satellite site search
      var site = satSite.filter(onlyUnique);
      $("#siteSearch").jqxComboBox({
        //selectedIndex: 0,
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
            for (var i = 0; i < satNum; i += 1) {
              if (satData[i].LAUNCH_SITE === item.label) {
                addCustomSat(i);

              }
            }
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
            customSatLayer.enabled = true;
            $("#custom").text("CUSTOM ON");
          }
        }
      });

      //create satellite site search
      var status = satStatus.filter(onlyUnique);
      console.log(status[0]);
      $("#statusSearch").jqxComboBox({
        //selectedIndex: 0,
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
            for (var i = 0; i < satNum; i += 1) {
              if (status[i] === item.label) {
                addCustomSat(i);
              }
            }
            $('#customStatus').text("ADDED " + item.label + " TO CUSTOM LAYER");
            window.setTimeout(function () {
              $('#customStatus').text("");
            }, 3000);
            allLayersOff();
            customSatLayer.enabled = true;
            $("#custom").text("CUSTOM ON");
          }
        }
      });

      // Create search box for Satellites
      $("#nameSearch").jqxComboBox({
        // selectedIndex: 0,
        source: satNames,
        displayMember: "OBJECT_NAME",
        //valueMember: "OWNER",
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
            // var valueElement = $("<div></div>");
            //valueElement.text("Owner: " + item.value);
            var labelElement = $("<div></div>");
            labelElement.text("Name: " + item.label);
            $("#nameLog").children().remove();
            //$("#selectionlog").append(labelElement);
            //$("#selectionlog").append(valueElement);
            endFollow();
            endMesh();
            endOrbit();
            endExtra();
            var searchSat = satNames.indexOf(item.label);
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

      //Orbit length/time slider
      $("#orbitEvent").jqxSlider({
        theme: 'shinyblack',
        value: 98,
        max: 10080,
        min: 0,
        ticksFrequency: 1440,
        width: "viewport",
        showButtons: false
      });
      $('#orbitEvent').bind('change', function (event) {
        $('#orbitValue').html(new Date(now.getTime() + event.args.value * 60000));
        $('#orbitValueMin').html(event.args.value + "mins");
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
      console.log(values);
      $("#yearRangeSlider").bind('change', function () {
        allLayersOff();
        customSatLayer.enabled = true;
        while (indexCheck.length > 0) {
          indexCheck.pop();
        }
        customSatLayer.removeAllRenderables();
        $('#customStatus').text("CLEARED CUSTOM LAYER");
        window.setTimeout(function () {
          $('#customStatus').text("");
        }, 2000);
        $("#custom").text("CUSTOM ON");
        for (var i = 0; i < satNum; i += 1) {
          if (satDate[i] >= values[0] && satDate[i] <= values[1]) {
            addCustomSat(i);
          }
        }
      });



      /****
       * Click-handle functions
       */
        //follow satellite on click
        // Move to sat position on click and redefine navigator positioning
      var startFollow;
      var toCurrentPosition = function (index) {
        var toggleButtons = document.getElementById('buttonToggle');
        toggleButtons.style.display = "inline";
        var satPos = everyCurrentPosition[index];
        //Changes center point of view.
        wwd.navigator.lookAtLocation.altitude = satPos.altitude;
        startFollow = window.setInterval(function () {
          try {
            var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), new Date());
          } catch (err) {
            console.log(err + ' in toCurrentPosition, sat ' + indx);
            //continue;
          }
          //change view position
          wwd.navigator.lookAtLocation.latitude = satPos.latitude;
          wwd.navigator.lookAtLocation.longitude = satPos.longitude;
          updateLLA(position);
        });
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
      };
      var endFollow = function () {     //ends startFollow window.setInterval
        clearInterval(startFollow);
      };

      //Mesh-cone to follow sat position
      var startMesh;                                    //allows to end window interval
      var meshToCurrentPosition = function (index) {
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
        startOrbit = window.setInterval(function () {
          var orbitRange = $('#orbitEvent').jqxSlider('value');
          var timeSlide = $('#timeEvent').jqxSlider('value');

          orbitsLayer.removeAllRenderables();
          var now = new Date();
          var pastOrbit = [];
          var futureOrbit = [];
          for (var i = -orbitRange; i <= orbitRange; i++) {
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
        var satPos = everyCurrentPosition[index];
        var colladaLoader = new WorldWind.ColladaLoader(satPos);
        colladaLoader.init({dirPath: 'assets/collada-models/'});
        colladaLoader.load('ISS.dae', function (scene) {
          scene.scale = 10000;
          modelLayer.addRenderable(scene);
        });
      };

      var highlightedItems = [];

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
          endExtra();
          endFollow();
          endOrbit();
          endMesh();

          var toggleButtons = document.getElementById('buttonToggle');
          toggleButtons.style.display = "none";
          orbitsHoverLayer.removeAllRenderables();
          orbitsHoverLayer.enabled = true;
          $('#follow').text('FOLLOW OFF');
          $('#mesh').text('HORIZON OFF');
          $('#orbit').text('ORBIT OFF');
          $('#collada').text('3D MODEL OFF');

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
          endFollow();
          endOrbit();
          endMesh();
          endHoverOrbit();
          endExtra();
          var toggleButtons = document.getElementById('buttonToggle');
          toggleButtons.style.display = "none";
          var groundPosition = pickList.objects[0].position;
          orbitsHoverLayer.removeAllRenderables();
          orbitsHoverLayer.enabled = true;
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
              var position = pickList.objects[p].position,
                satIndex = everyCurrentPosition.indexOf(position),
                gsIndex = groundStation.indexOf(position);
              orbitsLayer.enabled = true;
              if (satIndex > -1) {
                endHoverOrbit();
                $('#customSat').click(function () {
                  addCustomSat(satIndex);
                });
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

      // Listen for mouse clicks.
      var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

      // Listen for taps on mobile devices.
      var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);

      wwd.redraw();


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
