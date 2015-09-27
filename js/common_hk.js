'use strict';
var lStorage = $.localStorage;

$.urlParam = function(name) {
    url = window.location.href;
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function getActiveSection() {
  return 'P';
}

function setActiveSection(val) {
  //lStorage.set('activeSection', val);
}

function loadRec(sid) {
  console.log('loadRec');
  if (sid != 'Arch') {
    rec = initSection(sid);
  }
  console.log(JSON.stringify(rec)); 
}

function saveRec() {
  console.log('saveRec');
}