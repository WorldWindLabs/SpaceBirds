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


//Add imagery layers.
var layers = [
    {layer: new WorldWind.BMNGLayer(), enabled: true},
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
var modelLayer = new WorldWind.RenderableLayer("Model");
var meshLayer = new WorldWind.RenderableLayer();
var orbitsLayer = new WorldWind.RenderableLayer("Orbit");
var leoSatLayer = new WorldWind.RenderableLayer("LEO Payloads");
var meoSatLayer = new WorldWind.RenderableLayer("MEO Payloads");
var heoSatLayer = new WorldWind.RenderableLayer("HEO Payloads");
var leoRocketLayer = new WorldWind.RenderableLayer("LEO Rocket Bodies");
var meoRocketLayer = new WorldWind.RenderableLayer("MEO Rocket Bodies");
var heoRocketLayer = new WorldWind.RenderableLayer("HEO Rocket Bodies");
var leoDebrisLayer = new WorldWind.RenderableLayer("LEO Debris");
var meoDebrisLayer = new WorldWind.RenderableLayer("MEO Debris");
var heoDebrisLayer = new WorldWind.RenderableLayer("HEO Debris");



//add custom layers
wwd.addLayer(groundStationsLayer);

var payloads = [];
var rocketbodies = [];
var debris = [];
var unknown = [];

$.get('data/groundstations.json', function(groundStations) {
    $.get('data/TLE.json', function (satPac) {
        satPac.satDataString = JSON.stringify(satPac);
        console.log(satPac[0].OBJECT_NAME);

         for (var i = 0; i < satPac.length; i++) {
         if (satPac[i].OBJECT_TYPE === 'PAYLOAD') {
         payloads.push(satPac[i]);
             }
         }

        for (var i = 0; i < satPac.length; i++) {
            if (satPac[i].OBJECT_TYPE === 'ROCKET BODY') {
                rocketbodies.push(satPac[i]);
            }
        }

        for (var i = 0; i < satPac.length; i++) {
            if (satPac[i].OBJECT_TYPE === 'DEBRIS') {
                debris.push(satPac[i]);
            }
        }

        for (var i = 0; i < satPac.length; i++) {
            if (satPac[i].OBJECT_TYPE !== 'PAYLOAD' && satPac[i].OBJECT_TYPE !== 'ROCKET BODY' && satPac[i].OBJECT_TYPE !== 'DEBRIS') {
                unknown.push(satPac[i]);
            }
        }





    //Latitude, Longitude, and Altitude
    var latitudePlaceholder = document.getElementById('latitude');
    var longitudePlaceholder = document.getElementById('longitude');
    var altitudePlaceholder = document.getElementById('altitude');
    var typePlaceholder = document.getElementById('type');
    var intldesPlaceholder = document.getElementById('intldes');
    var namePlaceholder  = document.getElementById('name');
    var inclinationPlaceholder = document.getElementById('inclination');
    var eccentricityPlaceHolder = document.getElementById('eccentricity');
    var revDayPlaceholder = document.getElementById('revDay');
    var apogeeplaceholder = document.getElementById('apogee');
    var perigeeplaceholder = document.getElementById('perigee');
    var periodPlaceholder = document.getElementById('period');
    var semiMajorAxisPlaceholder = document.getElementById('majorAxis');
    var semiMinorAxisPlaceholder = document.getElementById('minorAxis');

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

        //Display sats position
        function updateLLA(position) {
            latitudePlaceholder.textContent = deg2text(position.latitude, 'NS');
            longitudePlaceholder.textContent = deg2text(position.longitude, 'EW');
            altitudePlaceholder.textContent = (Math.round(position.altitude / 10) / 100) + "km";
        }

      // Ground Stations Layer
      var gsPlacemarkAttributes = new WorldWind.PlacemarkAttributes(null);
      gsPlacemarkAttributes.imageSource = "../apps/SatTracker/ground-station.png";
      gsPlacemarkAttributes.imageScale = 0.25;
      gsPlacemarkAttributes.imageOffset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.3,
          WorldWind.OFFSET_FRACTION, 0.0);
      gsPlacemarkAttributes.imageColor = WorldWind.Color.WHITE;
      gsPlacemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
          WorldWind.OFFSET_FRACTION, 0.5,
          WorldWind.OFFSET_FRACTION, 1.0);
      gsPlacemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

      // Create a layer to hold the surface shapes.
      //var shapesLayer = new WorldWind.RenderableLayer("Ground Station Range");

      // Create and set attributes for it. The shapes below except the surface polyline use this same attributes
      // object. Real apps typically create new attributes objects for each shape unless they know the attributes
      // can be shared among shapes.
      var gsAttributes = new WorldWind.ShapeAttributes(null);
      gsAttributes.outlineColor = new WorldWind.Color(0, 255, 255, 0.1);
          gsAttributes.interiorColor = WorldWind.Color.TRANSPARENT;

      var boundary = [];

      var shape = new WorldWind.SurfacePolygon(boundary, gsAttributes);

      for (var i = 0, len = groundStations.length; i < len; i++) {
          var groundStation = groundStations[i];

          var gsPlacemark = new WorldWind.Placemark(new WorldWind.Position(groundStation.LATITUDE,
              groundStation.LONGITUDE,
              1e3));

          shape = new WorldWind.SurfaceCircle(new WorldWind.Location(groundStation.LATITUDE,
              groundStation.LONGITUDE), 150e4, gsAttributes);

          gsPlacemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
          gsPlacemark.label = groundStation.name;
          gsPlacemark.attributes = gsPlacemarkAttributes;
          groundStationsLayer.addRenderable(gsPlacemark);
          groundStationsLayer.addRenderable(shape);
      }

      // Add the path to a layer and the layer to the World Window's layer list.
      groundStationsLayer.displayName = "Ground Stations";
      groundStationsLayer.enabled = false;


        // Add the path to a layer and the layer to the World Window's layer list.
        groundStationsLayer.displayName = "Ground Stations";
        groundStationsLayer.enabled = false;


        /***
         * Satellites
         */
        var orbitToggle = {leo:9, meo:9, heo:9};

        var satNum = satPac.length;
        //Sat Tyoe toggles
        $('#allSats').click(function(orbitToggle) {
            if ($(this).text() == "ALL OFF") {
                $(this).text("ALL ON");
                $('#payloads').text("PAYLOADS OFF");
                $('#rockets').text("ROCKETS OFF");
                $('#debris').text("DEBRIS OFF");
                $('#unknown').text("UNKNOWN OFF");
                leoSatLayer.enabled = true;
                leoRocketLayer.enabled = true;
                leoDebrisLayer.enabled = true;
                meoSatLayer.enabled = true;
                meoRocketLayer.enabled = true;
                meoDebrisLayer.enabled = true;
                heoSatLayer.enabled = true;
                heoRocketLayer.enabled = true;
                heoDebrisLayer.enabled = true;
                orbitToggle = 9;
                return orbitToggle;
            } else {
                $(this).text("ALL OFF");
                leoSatLayer.enabled = false;
                leoRocketLayer.enabled = false;
                leoDebrisLayer.enabled = false;
                meoSatLayer.enabled = false;
                meoRocketLayer.enabled = false;
                meoDebrisLayer.enabled = false;
                heoSatLayer.enabled = false;
                heoRocketLayer.enabled = false;
                heoDebrisLayer.enabled = false;
                orbitToggle = 0;
                return orbitToggle;          }
        });
        $('#payloads').click(function() {
            if ($(this).text() == "PAYLOADS OFF") {
                $(this).text("PAYLOADS ON");
               // endAllSats();
                $('#allSats').text("ALL OFF");
                $('#rockets').text("ROCKETS OFF");
                $('#unknown').text("UNKNOWN OFF");
                $('#debris').text("DEBRIS OFF");
                leoSatLayer.enabled = true;
                leoRocketLayer.enabled = false;
                leoDebrisLayer.enabled = false;
                meoSatLayer.enabled = true;
                meoRocketLayer.enabled = false;
                meoDebrisLayer.enabled = false;
                heoSatLayer.enabled = true;
                heoRocketLayer.enabled = false;
                heoDebrisLayer.enabled = false;
                orbitToggle = 1;
                return orbitToggle;
            } else {
                $(this).text("PAYLOADS OFF");
                leoSatLayer.enabled = false;
                leoRocketLayer.enabled = false;
                leoDebrisLayer.enabled = false;
                meoSatLayer.enabled = false;
                meoRocketLayer.enabled = false;
                meoDebrisLayer.enabled = false;
                heoSatLayer.enabled = false;
                heoRocketLayer.enabled = false;
                heoDebrisLayer.enabled = false;
                orbitToggle = 0;
                return orbitToggle;
            }
        });
        $('#rockets').click(function() {
            if ($(this).text() == "ROCKETS OFF") {
                $(this).text("ROCKETS ON");
                $('#payloads').text("PAYLOADS OFF");
                $('#allSats').text("ALL OFF");
                $('#unknown').text("UNKNOWN OFF");
                $('#debris').text("DEBRIS OFF");
                leoSatLayer.enabled = false;
                leoRocketLayer.enabled = true;
                leoDebrisLayer.enabled = false;
                meoSatLayer.enabled = false;
                meoRocketLayer.enabled = true;
                meoDebrisLayer.enabled = false;
                heoSatLayer.enabled = false;
                heoRocketLayer.enabled = true;
                heoDebrisLayer.enabled = false;
                orbitToggle = 3;
                return orbitToggle;
            } else {
                $(this).text("ROCKETS OFF");
                leoSatLayer.enabled = false;
                leoRocketLayer.enabled = false;
                leoDebrisLayer.enabled = false;
                meoSatLayer.enabled = false;
                meoRocketLayer.enabled = false;
                meoDebrisLayer.enabled = false;
                heoSatLayer.enabled = false;
                heoRocketLayer.enabled = false;
                heoDebrisLayer.enabled = false;
                orbitToggle = 0;
                return orbitToggle;
            }
        });
        $('#debris').click(function() {
            if ($(this).text() == "DEBRIS OFF") {
                $(this).text("DEBRIS ON");
                $('#payloads').text("PAYLOADS OFF");
                $('#rockets').text("ROCKETS OFF");
                $('#unknown').text("UNKNOWN OFF");
                $('#allSats').text("ALL OFF");
                leoSatLayer.enabled = false;
                leoRocketLayer.enabled = false;
                leoDebrisLayer.enabled = true;
                meoSatLayer.enabled = false;
                meoRocketLayer.enabled = false;
                meoDebrisLayer.enabled = true;
                heoSatLayer.enabled = false;
                heoRocketLayer.enabled = false;
                heoDebrisLayer.enabled = true;
                orbitToggle = 5;
                return orbitToggle;
            } else {
                $(this).text("DEBRIS OFF");
                leoSatLayer.enabled = false;
                leoRocketLayer.enabled = false;
                leoDebrisLayer.enabled = false;
                meoSatLayer.enabled = false;
                meoRocketLayer.enabled = false;
                meoDebrisLayer.enabled = false;
                heoSatLayer.enabled = false;
                heoRocketLayer.enabled = false;
                heoDebrisLayer.enabled = false;
                orbitToggle = 0;
                return orbitToggle;
            }
        });
        /*$('.unknown').click(function() {
            if ($(this).text() == "UNKNOWN OFF") {
                $(this).text("UNKNOWN ON");
                endAllSats();
                $('.payloads').text("PAYLOADS OFF");
                $('.rockets').text("ROCKETS OFF");
                $('.debris').tect("DEBRIS OFF");
                $('.allSats').text("ALL OFF");
                //selectSat(unknown);
            } else {
                $(this).text("UNKNOWN OFF");
                endAllSats();
            }
        });*/
       /* function satsLeoOn() {
            if (payloadsOrbit = true) {
                leoSatLayer.enabled = true;
            }
        }
        function rocketLoeOn() {
            if (rocketsOrbit = true) {
                leoRocketLayer.enabled = true;
            }
        }
        function debrisLeoOn(){
            if (debrisOrbit = true) {
                leoDebrisLayer.enabled = true;
            }
        }

        function satsLeoOff() {
            if (payloadsOrbit = true) {
                leoSatLayer.enabled = false;
            }
        }
        function rocketLeoOff() {
            if (rocketsOrbit = true) {
                leoRocketLayer.enabled = false;
            }
        }
        function debrisLeoOff(){
            if (debrisOrbit = true) {
                leoDebrisLayer.enabled = false;
            }
        }*/


        function leoToggleOn() {
            console.log(orbitToggle);
            switch (orbitToggle) {
                case 0:
                    //leoSatLayer.enabled = false;
                    //leoRocketLayer.enabled = false;
                    //leoDebrisLayer.enabled = false;
                    break;
                case 1:
                    leoSatLayer.enabled = true;
                    //leoRocketLayer.enabled = false;
                    //leoDebrisLayer.enabled = false;
                    break;
                case 3:
                    //leoSatLayer.enabled = false;
                    leoRocketLayer.enabled = true;
                    //leoDebrisLayer.enabled = false;
                    break;
                case 5:
                    //leoSatLayer.enabled = false;
                    //leoRocketLayer.enabled = false;
                    leoDebrisLayer.enabled = true;
                    break;
                case 4:
                    leoSatLayer.enabled = true;
                    leoRocketLayer.enabled = true;
                   // leoDebrisLayer.enabled = false;
                    break;
                case 6:
                    leoSatLayer.enabled = true;
                    //leoRocketLayer.enabled = false;
                    leoDebrisLayer.enabled = true;
                    break;
                case 8:
                    //leoSatLayer.enabled = false;
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
            console.log(orbitToggle);
            switch (orbitToggle) {
                case 0:
                    //meoSatLayer.enabled = false;
                    //meoRocketLayer.enabled = false;
                    //meoDebrisLayer.enabled = false;
                    break;
                case 1:
                    meoSatLayer.enabled = true;
                    //meoRocketLayer.enabled = false;
                    //meoDebrisLayer.enabled = false;
                    break;
                case 3:
                    //meoSatLayer.enabled = false;
                    meoRocketLayer.enabled = true;
                    //meoDebrisLayer.enabled = false;
                    break;
                case 5:
                    //meoSatLayer.enabled = false;
                    //meoRocketLayer.enabled = false;
                    meoDebrisLayer.enabled = true;
                    break;
                case 4:
                    meoSatLayer.enabled = true;
                    meoRocketLayer.enabled = true;
                    // leoDebrisLayer.enabled = false;
                    break;
                case 6:
                    leoSatLayer.enabled = true;
                    //meoRocketLayer.enabled = false;
                    meoDebrisLayer.enabled = true;
                    break;
                case 8:
                    //meoSatLayer.enabled = false;
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
            console.log(orbitToggle);
            switch (orbitToggle) {
                case 0:
                    //heoSatLayer.enabled = false;
                    //heoRocketLayer.enabled = false;
                    //heoDebrisLayer.enabled = false;
                    break;
                case 1:
                    heoSatLayer.enabled = true;
                    //heoRocketLayer.enabled = false;
                    //heoDebrisLayer.enabled = false;
                    break;
                case 3:
                    //heoSatLayer.enabled = false;
                    heoRocketLayer.enabled = true;
                    //heoDebrisLayer.enabled = false;
                    break;
                case 5:
                    //heoSatLayer.enabled = false;
                    //heoRocketLayer.enabled = false;
                    heoDebrisLayer.enabled = true;
                    break;
                case 4:
                    heoSatLayer.enabled = true;
                    heoRocketLayer.enabled = true;
                    // heoDebrisLayer.enabled = false;
                    break;
                case 6:
                    heoSatLayer.enabled = true;
                    //heoRocketLayer.enabled = false;
                    heoDebrisLayer.enabled = true;
                    break;
                case 8:
                    //heoSatLayer.enabled = false;
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

        function leoToggleOff() {
            switch (orbitToggle) {
                case 0:
                    leoSatLayer.enabled = false;
                    leoRocketLayer.enabled = false;
                    leoDebrisLayer.enabled = false;
                    break;
                case 1:
                    leoSatLayer.enabled = false;
                    //leoRocketLayer.enabled = false;
                    //leoDebrisLayer.enabled = false;
                    break;
                case 3:
                    //leoSatLayer.enabled = false;
                    leoRocketLayer.enabled = false;
                    //leoDebrisLayer.enabled = false;
                    break;
                case 5:
                    //leoSatLayer.enabled = false;
                    //leoRocketLayer.enabled = false;
                    leoDebrisLayer.enabled = false;

                    break;
                case 4:
                    leoSatLayer.enabled = false;
                    leoRocketLayer.enabled = false;
                   // leoDebrisLayer.enabled = false;

                    break;
                case 6:
                    leoSatLayer.enabled = false;
                    //leoRocketLayer.enabled = false;
                    leoDebrisLayer.enabled = false;
                    break;
                case 8:
                    //leoSatLayer.enabled = false;
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
            switch (orbitToggle) {
                case 0:
                    meoSatLayer.enabled = false;
                    meoRocketLayer.enabled = false;
                    meoDebrisLayer.enabled = false;
                    break;
                case 1:
                    meoSatLayer.enabled = false;
                    //meoRocketLayer.enabled = false;
                    //meoDebrisLayer.enabled = false;
                    break;
                case 3:
                    //meoSatLayer.enabled = false;
                    meoRocketLayer.enabled = false;
                    //meoDebrisLayer.enabled = false;
                    break;
                case 5:
                    //meoSatLayer.enabled = false;
                    //meoRocketLayer.enabled = false;
                    meoDebrisLayer.enabled = false;

                    break;
                case 4:
                    meoSatLayer.enabled = false;
                    meoRocketLayer.enabled = false;
                    // meoDebrisLayer.enabled = false;

                    break;
                case 6:
                    meoSatLayer.enabled = false;
                    //meoRocketLayer.enabled = false;
                    meoDebrisLayer.enabled = false;
                    break;
                case 8:
                    //meoSatLayer.enabled = false;
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
            switch (orbitToggle) {
                case 0:
                    heoSatLayer.enabled = false;
                    heoRocketLayer.enabled = false;
                    heoDebrisLayer.enabled = false;
                    break;
                case 1:
                    heoSatLayer.enabled = false;
                    //heoRocketLayer.enabled = false;
                    //heoDebrisLayer.enabled = false;
                    break;
                case 3:
                    //heoSatLayer.enabled = false;
                    heoRocketLayer.enabled = false;
                    //heoDebrisLayer.enabled = false;
                    break;
                case 5:
                    //heoSatLayer.enabled = false;
                    //heoRocketLayer.enabled = false;
                    heoDebrisLayer.enabled = false;

                    break;
                case 4:
                    heoSatLayer.enabled = false;
                    heoRocketLayer.enabled = false;
                    // heoDebrisLayer.enabled = false;

                    break;
                case 6:
                    heoSatLayer.enabled = false;
                    //heoRocketLayer.enabled = false;
                    heoDebrisLayer.enabled = false;
                    break;
                case 8:
                    //heoSatLayer.enabled = false;
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

        //Range Toggles
        $('#leo').click(function() {
            if ($(this).text() == "LEO OFF") {
                $(this).text("LEO ON");
                leoToggleOn();
            } else {
                $(this).text("LEO OFF");
                leoToggleOff();
            }
        });
        $('#meo').click(function() {
            if ($(this).text() == "MEO OFF") {
                $(this).text("MEO ON");
                meoToggleOn();
            } else {
                $(this).text("MEO OFF");
                meoToggleOff();
            }
        });
        $('#heo').click(function() {
            if ($(this).text() == "HEO OFF") {
                $(this).text("HEO ON");
                heoToggleOn();
            } else {
                $(this).text("HEO OFF");
            heoToggleOff();
            }
        });

        $('#gStations').click(function() {
            if ($(this).text() == "GS OFF") {
                $(this).text("GS ON");
                groundStationsLayer.enabled = true;
            } else {
                $(this).text("GS OFF");
                groundStationsLayer.enabled = false;
            }
        });
        selectSat(satPac);

        function selectSat(satData) {

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

// Orbit Propagation (MIT License, see https://github.com/shashwatak/satellite-js)
            var getPosition = function (satrec, time) {
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


            var now = new Date();
            var everyCurrentPosition = [];


            for (var j = 0; j < satNum; j ++) {
                var currentPosition = null;
                var time = new Date(now.getTime() + i * 60000);
                try {
                    var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
                } catch (err) {
                }
                currentPosition = new WorldWind.Position(position.latitude,
                    position.longitude,
                    position.altitude);
                everyCurrentPosition[j] = currentPosition;
            }


            // Satellite

            //add colored image depending on sat type
            for (var ind = 0; ind < satNum; ind += 1) {
                var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                highlightPlacemarkAttributes.imageScale = 0.40;

                if (satData[ind].OBJECT_TYPE === "PAYLOAD") {
                    placemarkAttributes.imageSource = "../apps/SatTracker/dot-red.png";
                } else if (satData[ind].OBJECT_TYPE === "ROCKET BODY") {
                    placemarkAttributes.imageSource = "../apps/SatTracker/dot-blue.png";
                } else {
                    placemarkAttributes.imageSource = "../apps/SatTracker/dot-grey.png";
                }

                placemarkAttributes.imageOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 0.5);
                placemarkAttributes.imageColor = WorldWind.Color.WHITE;
                placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 1.0);
                placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;


                var placemark = new WorldWind.Placemark(everyCurrentPosition[ind]);
                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                placemark.attributes = placemarkAttributes;
                placemark.highlightAttributes = highlightPlacemarkAttributes;
                placemarkAttributes.imageScale = 0.35;


                //Defines orbit ranges
                if (satData[ind].OBJECT_TYPE === "PAYLOAD") {
                    if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) <= 1200) {
                        leoSatLayer.addRenderable(placemark);
                    } else if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) > 1200 && (Math.round(everyCurrentPosition[ind].altitude / 10) / 100) <= 35790) {
                        meoSatLayer.addRenderable(placemark);
                    } else if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) > 35790) {
                        heoSatLayer.addRenderable(placemark);
                    }
                } else if (satData[ind].OBJECT_TYPE === "ROCKET BODY") {
                    if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) <= 1200) {
                        leoRocketLayer.addRenderable(placemark);
                    } else if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) > 1200 && (Math.round(everyCurrentPosition[ind].altitude / 10) / 100) <= 35790) {
                        meoRocketLayer.addRenderable(placemark);
                    } else if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) > 35790) {
                        heoRocketLayer.addRenderable(placemark);
                    }
                } else if (satData[ind].OBJECT_TYPE === "DEBRIS") {
                    if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) <= 1200) {
                        leoDebrisLayer.addRenderable(placemark);
                    } else if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) > 1200 && (Math.round(everyCurrentPosition[ind].altitude / 10) / 100) <= 35790) {
                        meoDebrisLayer.addRenderable(placemark);
                    } else if ((Math.round(everyCurrentPosition[ind].altitude / 10) / 100) > 35790) {
                        heoDebrisLayer.addRenderable(placemark);
                    }
                }


            }

            // Draw
            wwd.redraw();

            // Update all Satellite Positions
             window.setInterval(function () {
                for (var indx = 0; indx < satNum; indx += 1) {
                    var position = getPosition(satellite.twoline2satrec(satData[indx].TLE_LINE1, satData[indx].TLE_LINE2), new Date());
                    everyCurrentPosition[indx].latitude = position.latitude;
                    everyCurrentPosition[indx].longitude = position.longitude;
                    everyCurrentPosition[indx].altitude = position.altitude;

                    wwd.redraw();
                }
            }, 1000);


            //follow satellite on click
            var startFollow;
            var toCurrentPosition = function (index) {
                var satPos = everyCurrentPosition[index];
                //Move to sat position on click and redefine navigator positioning
                //console.log(everyCurrentPosition.indexOf(position));
                //Changes center point of view.
                wwd.navigator.lookAtLocation.altitude = satPos.altitude;
                wwd.goTo(new WorldWind.Position(satPos.latitude, satPos.longitude, satPos.altitude + 10000));
                //delays navigator position change for smooth transition
                window.setTimeout(function () {
                    startFollow = window.setInterval(function () {
                        var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), new Date());
                      /*  everyCurrentPosition[index].latitude = position.latitude;
                        everyCurrentPosition[index].longitude = position.longitude;
                        //  everyCurrentPosition[index].altitude = position.altitude;

                        //allows for updating lookAtNavigator and visual cone when called on line 34*/

                        //change view position
                        wwd.navigator.lookAtLocation.latitude = satPos.latitude;
                        wwd.navigator.lookAtLocation.longitude = satPos.longitude;
                        // wwd.navigator.lookAtLocation.altitude = satPos.altitude;
                        updateLLA(position);
                    });
                }, 3000);
            };
            var endFollow = function(){
                clearInterval(startFollow);
            };

            //mesh cone follow sat position
            var startMesh;                                    //allows to end window interval
            var meshToCurrentPosition = function (index) {
                startMesh = window.setInterval(function () {
                    var satPos = everyCurrentPosition[index];
                    meshLayer.removeAllRenderables();
                    //create triangle mesh
                    var altitude = [],
                        numRadialPositions = 40,
                        meshPositions = [],
                        meshIndices = [],
                        outlineIndices = [],
                        texCoords = [],
                        meshRadius = 15; // degrees

                    // Create the mesh's positions, which are the center point of a circle followed by points on the circle.
                    meshPositions.push(satPos);// the mesh center
                    wwd.redraw();
                    texCoords.push(new WorldWind.Vec2(0.5, 0.5));

                    for (var angle = 0; angle < 360; angle += 360 / numRadialPositions) {
                        var angleRadians = angle * WorldWind.Angle.DEGREES_TO_RADIANS,
                            lat = meshPositions[0].latitude + Math.sin(angleRadians) * meshRadius,
                            lon = meshPositions[0].longitude + Math.cos(angleRadians) * meshRadius,
                            t = 0.5 * (1 + Math.sin(angleRadians)),
                            s = 0.5 * (1 + Math.cos(angleRadians));

                        meshPositions.push(new WorldWind.Position(lat, lon, altitude));
                        texCoords.push(new WorldWind.Vec2(s, t));
                    }

                    // Create the mesh indices.
                    for (var i = 1; i < numRadialPositions; i++) {
                        meshIndices.push(0);
                        meshIndices.push(i);
                        meshIndices.push(i + 1);
                    }

                    // Close the circle.
                    meshIndices.push(0);
                    meshIndices.push(numRadialPositions);
                    meshIndices.push(1);

                    // Create the outline indices.
                    for (var j = 1; j <= numRadialPositions; j++) {
                        outlineIndices.push(j);
                    }
                    // Close the outline.
                    outlineIndices.push(1);

                    // Create the mesh's attributes. Light this mesh.
                    var meshAttributes = new WorldWind.ShapeAttributes(null);
                    meshAttributes.outlineColor = new WorldWind.Color(51, 51, 255, 0.03);
                    meshAttributes.interiorColor = new WorldWind.Color(255, 255, 51, 0.030);
                    // meshAttributes.imageSource = "../images/400x230-splash-nww.png";
                    meshAttributes.applyLighting = false;


                    // Create the mesh.
                    var mesh = new WorldWind.TriangleMesh(meshPositions, meshIndices, meshAttributes);
                    mesh.textureCoordinates = texCoords;
                    mesh.outlineIndices = outlineIndices;
                    //mesh.highlightAttributes = highlightAttributes;

                    // Add the mesh to a layer and the layer to the World Window's layer list.
                    meshLayer.displayName = "Triangle Mesh";
                    meshLayer.addRenderable(mesh);

                    var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), new Date());
                    satPos.latitude = position.latitude;
                    satPos.longitude = position.longitude;
                    satPos.altitude = position.altitude;
                    updateLLA(position);

                });
            };
            var endMesh = function () {
                meshLayer.removeAllRenderables();
                clearInterval(startMesh);
            };


            var startOrbit;
            var createOrbit = function(index) {
                startOrbit = window.setInterval(function() {
                    orbitsLayer.removeAllRenderables();
                    var now = new Date();
                    var pastOrbit = [];
                    var futureOrbit = [];
                    for (var i = -98; i <= 98; i++) {
                        var time = new Date(now.getTime() + i * 60000);

                        var position = getPosition(satellite.twoline2satrec(satData[index].TLE_LINE1, satData[index].TLE_LINE2), time);

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

                    orbitsLayer.addRenderable(pastOrbitPath);
                    orbitsLayer.addRenderable(futureOrbitPath);
                });
            };

            var endOrbit = function(){
                clearInterval(startOrbit);
                orbitsLayer.removeAllRenderables();
            };
            var startExtra;
            var extraData = function(index) {
                startExtra = window.setInterval(function() {
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

                    inclinationPlaceholder.textContent = extra.inclination;
                    eccentricityPlaceHolder.textContent = extra.eccentricity;
                    revDayPlaceholder.textContent = extra.meanMotion;
                    apogeeplaceholder.textContent = extra.apogee;
                    perigeeplaceholder.textContent = extra.perigee;
                    periodPlaceholder.textContent = extra.period;
                    semiMajorAxisPlaceholder.textContent = extra.semiMajorAxis;
                    semiMinorAxisPlaceholder.textContent = extra.semiMinorAxis;
                });
            };
            var endExtra = function(){
                clearInterval(startExtra);
            };

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
                for (var h = 0; h < highlightedItems.length; h++) {
                    highlightedItems[h].highlighted = false;
                    endOrbit();
                    endMesh();
                    endFollow();
                    endExtra();

                    //turns off renderables that were turned on by click
                    modelLayer.removeAllRenderables();



                }
                //highlightedItems = [];

                // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                // relative to the upper left corner of the canvas rather than the upper left corner of the page.
                var rectRadius = 1,
                    pickPoint = wwd.canvasCoordinates(x, y),
                    pickRectangle = new WorldWind.Rectangle(pickPoint[0] - rectRadius, pickPoint[1] + rectRadius,
                        2 * rectRadius, 2 * rectRadius);

                var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

                // If only one thing is picked and it is the terrain, tell the world window to go to the picked location.
                if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
                    var position = pickList.objects[0].position;
                    orbitsLayer.removeAllRenderables();
                    modelLayer.removeAllRenderables();
                    meshLayer.removeAllRenderables();
                    endExtra();
                    endFollow();
                    endOrbit();
                    endMesh();

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
                    var index = everyCurrentPosition.indexOf(position);
                    var satPos = everyCurrentPosition[index];
                    endFollow();
                    endMesh();
                    endExtra();
                    extraData(index);
                    $(this).text("Mesh On");
                    meshToCurrentPosition(index);
                    $('#mesh').click(function () {
                        if ($(this).text() == "Mesh Off") {
                            $(this).text("Mesh On");
                            meshToCurrentPosition(index);
                        }
                        else {
                            $(this).text("Mesh Off");
                            endMesh();
                        }
                    });

                    toCurrentPosition(index);
                    $('#follow').click(function () {
                        if ($(this).text() == "Follow Off") {
                            $(this).text("Follow On");
                            toCurrentPosition(index);
                        }
                        else {
                            $(this).text("Follow Off");
                            endFollow();
                        }
                    });

                    createOrbit(index);
                    $('#orbit').click(function () {
                        if ($(this).text() == "Orbit Off") {
                            $(this).text("Orbit On");
                            createOrbit(index);
                        }
                        else {
                            $(this).text("Orbit Off");
                            endOrbit();
                        }
                    });


                    //create 3D collada model
                    var colladaLoader = new WorldWind.ColladaLoader(satPos);
                    colladaLoader.init({dirPath: '../apps/SatTracker/collada-models/'});
                    colladaLoader.load('ISS.dae', function (scene) {
                        scene.scale = 10000;
                        modelLayer.addRenderable(scene);
                    });

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
                    endOrbit();
                    endMesh();

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
                    var index = everyCurrentPosition.indexOf(position);
                    typePlaceholder.textContent = satData[index].OBJECT_TYPE;
                    intldesPlaceholder.textContent = satData[index].INTLDES;
                    namePlaceholder.textContent = satData[index].OBJECT_NAME;
                    endExtra();
                    extraData(index);
                    endOrbit();
                    endMesh();

                   /* meshToCurrentPosition(index);
                    $('.mesh').click(function () {
                        if ($(this).text() == "Mesh Off") {
                            $(this).text("Mesh On");
                            meshToCurrentPosition(index);
                        }
                        else {
                            $(this).text("Mesh Off");
                            endMesh();
                        }
                    });*/

                    createOrbit(index);
                    $('#orbit').click(function () {
                        if ($(this).text() == "Orbit Off") {
                            $(this).text("Orbit On");
                            createOrbit(index);
                        }
                        else {
                            $(this).text("Orbit Off");
                            endOrbit();
                        }
                    });

                    updateLLA(everyCurrentPosition[index]);
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


            // Create a layer manager for controlling layer visibility.


            wwd.redraw();


        }
    });
});
var layerManger = new LayerManager(wwd);
wwd.redraw();
