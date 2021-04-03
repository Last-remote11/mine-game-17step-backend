// [1, 2, 3, 11, 12, 13, 21, 22, 23, 30, 30, 31, 31]

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
  'suushi': 13,
  'chinroto': 13,
  'tsuuiiso': 13,
  'ryuuiiso': 13,
  'chuuren': 13,
  'ippatsu': 1,
  'hotei': 1,
}

const kokushi = (tiles) => {
  const setOfTiles = new Set(tiles)
  const asd = [...setOfTiles]
  if (asd === ROYAL) {
    return 'kokushi'
  }
}


const checkPair = (tiles) => {
  for (i of [...Array(tiles.length).keys()]) {
    if (tiles[i] === tiles[i+1]) {
      if (i+1 < tiles.length && tiles[i+1] === tiles[i+2]) {
        continue
      }
      return (['pair', tiles[i]], tiles.slice(0, i) + tiles.slice(i+2))
    }
  }
  return ([], tiles)
}

const ckeckPon = (tiles) => {
  if (tiles.length >= 3 && tiles[0] == tiles[1] == tiles[2]) {
    return (['pon', tiles[0]], tiles.slice(3))
  } else {
    return ([], tiles)
  }
}

const ckeckChi = (tiles) => {
  let t1 = tiles[0]
  let n = t1[t1.length - 1]
  if (t1 >= 30 || n >= 8) {
    return
  }
  let t2 = t1 + 1
  let t3 = t1 + 2
  if (t2 in tiles && t3 in tiles) {
    tiles.remove(t1)
    tiles.remove(t2)
    tiles.remove(t3)
    return (['chi', t1], tiles)
  } else {
    return ([], tiles)
  }
}

const checkDora = (tiles, dora) => {
  let count = 0;
  for(var i = 0; i < tiles.length; ++i){
    if (array[i] == dora) {
      count++;
    }
  }
  return count
}

const decomposeRegular = (tiles) => {
  let body = []
  let head = []
  let count = 0

  head, tile = checkPair(tiles)

  while (tiles != [] || count >= 20) {

      let resultBody, tiles = checkPon(tiles)
      if (resultBody.length !== []) {
        body.push(resultBody)
      }
    
      let resultBody, tiles = checkChi(tiles)
      if (resultBody.length !== []) {
        body.push(resultBody)
      }

      count++
    }
}


const checkYaku = ( tiles, dora ) => {
  let pan = 0

  if (kokushi(tiles) === 'kokushi') {
    pan += 13
  }

  pan += checkDora(tiles, dora)
  // 도라판수

}