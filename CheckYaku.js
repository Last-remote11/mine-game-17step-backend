// [1, 2, 3, 11, 12, 13, 21, 22, 23, 30, 30, 31, 31]
// 1~9 만 11~19 통 21~29 삭 31~34 풍 35 36 37 백발중

// const decomposeRegular = require('./decomposeRegular.js')

const SU = []

const WINDS = [31, 32, 33, 34] // 바람패

const DRAGONS = [35, 36, 37] // 삼원패

const ROYAL = [1, 9, 11, 19, 21, 29, 31, 32, 33, 34, 35, 36, 37]

const BASE_POINTS = [0, 8000, 12000, 16000, 24000, 32000, 64000]

const YAKU = {
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
  'itsuu': 2,//*
  'chitoitsu': 2,
  'chanta': 2,
  'junchan': 3,
  'honroto': 2,
  'honitsu': 3,
  'chinitsu': 6,
  'toitoi': 2, // 울기가 없으므로 없음
  'sananko': 2,
  'shosangen': 2,
  'daisangen': 13,
  'kokushi': 13,
  'suuanko': 13,
  'suushi': 13,// 대사희
  'chinroto': 13,// 청노두
  'tsuuiiso': 13,// 자일색
  'ryuuiiso': 13,// 녹일색
  'chuuren': 13,// 구련
  'ippatsu': 1,
  'hotei': 1,
}

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


const kokushi = (tiles) => { // 국사무쌍
  const setOfTiles = new Set(tiles)
  const tempArr = [...setOfTiles]
  if (tempArr === ROYAL) {
    return 'kokushi'
  } else {
    return null
  }
}

const chitoitsu = (tiles) => {
  for (var i = 0; i < 7; i++) { // 치또이츠
    if (tiles[i*2] === tiles[i*2 + 1]) {
      continue
    } else {
      return null
    }
  }
  return 'chitoitsu'
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



// **********************************************************8

const checkYaku = ( tiles, dora, uradora ) => {

  const ronCard = tiles[tiles.length - 1] // 굉후, 쓰안커단기 등 확인용
  tiles.sort()

  let pan = 0
  let yakuman = 0

  if (kokushi(tiles) === 'kokushi') { // 어차피 다른 역만과 중복 불가
    pan += 13
    return pan
  }

  if (chitoitsu(tiles) === 'chitoitsu') {
    pan += 2
  }


  pan += checkDora(tiles, dora, uradora)
  // 도라

  let { heads, chis, pons } = decomposeRegular(tiles)



  return pan
}
