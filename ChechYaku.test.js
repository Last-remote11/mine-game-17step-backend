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
    console.log('변짱')
    return null
  }
  
  var twoSide = chis.concat(chisTail) // 양면확인용
  console.log('chis', chis, 'ronCard',ronCard,'양면', chis.concat(chisTail))
  if (chis.length === 4 && twoSide.includes(ronCard)) {
      // !chis.some((chi) => [ronCard].includes(chi+1)) && // 간짱
      // heads[0] !== ronCard
      // ||
      // heads[0] === ronCard && 
    return 'pinfu'
  }
  return null
}



test('간짱, 일기통관', () => {
  expect(checkYaku([1,2,3,4,5,6,7,8,9,12,13,14,3,3], 3, 30, 31))
  .toStrictEqual({
    pan: 2,
    fu: 0,
    yakuman: 0, 
    yakuNameArr: ['일기통관'], 
    uradoraCount: 0
  })
})
