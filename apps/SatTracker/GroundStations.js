define(['GroundStations'], function(groundStations){
    var groundStations = [
        {name: 'Matera, Italy', latitude: 40.65, longitude: 16.7},
        {name: 'Svalbard, Norway', latitude: 78.2306, longitude: 15.3894},
        {name: 'Maspalomas, Spain', latitude: 27.7629, longitude: -15.6338},
    ];

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

});