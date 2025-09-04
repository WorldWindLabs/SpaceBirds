// This is a minimal satellite tracker web app built around Web WorldWind and Satellite.js,
// and based on Yann Voumard's work: https://github.com/AkeluX

// Update latitude, longitude and altitude in the DOM
var latitudePlaceholder = document.getElementById('latitude');
var longitudePlaceholder = document.getElementById('longitude');
var altitudePlaceholder = document.getElementById('altitude');

function updateLatitudeLongitudeAltitude(position) {
    latitudePlaceholder.textContent = degreesToText(position.latitude, 'NS');
    longitudePlaceholder.textContent = degreesToText(position.longitude, 'EW');
    altitudePlaceholder.textContent = (Math.round(position.altitude / 10) / 100) + "km";
}

// WorldWind's base Layers
var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
var bmngLayer = new WorldWind.BMNGLayer();
var atmosphereLayer = new WorldWind.AtmosphereLayer();
var starfieldLayer = new WorldWind.StarFieldLayer();

// Deep Space Network ground stations Layer
var groundStations = [
    {name: 'Lunar groundstation Alpha', latitude: 35.1603, longitude: -116.8736},
    {name: 'Lunar groundstation Bravo', latitude: -35.2236, longitude: 148.9831},
    {name: 'Lunar groundstation Charlie', latitude: 40.2403, longitude: -4.2514},
];

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
placemarkAttributes.imageSource = "resources/icons/ground-station.png";
placemarkAttributes.imageScale = 0.5;
placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);
placemarkAttributes.imageColor = WorldWind.Color.WHITE;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);
placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

var groundStationsLayer = new WorldWind.RenderableLayer("Ground Stations");

for(var i = 0, len = groundStations.length; i < len; i++) {
    var groundStation = groundStations[i];

    var placemark = new WorldWind.Placemark(new WorldWind.Position(groundStation.latitude,
                                                                   groundStation.longitude,
                                                                   1e3));

    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
    placemark.label = groundStation.name;
    placemark.attributes = placemarkAttributes;

    groundStationsLayer.addRenderable(placemark);
}

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

    var gmst = satellite.gstime (time.getUTCFullYear(),
                                           time.getUTCMonth() + 1,
                                           time.getUTCDate(),
                                           time.getUTCHours(),
                                           time.getUTCMinutes(),
                                           time.getUTCSeconds());

    var position_gd = satellite.eciToGeodetic (position_eci, gmst);
    var latitude    = satellite.degreesLat(position_gd["latitude"]);
    var longitude   = satellite.degreesLong(position_gd["longitude"]);
    var altitude    = position_gd["height"] * 1000;

    return new WorldWind.Position(latitude, longitude, altitude);
}

// Two Line Element set to plot the orbit and current position of a satelite.
// Note that we could be reading thousands of these from one
// of the 'all_on-orbit_bodies' files in the data folder.
var tle_line_1 = '1 25544U 98067A   20277.45255787  .00002170  00000-0  47783-4 0  9994'
var tle_line_2 = '2 25544  51.6442 172.7662 0001229  98.7431 246.4350 15.48827376248796'

var satrec = satellite.twoline2satrec(tle_line_1, tle_line_2);

var now = new Date();
var pastOrbit = [];
var futureOrbit = [];
var currentPosition = null;
for(var i = -98; i <= 98; i++) {
    var time = new Date(now.getTime() + i*60000);

    var position = getPosition(satrec, time)

    if(i < 0) {
        pastOrbit.push(position);
    } else if(i > 0) {
        futureOrbit.push(position);
    } else {
        currentPosition = new WorldWind.Position(position.latitude,
                                                 position.longitude,
                                                 position.altitude);
        pastOrbit.push(position);
        futureOrbit.push(position);
    }
}

// Orbit Path
var pathAttributes = new WorldWind.ShapeAttributes(null);
pathAttributes.outlineColor = WorldWind.Color.RED;
pathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5);

var pastOrbitPath = new WorldWind.Path(pastOrbit);
pastOrbitPath.useSurfaceShapeFor2D = true;
pastOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
pastOrbitPath.attributes = pathAttributes;

var pathAttributes = new WorldWind.ShapeAttributes(pathAttributes);
pathAttributes.outlineColor = WorldWind.Color.GREEN;
pathAttributes.interiorColor = new WorldWind.Color(0, 1, 0, 0.5);

var futureOrbitPath = new WorldWind.Path(futureOrbit);
futureOrbitPath.useSurfaceShapeFor2D = true;
futureOrbitPath.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
futureOrbitPath.attributes = pathAttributes;

var orbitLayer = new WorldWind.RenderableLayer("Orbit");

orbitLayer.addRenderable(pastOrbitPath);
orbitLayer.addRenderable(futureOrbitPath);

// Satellite
var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
placemarkAttributes.imageSource = "resources/icons/space-station.png";
placemarkAttributes.imageScale = 1;
placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 0.5);
placemarkAttributes.imageColor = WorldWind.Color.WHITE;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.5);
placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;

var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
highlightPlacemarkAttributes.imageScale = 1.2;

var satelliteLayer = new WorldWind.RenderableLayer("Satellite");

var placemark = new WorldWind.Placemark(currentPosition);
updateLatitudeLongitudeAltitude(currentPosition);

placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
placemark.label = "Lunar Gateway";
placemark.attributes = placemarkAttributes;
placemark.highlightAttributes = highlightPlacemarkAttributes;

satelliteLayer.addRenderable(placemark);

// Update WorldWindow
var wwd = new WorldWind.WorldWindow("wwd");
wwd.drawContext.clearColor = WorldWind.Color.colorFromBytes(0,0,0,0);
wwd.addLayer(bmngOneImageLayer);
wwd.addLayer(bmngLayer);
// wwd.addLayer(atmosphereLayer);
wwd.addLayer(starfieldLayer);
wwd.addLayer(groundStationsLayer);
wwd.addLayer(orbitLayer);
wwd.addLayer(satelliteLayer);

// Assign current date and time to these layers to enable Earth's night-side effects.
starfieldLayer.time = now;
atmosphereLayer.time = now;

// Responsive altitude for mobile devices
if (screen.width > 900 ) {
  wwd.navigator.range = 4e7;
} else {
  wwd.navigator.range = 1e7;
}

// Call this after you create the WorldWindow, e.g. after:
//   var wwd = new WorldWind.WorldWindow("canvasOne");
async function useMoonWmsAsBase(wwd, {
  service = "https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map",
  layerName = "LROC_WAC",           // you can also try "LRO_WAC_GLOBAL" on some mirrors
  version = "1.3.0",
  title = "Moon (LROC WAC, USGS)"
} = {}) {
  // 1) Try to retrieve WMS capabilities and construct the layer the "WebWW way".
  try {
    const caps = await WorldWind.WmsLayerCapabilities.retrieve(service);
    const named = caps.getNamedLayer(layerName);
    if (!named) {
      console.warn(`WMS layer "${layerName}" not found in capabilities; falling back to manual config.`);
      throw new Error("Missing named layer");
    }

    // Build a config object from the capabilities and tweak a few things.
    const cfg = WorldWind.WmsLayer.formLayerConfiguration(named);
    cfg.title = title;
    cfg.version = version;
    // Ensure full coverage & sane tile pyramid on a simple cyl dataset.
    cfg.sector = WorldWind.Sector.FULL_SPHERE;
    cfg.levelZeroDelta = new WorldWind.Location(36, 36);
    cfg.numLevels = Math.max(cfg.numLevels || 8, 8);
    cfg.size = 256;
    cfg.coordinateSystem = cfg.coordinateSystem || "EPSG:4326";
    cfg.transparent = false;  // opaque basemap

    const moonLayer = new WorldWind.WmsLayer(cfg);
    moonLayer.enabled = true;

    // 2) Disable the usual terrestrial basemaps so the Moon imagery is visible.
    for (const L of wwd.layers) {
      // Typical stock base imagery layers to hide:
      if (
        L instanceof WorldWind.BMNGLayer ||
        L instanceof WorldWind.BMNGLandsatLayer ||
        L.displayName?.toLowerCase().includes("bing") ||
        L.displayName?.toLowerCase().includes("blue marble") ||
        L.displayName?.toLowerCase().includes("landsat")
      ) {
        L.enabled = false;
      }
    }

    // 3) Add the lunar WMS imagery as the new base.
    wwd.addLayer(moonLayer);

    // 4) Redraw.
    wwd.redraw();
    console.log("Moon WMS basemap enabled:", title);
    return;
  } catch (e) {
    // If capabilities fetch fails (network/CORS), do a manual WMS layer.
    console.warn("Falling back to manual WMS layer:", e);

    const manualCfg = {
      title,
      service,
      layerNames: layerName,
      version,
      sector: WorldWind.Sector.FULL_SPHERE,
      levelZeroDelta: new WorldWind.Location(36, 36),
      numLevels: 8,
      size: 256,
      imageFormat: "image/png",
      coordinateSystem: "EPSG:4326",
      transparent: false
    };

    // WmsLayer also accepts a plain config object:
    const moonLayer = new WorldWind.WmsLayer(manualCfg);
    moonLayer.enabled = true;

    for (const L of wwd.layers) {
      if (
        L instanceof WorldWind.BMNGLayer ||
        L instanceof WorldWind.BMNGLandsatLayer ||
        L.displayName?.toLowerCase().includes("bing") ||
        L.displayName?.toLowerCase().includes("blue marble") ||
        L.displayName?.toLowerCase().includes("landsat")
      ) {
        L.enabled = false;
      }
    }

    wwd.addLayer(moonLayer);
    wwd.redraw();
  }
}

// Example usage (after your WorldWindow is constructed):
// var wwd = new WorldWind.WorldWindow("canvasOne");
// ... your existing code ...
useMoonWmsAsBase(wwd, {
  service: "https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map",
  layerName: "LROC_WAC",
  version: "1.3.0",
  title: "Moon (LROC WAC, USGS)"
});

function switchEllipsoidToEarth(wwd) {
  const g = wwd.globe;
  if (!g) return;
  g.equatorialRadius = 6378137.0;     // WGS-84 a
  g.polarRadius = 6356752.3142;       // WGS-84 b
  const f = 1.0 / 298.257223563;      // WGS-84 flattening
  g.eccentricitySquared = (2 * f) - (f * f);

  // Restore a normal elevation model if you want:
  // g.elevationModel = new WorldWind.EarthElevationModel(); // if available in your build

  if (wwd.navigator) {
    const nav = wwd.navigator;
    if (typeof nav.range === "number") {
      nav.range = 3.0 * g.equatorialRadius;
      nav.minRange = 10.0;
      nav.maxRange = 20.0 * g.equatorialRadius;
    }
    if (typeof nav.altitude === "number") {
      nav.altitude = 2.0e6;
      nav.minAltitude = 10.0;
      nav.maxAltitude = 2.0e7;
    }
  }
  wwd.redraw();
}


// Globe
var globe = wwd.globe;

// Map
var map = new WorldWind.Globe2D();
map.projection = new WorldWind.ProjectionEquirectangular();

// Navigation
wwd.navigator.lookAtLocation = new WorldWind.Location(currentPosition.latitude,
                                                      currentPosition.longitude);

// Refresh WorldWindow to reflect changes so far
wwd.redraw();

// Update Satellite Position
var follow = false;
window.setInterval(function() {
    var position = getPosition(satrec, new Date());
    currentPosition.latitude = position.latitude;
    currentPosition.longitude = position.longitude;
    currentPosition.altitude = position.altitude;

    updateLatitudeLongitudeAltitude(currentPosition);

    if(follow) {
        toCurrentPosition();
    }

    wwd.redraw();
}, 5000);

function toCurrentPosition() {
    wwd.navigator.lookAtLocation.latitude = currentPosition.latitude;
    wwd.navigator.lookAtLocation.longitude = currentPosition.longitude;
}

// Follow Satellite
var emptyFunction = function(e) {};
var regularHandlePanOrDrag = wwd.navigator.handlePanOrDrag;
var regularHandleSecondaryDrag = wwd.navigator.handleSecondaryDrag;
var regularHandleTilt = wwd.navigator.handleTilt;
var followPlaceholder = document.getElementById('follow');
function toggleFollow() {
    follow = !follow;
    if(follow) {
        followPlaceholder.textContent = 'On';
        wwd.navigator.handlePanOrDrag = emptyFunction;
        wwd.navigator.handleSecondaryDrag = emptyFunction;
        wwd.navigator.handleTilt = emptyFunction;
    } else {
        followPlaceholder.textContent = 'Off';
        wwd.navigator.handlePanOrDrag = regularHandlePanOrDrag;
        wwd.navigator.handleSecondaryDrag = regularHandleSecondaryDrag;
        wwd.navigator.handleTilt = regularHandleTilt;
    }
    toCurrentPosition();
    wwd.redraw();
}

// Update Globe Representation
var representationPlaceholder = document.getElementById('representation');
function toggleRepresentation() {
    if(wwd.globe instanceof WorldWind.Globe2D) {
        wwd.globe = globe;
        representationPlaceholder.textContent = '3D';
    } else {
        wwd.globe = map;
        representationPlaceholder.textContent = '2D';
    }

    wwd.redraw();
}

// Help
function openHelp() {
    alert("This tool shows the current location of the ISS and some ground stations. An orbit in the past (red) and one in the future (green) are also displayed.\n\nRepresentation: 3D or 2D\nFollow: On or Off. When on, the position is locked on the satellite, but zooming in and out is still possible.");
}

// Convert degrees to text
function degreesToText(deg, letters) {
    var letter;
    if(deg < 0) {
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
