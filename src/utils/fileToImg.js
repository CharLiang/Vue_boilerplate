/**
 * Created by liuzhq on 2018/5/10.
 */

import EXIF from 'exif-js'

function getPhotoOrientation(file, callback) {
  EXIF.getData(file, function () {
    var orient = ''
    orient = EXIF.getTag(this, 'Orientation')
    callback && callback(orient)
  });
}

// 对图片旋转处理
function rotateImg(img, direction, canvas) {
  //最小与最大旋转方向，图片旋转4次后回到原方向
  var min_step = 0;
  var max_step = 3;
  //var img = document.getElementById(pid);
  if (img == null)return;
  //img的高度和宽度不能在img元素隐藏后获取，否则会出错
  var height = img.height;
  var width = img.width;
  var step = 2;
  if (step == null) {
    step = min_step;
  }
  if (direction == 'right') {
    step++;
    //旋转到原位置，即超过最大值
    step > max_step && (step = min_step);
  } else {
    step--;
    step < min_step && (step = max_step);
  }

  //旋转角度以弧度值为参数
  var degree = step * 90 * Math.PI / 180;
  var ctx = canvas.getContext('2d');
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0);
      break;
  }
}

function getPhoto(file, callback) {
  var imgURL = "";
  callback = callback || function(){}
  try{
    //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
    try{
      imgURL =  file.getAsDataURL();
      callback(imgURL)
    }catch(e){
      imgURL = window.URL.createObjectURL(file);
      callback(imgURL)
    }
  }catch(e){
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        imgURL = e.target.result;
        callback(imgURL)
      };
      reader.readAsDataURL(file);
    }
  }
}

function getBase64(file, callback) {
  let reader = new FileReader();
  reader.onload = (e) => {
    let fileInfo = {
      name: file.name,
      type: file.type,
      size: file.size,
      base64: reader.result, //reader.result.split(',')[1],
      result: reader.result
    };
    getPhotoOrientation(file, function (orientation) {
      if (orientation != '' && orientation != 1) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function() {
          var expectWidth = this.naturalWidth;
          var expectHeight = this.naturalHeight;

          if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
            expectWidth = 800;
            expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
          } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
            expectHeight = 1200;
            expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
          }
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = expectWidth;
          canvas.height = expectHeight;
          ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
          var base64 = null;
          switch (orientation) {
            case 6://需要顺时针（向左）90度旋转
              rotateImg(this, 'left', canvas);
              break;
            case 8://需要逆时针（向右）90度旋转
              rotateImg(this, 'right', canvas);
              break;
            case 3://需要180度旋转
              rotateImg(this, 'right', canvas);//转两次
              rotateImg(this, 'right', canvas);
              break;
          }
          base64 = canvas.toDataURL("image/jpeg")
          fileInfo.base64 = base64
          fileInfo.result = base64
          callback && callback(fileInfo)
        }
      } else {
        callback && callback(fileInfo)
      }
    })
  }
  reader.readAsDataURL(file);

}

export default {
  getPhoto,
  getBase64,
}