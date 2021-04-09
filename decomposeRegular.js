const beginPair = (tilesCopy, chis, pons, heads) => {
  
  if (tilesCopy[0] === tilesCopy[1]) {
    heads.push(tilesCopy[0])
    return { heads, tilesCopy: tilesCopy.slice(2) }
  } else {
    return { tilesCopy, chis, pons, heads }
  }
}

const beginChi = (tilesCopy, chis, pons, heads) => {
  let t1 = tilesCopy[0]
  let n = t1 % 10
  if (t1 >= 30 || n >= 8) {
    return { tilesCopy, chis, pons, heads }
  }
  let t2 = t1 + 1
  let t3 = t1 + 2
  if (tilesCopy.includes(t2) && tilesCopy.includes(t3)) {
    for(var i = 0; i < tilesCopy.length; i++) { 
      if (tilesCopy[i] === t1) {  
        tilesCopy.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tilesCopy.length; i++) { 
      if (tilesCopy[i] === t2) {  
        tilesCopy.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tilesCopy.length; i++) { 
      if ( tilesCopy[i] === t3) {  
        tilesCopy.splice(i, 1); 
        break
      }
    }
    chis.push(t1)
    return { tilesCopy, chis, pons, heads }
  } else {
    return { tilesCopy, chis, pons, heads }
  }
}

const beginPon = (tilesCopy, chis, pons, heads) => {
  if (tilesCopy.length >= 3 && tilesCopy[0] === tilesCopy[1] && tilesCopy[0] === tilesCopy[2]) {
    pons.push(tilesCopy[0])
    return { tilesCopy, chis, pons, heads }
  } else {
    return { tilesCopy, chis, pons, heads }
  }
}

const chiPonPair = [beginChi, beginPon, beginPair]

const dfs = (tilesCopy, queue, depth=0,chis=[], pons=[],heads=[]) => {
  let initialTiles = [...tilesCopy]
  for (decom of chiPonPair) {
    console.log(tilesCopy, total, 'depth', depth)
    if (depth === 5) {
      for (i of queue) {
        tilesCopy, chis, pons, heads = i(tilesCopy, chis, pons, heads)
      }
      if (tilesCopy.length === 0) {
        return { heads, chis, pons }
      } else {
        tilesCopy = initialTiles,
        chis = []
        pons = []
        heads = []
      }
    } else {
      
      dfs(tilesCopy, queue.concat([decom]), depth+1)
    }
  }
}
var total = 0

const decomposeRegular = (tiles) => {
  tiles.sort()
  var tilesCopy = [...tiles]


  var { tilesCopy, chis, pons, heads } = dfs(tilesCopy, [], 0)
  
  // for (var j = 0; j < 6; j++) {
  //   for (var i = 0; i < 4; i++) { // 4번 실행?
  //     var { chi, tilesCopy } = beginChi(tilesCopy)
  //     if (chi) {
  //       chis.push(chi)
  //       console.log('치')
  //     }
  //   }
  //   for (var k = 0; k < 4; k++) {
  //     var { pon, tilesCopy } = beginPon(tilesCopy)
  //     if (pon) {
  //       pons.push(pon)
  //       console.log('퐁')
  //     }
  //   }
    
      
  //   var { head, tilesCopy } = beginPair(tilesCopy)
  //   if (head) {
  //     heads.push(head)
  //   }
  // }
  
  if (heads.length !== 0) {
    return { heads, chis, pons }
  } else {
    return { heads: 'cannot decompose', chis: 'cannot decompose', pons: 'cannot decompose'} // not regular
  }
}

module.exports = { decomposeRegular }


console.log(decomposeRegular([1,2,3,4,5,6,7,8,9,12,13,14,3,3]))