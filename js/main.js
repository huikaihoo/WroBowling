'use strict';
var ls = $.localStorage;
var rec;

function init() {
  rec = initSection('P');
  $('.ui.dropdown').dropdown();
  $('.tabular.menu .item').tab();
  $('.pagination.menu a.item').on('click', paginationMenuHandler);
}

function updateScore() {
  for (var i=0; i<rec.R.length; i++) {
    for (var j=0; j<rec.R[i].G.length; j++) {
      calBO(rec.R[i].G[j], rec.R[i].G[j+1], rec.R[i].G[j+2]);
    }
  }
  for (var i=0; i<rec.R.length; i++) {
    rec.R[i].Rscore.A = 0;
    rec.R[i].Rscore.K = 0;
    rec.R[i].Rscore.X = 0;
    for (var j=0; j<rec.R[i].G.length; j++) {
      rec.R[i].Rscore.A += getGameAScore(rec.R[i].G[j]);
      rec.R[i].Rscore.K += getGameKScore(rec.R[i].G[j]);
      rec.R[i].Rscore.X += getGameXScore(rec.R[i].G[j]);
    }
  }
}

function updateUI() {
  //R1score
  for (var i=0; i<rec.R.length; i++) {
    $('#R' + rec.R[i].Rid + 'score span').text('Total Score: ' + rec.R[i].Rscore.A );
    $('#R' + rec.R[i].Rid + 'score .item').each( function(index) {
      if (index < rec.R[i].G.length) {
        $(this).text('Game #' + (index+1) + ': ' + getGameAScore(rec.R[i].G[index]));
      } else if (index == rec.R[i].G.length) {
        $(this).text('Total Knocked: ' + rec.R[i].Rscore.K );
      } else if (index == rec.R[i].G.length + 1) {
        $(this).text('Total Strike: ' + rec.R[i].Rscore.X );
      }
    });
  }
  //R1TM
  //R1table
  for (var i=0; i<rec.R.length; i++) {
    var cnt = 0;
    for (var j=0; j<rec.R[i].G.length; j++) {
      $('#R' + rec.R[i].Rid + 'table td:eq(' + (cnt++) + ')').text(getScoreStr(rec.R[i].G[j].B1));
      $('#R' + rec.R[i].Rid + 'table td:eq(' + (cnt++) + ')').text(getScoreStr(rec.R[i].G[j].B2, getScore(rec.R[i].G[j].B1)));
    }
    var prev = null;
    if (getScore(rec.R[i].G[rec.R[i].G.length-1].B1) == 10) {
      prev = getScore(rec.R[i].G[rec.R[i].G.length-1].B2);
    } 
    $('#R' + rec.R[i].Rid + 'table td:eq(' + (cnt++) + ')').text(getScoreStr(rec.R[i].G[rec.R[i].G.length-1].B3, prev));
    for (var j=0; j<rec.R[i].G.length; j++) {
      $('#R' + rec.R[i].Rid + 'table td:eq(' + (cnt++) + ')').text(getGameKScoreStr(rec.R[i].G[j]));
    }
  }
  //R1G1TM
  //R1G1score
  for (var i=0; i<rec.R.length; i++) {
    for (var j=0; j<rec.R[i].G.length; j++) {
      $('#R' + rec.R[i].Rid + 'G' + (j+1) + 'score').text('Score: ' + getGameAScore(rec.R[0].G[j]));
    }
  }
}

function paginationMenuHandler() {
  if (!$(this).hasClass('disabled')){
    $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');

    var r = $(this).closest('.ui.menu').data('r');
    var g = $(this).closest('.ui.menu').data('g');
    var type = $(this).closest('.ui.menu').data('type');

    var i = (parseInt(r) == 'NaN') ? 0 : parseInt(r) - 1;
    var j = parseInt(g) - 1;

    if ($(this).text() == '--') {
      rec.R[i].G[j][type] = -1;
    } else {
      rec.R[i].G[j][type] = parseInt($(this).text());
    }

    // Handle Last Game
    if (parseInt(g) == rec.R[i].G.length) {
      // Special Handle B2 when B1 == 10 
      if (rec.R[i].G[j].B1 ==10) {
        $('#R'+r+'G'+g+'B2 .item').each( function(index) {
          $(this).removeClass('disabled');
        });
      }
      if ((rec.R[i].G[j].B1 == 10 && rec.R[i].G[j].B2 < 1) || (rec.R[i].G[j].B2 == 10) || (rec.R[i].G[j].B1 + rec.R[i].G[j].B2 == 10)) {
        // Enable whole B3
        $('#R'+r+'G'+g+'B3 .item').each( function(index) {
          $(this).removeClass('disabled');
        });        
      } else if (rec.R[i].G[j].B1 == 10) {
        // Enable B3 depends on B2
        var totalScore = parseInt($('#R'+r+'G'+g+'B3 .active.item').text()) + rec.R[i].G[j].B2;
        console.log(totalScore);
        $('#R'+r+'G'+g+'B3 .item').each( function(index) {
          if (totalScore > 10){
            if (index == 0) {
              $(this).addClass('active');
              rec.R[i].G[j].B3 = -1;
            } else {
              $(this).removeClass('active');
            }
          }
          if (parseInt($(this).text()) - (10 - rec.R[i].G[j].B2) > 0) {
            $(this).addClass('disabled');
          }else {
            $(this).removeClass('disabled');
          }
          //console.log( index + ": " + $(this).text() );
        });       
      } else {
        // Disable B3
        $('#R'+r+'G'+g+'B3 .item').each( function(index) {
          if (index == 0) {
            $(this).addClass('active');
            rec.R[i].G[j].B3 = -1;
          } else {
            $(this).removeClass('active');
            $(this).addClass('disabled');
          }
        });      
      }
    }

    if (type == 'B1') {
      // Handle B2 (except last game with B1 == 10)
      if (!(parseInt(g) == rec.R[i].G.length && rec.R[i].G[j][type]==10)) {
        var totalScore = parseInt($('#R'+r+'G'+g+'B2 .active.item').text()) + rec.R[i].G[j][type];
        console.log(totalScore);
        $('#R'+r+'G'+g+'B2 .item').each( function(index) {
          if (totalScore > 10){
            if (index == 0) {
              $(this).addClass('active');
              rec.R[i].G[j].B2 = -1;
            } else {
              $(this).removeClass('active');
            }
          }
          if ((parseInt($(this).text()) - (10 - rec.R[i].G[j][type]) > 0) || (rec.R[i].G[j][type]==10 && index > 0)) {
            $(this).addClass('disabled');
          }else {
            $(this).removeClass('disabled');
          }
          //console.log( index + ": " + $(this).text() );
        });
      }
    }

    updateScore();
    console.log(JSON.stringify(rec.R[i].G));

    updateUI();
  }
}