/**
 * Created by liuzhq on 2018/4/27.
 */
import md5 from './md5'
import runHtmlScript from './runHtmlScript'
import fileToImg from './fileToImg'

//半角转全角
function ToDBC(txtstring)
{
  var tmp = "";
  for(var i=0;i<txtstring.length;i++)
  {
    // 不处理空格和半角句号.
    if(txtstring.charCodeAt(i)==32 || txtstring.charCodeAt(i)==46 || txtstring.charCodeAt(i) >= 127)
    {
      tmp=tmp+String.fromCharCode(txtstring.charCodeAt(i));
    }
    // else if (txtstring.charCodeAt(i) == 65282) {
    //   tmp=tmp+String.fromCharCode(txtstring.charCodeAt(i));
    // }
    else{
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i)+65248);
    }
  }
  return tmp;
}

export default {
  md5: md5.md5,
  runScript: runHtmlScript.runScript,
  getPhoto: fileToImg.getPhoto,
  getBase64: fileToImg.getBase64,
  ToDBC: ToDBC
}
