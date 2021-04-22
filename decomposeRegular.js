const beginPair = (tilesCopy, chis, pons, heads) => {
  
  if (tilesCopy[0] === tilesCopy[1]) {
    heads.push(tilesCopy[0])
    return { heads, tilesCopy: tilesCopy.slice(2), chis, pons }
  } else {
    return { tilesCopy, chis, pons, heads }
  }
}

const beginChi = (tilesCopy, chis, pons, heads) => {
  var tempArr = [...tilesCopy]

  let t1 = tempArr[0]
  let n = t1 % 10
  if (t1 >= 30 || n >= 8) {
    return { tilesCopy, chis, pons, heads }
  }
  let t2 = t1 + 1
  let t3 = t1 + 2
  if (tempArr.includes(t2) && tempArr.includes(t3)) {
    for(var i = 0; i < tempArr.length; i++) { 
      if (tempArr[i] === t1) {  
        tempArr.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tempArr.length; i++) { 
      if (tempArr[i] === t2) {  
        tempArr.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tempArr.length; i++) { 
      if ( tempArr[i] === t3) {  
        tempArr.splice(i, 1); 
        break
      }
    }
    chis.push(t1)
    return { tilesCopy: tempArr, chis, pons, heads }
  } else {
    return { tilesCopy, chis, pons, heads }
  }
}

const beginPon = (tilesCopy, chis, pons, heads) => {
  if (tilesCopy.length >= 3 && tilesCopy[0] === tilesCopy[1] && tilesCopy[0] === tilesCopy[2]) {
    pons.push(tilesCopy[0])
    return { tilesCopy: tilesCopy.slice(3), chis, pons, heads }
  } else {
    return { tilesCopy, chis, pons, heads }
  }
}

const chiPonPair = [beginChi, beginPon, beginPair]

const dfs = (tilesCopy, queue, depth, chis=[], pons=[],heads=[]) => {
  var initialTiles = [...tilesCopy]

  for (decom of chiPonPair) {
    if (decom === beginPair && queue.includes(beginPair)) {
      continue
    }
    if (depth === 4) {
      if (!queue.includes(beginPair) && decom !== beginPair) {
        continue
      }
      for (i of queue.concat([decom])) {
        var {tilesCopy, chis, pons, heads} = i(tilesCopy, chis, pons, heads)
      }
      if (chis.length + pons.length + heads.length === 5) { // decompose 성공
        return { tilesCopy, heads, chis, pons }
      } else {
        tilesCopy = initialTiles
        chis = []
        pons = []
        heads = []
      }
  
    } else {
      return dfs(tilesCopy, queue.concat([beginChi]), depth+1)
      || dfs(tilesCopy, queue.concat([beginPon]), depth+1)
      || dfs(tilesCopy, queue.concat([beginPair]), depth+1)
    }
  }
}

var total = 0

const decomposeRegular = (tiles) => {
  tiles.sort()
  var tilesCopy = [...tiles]

  try {
    var { tilesCopy, chis, pons, heads } = dfs(tilesCopy, [], 0)
  } catch {
    var tilesCopy = 'cannot decompose'
    var heads = []
  }

  if (heads.length === 1) {
    return { heads, chis, pons }
  } else {
    return { heads: 'cannot decompose', chis: 'cannot decompose', pons: 'cannot decompose'} // not regular
  }
}

module.exports = { decomposeRegular }