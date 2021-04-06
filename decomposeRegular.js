const beginPair = (tiles) => {
  if (tiles[0] === tiles[1]) {
    return { head: tiles[0], tiles: tiles.slice(2) }
  } else {
    return { head: false, tiles: tiles }
  }
}

const beginChi = (tiles) => {
  let t1 = tiles[0]
  let n = t1 % 10
  if (t1 >= 30 || n >= 8) {
    return { chi: false, tiles: tiles }
  }
  let t2 = t1 + 1
  let t3 = t1 + 2
  if (tiles.includes(t2) && tiles.includes(t3)) {
    for( var i = 0; i < tiles.length; i++) { 
      if ( tiles[i] === t1) {  
        tiles.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tiles.length; i++) { 
      if ( tiles[i] === t2) {  
        tiles.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tiles.length; i++) { 
      if ( tiles[i] === t3) {  
        tiles.splice(i, 1); 
        break
      }
    }
    // tiles.remove(t1)
    // tiles.remove(t2)
    // tiles.remove(t3)
    return { chi: t1, tiles: tiles }
  } else {
    return { chi: false, tiles: tiles }
  }
}

const beginPon = (tiles) => {
  if (tiles.length >= 3 && tiles[0] === tiles[1] && tiles[0] === tiles[2]) {
    return { pon: tiles[0] ,tiles: tiles.slice(3) }
  } else {
    return { pon: false, tiles: tiles }
  }
}

const decomposeRegular = (tiles) => {
  let chis = []
  let pons = []
  let heads = []
  
  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < 4; i++) { // 4번 실행?
      var { chi, tiles } = beginChi(tiles)
      if (chi) {
        chis.push(chi)
      }
      var { pon, tiles } = beginPon(tiles)
      if (pon) {
        pons.push(pon)
      }
    }
      
    var { head, tiles } = beginPair(tiles)
    if (head) {
      heads.push(head)
    }
  }
  
  if (tiles.length === 0 ) {
    return { heads, chis, pons }
  } else {
    return { heads: 'cannot decompose', chis: 'cannot decompose', pons: 'cannot decompose'} // not regular
  }
}

module.exports = { decomposeRegular }