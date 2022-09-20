// Excludes the maximum value
function generateRandomIntegerFromRange(minimum, maximum) {
  return Math.floor(Math.random() * (maximum- minimum) + minimum)
}


function shuffleIndexes(ordered_indexes) {
  const obj_indexes = ordered_indexes.reduce((acc, current_element) => {
    const random_index = generateRandomIntegerFromRange(0, acc['ordered'].length)
    acc['shuffled'].push(acc['ordered'][random_index])
    acc['ordered'].splice(random_index, 1)
    return acc
  }, { 'ordered': [...ordered_indexes], 'shuffled': [] })

  return obj_indexes['shuffled']
}


function shuffleArray(ordered_array) {
  const ordered_indexes = ordered_array.map((element, index) => {
    return index
  })
  
  const shuffled_indexes = shuffleIndexes(ordered_indexes)

  const shuffled_array = ordered_array.map((element, ind) => {
    return ordered_array[shuffled_indexes[ind]]
  })

  return shuffled_array
}

module.exports = {
  shuffleArray
}