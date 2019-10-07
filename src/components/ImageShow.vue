<template lang="pug">
  .image-show
      .left-side
        .img-cell(v-for="(item, imgIndex) in smallImgs")
            img(:src="item.src", :class="{'small-img': true, 'current': index==imgIndex}", @click="showImageByIndex(imgIndex)", v-bind:style="{transform: 'rotate(' + item.angel + 'deg)'}")
            .image-index {{imgIndex+1}}
      .right-side(ref="rightSide")
          img(:src='(bigImg || {}).src || ""', class="big-img", @load="imgLoad", v-bind:style="{transform: 'rotate(' + bigImg.angel + 'deg)'}")
          vue-draggable-resizable(
          :class="{cuts:true}",
          v-for="(style,index) in stylesForDisplay",
          :w="style.width",
          :h="style.height",
          :minw="10",
          :minh="10",
          :x="style.x",
          :y="style.y",
          :key="index",
          :index="index",
          v-on:dragging="onDrag",
          v-on:resizing="onResize",
          :parent="parent",
          )
      ImageHandleBar(v-on:add="addCut", v-on:deleteCut="deleteCut",v-on:cntclkRotate="rotateNg90",v-on:clkRotate="rotatePs90",v-on:reset="resetImg")
      .bottom-container
        a(href="javascript:;", class="upload-btn el-icon-upload") 补充上传
          input(type="file", class="upload", @change="uploadImg", :value="images",accept="image/*", multiple)
        <el-button type="primary" class="next-step-style" @click="deleteImg">删除图片</el-button>
        <el-button type="primary" class="next-step-style" @click="gotoTextCheck">下一步</el-button>
</template>

<!---->
<script>

import { mapGetters, mapActions } from 'vuex'
import ImageHandleBar from './ImageHandleBar'
import VueDraggableResizable from './vue-draggable-resizeable'
import scrawlImageToBase64 from '../utils/scrawlImageToBase64'
import utils from '../utils'
import $save from '../services/saveRecovery/index.js'

export default {
  name: 'ImageShow',
  data() {
    return {
      bigImg: null,
      bigImgWidth: 0,
      bigImgHeight: 0,
      blockerWidth: 0,
      blockerHeight: 0,
      smallImgs: [],
      index: 0,
      imagesSize:0,
      stylesForDisplay:[],
      stylesForProcess:[],
      cutIndex: -1,
      parent: false,
      images: '',
    }
  },
  watch: {
    cutImageStylesDisplay: function() {   // 删除图片时框选显示坐标重置
      this.stylesForDisplay = this.cutImageStylesDisplay[this.index] || []
    },
    cutImageStylesProcess: function() {   // 删除图片时框选处理坐标重置
      this.stylesForProcess = this.cutImageStylesProcess[this.index] || []
    },
    '$route' (to, from) {
      this.setData()
    }
  },
  computed: {
    ...mapGetters({
      ocrImagesBase64: 'getOcrImagesBase64',
      imagesUrl: 'getImagesUrl',
      cutImageStylesProcess: 'getCutImageStylesProcess',
      cutImageStylesDisplay: 'getCutImageStylesDisplay',
      toUploadBase64: 'getToUploadBase64'
    }),
  },

  mounted() {
  if(navigator.userAgent.indexOf("Trident") > -1 || parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("Chrome/")+7,navigator.userAgent.indexOf("Chrome/")+9))<= 57){
    console.log("You are on IE browser!!!!!")
    document.getElementsByClassName("right-side")[0].style.left = Math.max(( document.body.clientWidth - 960 ) /2, 220) + "px"
    document.getElementsByClassName("image-handle-bar")[0].classList.add("imageHandlerStyle")
    document.getElementsByClassName("bottom-container")[0].classList.add("bottomContainerStyle")
  }
    this.setData()
  },
  created() {
    this.setData()
  },
  beforeDestroy(){
    this.bigImg = null
    this.bigImgWidth = 0
    this.bigImgHeight = 0
    this.smallImgs = []
    this.$set(this, 'stylesForDisplay', [])
    this.$set(this, 'stylesForProcess', [])
  },
  methods: {
    setData(){  // 将 store 中存储的数据设置到当前 data 中
      const loading = this.$loading()
      this.index = Math.min(this.index, this.imagesUrl.length-1)
      this.imagesSize = this.imagesUrl.length
      // 若是第一次执行，则同时设置 smallImgs ----- singleton
      if (this.imagesUrl.length !== this.smallImgs.length) {
        this.smallImgs = this.imagesUrl // 包含有src 和 Angel
      }
      this.bigImg = this.smallImgs[this.index] || {}
      let image = new Image()
      image.src = this.bigImg.src
      this.bigImgWidth = image.width
      this.bigImgHeight = image.height
      this.$set(this, 'stylesForDisplay', this.cutImageStylesDisplay[this.index] || [])
      this.$set(this, 'stylesForProcess', this.cutImageStylesProcess[this.index] || [])
      loading.close()
    },
    imgLoad() {
      this.setData()
      //在parent="false"模式下，图片未加载的时候拖动区域高度为负值，所以这里在加载后设置为true
      this.parent = true
    },
    showImageByIndex(index) {   // 图片切换
      this.saveModify()
      this.index = index
      this.bigImg = this.smallImgs[this.index] || {}
      let image = new Image()
      image.src = this.bigImg.src
      this.bigImgWidth = image.width
      this.bigImgHeight = image.height
      this.$set(this, 'stylesForDisplay', this.cutImageStylesDisplay[this.index] || [])
    },
    onResize(x, y, width, height, index) {  // 框选 resize 回调
      this.cutIndex = index
      if(this.cutIndex == -1) return
      this.blockerWidth = width
      this.blockerHeight = height
      var stylesForDisplay = this.stylesForDisplay.slice(0)
      var stylesForProcess = this.stylesForProcess.slice(0)
      if(Math.abs(this.smallImgs[this.index].angel) == 180 ) {
        let new_x = 960 - x - width
        let new_y = this.bigImgHeight*960/this.bigImgWidth - y - height
        stylesForProcess[this.cutIndex] = {
          x: new_x,
          y: new_y,
          width,
          height,
        }
      } else {
        stylesForProcess[this.cutIndex] = {
          x,
          y,
          width,
          height,
        }
      }
      
      stylesForDisplay[this.cutIndex] = {
        x,
        y,
        width,
        height,
      }
      this.$set(this, 'stylesForProcess', stylesForProcess)
      this.$set(this, 'stylesForDisplay', stylesForDisplay)
    },
    onDrag(x, y, index) {   // 框选 拖动 回调
      this.cutIndex = index
      if(this.cutIndex == -1) return
      var stylesForDisplay = this.stylesForDisplay.slice(0)
      var stylesForProcess = this.stylesForProcess.slice(0)
      if(Math.abs(this.smallImgs[this.index].angel) == 180 ) {
        let new_x = 960 - x - this.blockerWidth
        let new_y = this.bigImgHeight*960/this.bigImgWidth - y - this.blockerHeight
        stylesForProcess[this.cutIndex] = {
          x: new_x,
          y: new_y,
          width: stylesForProcess[this.cutIndex]['width'],
          height: stylesForProcess[this.cutIndex]['height']
        }
      } else {
        stylesForProcess[this.cutIndex] = {
          x,
          y,
          width: stylesForProcess[this.cutIndex]['width'],
          height: stylesForProcess[this.cutIndex]['height']
        }
      }

      stylesForDisplay[this.cutIndex] = {
        x,
        y,
        width: stylesForDisplay[this.cutIndex]['width'],
        height: stylesForDisplay[this.cutIndex]['height']
      }
      this.$set(this, 'stylesForProcess', stylesForProcess)
      this.$set(this, 'stylesForDisplay', stylesForDisplay)
    },
    addCut(){   // 增加框选
      var stylesForDisplay = this.stylesForDisplay.slice(0)
      var stylesForProcess = this.stylesForProcess.slice(0)

      stylesForProcess = stylesForProcess.concat([{
        'width': 440,
        'height': 125,
        'x': 210,
        'y': 122
      }])
      stylesForDisplay = stylesForDisplay.concat([{
        'width': 440,
        'height': 125,
        'x': 210,
        //'y': 150
        // 'y': (this.$refs['rightSide'].clientHeight - 125)/2 + this.$refs['rightSide'].scrollTop - 72 , //始终处于视口中间位置，169为header高度
        'y': 122
      }])
      this.$set(this, 'stylesForProcess', stylesForProcess)
      this.$set(this, 'stylesForDisplay', stylesForDisplay)
      this.setOcrPageData({index: this.index, data: null})
    },
    deleteCut(){     // 删除框选
      const index = this.cutIndex
      var stylesForDisplay = this.stylesForDisplay.slice(0)
      var stylesForProcess = this.stylesForProcess.slice(0)
      stylesForDisplay.splice(index, 1)
      stylesForProcess.splice(index, 1)
      this.$set(this, 'stylesForProcess', stylesForProcess)
      this.$set(this, 'stylesForDisplay', stylesForDisplay)
      this.saveUpload64()
    },
    gotoTextCheck(){
      // snapshot on current state
      // 这里step还是保留为当前step, 因为ocr 识别结果没拿到，下一页数据不全
      $save.saveCurrentState()
      this.$emit('gotoTextCheck')
      this.saveUpload64()
    },
    saveModify(){
      this.saveUpload64()
    },
    rotateNg90(){
        let degree = this.smallImgs[this.index].angel
        degree = degree - 90
        this.smallImgs[this.index].angel = degree
    },
    rotatePs90(){
        let degree = this.smallImgs[this.index].angel
        degree = degree + 90
        this.smallImgs[this.index].angel = degree
    },
    resetImg(){
      this.smallImgs[this.index].angel = 0
    },
    saveUpload64(){ // 保存框选后的图片 base64 数据
      this.setOcrPageData({index: this.index, data: null})
      const index = this.index
      this.setCutImageStylesDisplay({styles: this.stylesForDisplay, index: index})
      this.setCutImageStylesProcess({styles: this.stylesForProcess, index: index})
      console.log('Here is saveupTOBASE64 cutImageStylesDisplay',this.cutImageStylesDisplay[index])
      console.log('Here is saveupTOBASE64 cutImageStylesProcess',this.cutImageStylesProcess[index])
      // console.log('is styles and cutImageStles same?',JSON.stringify(_this.styles) === JSON.stringify(this.cutImageStyles[index]))
      // 960 为框选图片的宽度，框选的位置要按照 960 进行缩放
      scrawlImageToBase64(this.ocrImagesBase64[index], this.cutImageStylesProcess[index], 960, base64 => {
        this.setToUploadBase64({base64: base64.split(',')[1], index: index})
      })
    },
    deleteImg(){    // 删除图片
      const index = this.index
      var newOcrImagesBase64 = JSON.parse(JSON.stringify(this.ocrImagesBase64))
      newOcrImagesBase64.splice(index, 1)

      var newImagesUrl = JSON.parse(JSON.stringify(this.imagesUrl))
      newImagesUrl.splice(index, 1)
      var newCutImageStylesProcess = JSON.parse(JSON.stringify(this.cutImageStylesProcess))
      newCutImageStylesProcess.splice(index, 1)
      var newCutImageStylesDisplay = JSON.parse(JSON.stringify(this.cutImageStylesDisplay))
      newCutImageStylesDisplay.splice(index, 1)
      // TODO 删除toUploadBase64和ocrPageData里对应的项。目前不删也不会有bug, 但潜在是个坑
      this.resetData({key: 'cutImageStylesProcess', value: newCutImageStylesProcess})
      this.resetData({key: 'cutImageStylesDisplay', value: newCutImageStylesDisplay})
      this.resetData({key: 'imagesUrl', value: newImagesUrl})
      this.resetData({key: 'ocrImagesBase64', value: newOcrImagesBase64})
      if(this.toUploadBase64.length) {
        var newToUploadBase64 = JSON.parse(JSON.stringify(this.toUploadBase64))
        newToUploadBase64.splice(index, 1)
        this.resetData({key: 'toUploadBase64', value: newToUploadBase64})
      }
      this.setData()
      // snapshot on current state
      $save.saveCurrentState()
    },
    uploadImg(event) {  // 追加上传图片
      const target = event.target
      var imgUrl = ''
      var base64 = ''
      const files = target.files
      const numberLeft = 5 - this.imagesSize
      const flag = `${xinhsSpecial}` === 'false'? false : true;
        // xinhsSpecial set to false, 此处需要一个反的逻辑
      if(!flag && (files.length > numberLeft)) {
        window.alert("您最多可上传5张图片，请减少照片的数量");
        return;
      }
      // if (files[files.length - 1].size >= 1500000) {
      //     window.alert("您选择的文件过大，请控制大小在1.5M以内");
      //     return;
      // }
      for (var i=0; i<files.length; i++) {
        const file = files[i] || files.item(i)
        if (!flag && (file.size >= 1500000)) {
          window.alert("您选择的文件过大，请控制大小在1.5M以内");
          break;
        }
        const name = file.name.toLowerCase()
        if (file && name.indexOf(".png") != -1 || name.indexOf(".jpg") != -1 || name.indexOf(".jpeg") != -1) {
          utils.getBase64(file, (info) => {
            if (info && info.result) {
              imgUrl = info.result
              base64 = info.base64
              this.setOcrImagesBase64( {index: this.ocrImagesBase64.length, data: base64} )
              this.setImagesUrl( {index: this.imagesUrl.length, data: {src: imgUrl, angel: 0}} )
              this.setData()
              this.images = ''
              if(this.ocrImagesBase64.length) {
                this.showImageByIndex(this.ocrImagesBase64.length - 1)
              }
              // snapshot on current state
              $save.saveCurrentState()
            }
          })
        } else {
          this.error('仅支持png、jpg格式')
          this.images = ''
          break;
        }
      }
      return;
    },
    ...mapActions([
      'setCutImageStylesProcess',
      'setToUploadBase64',
      'resetData',
      'setOcrImagesBase64',
      'setImagesUrl',
      'setCutImageStylesDisplay',
      'setOcrPageData'
    ]),
  },
  components: {
    ImageHandleBar,
    VueDraggableResizable
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus" scoped>
  .result-nav
    padding 20px 36px
    text-align right
    background rgb(84, 92, 100)
  .split
    height 40px
    width 60px
    font-size 30px
    text-align center
    line-height 40px
    vertical-align middle
    color #ddd
  .image-show
    height 100%
    position relative
    width 100%
    display flex
    justify-content center
    min-width 1395px
  .left-side
    position absolute
    top 0
    left 60px
    bottom 60px
    padding 20px
    overflow scroll
    width 134px
    border 2px solid #999
  .small-img
    display block
    width 130px
    height 180px
    border 2px solid white
    cursor pointer
    transform-origin 50% 50%
  .small-img.current
    border 2px solid #409eff
  .image-index
    font-size 12px
    color #333333
    height 20px
    text-align center
  .right-side
    // width 708px
    // height 431px
    // margin 24px auto
    // overflow scroll
    // overflow-x hidden
    // background #f5f7fa
    position absolute
    width 960px
    // margin 20px 50px
    top 0
    // left 140px
    // right 0
    bottom 180px
    overflow scroll
    overflow-x hidden
    margin 20px 20px 0px 20px

  .big-img
    display block
    width 960px
    height auto
    transform-origin 50% 50%
  .cuts
    position absolute
    background linear-gradient(to right, rgba(249,249,249,1), rgba(216,216,216,1), rgba(249,249,249,1))
    border 1px solid white
    border-radius 12px
    box-shadow: 0 12rpx 30rpx 0 rgba(225,233,250,0.64);
  .active
    border 2px solid #337ab7
  .cut-sure
    position absolute
    bottom 0
    right 0
  .upload-btn
      width 120px
      height 40px
      line-height 40px!important
      text-align center
      background #409eff
      color white
      font-size 16px
      border-radius 4px
      margin 1px 8px
  .upload-btn:hover
        box-shadow 0 0 8px 0 rgba(232,237,250,.6)
        background #5BA7FF
  .upload-btn-next
    width 120px
    height 40px
    text-align center
    color #FFFFFF
    background #0081FF
  .upload
      position absolute
      transform translateX(-100px)
      width 120px
      height 40px
      opacity 0
      cursor pointer
  .next-step-style
    margin 0 8px
  .bottom-container
    text-align center
    position absolute 
    bottom 23px
    width 100%
  .rightsideStyle
    left 275px
    right 275px
  .imageHandlerStyle
    left 0px
  .bottomContainerStyle
    left 0px
</style>
