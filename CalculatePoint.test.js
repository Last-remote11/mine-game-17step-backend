const { calculatePoint } = require ('./CalculatePoint')

// ( pan, fu, yakuman, uradoraCount ) 

test('4판', () => {
  expect(calculatePoint(4,0,0,0)).toBe(8000)
})
test('역만', () => {
  expect(calculatePoint(4,0,1,2)).toBe(32000)
})
test('6판', () => {
  expect(calculatePoint(4,0,0,2)).toBe(12000)
})