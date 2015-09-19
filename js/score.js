'use strict';

function initSection(sid) {
  if (sid == 'P') {
    return {
      "Sid" : sid,
      "Tscore" : { "A" : 0, "K" : 0, "X" : 0 , "TM": 0 },
      "R" : [
        {
          "Rid" : '1',
          "Rscore" : { "A" : 0, "K" : 0, "X" : 0 , "TM": 0 },
          "S" : 0,
          "G" : [
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 }
          ]
        },
        {
          "Rid" : '2',
          "Rscore" : { "A" : 0, "K" : 0, "X" : 0 , "TM": 0 },
          "S" : 0,
          "G" : [
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 }
          ]
        }
      ]
    };
  } else if (sid == 'F'){
    return {
      "Sid" : sid,
      "Tscore" : { "A" : 0, "K" : 0, "X" : 0 , "TM": 0 },
      "R" : [
        {
          "Rid" : 'F',
          "Rscore" : { "A" : 0, "K" : 0, "X" : 0 , "TM": 0 },
          "S" : 0,
          "G" : [
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 },
            { "PB" : 0, "B1" : -1, "B2" : -1, "B3" : -1, "GP" : 0, "OP" : 0, "RB" : 0, "SP": 0, "TM": 0, "BO": 0, "BS" : 0 }
          ]
        }
      ]
    };
  }
  return null;
}


function getScore(val) {
  return isNaN(parseInt(val)) ? 0 : parseInt(val);
}

function getBscore(val) {
  return val < 0 ? 0 : val;
}

function getScoreStr(val, prevVal) {
  if (val < 0) {
    return '-';
  }
  if (prevVal == null || prevVal == 10) {
    if (val == 10) {
      return 'X';
    } else {
      return val;
    }
  } else {
    if ((val + prevVal) == 10) {
      return '/';
    } else if (val == 10) {
      return 'X';
    } else {
      return val;
    }
  }
}

function getGameAScore(game) {
  return Math.max(game.PB + getBscore(game.B1) + getBscore(game.B2) + getBscore(game.B3) + game.BO + game.GP + game.OP + game.RB + game.SP, 0);
}

function getGameKScore(game) {
  return getBscore(game.B1) + getBscore(game.B2) + getBscore(game.B3) + game.BO;
}

function getGameKScoreStr(game) {
  return game.BS > 0 ? getGameKScore(game) : '-';
}

function getGameXScore(game) {
  return ((getBscore(game.B1) == 10) ? 10 : 0 ) + ((getBscore(game.B2) == 10) ? 10 : 0 ) + ((getBscore(game.B3) == 10) ? 10 : 0 );
}

function calBO(currG, nextG, nextnextG) {
  if (nextG == null) {
    if (currG.B1 < 0 || currG.B2 < 0 || ((getBscore(currG.B1) + getBscore(currG.B2) >= 10) && currG.B3 < 0)) {
      currG.BS = 0;
    } else {
      currG.BS = 1;
    }
  } else {
    var cnt = 0;
    currG.BS = ((currG.B1 > -1 && currG.B2 > -1) || currG.B1 == 10) ? 1 : 0;
    currG.BO = 0;
    if (getBscore(currG.B1) == 10) {
      cnt = 2;
    } else if ((getBscore(currG.B1) + getBscore(currG.B2)) == 10) {
      cnt = 1;
    }
    if (cnt > 0) {
      currG.BO += getBscore(nextG.B1);
      currG.BS = nextG.B1 < 0 ? 0 : currG.BS;
      cnt--;
/*      if (!(nextG.B1 == 10 && nextnextG != null)) {
        cnt--;
      }*/
    }
    if (cnt > 0 && (nextG.B1 < 10 || nextnextG == null)) {
      currG.BO += getBscore(nextG.B2);
      currG.BS = nextG.B2 < 0 ? 0 : currG.BS;
      cnt--;
    }
    if (cnt > 0) {
      currG.BO += getBscore(nextnextG.B1);
      currG.BS = nextnextG.B1 < 0 ? 0 : currG.BS;
    }   
  }
}