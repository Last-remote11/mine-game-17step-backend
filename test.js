const e = require("cors")

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const checkDora = (tiles, dora, uradora) => { 
  // ※도라가 아닌 도라표시패가 들어옴
  // 뒷도라는 어차피 안보이니까 그냥계산?
  dora++
  dora === 10 ? dora = 1 : true
  dora === 20 ? dora = 11 : true
  dora === 30 ? dora = 21 : true
  dora === 35 ? dora = 31 : true
  dora === 38 ? dora = 35 : true

  let count = 0;
  for(var i = 0; i < tiles.length; ++i){
    if (tiles[i] == dora) {
      count++;
    }
    if (tiles[i] == uradora) {
      count++;
    }
  }
  return count
}

// console.log(checkDora([1,2,3,4,5,6,35], 9, 35))

const ROYAL = [1, 9, 11, 19, 21, 29, 31, 32, 33, 34, 35, 36, 37]
const JunROYAL = [1, 9, 11, 19, 21, 29]
const DRAGONS = [35, 36, 37]
const WINDS = [31, 32, 33, 34]
const GREENS = [22, 23, 24, 26, 28, 36]

const chuurenGroup = [
  [1,1,1,1,2,3,4,5,6,7,8,9,9,9],
  [1,1,1,2,2,3,4,5,6,7,8,9,9,9],
  [1,1,1,2,3,3,4,5,6,7,8,9,9,9],
  [1,1,1,2,3,4,4,5,6,7,8,9,9,9],
  [1,1,1,2,3,4,5,5,6,7,8,9,9,9],
  [1,1,1,2,3,4,5,6,6,7,8,9,9,9],
  [1,1,1,2,3,4,5,6,7,7,8,9,9,9],
  [1,1,1,2,3,4,5,6,7,8,8,9,9,9],
  [1,1,1,2,3,4,5,6,7,8,9,9,9,9]
]


const pinfu = (heads, chis, ronCard) => {
  if (chis.length === 4 
    && !chis.some((chi) => [ronCard].includes(chi+1))
    && heads[0] !== ronCard
    ) {
    return 'pinfu'
  }
  return null
}

const iipeiko = (chis) => {
  let setChis = new Set(chis)
  let tempArr = [...setChis]
  if (tempArr.length === chis.length - 1) {
    return 'iipeiko'
  }
  return null
}

const tanyao = ( heads, chis, pons ) => {
  if (
     !ROYAL.includes(heads[0])
  && !chis.some((chi) => [1,11,21,7,17,27].includes(chi))
  && !pons.some((pon) => ROYAL.includes(pon))
  ) { return 'tanyao' }
  return null
}

const sanshokudojun = ( chis ) => {
  if (chis.length >= 3) {
    let number = chis.map(chi => chi % 10)
    number.sort()
    if (number[0] === number[1] && number[1] === number[2]) {
      return 'sanshokudojun'
    } 
    if (number[1] === number[2] && number[2] === number[3]) {
      return 'sanshokudojun'
    } 
  }
  return null
}

const sanshokudoko = ( pons ) => {
  if (pons.length >= 3) {
    let number = pons.map(chi => chi % 10)
    number.sort()
    if (number[0] === number[1] && number[1] === number[2]) {
      return 'sanshokudoko'
    } 
    if (number[1] === number[2] && number[2] === number[3]) {
      return 'sanshokudoko'
    } 
  }
  return null
}

const chanta = ( heads, chis, pons ) => {
  if (
    ROYAL.includes(heads[0])
 && chis.every((chi) => [1,11,21,7,17,27].includes(chi))
 && pons.every((pon) => ROYAL.includes(pon))
 ) { 
   if (JunROYAL.includes(heads[0]) && pons.every((pon) => JunROYAL.includes(pon))) { return 'junchan' }
   return 'chanta'
 }
 return null
}

const honroto = (heads, pons) => {
  if (
    pons.length === 4 &&
    pons.every((pon) => ROYAL.includes(pon)) &&
    ROYAL.includes(heads[0])
    ) {
      return 'honroto'
  }
  return null
}


const honitsu_chinitsu_tsuuiiso = (heads, chis, pons) => {
  let mix = heads.concat(chis.concat(pons))
  let mixDiv = mix.map(element => parseInt(element / 10))
  console.log(mixDiv)
  let mixSet = new Set(mixDiv)
  let tempArr = [...mixSet].sort()
  console.log(tempArr)
  if (tempArr.includes(3) && tempArr.length === 2) {
    return 'honitsu'
  }
  if (tempArr.length === 1) {
    if (tempArr[0] === 3) {
      return 'tsuuiiso'
    }
    return 'chinitsu'
  }
  return null
}

const sananko_suuanko = (heads, pons, ronCard) => {
  if (pons.length === 4) {
    if (ronCard === heads[0]) {
      return 'suuanko'
    }
    return 'sananko'
  }
  return null
}

const shosangen_daisangen = (heads, pons) => {
  let tempArr = heads.concat(pons)
  if (DRAGONS.every(e => tempArr.includes(e))) {
    if (DRAGONS.every(e => pons.includes(e))) {
      return 'daisangen'
    } return 'shosangen'
  }
  return null
}

const itsuu = ( chis ) => {// 1 4 7 or 11 14 17 or 21 24 27 
  if (
    [1,4,7].every(e => chis.includes(e)) ||
    [11,14,17].every(e => chis.includes(e)) ||
    [21,24,27].every(e => chis.includes(e))
    ) {
      return 'itsuu'
    }
  return null
}

const suushi = ( heads, pons ) => {
  let tempArr = heads.concat(pons)
  if (WINDS.every(wind => tempArr.includes(wind))) {
    if (WINDS.every(wind => pons.includes(wind))) {
      return 'daisuushi'
    } return 'suushi'
  }
  return null
}

const chinroto = ( heads, pons ) => {
  let tempArr = heads.concat(pons)
  if (
    pons.length === 4 &&
    tempArr.every(e => JunROYAL.includes(e))) {
    return 'chinroto'
  }
  return null
}

const ryuuiiso = ( heads, chis, pons ) => { // 23468삭, 발
  let tempArr = heads.concat(pons)
  if ( tempArr.every(e => GREENS.includes(e)) && pons.length === 4) {
    return 'ryuuiiso'
  } 
  if ( tempArr.every(e => GREENS.includes(e)) && pons.length === 3 && chis[0] === 22) {
    return 'ryuuiiso'
  }
  return null
}

const chuuren = (tiles, ronCard) => {
  if (tiles.some(tile => tile >= 30)) {
    return null
  }
  let tempSet = new Set (tiles.map(tile => parseInt(tile / 10)))
  if ([...tempSet].length != 1) { // 모두 한 종류의 수패
    return null
  }

  let tilesNumber = tiles.concat(ronCard).map(tile => tile % 10).sort()
  if (chuurenGroup.some(chuurenTile => arraysEqual(tilesNumber, chuurenTile))) {
    return 'chuuren'
  }
  return null
}


