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



test('녹일색', () => {
  expect(checkYaku([
    22,  22, 22, 23, 23, 23,
   24, 24, 24, 28, 28, 28,
    36,  36
 ], 3, 30, 31))
  .toStrictEqual({
    pan: 5,
    fu: 0,
    yakuman: 1, 
    yakuNameArr: ['녹일색'], 
    uradoraCount: 0
  })
})
