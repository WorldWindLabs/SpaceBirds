self.importScripts('./SatTracker/util/Satelite.js');
self.addEventListener('message', onMessage);
self.addEventListener('error', onError);

var orbitalBody = {
  pastOrbit: null,       //Calculated by satellite.js
  futureOrbit: null,     //Calculated by satellite.js
  objectName: null,      //from space-track.org json TLE
  tleLine1: null,        //from space-track.org json TLE
  tleLine2: null,        //from space-track.org json TLE
  intlDes: null,         //from space-track.org json TLE
  objectType: null,      //from space-track.org json TLE
  orbitalPeriod: null,   //from space-track.org json TLE
  currentPosition: null; //new WorldWind.position, calculated by satellite.js
  collada3dModel: null;  //path to collada 3D model, if any. If not found, randomize one.
  orbitType: null;       //LEO, MEO or GEO
}

var orbitalEnvironment = [];

function onError(e){
  console.log('on error inside satelliteWorker');
}

function onMessage(e){
  $.get('./SatTracker/allObjectsTLE.json', function(response){
    satData = response;

    var now = new Date();
    var everyPastOrbit = [];
    var everyFutureOrbit = [];
    var everyCurrentPosition = [];
    //var orbitTime = [];


    for (var j = 0; j < satNum; j += 1) {
        var pastOrbit = [];
        var futureOrbit = [];
        var currentPosition = null;
        for (var i = -98; i <= 98; i++) {
            var time = new Date(now.getTime() + i * 60000);
            // orbitTime[i] = new Date(now.getTime() + i * 60000);
            //console.log(orbitTime[i]);
            try {
                var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
            } catch (err) {
            }
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
                everyCurrentPosition[j] = currentPosition;
            }
        }
        everyPastOrbit[j] = pastOrbit;
        everyFutureOrbit[j] = futureOrbit;
    }

  }).done(function(){
    //TODO: Stuff after retrieving the .json file
  });
}
