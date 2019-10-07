/**
 * Created by liuzhq on 2018/6/20.
 */

function draw (canvas, regions, baseWidth) {
  if (canvas == null) {
    return
  }
  const ctx = canvas.getContext('2d')
  const originWidth = canvas.width
  const scale = originWidth / baseWidth
  for (var i = 0; i < regions.length; i++) {
    const region = regions[i]
    console.log('Draw function', region)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(region.x * scale, region.y * scale, region.width * scale, region.height * scale)
  }
  return canvas
}

function scrawlImageToBase64 (base64, regions, baseWidth, callback) {
  const image = new Image()
  var canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  image.onload = function () {
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    canvas = draw(canvas, regions, baseWidth)
    const base64 = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
    callback && callback(base64)
  }
  image.src = base64
}

export default scrawlImageToBase64
