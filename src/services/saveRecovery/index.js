import $http from '../index'
import store from '../../store'
import _ from 'lodash'
import * as types from '../../store/mutation-type'

const BASE64_PREFIX = 'data:image/jpeg;base64,'
const PREFIX = adminBaseUrl

// TODO 加逻辑防止过于频繁地发送
// TODO create的时候加锁定防止多次create
// TODO 不应该直接写state
async function saveCurrentState (isBeforeRedirect) {
  let state = store.state.ocrResult
  let step = state.step
  if (isBeforeRedirect) {
    step += 1
  }
  // 注意这里toUploadBase64的原始数据的base64就没有加data url头, 跟其他几个不一样
  let data = {
    step,
    flownumber: state.flownumber,
    imagesUrl: _.cloneDeep(state.imagesUrl),
    cutImageStylesProcess: _.cloneDeep(state.cutImageStylesProcess),
    cutImageStylesDisplay: _.cloneDeep(state.cutImageStylesDisplay),
    ocrPageData: _.cloneDeep(state.ocrPageData),
    prpEditedData: _.cloneDeep(state.prpEditedData),
    picLanguage: state.picLanguage
  }
  // 去掉base64相关数据
  for (let img of data.imagesUrl) {
    delete img.src
  }
  for (let img of data.ocrPageData) {
    img = img || []
    for (let region of img) {
      region = region || {}
      for (let line of (region.lines || [])) {
        delete line.crop
      }
    }
  }
  let removeBase64Prefix = (string) => string.replace(new RegExp(`^${BASE64_PREFIX}`), '')
  let base64 = _.map(state.ocrImagesBase64, removeBase64Prefix)
  let maskedBase64 = state.toUploadBase64
  console.log('saved', JSON.stringify(data))
  console.log('base64 length', base64.length)
  console.log('maskedBase64 length', maskedBase64.length)
  console.log('ocrPageData length', data.ocrPageData.length)
  let json = {
    data: JSON.stringify(data),
    base64,
    maskedBase64
  }
  let flownumber = state.flownumber
  if (flownumber <= 0) {
    let url = `${PREFIX}/api/task/create`

    let {errorCode, flownumber: newFlownumber} = await $http.postTask(url, json)
    store.commit(types.SETFLOWNUMBER, newFlownumber)
  } else {
    let url = `${PREFIX}/api/task/update`
    json.flownumber = flownumber
    await $http.postTask(url, json)
  }
}

// return redirected step
async function recoverToCurrent(flownumber) {
  let url = `${PREFIX}/api/task/get?flownumber=${flownumber}`
  let res = await $http.getTask(url)
  let {data={}, base64=[], maskedBase64=[], errorCode} = res
  if (errorCode !== 0) {
    return 0
  }

  console.log('restored', JSON.stringify(data))

  data = JSON.parse(data)
  let addBase64Prefix = string => `${BASE64_PREFIX}${string}`
  base64 = _.map(base64, addBase64Prefix)
  _.forEach(data.imagesUrl, (img, index) => {
    img.src = base64[index]
  })

  store.commit(types.SETFLOWNUMBER, flownumber)
  store.commit(types.SETPICLANGUAGE, data.picLanguage)
  store.commit(types.SETSTEP, data.step || 0)
  store.commit(types.RESETDATA, {key: 'ocrImagesBase64', value: base64})
  store.commit(types.RESETDATA, {key: 'imagesUrl', value: data.imagesUrl || []})
  store.commit(types.RESETDATA, {key: 'cutImageStylesDisplay', value: data.cutImageStylesDisplay || []})
  store.commit(types.RESETDATA, {key: 'cutImageStylesProcess', value: data.cutImageStylesProcess || []})
  store.commit(types.RESETDATA, {key: 'toUploadBase64', value: maskedBase64})
  store.commit(types.RESETDATA, {key: 'ocrPageData', value: data.ocrPageData || []})
  store.commit(types.RESETDATA, {key: 'prpEditedData', value: data.prpEditedData || []})

  return data.step || 0;
}

export default {
  saveCurrentState,
  recoverToCurrent
}
