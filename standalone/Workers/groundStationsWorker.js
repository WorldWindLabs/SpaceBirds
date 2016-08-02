"use strict"
self.addEventListener('message', onMessage);
self.addEventListener('error', onError);

function onError(e){
  console.log('worker says: Error on groundstation parser. I suck');
}

//Web Worker interface: onMessage
function onMessage(inputMessage){
  console.log('groundstations worker says message received: ' + inputMessage.data);
  //postMessage('Send this crap to main thread');
  if(inputMessage.data == 'close'){
    console.log('groundstations worker says: Im closing');
    self.close();
  }
  else{
    loadJSON('./../SatTracker/groundstations.json',
      function(data) {
        //console.log(data); //Getting the data alright
        self.postMessage(data); //Sending JSON object to the main thread

      },
      function(xhr) { console.error(xhr); }
    );
  }
}


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
