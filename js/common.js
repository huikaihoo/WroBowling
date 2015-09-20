'use strict';
var isViewSection;

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

function getAcitveSection () {
  if (isViewSection) {
    return 'Arch';
  } else {
    var val = $.localStorage.get('activeSection');
    if (val == null) {
      setActiveSection('P');
    }
    return val == null ? 'P' : val;
  }
}

function setActiveSection (val) {
  if (!isViewSection) {
    $.localStorage.set('activeSection', val);
  }
}