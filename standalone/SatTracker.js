"use strict"
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

var orbitalEnvironment = {};
