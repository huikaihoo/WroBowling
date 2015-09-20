'use strict';
var rec;

function init() {
  rec = initSection('P');
  //$('.ui.dropdown').dropdown();
  $('.tabular.menu .item').tab();
  $('.pagination.menu a.item').on('click', paginationMenuHandler);
  $('.SP.input button').on('click', inputSPHandler);
  $('.SP.input input').on('keyup', inputSPHandler);
  $('.SP.input input').on('change', inputSPHandler);
  $('.menuAction.item').on('click', menuActionHandler);
}

function menuActionHandler()
{
  var target = $(this).data('target');
  console.log(target);

  // lock and unlock
  if ($(this).find('.icon').hasClass('unlock')) {
    $('#' + target).addClass('active');
    $(this).find('.icon').removeClass('unlock').addClass('lock');
  } else if ($(this).find('.icon').hasClass('lock')) {
     $('#' + target).removeClass('active');
    $(this).find('.icon').removeClass('lock').addClass('unlock'); 
  }

  // show and hide
  if ($(this).find('.icon').hasClass('minus')) {
    $('#' + target).transition('fade down')
    $(this).find('.icon').removeClass('minus').addClass('add');
  } else if ($(this).find('.icon').hasClass('add')) {
     $('#' + target).transition('fade down')
    $(this).find('.icon').removeClass('add').addClass('minus'); 
  }
}

function updateScore() {
  for (var i=0; i<rec.R.length; i++) {
    for (var j=0; j<rec.R[i].G.length; j++) {
      calBO(rec.R[i].G[j], rec.R[i].G[j+1], rec.R[i].G[j+2]);
    }
  }
  rec.Tscore.A = 0;
  rec.Tscore.K = 0;
  rec.Tscore.X = 0;
  for (var i=0; i<rec.R.length; i++) {
    rec.R[i].Rscore.A = rec.R[i].S;
    rec.R[i].Rscore.K = 0;
    rec.R[i].Rscore.X = 0;
    for (var j=0; j<rec.R[i].G.length; j++) {
      rec.R[i].Rscore.A += getGameAScore(rec.R[i].G[j]);
      rec.R[i].Rscore.K += getGameKScore(rec.R[i].G[j]);
      rec.R[i].Rscore.X += getGameXScore(rec.R[i].G[j]);
    }
    rec.Tscore.A += rec.R[i].Rscore.A;
    rec.Tscore.K += rec.R[i].Rscore.K;
    rec.Tscore.X += rec.R[i].Rscore.X;
  }
}

function updateUI() {
  //Pscore
  $('#Pscore').text('Total Score: ' + rec.Tscore.A);
  //PTM
  //Psummary
  {
    var cnt = 0;
    for (var i=0; i<rec.R.length; i++) {
      for (var j=0; j<rec.R[i].G.length; j++) {
        cnt++;
        $('#Psummary td:eq(' + cnt++ + ')').text(getGameAScore(rec.R[i].G[j]));
        $('#Psummary td:eq(' + cnt++ + ')').text(getGameKScore(rec.R[i].G[j]));
        $('#Psummary td:eq(' + cnt++ + ')').text(getGameXScore(rec.R[i].G[j]));
        $('#Psummary td:eq(' + cnt++ + ')').text('0:00');
      }
      cnt++;
      $('#Psummary td:eq(' + cnt++ + ')').text(rec.R[i].Rscore.A);
      $('#Psummary td:eq(' + cnt++ + ')').text(rec.R[i].Rscore.K);
      $('#Psummary td:eq(' + cnt++ + ')').text(rec.R[i].Rscore.X);
      $('#Psummary td:eq(' + cnt++ + ')').text('0:00');     
    }
    $('#Psummary tfoot th:eq(1)').text(rec.Tscore.A);
    $('#Psummary tfoot th:eq(2)').text(rec.Tscore.K);
    $('#Psummary tfoot th:eq(3)').text(rec.Tscore.X);
    $('#Psummary tfoot th:eq(4)').text('0:00'); 
  }

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
      $('#R' + rec.R[i].Rid + 'table td:eq(' + (cnt++) + ')').text(getScoreStr(rec.R[i].G[j].B2, getBscore(rec.R[i].G[j].B1)));
    }
    var prev = null;
    if (getBscore(rec.R[i].G[rec.R[i].G.length-1].B1) == 10) {
      prev = getBscore(rec.R[i].G[rec.R[i].G.length-1].B2);
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
      $('#R' + rec.R[i].Rid + 'G' + (j+1) + 'score span').text('Score: ' + getGameAScore(rec.R[i].G[j]));
    }
  }
}

function paginationMenuHandler() {
  if (!$(this).hasClass('disabled')){
    $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');

    var r = $(this).closest('.ui.menu').data('r');
    var g = $(this).closest('.ui.menu').data('g');
    var type = $(this).closest('.ui.menu').data('type');

    var i = isNaN(parseInt(r)) ? 0 : parseInt(r) - 1;
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
    console.log(JSON.stringify(rec));

    updateUI();
  }
}

function inputSPHandler() {
  var r = $(this).closest('.ui.input').data('r');
  var g = $(this).closest('.ui.input').data('g');
  var type = $(this).closest('.ui.input').data('type');

  var i = isNaN(parseInt(r)) ? 0 : parseInt(r) - 1;
  var j = parseInt(g) - 1;

  if (type == 'SP') {
    rec.R[i].G[j][type] = getScore($(this).closest('.ui.input').find('input').val()); 
  }
  else if (type == 'S') {
    rec.R[i][type] = getScore($(this).closest('.ui.input').find('input').val()); 
  }
  updateScore();
  console.log(JSON.stringify(rec));

  updateUI();
}