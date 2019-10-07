<template lang="pug">
    .ocr-result_page
        ResultNav(ref="ResultNav" current="2")
        .result-con
            .result-img-con(ref='resultImageCon')
                .crop-con 
                    img( v-if="isImgSelected" class="result-image", :style='"transform:rotate(" + getTextAngle() + "deg)"' :src='imageBase64Original', @load='resultImageLoaded', ref="resultImage")
                    img(v-else class="result-image", :style='"transform:rotate(" + getTextAngle() + "deg)"' :src='imageBase64Processed', @load='resultImageLoaded', ref="resultImage")
                <template v-for="(prps, p_index) in resRegions">
                    <template v-for="(line, l_index) in prps.lines">
                        <template v-if="line.updated">
                            .mask(v-if="p_index==focusIndex[0] && l_index==focusIndex[1]" :style="getMaskBoundStyle(p_index, l_index, 'focus')")
                            .mask(v-else :style="getMaskBoundStyle(p_index, l_index, 'updated')")
                        </template>
                    </template>
                </template>
                
            .explain
                //- <ul class="tabrow">
                //-     <li v-bind:class="{selected: isImgSelected }" @click="originalImgClicked">原图</li>
                //-     <li v-bind:class="{selected: !isImgSelected }" @click="processedImgClicked">处理后图</li>
                //- </ul>
                
                span.text.red-text 图示：
                span.color-block.blue-block
                span.text 正在编辑的行
                span.color-block.green-block
                span.text 已经校对过的行
                <el-switch v-model="isImgSelected" active-text="查看原图" inactive-text="" class="switch-style"></el-switch>
            .ocr-text_con(ref='octTextCon')
                <template v-for="(prps, p_index) in resRegions">
                    <template v-for="(line, l_index) in prps.lines">
                        <span class="line-count"> {{getLineCount(p_index, l_index)}} </span>
                        .paragraph-operation
                            <template  v-if="l_index==0 && p_index!==0">
                                <span class="paragraph-text-style">第 {{p_index+1}} 段</span>
                                <span v-if="p_index!=0"  @click="cancelBeginning(p_index, l_index)" class="paragragh-btn-style">取消段首</span>
                            </template>
                            <template  v-else-if="p_index==0 && l_index==0">
                                <template v-if="hasPageHeadSpace ">
                                    <span class="paragraph-text-style">第 1 段</span>
                                    <span @click="cancelBeginningPageHead(p_index, l_index)" class="paragragh-btn-style">取消段首</span>
                                </template>
                                <span v-else @click="setBeginningPageHead(p_index, l_index)" class="paragragh-btn-style">标记段首</span>
                            </template>
                            <span v-else @click="setBeginning(p_index, l_index)" class="paragragh-btn-style">标记段首</span>
                        .corp-con
                            //- img(class="crop-image", :src='line.crop', @load='cropImgLoad($event, p_index, l_index)')
                        .ocr-text-item(v-html="line.text", :style="getFontSize(p_index, l_index)", :class="{updated: line.updated && p_index!=focusIndex[0] && l_index!=focusIndex[1]}" contenteditable="true", @focus="resultOver($event, p_index, l_index)", @blur="resultOut($event, p_index, l_index)")
                    </template>
                </template>
            <el-pagination class="result-pagination" background layout="prev, pager, next" :total="toUploadBase64.length" :page-size="1" @current-change="pageChange" :current-page.sync="pageno"></el-pagination>
        .bottom-container
            <el-button type="primary" @click="previousStep">上一步</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
</template>

<script>
  import ResultNav from '../components/ResultNav'
  import services from '../services/Ocr/index'
  import { mapGetters, mapActions } from 'vuex'
  import cropImageByRegion from '../utils/cropImageByRegion'
  import sensitivityWords from '../utils/sensitivityWords'
  import utils from '../utils/index'
  import $save from '../services/saveRecovery/index.js'

  export default {
    name: 'textCheck',
    data () {
      return {
        resRegions: [],
        resultImgWidth: 0,
        resultImgHeight: 0,
        resultImageScale: 0,
        imageIndex: 0,
        checkedList:[1],
        toCheckList:[],
        pageno: 1,
        lineIndex: 0,
        focusIndex: [0, 0],
        oldLineText: '',
        hasPageHeadSpace:true,
        imageBase64Processed:'',
        imageBase64Original:'',
        isImgSelected:false
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.fetchOcrResult()
      })
    },
    mounted() {
        if (this.$refs['resultImage'].complete) {
            this.computeScale()
        }
        console.log('Here is the toUploadBase64 length',this.toUploadBase64.length)
        for ( let i =2; i <= this.toUploadBase64.length; i++) {
            this.toCheckList.push(i)
        }
        this.setStep(2)
        console.log('Here is step number in textCheck', this.step)
        console.log('Here is toCheckList',this.toCheckList)
    },
    watch:{
      imageIndex: function(val){
        this.pageno = val + 1
        this.resRegions = this.ocrPageData[val]
      }
    },
    computed: {
      ...mapGetters({
        toUploadBase64: 'getToUploadBase64',
        ocrImagesBase64: 'getOcrImagesBase64',
        ocrPageData: 'getOcrPageData',
        step:'getStep'
      }),
    },
    methods: {
      fetchOcrResult() {
        const toUploadBase64 = this.toUploadBase64 || []
        const ocrImagesBase64 = this.ocrImagesBase64 || []
        this.imageBase64Original = ocrImagesBase64[this.imageIndex]
        this.imageBase64Processed = 'data:image/jpeg;base64,' + toUploadBase64[this.imageIndex]
        const that = this
        if (toUploadBase64.length == 0 || !toUploadBase64[this.imageIndex]) {
          this.$router.push({
            path: '/',
          })
          return
        }
        // always make a new request
        // !this.ocrPageData[this.imageIndex]
        if ( !this.ocrPageData[this.imageIndex] ) {
          const loading = this.$loading()
          // 请求 ocr 接口
          services.getOcrResult(toUploadBase64[this.imageIndex]).then((res) => {
            if (res.errorCode == 0) {
              // 保存 ocr 识别时对图片进行旋转校正的角度
              res.resRegions[0].lines[0]['textAngle'] = res.textAngle
              res.resRegions[0].lines[0]['orientation'] = res.orientation
              // 设置初始化hasPageHeadSpace 为true
              res.resRegions[0]["hasPageHeadSpace"] = true
              // 遍历 ocr 识别接口返回数据中的每行文本(lines)
              for (let j = 0; j < res.resRegions.length; j++) {
                var lines = res.resRegions[j].lines
                for (let k = 0; k < lines.length; k++) {
                  var regionBound = lines[k].boundingBox.split(',')
                  // 保存每行文本在图片上的坐标位置
                  var region = {
                    x: regionBound[0],
                    y: regionBound[1],
                    w: regionBound[2] - regionBound[0],
                    h: regionBound[5] - regionBound[1],
                    angle: res.textAngle
                  }
                  // 替换接口数据中的特殊字符，如半角转全角
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/,/ig, '，')
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/;/ig, '；').replace(/!/ig, '!')
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/\?/ig, '？').replace(/:/ig, '：')
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/\"(\S+?)\"/ig, function($0,$1){return `“${$1}”`})
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/\'(\S+?)\'/ig, function($0,$1){return `‘${$1}’`})
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/"/ig, '”').replace(/'/ig, '’')
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/-+/ig, '——')
                  res.resRegions[j].lines[k]['text'] = res.resRegions[j].lines[k]['text'].replace(/\(/ig, '（').replace(/\)/ig, '）')
                  // 敏感词，如领导人名字进行高亮
                  res.resRegions[j].lines[k]['text'] = sensitivityWords(res.resRegions[j].lines[k]['text'], '<span style="color: red;">_word_</span>')
                  res.resRegions[j].lines[k]['region'] = region
                  res.resRegions[j].lines[k]['fsize'] = '12px'  // 文本默认字号
                  // 一下目前不用，而且比较耗时，注释掉
                  /*
                  cropImageByRegion(ocrImagesBase64[that.imageIndex], region, function (base64) {
                    res.resRegions[j].lines[k]['crop'] = base64
                    // TODO: 下面对于全部crop结束的判断不严谨
                    if ((j == res.resRegions.length - 1) && (k == lines.length - 1)) {
                      that.setOcrPageData({index: that.imageIndex, data: res.resRegions})
                      that.resRegions = that.ocrPageData[that.imageIndex] || []
                      loading.close()
                    }
                  })
                  */
                }
              }
              that.setOcrPageData({index: that.imageIndex, data: res.resRegions})
              that.resRegions = that.ocrPageData[that.imageIndex] || []
              loading.close()
            } else {
              that.setOcrPageData({index: that.imageIndex, data: []})
              that.$message(`获取第 ${that.imageIndex + 1} 张 OCR 结果失败：${res.message}`)
              that.resRegions = that.ocrPageData [that.imageIndex] || []
              loading.close()
            }
          }).catch(() => {
            that.setOcrPageData({index: that.imageIndex, data: []})
            that.$message(`获取第 ${that.imageIndex + 1} 张 OCR 结果失败`)
            that.resRegions = that.ocrPageData [that.imageIndex] || []

            loading.close()
          });
        } else {
          that.resRegions = that.ocrPageData[that.imageIndex] || []
        }


      },
      getLineCount(p_index, l_index){
        // 行标记
        var count =1
        for(var i=0; i<p_index; i++) {
          count += this.resRegions[i].lines.length
        }
        count += l_index
        return count
      },
      originalImgClicked(){
          this.imageBase64Shown = this.ocrImagesBase64[this.imageIndex]
          this.isImgSelected = true
      },
      processedImgClicked(){
          this.imageBase64Shown = 'data:image/jpeg;base64,' + this.toUploadBase64[this. imageIndex]
          this.isImgSelected = false
      },
      
      resultImageLoaded(e) {
        this.computeScale()
      },
      computeScale() {
        // 图片加载后，按照图片的原始大小和展示大小进行缩放，保存缩放比例，为后面定位每行文字在原图中的位置做准备
        this.resultImgWidth = this.$refs['resultImage'].width
        this.resultImgHeight = this.$refs['resultImage'].height
        this.resultImageScale = this.resultImgWidth / this.$refs['resultImage'].naturalWidth
      },
      resultOver(e, p_index, l_index) { // 高亮图片上对应的行
        const resRegions = JSON.parse(JSON.stringify(this.resRegions))
        var overRegion = this.resRegions[p_index]["lines"][l_index]['boundingBox'].split(',')
        // 按照缩放比例，将每行数据的坐标进行缩放，等到缩放后在展示图片上的坐标信息
        var scaleRegion = overRegion.map((item) => {
          return item * this.resultImageScale
        })
        this.oldLineText = resRegions[p_index]['lines'][l_index].text
        this.$set(this, 'focusIndex', [p_index, l_index])
        resRegions[p_index]['lines'][l_index].updated = true
        this.$set(this, 'resRegions', resRegions)
//        console.log(e.target.parentElement, e.target.offsetTop, e.target.parentElement.clientHeight/2)
        // 保持当前焦点输入框始终在屏幕中间
        console.log(e.target.parentElement)
        e.target.parentElement.scrollTop = e.target.offsetTop - e.target.parentElement.clientHeight/2 + 60
        this.scrollToView(0, scaleRegion[1] + (scaleRegion[5] - scaleRegion[1]) - 50)
        this.setOcrPageData({index: this.imageIndex, data: this.resRegions})
      },
      setBeginning (p_index, l_index){ // 设置新的段落
        var resRegions = JSON.parse(JSON.stringify(this.resRegions))    //数组深拷贝，对 resRegions 的操作不影响this.resRegions
        const prp = resRegions[p_index]
        const newPrp = { lines: prp.lines.splice(l_index) }
        resRegions[p_index].lines = prp.lines
        const tailPrp = resRegions.splice(p_index + 1)
        const headPrp = resRegions
        headPrp.push(newPrp)
        resRegions = headPrp.concat(tailPrp)
        this.$set(this, 'resRegions', resRegions)
        this.setOcrPageData({index: this.imageIndex, data: this.resRegions})
      },
      cancelBeginning (p_index, l_index){   // 取消一个段落设置
        var resRegions = JSON.parse(JSON.stringify(this.resRegions))
        const cancelPrp = resRegions[p_index]
        const cancelLines = cancelPrp.lines
        resRegions[p_index - 1]['lines'] = resRegions[p_index - 1]['lines'].concat(cancelLines)
        resRegions.splice(p_index, 1)
        this.$set(this, 'resRegions', resRegions)
        this.setOcrPageData({index: this.imageIndex, data: this.resRegions})
      },
      scrollToView(x, y) {
        // 没用scrollTo的原因是还要兼容 xp 的chrome。。。
        this.$refs['resultImageCon'].scrollLeft = x
        this.$refs['resultImageCon'].scrollTop = y
      },
      resultOut(e, p_index, l_index) {  // 取消高亮
        const newLineText = e.target.innerText || e.target.textContent
        var resRegions = this.resRegions
        if (newLineText != this.oldLineText) {
          resRegions[p_index]['lines'][l_index].text = newLineText
          this.resRegions = resRegions
          this.setOcrPageData({index: this.imageIndex, data: this.resRegions})
          // snapshot
          $save.saveCurrentState()
        }
        this.$set(this, 'focusIndex', [-1, -1])
      },
      cancelBeginningPageHead(p_index, l_index){
          this.resRegions[0]["hasPageHeadSpace"] = false
          this.hasPageHeadSpace = false
      },
      setBeginningPageHead(p_index, l_index){
          this.resRegions[0]["hasPageHeadSpace"] = true
          this.hasPageHeadSpace  = true
      },
      getMaskBoundStyle(p_index, l_index, maskType){   // 图片上高亮行时的样式，红色代表当前正在编辑的，绿色代表编辑过的
        var overRegion = this.resRegions[p_index]["lines"][l_index]['boundingBox'].split(',')
        var scaleRegion = overRegion.map((item) => {
          return item * this.resultImageScale
        })
        // 通过 isUpdated 来区分是修改过的还是当前获取焦点的
        const x = scaleRegion[0]
        const y = scaleRegion[1]
        const w = scaleRegion[2]-scaleRegion[0]
        const h = scaleRegion[5] - scaleRegion[1]
        var maskBounding = ""
        if ( maskType == 'focus' ) {
          maskBounding = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background: rgba(0, 129, 255, .5);`
        } else if(maskType == 'updated') {
          maskBounding = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background: rgba(0, 204, 162, .5);`
        }
        return maskBounding
      },
      pageChange(val){
        this.imageIndex = val -1
        this.$refs['resultImageCon'].scrollTop = 0
        this.$refs['octTextCon'].scrollTop = 0
        this.fetchOcrResult()
        if (this.checkedList.indexOf(val)  == -1) {
            this.checkedList.push(val)
            const result = this.toCheckList.filter(item => item!=val)
            this.toCheckList = result
        }
      },
      getFontSize(p_index, l_index) {
        return `font-size: ${this.resRegions[p_index].lines[l_index].fsize}`
      },
      cropImgLoad(e, p_index, l_index) {
        // 根据图片宽度和文字长度，计算字体，尽量保证文字显示和图片都保持一行
        if (this.resRegions.length > 0) {
          const text = this.resRegions[p_index].lines[l_index]["text"].replace(/<\/?.+?>/g,"")
          this.resRegions[p_index].lines[l_index]['fsize'] = (e.target.width / text.length) + 'px'
        }
      },
      getTextAngle(){
        if (this.resRegions && this.resRegions.length > 0) {
            if(this.resRegions[0].lines[0]['orientation']== 'UP') {
                return -this.resRegions[0].lines[0]['textAngle']
            } else if(this.resRegions[0].lines[0]['orientation']== 'DOWN') {
                return 180 + this.resRegions[0].lines[0]['textAngle']
            } else if(this.resRegions[0].lines[0]['orientation']== 'RIGHT') {
                return -90 - this.resRegions[0].lines[0]['textAngle']
            } else if(this.resRegions[0].lines[0]['orientation']== 'LEFT') {
                return 90 - this.resRegions[0].lines[0]['textAngle']
            } else {
                return 0
            }
          
        } else {
          return 0
        }
      },
      ...mapActions([
        'setOcrRegions',
        'setOcrPageData',
        'setStep'
      ]),
      previousStep(){
          $save.saveCurrentState()
          this.$router.push({path: '/image-handle',})
      },
      nextStep(){
          // snapshot
          if (this.toCheckList.length == 0) {
              $save.saveCurrentState(true)
              this.$router.push({path: '/document-check',})
              console.log('Here is OcrPageData', JSON.stringify(this.ocrPageData))
          } else {
              window.alert(`以下页面还未被校对 \n  ${this.toCheckList} \n 请校对后再点击下一步`)
          }
      }
    },
    components: {
      ResultNav
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .ocr-result_page
        // min-width 1395px
    .result-con
        width 1280px
        margin 20px auto 20px auto
        font-size 0
        letter-spacing 0
        position absolute
        z-index 1
        top 80px
        bottom 100px
        left 5%
        right 5%
        min-width 1280px
        /*overflow hidden*/
    .result-img-con
        display inline-block
        vertical-align top
        margin-right 4%
        width 48%
        overflow-y auto
        position relative
        z-index 1
        height 80%
    .result-image
       display block
       width 100%
    .ocr-text_con
        display inline-block
        overflow-y auto
        width 42%
        height 100%
    .ocr-text-item
        margin-bottom  30px
        padding 10px
        font-size 16px
        color black
        border 1px solid #409EFF
        font-family "宋体"
    .ocr-text-item:focus
        border 2px solid red
    .ocr-text-item.updated:focus
        border 1px solid #67c23a
    .mask
        background rgba(255, 0, 0, .3);
        position absolute
        z-index 2
    .updated-mask
        background rgba(64, 158, 255, .3);
    .result-pagination
        position absolute
        bottom -60px
        right 68px
    .line-count
        float left
        font-size 12px
        color #8E959E
        letter-spacing 0
        margin-right 11px
    .paragraph-operation
        margin-bottom 10px
        width 92%
        display flex
        justify-content space-between
    .corp-con
        display block
    .crop-image
        max-width: 95%;
        border: 1px solid #999;
        box-shadow: 4px 5px 5px #999;
        margin-bottom: 12px;
    .explain
        position: absolute;
        bottom: 0px;
        left: 10px;
        height: 40px;
        width: 536px;
        z-index: 2;
        font-size: 14px;
        line-height: 40px;
    .switch-style
        margin-left 128px

    .color-block
        display inline-block
        vertical-align middle
        width 20px
        height 20px
        margin 10px
    .red-text
        font-size 12px
        color #2D3138
        letter-spacing 0
        line-height 18px
    .blue-block
        background rgba(0, 129, 255, .5)
    .green-block
        background rgba(0, 204, 162, .5)
    .tabrow
        text-align center
        lsit-style none
        margin 25px
        padding 0
        line-height 24px
        position relative
    .tabrow li
        font-size 16px
        margin 0 10px
        padding 0 10px
        border 1px solid #AAA
        background:#ECECEC
        display inline-block
        position relative 
        z-index 0
        cursor pointer
    .tabrow li.selected
        background #FFF
        color #000
        z-index 2
    .paragraph-text-style
        font-size 12px
        color #2D3138
        letter-spacing 0
        line-height 24px
    .paragragh-btn-style
        font-size 12px
        color #60656B
        letter-spacing 0
        line-height 24px
        cursor pointer
    .bottom-container
        position absolute
        bottom 48px
        width 100%
        text-align center
        min-width 1395px

</style>
