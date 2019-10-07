import 'whatwg-fetch'
import router from '../router'
import store from '../store'

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  }
  const error = new Error(res.statusText)
  error.response = res
  return Promise.reject(error)
}

function parseJSON(res) {
  return res.json()
}

function checkLogin(res){
  if (res && res.code == 30000) {
    store.commit('LOGINOUT')
    router.push({path: '/'})
  }
  return res
}

export default {
  get(baseurl, query = {}, headers = {}) {
    let url = Object.keys(query).length === 0 ? baseurl : `${baseurl}?`
    Object.keys(query).forEach((key) => {
      const val = encodeURIComponent(query[key])
      url += `${key}=${val}&`
    })
    url = url.replace(/&$/, "")
    const options = {
      method: 'GET',
      headers: new Headers(headers),
      mode: 'cors',
      credentials: 'include'
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkLogin)
  },
  post (baseurl, formData) {
    const url = baseurl
    const options = {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkLogin)
  },
  postOnly (baseurl, formData) {
    const url = baseurl
    const options = {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include',
    }
    return fetch(url, options)
  },
  postOcr (baseurl, base64) {
    const url = baseurl
    const searchParam = new URLSearchParams()
    searchParam.set('imgBase', base64)
    const options = {
      method: 'POST',
      body: searchParam,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkLogin)
  },
  postTts (baseurl, text, lan, speed) {
    const url = baseurl
    const searchParam = new URLSearchParams()
    searchParam.set('text', text)
    searchParam.set('lan', lan)
    searchParam.set('speed', speed)
    const options = {
      method: 'POST',
      body: searchParam,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkLogin)
  },
  postTask (baseurl, jsonData) {
    const url = baseurl
    const options = {
      method: 'POST',
      body: JSON.stringify(jsonData),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
  },
  getTask(baseurl) {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(baseurl, options)
      .then(checkStatus)
      .then(parseJSON)
  }
}
