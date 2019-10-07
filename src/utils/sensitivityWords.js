import $word from '../services/sensitiveWord/index'
import _ from 'lodash'

function replaceWord (sentence, tags) {
  const responseList = $word.getSensitiveWordList()
  let sensitivityList = _.cloneDeep(responseList)
  var newSentence = sentence
  for (let i = 0; i < sensitivityList.length; i++) {
    const similar = sensitivityList[i].similar
    const name = sensitivityList[i].name
    // similar.push(name)
    similar.unshift(name)
    for (let j = 0; j < similar.length; j++) {
      if (newSentence.indexOf(similar[j]) !== -1) {
        // var reg = new RegExp('(?!span>)' + similar[j] + '(?!</span>)', 'ig')
        var reg = new RegExp('(?!<span>)' + similar[j] + '(?!</span>)', 'ig')
        newSentence = newSentence.replace(reg, tags.replace('_word_', name))
      }
    }
  }
  return newSentence
}
export default replaceWord
