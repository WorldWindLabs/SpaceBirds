/**
 * Created by bwstewart389 on 6/29/16.
 */
//Version with working follow of individual satellites and bootstrapper Combo.

require(['../../../src/WorldWind',
        'http://worldwindserver.net/webworldwind/examples/LayerManager.js',
        'util/Satellite', 'util/ObjectWindow', '../util/ProjectionMenu'],
    function (ww,
              LayerManager, Satellite, ObjectWindow, ProjectionMenu) {
        "use strict";

//Bootstrapper
        var modelsCombo = document.getElementById('model-list');
        var modelSelectorButton = document.getElementById('button-value');
//Ground Stations
        var groundStations = [
            {name: 'Matera, Italy', latitude: 40.65, longitude: 16.7},
            {name: 'Svalbard, Norway', latitude: 78.2306, longitude: 15.3894},
            {name: 'Maspalomas, Spain', latitude: 27.7629, longitude: -15.6338},
        ];
//Satellites
        var satellites = [
            {
                name: 'ISS',
                fileName: 'ISS.dae',
                path: '../apps/SatTracker/collada-models/',
                useImage: false,
                initialScale: 5000,
                maxScale: 1000000,
                useTexturePaths: true,
                tle_line_1: '1 25544U 98067A   16167.17503470  .00003196  00000-0  54644-4 0  9994',
                tle_line_2: '2 25544  51.6428  68.0694 0000324   5.0932 150.3291 15.54558788  4673'

            },
            {
                name: 'Hubble',
                fileName: '',
                path: '',
                useImage: true,
                initialScale: 5000,
                maxScale: 1000000,
                useTexturePaths: false,
                tle_line_1: '1 20580U 90037B   16164.81209214  .00000774  00000-0  37292-4 0  9994',
                tle_line_2: '2 20580  28.4702 287.6126 0002813 156.6394 338.1735 15.08391210234458'
            }
        ];

        // Orbit Propagation (MIT License, see https://github.com/shashwatak/satellite-js)

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

        var tle_line_1 = '1 25544U 98067A   16167.17503470  .00003196  00000-0  54644-4 0  9994'
        var tle_line_2 = '2 25544  51.6428  68.0694 0000324   5.0932 150.3291 15.54558788  4673'
        //Hubble
        //var tle_line_1 = '1 20580U 90037B   16164.81209214  .00000774  00000-0  37292-4 0  9994'
        //var tle_line_2 = '2 20580  28.4702 287.6126 0002813 156.6394 338.1735 15.08391210234458'
        var satrec = satellite.twoline2satrec(tle_line_1, tle_line_2);

        var now = new Date();
        var pastOrbit = [];
        var futureOrbit = [];
        var currentPosition = null;
        for (var i = -98; i <= 98; i++) {
            var time = new Date(now.getTime() + i * 60000);

            var position = getPosition(satrec, time)

            if (i < 0) {
                pastOrbit.push(position);
            } else if (i > 0) {
                futureOrbit.push(position);
            } else {
                currentPosition = new WorldWind.Position(position.latitude,
                    position.longitude,
                    position.altitude);
                pastOrbit.push(position);
                futureOrbit.push(position);
            }
        }


        createCombo();

        function createCombo() {
            for (var i = 0; i < satellites.length; i++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = "#";
                a.text = satellites[i].name;
                a.onclick = selectModel;
                li.appendChild(a);
                modelsCombo.appendChild(li);
            }
        }


// Tell World Wind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create the World Window.
        var wwd = new ObjectWindow("canvasOne");


        /**
         * Added imagery layers.
         */

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}

        ];


        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }


        //Latitude, Longitude, and Altitude
        var latitudePlaceholder = document.getElementById('latitude');
        var longitudePlaceholder = document.getElementById('longitude');
        var altitudePlaceholder = document.getElementById('altitude');

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

        function updateLLA(position) {
            latitudePlaceholder.textContent = deg2text(position.latitude, 'NS');
            longitudePlaceholder.textContent = deg2text(position.longitude, 'EW');
            altitudePlaceholder.textContent = (Math.round(position.altitude / 10) / 100) + "km";
        }

// Ground Stations Layer

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageSource = "../apps/SatTracker/ground-station.png";
        placemarkAttributes.imageScale = 0.5;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;


        for (var i = 0, len = groundStations.length; i < len; i++) {
            var groundStation = groundStations[i];

            var placemark = new WorldWind.Placemark(new WorldWind.Position(groundStation.latitude,
                groundStation.longitude,
                1e3));

            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemark.label = groundStation.name;
            placemark.attributes = placemarkAttributes;


            // Add the path to a layer and the layer to the World Window's layer list.
            var groundStationsLayer = new WorldWind.RenderableLayer();
            groundStationsLayer.displayName = "Ground Stations";
            groundStationsLayer.addRenderable(placemark);
            wwd.addLayer(groundStationsLayer);
        }



// Orbit Path
        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.RED;
        pathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);


        var pastOrbitPath = new WorldWind.Path(pastOrbit);
        pastOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        pastOrbitPath.attributes = pathAttributes;

        var pathAttributes = new WorldWind.ShapeAttributes(pathAttributes);
        pathAttributes.outlineColor = WorldWind.Color.GREEN;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);

        var futureOrbitPath = new WorldWind.Path(futureOrbit);
        futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        futureOrbitPath.attributes = pathAttributes;

        var orbitLayer = new WorldWind.RenderableLayer();
        orbitLayer.displayName = "Orbit";
        orbitLayer.addRenderable(pastOrbitPath);
        orbitLayer.addRenderable(futureOrbitPath);
        wwd.addLayer(orbitLayer);


// Satellite
        //collada
        var position = new WorldWind.Position(currentPosition.latitude, currentPosition.longitude, currentPosition.altitude);
        updateLLA(currentPosition.latitude, currentPosition.longitude, currentPosition.altitude);

        var modelLayer = new WorldWind.RenderableLayer("model");
        wwd.addLayer(modelLayer);
        var modelScene;

        function selectModel(event) {

            modelSelectorButton.innerHTML = this.text;

            var pos = satellites.map(function (model) {
                return model.name;
            }).indexOf(this.text);
            var model = satellites[pos];


            if (model.useImage){
                var satelliteLayer = new WorldWind.RenderableLayer();
                modelLayer.removeAllRenderables();

                var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                placemarkAttributes.imageSource = "../apps/SatTracker/satellite.png";
                placemarkAttributes.imageScale = 1;
                placemarkAttributes.imageOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.3,
                    WorldWind.OFFSET_FRACTION, 0.0);
                placemarkAttributes.imageColor = WorldWind.Color.WHITE;
                placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 1.0);
                placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;


                var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                highlightPlacemarkAttributes.imageScale = 1.2;

                var placemark = new WorldWind.Placemark(currentPosition);
                updateLLA(currentPosition);

                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                placemark.label = model.name;
                placemark.attributes = placemarkAttributes;
                placemark.highlightAttributes = highlightPlacemarkAttributes;



                satelliteLayer.displayName = model.name;
                satelliteLayer.addRenderable(placemark);
                wwd.addLayer(satelliteLayer);






            } else {




                var colladaLoader = new WorldWind.ColladaLoader(currentPosition);

                colladaLoader.init({dirPath: model.path});
                colladaLoader.load(model.fileName, function (scene) {

                    console.log('scene', scene);

                    if (scene) {
                        scene.scale = model.initialScale;
                        scene.altitudeMode = WorldWind.ABSOLUTE;
                        scene.useTexturePaths = model.useTexturePaths;

                        modelLayer.removeAllRenderables();
                        modelLayer.addRenderable(scene);

                        modelScene = scene;



                        //sliderScale.slider("option", "max", model.maxScale);
                        //sliderScale.slider("option", "value", model.initialScale);
                        //spanScale.html(model.initialScale);
                    }
                });
            }
        }

        /* var position = new WorldWind.Position(currentPosition.latitude, currentPosition.longitude, currentPosition.altitude);
         updateLLA(currentPosition.latitude, currentPosition.longitude, currentPosition.altitude);
         var colladaLoader = new WorldWind.ColladaLoader(currentPosition);
         colladaLoader.init({dirPath: '../apps/SatTracker/collada-models/'});
         colladaLoader.load('ISS.dae', function (scene) {
         scene.scale = 5000;
         modelLayer.addRenderable(scene);

         });*/
        //end collada

        /* var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
         placemarkAttributes.imageSource = "../apps/SatTracker/satellite.png";
         placemarkAttributes.imageScale = 1;
         placemarkAttributes.imageOffset = new WorldWind.Offset(
         WorldWind.OFFSET_FRACTION, 0.3,
         WorldWind.OFFSET_FRACTION, 0.0);
         placemarkAttributes.imageColor = WorldWind.Color.WHITE;
         placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
         WorldWind.OFFSET_FRACTION, 0.5,
         WorldWind.OFFSET_FRACTION, 1.0);
         placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;


         var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
         highlightPlacemarkAttributes.imageScale = 1.2;

         var placemark = new WorldWind.Placemark(currentPosition);
         updateLLA(currentPosition);

         placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
         placemark.label = "ISS";
         placemark.attributes = placemarkAttributes;
         placemark.highlightAttributes = highlightPlacemarkAttributes;


         var satelliteLayer = new WorldWind.RenderableLayer();
         satelliteLayer.displayName = "ISS";
         satelliteLayer.addRenderable(placemark);
         wwd.addLayer(satelliteLayer);*/

// Navigation
        wwd.navigator.lookAtLocation = new WorldWind.Location(currentPosition.latitude,
            currentPosition.longitude, currentPosition.altitude);

// Draw
        wwd.redraw();

// Update Satellite Position
        var follow = false;
        window.setInterval(function () {
            var position = getPosition(satrec, new Date());
            currentPosition.latitude = position.latitude;
            currentPosition.longitude = position.longitude;
            currentPosition.altitude = position.altitude;

            updateLLA(currentPosition);

            if (follow) {
                toCurrentPosition();
            }

            wwd.redraw();
        }, 5000);

        function toCurrentPosition() {
            wwd.navigator.lookAtLocation.latitude = currentPosition.latitude;
            wwd.navigator.lookAtLocation.longitude = currentPosition.longitude;
            wwd.navigator.lookAtLocation.altitude = currentPosition.altitude;
            // wwd.navigator.lookAtLocation.altitude = currentPosition.altitude;

        }

// Follow Satellite
        var emptyFunction = function (e) {};
        var regularHandlePanOrDrag = wwd.navigator.handlePanOrDrag;
        var regularHandleSecondaryDrag = wwd.navigator.handleSecondaryDrag;
        var regularHandleTilt = wwd.navigator.handleTilt;
        var followPlaceholder = document.getElementById('follow');



        var follow = document.getElementById('follow');
        follow.onclick = toggleFollow;
        function toggleFollow() {

            follow = !follow;
            if (follow) {
                followPlaceholder.textContent = 'Follow On';
                wwd.navigator.handlePanOrDrag = emptyFunction;
                wwd.navigator.handleSecondaryDrag = emptyFunction;
                wwd.navigator.handleTilt = emptyFunction;
                wwd.navigator.lookAtLocation.range = currentPosition.altitude;


            } else {
                followPlaceholder.textContent = 'Follow Off';
                wwd.navigator.handlePanOrDrag = regularHandlePanOrDrag;
                wwd.navigator.handleSecondaryDrag = regularHandleSecondaryDrag;
                wwd.navigator.handleTilt = regularHandleTilt;
                wwd.navigator.lookAtLocation.range = currentPosition.altitude;
                wwd.navigator.range = 10e6;
            }

            wwd.redraw();
            return false;
        }

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

    });
