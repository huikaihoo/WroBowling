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
  var val = lStorage.get('activeSection');
  if (val) {
    return val;
  } else {
    setActiveSection('P');
    return 'P';
  }
}

function setActiveSection(val) {
  lStorage.set('activeSection', val);
}

function loadRec(sid) {
  console.log('loadRec');
  if (sid != 'Arch') {
    var val = lStorage.get('sharedRec-' + sid);
    if (val) {
      rec = val;
    } else {
      rec = initSection(sid);
      saveRec();
    }
  }
  console.log(JSON.stringify(rec)); 
}

function saveRec() {
  console.log('saveRec');
  if (rec) {
    lStorage.set('sharedRec-' + rec.Sid, rec);
  }
}