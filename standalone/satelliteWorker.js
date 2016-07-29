"use strict"
self.importScripts('./SatTracker/util/Satellite.js');
self.addEventListener('message', onMessage);
self.addEventListener('error', onError);

var everyPastOrbit = [];
var everyFutureOrbit = [];
var everyCurrentPosition = [];
var everyOrbitalBody = [];

function allOrbits(){
  {
    this.orbitIndex: null,          //Has to correspond to satellite index
    this.pastOrbit: null,
    this.futureOrbit: null,
  }
}

function orbitalBody(){           //Abstraction of an orbital body
  this.objectName: null,          //from space-track.org json TLE
  this.tleLine1: null,            //from space-track.org json TLE
  this.tleLine2: null,            //from space-track.org json TLE
  this.intlDes: null,             //from space-track.org json TLE
  this.objectType: null,          //from space-track.org json TLE
  this.orbitalPeriod: null,       //from space-track.org json TLE
  this.currentPosition: null,     //Worldwind.position object
  this.collada3dModel: null;      //path to collada 3D model, if any. If not found, randomize model.
  this.orbitType: null;           //LEO, MEO or GEO
}

//Web Worker interface: onError
function onError(e){
  console.log('on error inside satelliteWorker');
}

//Web Worker interface: onMessage
function onMessage(e){
  $.get('./SatTracker/allObjectsTLE.json', function(response){
    orbitalCalculation(response);
  }).done(function(){
    //TODO: Stuff after retrieving the .json file

  });
}

function orbitalCalculation(satData){
  var now = new Date();
  var satNume = satData.length;

  for (var j = 0; j < satNum; j += 1) {
      var pastOrbit = [];
      var futureOrbit = [];
      var currentPosition = null;
      var myOrbitalBody = new orbitalBody();

      myOrbitalBody.pastOrbit =
      myOrbitalBody.futureOrbit =
      myOrbitalBody.objectName = satData[j].OBJECT_NAME;
      myOrbitalBody.tleLine1 = satData[j].TLE_LINE1;
      myOrbitalBody.tleLine2 = satData[j].TLE_LINE2;
      myOrbitalBody.intlDes = satData[j].INTLDES;
      myOrbitalBody.objectType = satData[j].OBJECT_TYPE;
      myOrbitalBody.orbitalPeriod = satData[j].PERIOD;
      myOrbitalBody.currentLatitude
      myOrbitalBody.currentLongitude
      myOrbitalBody.currentAltitude
      myOrbitalBody.collada3dModel =
      myOrbitalBody.orbitType =

      for (var i = -98; i <= 98; i++) {

          try {
              var position = getPosition(satellite.twoline2satrec(satData[j].TLE_LINE1, satData[j].TLE_LINE2), time);
          } catch (err) {
            console.log('Satellite ' + satData[j].OBJECT_NAME +  ' messes up twoline2satrec. Its TLE data is:');
            console.log(satData[j].TLE_LINE1);
            console.log(satData[j].TLE_LINE2);
            console.log('The error is ' + err);
            continue; //Skip this faulty satellite just because
          }
          //TODO: calculate time as a function of orbital period, to always show
          //two orbits regardless of altitude
          var time = new Date(now.getTime() + i * 60000);

          if (i < 0) {
            myOrbitalBody.pastOrbit.push(position);
          } else if (i > 0) {
            myOrbitalBody.futureOrbit.push(position);
          } else {
              currentPosition = new WorldWind.Position(position.latitude, position.longitude, position.altitude);
              myOrbitalBody.pastOrbit.push(position);
              futureOrbit.push(position);
              everyCurrentPosition[j] = currentPosition;
          }
      }
      everyPastOrbit[j] = pastOrbit;
      everyFutureOrbit[j] = futureOrbit;

  }

  return orbitalEnvironment;
}
