/**
 * Created by liuzhq on 2018/6/4.
 */

import $http from '../index'
import authroization from '../authorization'

/*
* 通过图片base64数据获取图片上的题目文字
* clientele	必填	客户端唯一标识
* salt	必填	加密的盐。可以使用随机数，也可以用系统当前时间等
* sign	必填	签名，算法见接口文档
* 接口文档：http://luna.corp.youdao.com/index.php?title=OCR%E7%BF%BB%E8%AF%91#OCR.E6.8E.A5.E5.8F.A3.EF.BC.88.E4.B8.8D.E5.8C.85.E6.8B.AC.E7.BF.BB.E8.AF.91.EF.BC.89
 * */
function getOcrResult (base64) {
  const salt = new Date().getTime()
  const sign = authroization.generateSign(base64, salt)
  const params = [
    `clientele=${authroization.clientele}`,
    `salt=${salt}`,
    `sign=${sign}`,
    'keyfrom=fanyi.2.7.1.desk',
    'option=donot_rotate_box',  // 可不加 见：https://dev.corp.youdao.com/outfoxwiki/PublicTech/OCR/api
    'imei=imei', // 加imei走自研ocr，否则走微软
    'option=detect360'
  ].join('&')
  const url = `${ocrBaseUrl}?${params}`
  return $http.postOcr(url, base64)
}

// 官网的接入函数
// function getOcrResult (base64) {
//   const url = 'http://nb036x.corp.youdao.com:9696/ocrapi1'
//   const formData = {
//     imgBase: base64,
//     lang: 'auto'
//   }
//   return fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'text/plain; charset=UTF-8'
//     },
//     body: formData
//   }).then(res => res.json())
// }

function exportWord (text) {
  const url = exportWordBaseUrl
  let formData = new FormData()
  formData.append('content', text)
  return $http.post(url, formData)
}

export default {
  getOcrResult,
  exportWord
}
