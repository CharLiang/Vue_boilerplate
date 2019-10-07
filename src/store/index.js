import Vue from 'vue'
import Vuex from 'vuex'
import ocrResult from './modules/ocrResult'

Vue.use(Vuex)

const debug = (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'xinhsproduction')

export default new Vuex.Store({
  modules: {
    ocrResult
  },
  strict: debug,
})
