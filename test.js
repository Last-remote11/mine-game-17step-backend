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
const testArr = [1,2,3,4,5]

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

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

console.log(honitsu_chinitsu_tsuuiiso([21],[21] ,[23, 24,25,26]))