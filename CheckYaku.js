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
  'ippatsu': 1,
  'hotei': 1,
  'pinfu': 1, 
  'iipeiko': 1, 
  'ryanpeiko': 3,
  'tanyao': 1,
  'wind': 1,
  'haku': 1,
  'hatsu': 1,
  'chun': 1,
  'sanshokudojun': 2,
  'sanshokudoko': 2,
  'itsuu': 2, 
  'chitoitsu': 2,
  'chanta': 2,
  'junchan': 3,
  'honroto': 2,
  'honitsu': 3,
  'chinitsu': 6,
  'toitoi': 2,
  'sananko': 2, 
  'shosangen': 2, 
  'daisangen': 13, 
  'kokushi': 13, 
  'suuanko': 13, 
  'suushi': 13,// 소or대사희
  'chinroto': 13,// 청노두
  'tsuuiiso': 13,// 자일색
  'ryuuiiso': 13,// 녹일색
  'chuuren': 13,// 구련보등
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

  let tilesNumber = tiles.map(tile => tile % 10).sort((a, b) => a - b)
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
const ippatsu = (soon) => {
  if (soon === 1) {
    return 'ippatsu'
  }
  return null
}

const hotei = (oya, soon) => {
  if (oya === true && soon === 17) {
    return 'hotei'
  }
  return null
}

const pinfu = (heads, chis, ronCard) => {
  var chisTail = chis.map(e => e+2)
  // var chisNum = [...new Set (chis.map(e => e % 10))]

  if ( // 변짱
    chis.includes(1) && !chis.includes(3) && ronCard === 3 ||
    chis.includes(7) && !chis.includes(5) && ronCard === 7 ||
    chis.includes(11) && !chis.includes(13) && ronCard === 13 ||
    chis.includes(17) && !chis.includes(15) && ronCard === 17 ||
    chis.includes(21) && !chis.includes(23) && ronCard === 23 ||
    chis.includes(27) && !chis.includes(25) && ronCard === 27
  ) {
    return null
  }
  
  var twoSide = chis.concat(chisTail) // 양면확인용
  if (chis.length === 4 && twoSide.includes(ronCard)) {
      // !chis.some((chi) => [ronCard].includes(chi+1)) && // 간짱
      // heads[0] !== ronCard
      // ||
      // heads[0] === ronCard && 
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


const tou = ( pons, oya ) => {
  if (pons.includes(31) && oya===true) {
    return 'tou'
  }
}
const sha = ( pons, oya ) => {
  if (pons.includes(33) && oya===false) {
    return 'sha'
  }
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
    numberOfCard.sort((a, b) => (a - b))
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

const chanta = ( heads, chis, pons ) => { // 찬타, 준찬타, 혼노두
  if (
    ROYAL.includes(heads[0])
 && chis.every((chi) => [1,11,21,7,17,27].includes(chi))
 && pons.every((pon) => ROYAL.includes(pon))
 ) { 
   if (JunROYAL.includes(heads[0]) && pons.every((pon) => JunROYAL.includes(pon))) { return 'junchan' }
   if (
    pons.length === 4 &&
    pons.every((pon) => ROYAL.includes(pon)) &&
    ROYAL.includes(heads[0])
    ) { return 'honroto' }
   return 'chanta'
   
 }
 return null
}


const honitsu_chinitsu_tsuuiiso = (heads, chis, pons) => {
  let mix = heads.concat(chis.concat(pons))
  let mixDiv = mix.map(element => parseInt(element / 10))
  let mixSet = new Set(mixDiv)
  let tempArr = [...mixSet].sort((a, b) =>  a - b)
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
  if ( chis.every(e => e === 22) && tempArr.every(e => GREENS.includes(e))) {
    return 'ryuuiiso'
  }
  return null
}



// ********************************************

const checkDora = (tiles, dora, uradora) => { 
  // ※도라가 아닌 도라표시패가 들어옴
  // 뒷도라는 어차피 안보이니까 그냥계산? => X
  dora++
  dora === 10 ? dora = 1 : true
  dora === 20 ? dora = 11 : true
  dora === 30 ? dora = 21 : true
  dora === 35 ? dora = 31 : true
  dora === 38 ? dora = 35 : true
  uradora++
  uradora === 10 ? uradora = 1 : true
  uradora === 20 ? uradora = 11 : true
  uradora === 30 ? uradora = 21 : true
  uradora === 35 ? uradora = 31 : true
  uradora === 38 ? uradora = 35 : true

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

  return { doraCount, uradoraCount }
  }




// ***********************************************************
// ***********************************************************

const checkYaku = ( tiles, ronCard, dora, uradora, oya, soon ) => { 
  // tiles는 14개의 배열을 받음
  // 역만이 하나라도 있으면 도라, 뒷도라 카운트 안함(그냥 0으로 반환)

  tiles.sort((a, b) => a - b)

  let yakuNameArr = ['리치 1']
  let pan = 1
  let fu = 0
  let yakuman = 0
  var uradoraCount = 0

  if (kokushi(tiles) === 'kokushi') { // 어차피 다른 역만과 중첩 불가(단일 역의 더블역만 X)
    yakuman++
    yakuNameArr.push('국사무쌍')
    return { pan, fu, yakuman, yakuNameArr, uradoraCount }
  }
  
  if (ippatsu(soon) === 'ippatsu') {
    pan += 1
    yakuNameArr.push('일발 1')
  }

  if (hotei(oya, soon) === 'hotei') {
    pan += 1
    yakuNameArr.push('해저/하저 1')
  }


  switch (chitoitsu(tiles)) {
    case 'chitoitsu':
      pan += 2
      yakuNameArr.push('치또이쯔(칠대자) 2')
      break;
    case 'chitoitsu_tanyao':
      pan += 3
      yakuNameArr.push('치또이쯔(칠대자) 2')
      yakuNameArr.push('탕야오 1')
      break;
    case 'chitoitsu_honitsu':
      pan += 5
      yakuNameArr.push('치또이쯔(칠대자) 2')
      yakuNameArr.push('혼일색 3')
      break;
    case 'chitoitsu_chanta' :
      pan += 4
      yakuNameArr.push('치또이쯔(칠대자) 2')
      yakuNameArr.push('혼노두 2')
      break;
    case 'chitoitsu_honitsu_chanta':
      pan += 7
      yakuNameArr.push('치또이쯔(칠대자) 2')
      yakuNameArr.push('혼일색 3')
      yakuNameArr.push('찬타(혼전대요구) 2')
      break;
    case 'cchitoitsu_chinitsu':
      pan += 8
      yakuNameArr.push('치또이쯔(칠대자) 2')
      yakuNameArr.push('청일색 6')
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

  console.log('heads',heads,'chis',chis,'pons',pons)

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

  if (pinfu(heads, chis, ronCard) === 'pinfu') {
    pan += 1
    yakuNameArr.push('핑후 1')
  }

  if (iipeiko(chis) === 'iipeiko') {
    pan += 1
    yakuNameArr.push('이페코 1')
  }

  if (ryanpeiko(chis) === 'ryanpeiko') {
    pan += 3
    yakuNameArr.push('량페코 3')
  }

  if (tanyao(heads, chis, pons) === 'tanyao') {
    pan += 1
    yakuNameArr.push('탕야오 1')
  }



  if (tou(pons) === 'tou') {
    pan += 1
    yakuNameArr.push('동 1')
  }

  if (sha(pons) === 'sha') {
    pan += 1
    yakuNameArr.push('서 1')
  }

  if (haku(pons) === 'haku') {
    pan += 1
    yakuNameArr.push('백 1')
  }

  if (hatsu(pons) === 'hatsu') {
    pan += 1
    yakuNameArr.push('발 1')
  }
  
  if (chun(pons) === 'chun') {
    pan += 1
    yakuNameArr.push('중 1')
  }

  if (sanshokudojun(chis) === 'sanshokudojun') {
    pan += 2
    yakuNameArr.push('삼색동순 2')
  }

  if (sanshokudoko(pons) === 'sanshokudoko') {
    pan += 2
    yakuNameArr.push('삼색동각 2')
  }

  if (chanta(heads, chis, pons) === 'chanta') {
    pan += 2
    yakuNameArr.push('찬타(혼전대요구) 2')
  }

  if (chanta(heads, chis, pons) === 'junchan') {
    pan += 3
    yakuNameArr.push('준찬타(순전대요구) 3')
  }
  
  if (chanta(heads, chis, pons) === 'honroto') {
    pan += 2
    yakuNameArr.push('혼노두 2')
  }

  switch (honitsu_chinitsu_tsuuiiso(heads, chis, pons)) {
    case 'honitsu':
      pan += 3
      yakuNameArr.push('혼일색 3')
      break;
    case 'tsuuiiso':
      yakuman++
      yakuNameArr.push('자일색')
      break;
    case 'chinitsu':
      pan += 6
      yakuNameArr.push('청일색 6')
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
      pan += 4
      yakuNameArr.push('산안커(삼암각) 2')
      yakuNameArr.push('또이또이 2')
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
      yakuNameArr.push('소삼원 2')
      break;
    default:
      true
  }

  if (itsuu(chis) === 'itsuu') {
    pan += 2
    yakuNameArr.push('일기통관 2')
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
