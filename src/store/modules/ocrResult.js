import * as types from '../mutation-type'

const state = {
  flownumber: -1,
  ocrImagesBase64: [],
  imagesUrl: [],
  cutImageStylesDisplay: [],
  cutImageStylesProcess: [],
  toUploadBase64: [],
  ocrPageData: [],
  prpEditedData: [],
  picLanguage: '',
  step: 0,
  sensitiveWords: []
}

const getters = {
  getFlownumber: s => s.flownumber,
  getOcrImagesBase64: s => s.ocrImagesBase64,
  getImagesUrl: s => s.imagesUrl,
  getCutImageStylesProcess: s => s.cutImageStylesProcess,
  getCutImageStylesDisplay: s => s.cutImageStylesDisplay,
  getToUploadBase64: s => s.toUploadBase64,
  getOcrPageData: s => s.ocrPageData,
  getPrpEditedData: s => s.prpEditedData,
  getPicLanguage: s => s.picLanguage,
  getStep: s => s.step,
  getSensitiveWords: s => s.sensitiveWords
}

const actions = {
  setFlownumber ({commit}, data) {
    commit(types.SETFLOWNUMBER, data)
  },
  setOcrImagesBase64 ({commit}, data) {
    commit(types.SETOCRIMAGEBASE64, data)
  },
  setImagesUrl ({commit}, data) {
    commit(types.SETIMAGEURL, data)
  },
  setCutImageStylesProcess ({commit}, data) {
    commit(types.SETCUTSTYLEPROCESS, data)
  },
  setCutImageStylesDisplay ({commit}, data) {
    commit(types.SETCUTSTYLEDISPLAY, data)
  },
  setToUploadBase64 ({commit}, data) {
    commit(types.SETUPLOADBASE64, data)
  },
  setOcrPageData ({commit}, data) {
    commit(types.SETOCRPAGEDATA, data)
  },
  setPrpEditedData ({commit}, data) {
    commit(types.SETPRPEDITEDDATA, data)
  },
  resetData ({commit}, data) {
    commit(types.RESETDATA, data)
  },
  setPicLanguage ({commit}, data) {
    commit(types.SETPICLANGUAGE, data)
  },
  setStep ({commit}, data) {
    commit(types.SETSTEP, data)
  },
  setSensitiveWords ({commit}, data) {
    commit(types.SETSENSITIVEWORDS, data)
  }
}

const mutations = {
  [types.SETOCRIMAGEBASE64] (s, data) {
    const temp = s.ocrImagesBase64
    temp[data.index] = data.data
    s.ocrImagesBase64 = temp
  },
  [types.SETIMAGEURL] (s, data) {
    s.imagesUrl[data.index] = data.data
  },
  [types.SETCUTSTYLEPROCESS] (s, data) {
    s.cutImageStylesProcess[data.index] = data.styles
  },
  [types.SETCUTSTYLEDISPLAY] (s, data) {
    s.cutImageStylesDisplay[data.index] = data.styles
  },
  [types.SETUPLOADBASE64] (s, data) {
    s.toUploadBase64[data.index] = data.base64
  },
  [types.SETOCRPAGEDATA] (s, data) {
    s.ocrPageData[data.index] = data.data
  },
  [types.SETPRPEDITEDDATA] (s, data) {
    s.prpEditedData[data.index] = data.data
  },
  [types.RESETDATA] (s, data) {
    s[data.key] = data.value
  },
  [types.SETPICLANGUAGE] (s, data) {
    s.picLanguage = data
  },
  [types.SETFLOWNUMBER] (s, data) {
    s.flownumber = data
  },
  [types.SETSTEP] (s, data) {
    s.step = data
  },
  [types.SETSENSITIVEWORDS] (s, data) {
    s.sensitiveWords = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
