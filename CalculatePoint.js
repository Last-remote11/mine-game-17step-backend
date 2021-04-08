const BASE_POINTS = [0, 8000, 12000, 16000, 24000, 32000, 64000]

const calculatePoint = ( pan, fu, yakuman, uradoraCount ) => {
  if (pan < 4 && yakuman === 0 ) { // 우라도라제외 만관이하
    return -8000
  } else {
    pan += uradoraCount
  }

  if (yakuman != 0) {
    return yakuman * 32000
  }
  switch (pan) {
    case 4:
    case 5:
      return BASE_POINTS[1]
    case 6:
    case 7:
      return BASE_POINTS[2]
    case 8:
    case 9:
    case 10:
      return BASE_POINTS[3]
    case 11:
    case 12:
      return BASE_POINTS[4]
    case 13:
      return BASE_POINTS[5]
    default:
      return -8000
  }
}

module.exports = { calculatePoint }