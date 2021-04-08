// [1, 2, 3, 11, 12, 13, 21, 22, 23, 30, 30, 31, 31]
// 1~9 만 11~19 통 21~29 삭 31~34 풍 35 36 37 백발중

const { decomposeRegular } = require('./decomposeRegular')

const SU = []

const WINDS = [31, 32, 33, 34] // 바람패

const DRAGONS = [35, 36, 37] // 삼원패

const ROYAL = [1, 9, 11, 19, 21, 29, 31, 32, 33, 34, 35, 36, 37]

const JunROYAL = [1, 9, 11, 19, 21, 29]

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

const YAKU = {
  'pinfu': 1, //v
  'iipeiko': 1, //v
  'ryanpeiko': 3,//v
  'tanyao': 1,//v
  'wind': 1,//v
  'haku': 1,//v
  'hatsu': 1,//v
  'chun': 1,//v
  'sanshokudojun': 2,//v
  'sanshokudoko': 2,//v
  'itsuu': 2, //v
  'chitoitsu': 2,//v
  'chanta': 2,//v
  'junchan': 3,//v
  'honroto': 2,//v
  'honitsu': 3,//v
  'chinitsu': 6,//v
  'toitoi': 2, // 울기가 없으므로 없음
  'sananko': 2, //v
  'shosangen': 2, //v
  'daisangen': 13, //v
  'kokushi': 13, //v
  'suuanko': 13, //v
  'suushi': 13,// 소/대사희 v
  'chinroto': 13,// 청노두 v
  'tsuuiiso': 13,// 자일색 v
  'ryuuiiso': 13,// 녹일색 v
  'chuuren': 13,// 구련
  'ippatsu': 1,
  'hotei': 1,
}


const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// 특수한 형태의 역 (decomposeRegular를 거치지 않음)
const kokushi = (tiles) => { // 국사무쌍
  const setOfTiles = new Set(tiles)
  const tempArr = [...setOfTiles]
  if (tempArr === ROYAL) {
    return 'kokushi'
  } else {
    return null
  }
}

const chuuren = (tiles, ronCard) => { // tiles는 14개의 완전한 패다?
  if (tiles.some(tile => tile >= 30)) {
    return null
  }
  let tempSet = new Set (tiles.map(tile => parseInt(tile / 10)))
  if ([...tempSet].length != 1) { // 모두 한 종류의 수패
    return null
  }

  let tilesNumber = tiles.map(tile => tile % 10).sort()
  if (chuurenGroup.some(chuurenTile => arraysEqual(tilesNumber, chuurenTile))) {
    return 'chuuren'
  }
  return null
}

const chitoitsu = (tiles) => {

  let tileNumbers = tiles.map(element => parseInt(element / 10))
  let setOfTilesArr = [...new Set(tiles)]

  let tileNumbersArr = [...new Set(tileNumbers)] // 그림종류


  for (var i = 0; i < 7; i++) { // 치또이츠
    if (tiles[i*2] === tiles[i*2 + 1]) {
      continue
    } else {
      return null
    }
  }

  if (setOfTilesArr.length !== 7) { // 깡 X
    return null
  }

  if (
    tileNumbersArr.length === 2 &&
    tileNumbersArr.includes(3)) {
      if (setOfTilesArr.every(e => ROYAL.includes(e))) {
        return 'chitoitsu_honitsu_chanta'
      }
      return 'chitoitsu_honitsu'
    }
  
  if (tileNumbersArr.length === 1) {
    if (tileNumbersArr.includes(3)) {
      return '7star'
    }
    if (!setOfTilesArr.some(e => ROYAL.includes(e))) {
      return 'grandWheel'
    }
    return 'chitoitsu_chinitsu'
  }

  if (setOfTilesArr.every(e => ROYAL.includes(e))) {
    return 'chitoitsu_chanta'
  }
  if (!setOfTilesArr.some(e => ROYAL.includes(e))) {
    return 'chitoitsu_tanyao'
  }

  return 'chitoitsu'
}

// **************************************************
// 일반적인 역(decompose 이후에 와야 함)

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

const ryanpeiko = (chis) => {
  if (chis.length === 4) {
    if (chis[0] === chis[1] && chis[2] === chis[3]) {
      return 'ryanpeiko'
    }
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


const haku = ( pons ) => {
  if (pons.includes(35)) {
    return 'haku'
  }
}
const hatsu = ( pons ) => {
  if (pons.includes(36)) {
    return 'hatsu'
  }
}
const chun = ( pons ) => {
  if (pons.includes(37)) {
    return 'chun'
  }
}

const sanshokudojun = ( chis ) => {
  if (chis.length >= 3) {
    let numberOfCard = chis.map(chi => chi % 10)
    numberOfCard.sort()
    if (
      numberOfCard[0] === numberOfCard[1] && numberOfCard[1] === numberOfCard[2] ||
      numberOfCard[1] === numberOfCard[2] && numberOfCard[2] === numberOfCard[3]) {
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
  let mixSet = new Set(mixDiv)
  let tempArr = [...mixSet].sort()
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
  if (
    pons.length === 3 &&
    pons.every(e => e !== ronCard)
    ) {return 'sananko'}
  return null
}

const shosangen_daisangen = (head, pons) => {
  let tempArr = head.concat(pons)
  if (DRAGONS.every(element => tempArr.includes(element))) {
    if (DRAGONS.every(element => pons.includes(element))) {
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

const suushi = ( heads, pons ) => { // 사희화
  let tempArr = heads.concat(pons)
  if (WINDS.every(wind => tempArr.includes(wind))) {
    if (WINDS.every(wind => pons.includes(wind))) {
      return 'daisuushi'
    } return 'suushi'
  }
  return null
}

const chinroto = ( heads, pons ) => { // 청노두
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



// ********************************************

const checkDora = (tiles, dora, uradora) => { 
  // ※도라가 아닌 도라표시패가 들어옴
  // 뒷도라는 어차피 안보이니까 그냥계산?
  dora++
  dora === 10 ? dora = 1 : true
  dora === 20 ? dora = 11 : true
  dora === 30 ? dora = 21 : true
  dora === 35 ? dora = 31 : true
  dora === 38 ? dora = 35 : true

  let doraCount = 0;
  let uradoraCount = 0
  for(var i = 0; i < tiles.length; i++){
    if (tiles[i] === dora) {
      doraCount++;
    }
    if (tiles[i] === uradora) {
      uradoraCount++;
    }
  }
  console.log('tiles', tiles,'dora',dora,'doracount',doraCount,'uradoraCount',uradoraCount)
  return { doraCount, uradoraCount }
  }




// ***********************************************************
// ***********************************************************

const checkYaku = ( tiles, ronCard, dora, uradora ) => { 
  // tiles는 14개의 배열을 받음
  // 역만이 하나라도 있으면 도라, 뒷도라 카운트 안함(그냥 0으로 반환)

  tiles.sort()

  let yakuNameArr = []
  let pan = 0
  let fu = 0
  let yakuman = 0
  var uradoraCount = 0

  if (kokushi(tiles) === 'kokushi') { // 어차피 다른 역만과 중첩 불가(단일 역의 더블역만 X)
    yakuman++
    yakuNameArr.push('국사무쌍')
    return { pan, fu, yakuman, yakuNameArr, uradoraCount }
  }

  switch (chitoitsu(tiles)) {
    case 'chitoitsu':
      pan += 2
      yakuNameArr.push('치또이쯔(칠대자)')
      break;
    case 'chitoitsu_tanyao':
      pan += 3
      yakuNameArr.push('치또이쯔(칠대자)')
      yakuNameArr.push('탕야오')
      break;
    case 'chitoitsu_honitsu':
      pan += 5
      yakuNameArr.push('치또이쯔(칠대자)')
      yakuNameArr.push('혼일색')
      break;
    case 'chitoitsu_chanta' :
      pan += 4
      yakuNameArr.push('치또이쯔(칠대자)')
      yakuNameArr.push('찬타(혼전대요구)')
      break;
    case 'chitoitsu_honitsu_chanta':
      pan += 7
      yakuNameArr.push('치또이쯔(칠대자)')
      yakuNameArr.push('혼일색')
      yakuNameArr.push('찬타(혼전대요구)')
      break;
    case 'cchitoitsu_chinitsu':
      pan += 8
      yakuNameArr.push('치또이쯔(칠대자)')
      yakuNameArr.push('청일색')
      break;
    case '7star':
      yakuman ++
      yakuNameArr.push('대칠성')
      break;
    case 'grandWheel':
      yakuman ++
      yakuNameArr.push('대차륜')
      break;
    default:
      true
  }

  if (chuuren(tiles) === 'chuuren') {
    yakuman++
    yakuNameArr.push('구련보등')
    return { pan, fu, yakuman, yakuNameArr, uradoraCount }
  }

  const { heads, chis, pons } = decomposeRegular(tiles)

  if (heads === 'cannot decompose') {
    if (yakuman === 0 && pan === 0) {
      return { pan, fu, yakuman, yakuNameArr, uradoraCount } // 역이없음?
    }
    if (yakuman === 0) {
      var { doraCount, uradoraCount } = checkDora(tiles, dora, uradora)
      if (doraCount >= 1) {
        pan += doraCount
        yakuNameArr.push(`도라 ${doraCount}`)
      }
    }
    return { pan, fu, yakuman, yakuNameArr, uradoraCount }
  }

  if (pinfu(heads, chis, ronCard) === 'pingfu') {
    pan += 1
    yakuNameArr.push('핑후')
  }

  if (iipeiko(chis) === 'iipeiko') {
    pan += 1
    yakuNameArr.push('이페코')
  }

  if (ryanpeiko(chis) === 'ryanpeiko') {
    pan += 3
    yakuNameArr.push('량페코')
  }

  if (tanyao(heads, chis, pons) === 'tanyao') {
    pan += 1
    yakuNameArr.push('탕야오')
  }

  if (haku(pons) === 'haku') {
    pan += 1
    yakuNameArr.push('백')
  }

  if (hatsu(pons) === 'hatsu') {
    pan += 1
    yakuNameArr.push('발')
  }
  
  if (chun(pons) === 'chun') {
    pan += 1
    yakuNameArr.push('중')
  }

  if (sanshokudojun(chis) === 'sanshokudojun') {
    pan += 2
    yakuNameArr.push('삼색동순')
  }

  if (sanshokudoko(pons) === 'sanshokudoko') {
    pan += 1
    yakuNameArr.push('삼색동각')
  }

  if (chanta(heads, chis, pons) === 'chanta') {
    pan += 2
    yakuNameArr.push('찬타(혼전대요구)')
  }

  if (chanta(heads, chis, pons) === 'junchan') {
    pan += 3
    yakuNameArr.push('준찬타(순전대요구)')
  }

  if (honroto(heads, pons) === 'honroto') {
    pan += 2
    yakuNameArr.push('혼노두')
  }

  switch (honitsu_chinitsu_tsuuiiso(heads, chis, pons)) {
    case 'honitsu':
      pan += 3
      yakuNameArr.push('혼일색')
      break;
    case 'tsuuiiso':
      yakuman++
      yakuNameArr.push('자일색')
      break;
    case 'chinitsu':
      pan += 6
      yakuNameArr.push('청일색')
      break;
    default:
      true
  }

  switch (sananko_suuanko(heads, pons, ronCard)) {
    case 'suuanko':
      yakuman++
      yakuNameArr.push('쓰안커(사암각)')
      break;
    case 'sananko':
      pan += 3
      yakuNameArr.push('산안커(삼암각)')
      break;
    default:
      true
  }
  
  switch (shosangen_daisangen(heads, pons)) {
    case 'daisangen':
      yakuman++
      yakuNameArr.push('대삼원')
      break;
    case 'shosangen':
      pan += 2
      yakuNameArr.push('소삼원')
      break;
    default:
      true
  }

  if (itsuu(chis) === 'itsuu') {
    pan += 2
    yakuNameArr.push('일기통관')
  }

  switch (suushi(heads, pons)) {
    case 'daisuushi':
      yakuman++
      yakuNameArr = ['대사희']
      break;
    case 'suushi':
      yakuman++
      yakuNameArr = ['소사희']
      break;
    default:
      true
  }

  if (chinroto(heads, pons) === 'chinroto') {
    yakuman++
    yakuNameArr = ['청노두']
  }

  if (ryuuiiso(heads, chis, pons) === 'ryuuiiso') {
    yakuman++
    yakuNameArr = ['녹일색']
  }

  if (yakuman === 0) {
    var { doraCount, uradoraCount } = checkDora(tiles, dora, uradora)
    if (doraCount >= 1) {
      pan += doraCount
      yakuNameArr.push(`도라 ${doraCount}`)
    }
  }


  return { pan, fu, yakuman, yakuNameArr, uradoraCount }
}

module.exports = { checkYaku }