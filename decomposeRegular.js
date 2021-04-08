const beginPair = (tilesCopy) => {
  
  if (tilesCopy[0] === tilesCopy[1]) {
    return { head: tilesCopy[0], tilesCopy: tilesCopy.slice(2) }
  } else {
    return { head: false, tilesCopy: tilesCopy }
  }
}

const beginChi = (tilesCopy) => {
  let t1 = tilesCopy[0]
  let n = t1 % 10
  if (t1 >= 30 || n >= 8) {
    return { chi: false, tilesCopy: tilesCopy }
  }
  let t2 = t1 + 1
  let t3 = t1 + 2
  if (tilesCopy.includes(t2) && tilesCopy.includes(t3)) {
    for( var i = 0; i < tilesCopy.length; i++) { 
      if ( tilesCopy[i] === t1) {  
        tilesCopy.splice(i, 1); 
        break
      }
    }
    for( var i = 0; i < tilesCopy.length; i++) { 
      if ( tilesCopy[i] === t2) {  
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
    // tilesCopy.remove(t1)
    // tilesCopy.remove(t2)
    // tilesCopy.remove(t3)
    return { chi: t1, tilesCopy: tilesCopy }
  } else {
    return { chi: false, tilesCopy: tilesCopy }
  }
}

const beginPon = (tilesCopy) => {
  if (tilesCopy.length >= 3 && tilesCopy[0] === tilesCopy[1] && tilesCopy[0] === tilesCopy[2]) {
    return { pon: tilesCopy[0] ,tilesCopy: tilesCopy.slice(3) }
  } else {
    return { pon: false, tilesCopy: tilesCopy }
  }
}

const decomposeRegular = (tiles) => {
  var tilesCopy = [...tiles]
  let chis = []
  let pons = []
  let heads = []
  
  for (var j = 0; j < 6; j++) {
    for (var i = 0; i < 4; i++) { // 4번 실행?
      var { chi, tilesCopy } = beginChi(tilesCopy)
      if (chi) {
        chis.push(chi)
      }
    }
    for (var k = 0; k < 4; k++) {
      var { pon, tilesCopy } = beginPon(tilesCopy)
      if (pon) {
        pons.push(pon)
      }
    }
    
      
    var { head, tilesCopy } = beginPair(tilesCopy)
    if (head) {
      heads.push(head)
    }
  }
  
  if (tilesCopy.length === 0 ) {
    return { heads, chis, pons }
  } else {
    return { heads: 'cannot decompose', chis: 'cannot decompose', pons: 'cannot decompose'} // not regular
  }
}

module.exports = { decomposeRegular }

console.log(decomposeRegular([6,7,8,16,16,17,17,18,18,26,26,26,27,28]))