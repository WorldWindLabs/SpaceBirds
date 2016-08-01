"use strict"
self.importScripts('./SatTracker/util/Satellite.js');
self.addEventListener('message', onMessage);
self.addEventListener('error', onError);

var satellites;

function onError(e){
  console.log('on error inside satelliteWorker');
}

//Web Worker interface: onMessage
function onMessage(e){
  $.get('./SatTracker/allObjectsTLE.json', function(response){
    satellites = JSON.parse(text);
  }).done(function(){
    //TODO: Stuff after retrieving the .json file
    console.log('TLE data parsed by worker.');
    postmessage(satellites);
  });
}
