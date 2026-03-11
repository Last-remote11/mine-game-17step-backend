interface DecomposeResult {
  tilesCopy: number[];
  chis: number[];
  pons: number[];
  heads: number[];
}

interface DecomposeOutput {
  heads: number[] | string;
  chis: number[] | string;
  pons: number[] | string;
}

type DecomposeFunction = (tilesCopy: number[], chis: number[], pons: number[], heads: number[]) => DecomposeResult;

const beginPair: DecomposeFunction = (tilesCopy, chis, pons, heads) => {

  if (tilesCopy[0] === tilesCopy[1]) {
    heads.push(tilesCopy[0]);
    return { heads, tilesCopy: tilesCopy.slice(2), chis, pons };
  } else {
    return { tilesCopy, chis, pons, heads };
  }
};

const beginChi: DecomposeFunction = (tilesCopy, chis, pons, heads) => {
  var tempArr = [...tilesCopy];

  let t1 = tempArr[0];
  let n = t1 % 10;
  if (t1 >= 30 || n >= 8) {
    return { tilesCopy, chis, pons, heads };
  }
  let t2 = t1 + 1;
  let t3 = t1 + 2;
  if (tempArr.includes(t2) && tempArr.includes(t3)) {
    for(var i = 0; i < tempArr.length; i++) {
      if (tempArr[i] === t1) {
        tempArr.splice(i, 1);
        break;
      }
    }
    for( var i = 0; i < tempArr.length; i++) {
      if (tempArr[i] === t2) {
        tempArr.splice(i, 1);
        break;
      }
    }
    for( var i = 0; i < tempArr.length; i++) {
      if ( tempArr[i] === t3) {
        tempArr.splice(i, 1);
        break;
      }
    }
    chis.push(t1);
    return { tilesCopy: tempArr, chis, pons, heads };
  } else {
    return { tilesCopy, chis, pons, heads };
  }
};

const beginPon: DecomposeFunction = (tilesCopy, chis, pons, heads) => {
  if (tilesCopy.length >= 3 && tilesCopy[0] === tilesCopy[1] && tilesCopy[0] === tilesCopy[2]) {
    pons.push(tilesCopy[0]);
    return { tilesCopy: tilesCopy.slice(3), chis, pons, heads };
  } else {
    return { tilesCopy, chis, pons, heads };
  }
};

const chiPonPair: DecomposeFunction[] = [beginChi, beginPon, beginPair];

const dfs = (tilesCopy: number[], queue: DecomposeFunction[], depth: number, chis: number[] = [], pons: number[] = [], heads: number[] = []): DecomposeResult | undefined => {
  var initialTiles = [...tilesCopy];

  for (const decom of chiPonPair) {
    if (decom === beginPair && queue.includes(beginPair)) {
      continue;
    }
    if (depth === 4) {
      if (!queue.includes(beginPair) && decom !== beginPair) {
        continue;
      }
      for (const i of queue.concat([decom])) {
        var result = i(tilesCopy, chis, pons, heads);
        tilesCopy = result.tilesCopy;
        chis = result.chis;
        pons = result.pons;
        heads = result.heads;
      }
      if (chis.length + pons.length + heads.length === 5 && heads.length === 1) { // decompose 성공
        return { tilesCopy, heads, chis, pons };
      } else {
        tilesCopy = initialTiles;
        chis = [];
        pons = [];
        heads = [];
      }

    } else {
      return dfs(tilesCopy, queue.concat([beginChi]), depth+1)
      || dfs(tilesCopy, queue.concat([beginPon]), depth+1)
      || dfs(tilesCopy, queue.concat([beginPair]), depth+1);
    }
  }
};

var total = 0;

export const decomposeRegular = (tiles: number[]): DecomposeOutput => {
  tiles.sort();
  var tilesCopy = [...tiles];

  try {
    var result = dfs(tilesCopy, [], 0);
    if (result) {
      var heads = result.heads;
      var chis = result.chis;
      var pons = result.pons;
    } else {
      var heads: number[] = [];
      var chis: number[] = [];
      var pons: number[] = [];
    }
  } catch(e) {
    var heads: number[] = [];
    var chis: number[] = [];
    var pons: number[] = [];
  }

  if (heads.length === 1) {
    return { heads, chis, pons };
  } else {
    return { heads: 'cannot decompose', chis: 'cannot decompose', pons: 'cannot decompose' }; // not regular
  }
};
