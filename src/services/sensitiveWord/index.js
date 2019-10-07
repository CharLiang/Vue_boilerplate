
import $http from '../index'
import store from '../../store'
import * as types from '../../store/mutation-type'

function getSensitiveWordList () {
  let state = store.state.ocrResult
  return state.sensitiveWords
}

async function initSensitiveWordList () {
  let state = store.state.ocrResult
  let PREFIX = adminBaseUrl
  if (!state.sensitiveWords.length) {
    const url = `${adminBaseUrl}/api/name/get`
    let res = await $http.get(url)
    store.commit(types.SETSENSITIVEWORDS, res.list)
  }
}

initSensitiveWordList()

export default {
  getSensitiveWordList
}
