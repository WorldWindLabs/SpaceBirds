"use strict"
//importScripts('./../SatTracker/util/Satellite.js');
self.addEventListener('message', onMessage);
self.addEventListener('error', onError);

function onError(e){
  //console.log('worker says: Error on groundstation parser. I suck');
}

//Web Worker interface: onMessage
function onMessage(inputMessage){
  //console.log('Message received by ground stations worker: ' + inputMessage.data);
  if(inputMessage.data == 'close'){
    //console.log('Groundstations worker is closing');
    self.close();
  }
  else{
    loadJSON('./../data/groundstations.json',
      function(data) {
        self.postMessage(data); //Sending JSON object to the main thread
      },
      function(xhr) { console.error(xhr); }
    );
  }
}

//Reading json with pure JavaScript. No jQuery allowed in web workers (no DOM access).
function loadJSON(path, success, error){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}
