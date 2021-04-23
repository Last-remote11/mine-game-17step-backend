const { checkYaku } = require('./CheckYaku')
// const { calculatePoint } = require('./CalculatePoint')
// const { decomposeRegular } = require('./decomposeRegular')

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



test('혼노두', () => {
  expect(checkYaku(    [
    2,  2, 3,  3,  31,  31,
    33,  33, 5, 5, 6, 6,
   7, 7
 ], 33, 30, 31))
  .toStrictEqual({
    pan: 5,
    fu: 0,
    yakuman: 0, 
    yakuNameArr: ['혼노두','산안커(삼암각)'], 
    uradoraCount: 0
  })
})
