/**
 * Created by liuzhq on 2018/4/27.
 */
import utils from '../utils/index'

const clientele = 'mdict'
const secretKey = '1cZjSkSvQf]02b8R$L%Q'

//生成sign
//sing规则：clientele的取值 + input信息 + salt(随机数) + secretKey(私钥) ==> 取md5的值
//input信息为 input前10个字符 + input长度 + input后十个字符（当input长度大于20）或 input字符串（当input长度小于等于20）
function generateSign(input, salt) {
  const inputLength = input.length
  var headerInput10 = input.substr(0, 10)
  var tailInput10 = input
  var toMd5Input = ''
  if (inputLength > 20) {
    tailInput10 = input.substr(input.length - 10, 10)
  }
  toMd5Input = `${clientele}${headerInput10}${inputLength}${tailInput10}${salt}${secretKey}`
  console.log("toMd5Input=", toMd5Input)
  return utils.md5(toMd5Input)
}

export default {
  clientele,
  secretKey,
  generateSign,
}