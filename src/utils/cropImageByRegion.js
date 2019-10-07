/**
 * Created by liuzhq on 2018/6/20.
 */


function cropImageByRegion(originBase64, regions, callback) {
  const image = new Image()
  var originCanvas = document.createElement("canvas")
  var clipCanvas = document.createElement("canvas")
  const o_ctx = originCanvas.getContext("2d")
  const c_ctx = clipCanvas.getContext("2d")
  image.onload = function () {
    originCanvas.width = image.width
    originCanvas.height = image.height
    const centerPointer = {
      x: image.width/2,
      y: image.height/2
    }
    // 以矩形中心位置为原点作为旋转中心点，默认是左上角
    o_ctx.translate(centerPointer.x, centerPointer.y);
    o_ctx.rotate((regions.angle || 0)*(Math.PI/180))
    o_ctx.translate(-centerPointer.x, -centerPointer.y);
    o_ctx.drawImage(image, 0, 0, image.width, image.height)
    o_ctx.rotate(-(regions.angle || 0)*(Math.PI/180))
    // document.body.appendChild(originCanvas)
    clipCanvas.width = regions.w
    clipCanvas.height = regions.h
    const clipImg = o_ctx.getImageData(regions.x, regions.y, regions.w, regions.h)
    c_ctx.putImageData(clipImg, 0, 0, 0, 0, regions.w, regions.h)
    const clipedBase64 = clipCanvas.toDataURL()
    callback && callback(clipedBase64)
  }
  image.src = originBase64
}

export default cropImageByRegion