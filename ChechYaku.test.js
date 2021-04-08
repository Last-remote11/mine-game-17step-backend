const { checkYaku } = require('./CheckYaku')
const { calculatePoint } = require('./CalculatePoint')
const { chitoitsu } = require('./helloooo')
const { decomposeRegular } = require('./decomposeRegular')




test('치또이쯔 도라2 우라도라2 4판(6판)', () => {
  expect(checkYaku([1,1,2,2,13,13,14,14,16,16,17,17,33,33], 33, 32, 17))
  .toStrictEqual({ 
    pan: 4, 
    fu: 0,
    yakuman: 0, 
    yakuNameArr: ['치또이쯔(칠대자)', '도라 2'], 
    uradoraCount: 2 })
})

test('구련보등', () => {
  expect(checkYaku([1,1,1,2,3,4,5,6,7,8,8,9,9,9], 9, 32, 17))
  .toStrictEqual({ 
    pan: 0, 
    fu: 0,
    yakuman: 1, 
    yakuNameArr: ['구련보등'], 
    uradoraCount: 0 })
})

test('대삼원', () => {
  expect(checkYaku([1,2,3,35,35,35,36,36,36,37,37,37,27,27], 9, 32, 17))
  .toStrictEqual({ 
    pan: 0, 
    fu: 0,
    yakuman: 1, 
    yakuNameArr: ['대삼원'], 
    uradoraCount: 0 })
})

test('핑후 탕야오 이페코 도라1 삼색동순', () => {
  expect(checkYaku([26,27,28,6,7,8,16,16,17,17,18,18,26,26], 6, 26, 17))
  .toStrictEqual({ 
    pan: 5, 
    fu: 0,
    yakuman: 0, 
    yakuNameArr: ['이페코', '탕야오', '삼색동순', '도라 1'], 
    uradoraCount: 2 })
})

test('소사희', () => {
  expect(checkYaku([1,2,3,31,31,32,32,32,33,33,33,34,34,34], 34, 32, 17))
  .toStrictEqual({ 
    pan: 0, 
    fu: 0,
    yakuman: 1, 
    yakuNameArr: ['소사희', '혼일색'], 
    uradoraCount: 0 })
})