<template lang="pug">
    .document_page
        ResultNav(ref="ResultNav" :current="currentStatus" v-on:exportSuccess="exportSuccessFn" )
        .result-con
            .result-img-con(ref='resultImageCon')
                img(class="result-image", :style='"transform:rotate(" + getTextAngle() + "deg)"', :src="currentUploadBase64" , ref="resultImage")
            .ocr-text_con
                <aplayer style="z-index:100;" v-if='!!music' :autoplay="false" :list="audioList" :music="music" repeat="none" :listFolded="true" />
                .aplayer_placeholder(v-else)
                div.aplayer_blcoker
                div.ocr-text-item(ref="words", contenteditable="true", @mouseout="editSave",@keyup="updateRegionText($event)", v-html="regionText", @focus="editLock=true", @blur="editorBlur($event)")
            <el-pagination class="result-pagination" background layout="prev, pager, next" :total="toUploadBase64.length" :page-size="1" @current-change="pageChange" :current-page.sync="pageno"></el-pagination>
        .bottom-container
          <el-button type="primary" @click="previousStep">上一步</el-button>
          <el-button type="primary" @click="exportWord">导出文档</el-button>
</template>

<script>
  import ResultNav from '../components/ResultNav'
  import { mapGetters, mapActions } from 'vuex'
  import Aplayer from 'vue-aplayer'
  import utils from '../utils/index'
  import sensitivityWords from '../utils/sensitivityWords'
  import $http from '../services/index.js'
  import $save from '../services/saveRecovery/index.js'

  export default {
    name: 'documentCheck',
    data () {
      return {
        resRegions: [],
        regionText: '',
        imageIndex: 0,
        pageno: 1,
        checkedList:[1],
        toCheckList:[],
        music: null,
        words: '',
        audioList: [],
        editLock: false,
        // regionTextCurrent 是为了解决regionText每次更新后光标都变到行首的问题引入的
        regionTextCurrent:'',
        currentStatus:"3",
        currentUploadBase64:''
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.fetchOcrResult()
      })
    },
    mounted() {
        for ( let i =2; i <= this.toUploadBase64.length; i++) {
            this.toCheckList.push(i)
        }
        this.setStep(3)
        console.log('Here is step number in document Check', this.step)
    },
    watch:{
      imageIndex: function(val){
        this.pageno = val + 1
      },
      words: async function(val) {    // 文本编辑后要重新生成 tts 发音链接
        const audioList = []
        const wordsLength = val.length
        const listLength = Math.ceil( wordsLength/100)
        const langType = encodeURIComponent('zh-CHS')
        const appKey = '2d1d88193ff35a66'
        const format = 'mp3'
        const lan = this.picLanguage
        console.log('here is the lan',lan)
        const host = ttsBaseUrl
        for (let i=0; i<listLength; i++) {
          // const salt = new Date().getTime()
          const subQ = val.substring(i*100, (i + 1)*100)
          // const q = encodeURIComponent(subQ)
          // const sign = utils.md5(appKey + subQ + salt + 'JDET1QklEFBKjFRYSfcX3r3ZhA9H0pDY')
          // const url = `${host}?q=${q}&langType=${langType}&appKey=${appKey}&salt=${salt}&sign=${sign}&format=${format}`
          // const url = `${host}?text=${q}`
          // const urlMp3 = `${ttsBaseUrl}?text=${subQ}&lan=${lan}&speed=1`
          const url = `${ttsBaseUrl}`
          const response = await $http.postTts(url, subQ, lan, 1)
          // console.log('Here is the response', response)
          if (response.errorCode == "0") {
            audioList.push({
              title: '第' + Math.max(1,i*100) + '-' + Math.min((i+1)*100, wordsLength) + '字符',
              artist: 'TTS',
              src: response.data,
              pic:"https://shared.ydstatic.com/ead/zhiyun/jiaodui/logo_bgwhite.png",
              theme:"#FFFFFF"
            })
          } 
          // else if (response.errorCode == "311") {
          //   alert("您请求的过于频繁，请稍后再试")
          //   return false
          // } else if (response.errorCode == "103") {
          //   alert("您请求的字段过长")
          //   return false
          // } else {
          //   alert("您的请求失败，刷新一下页面，再试一次")
          //   return false
          // }
          
        }
        this.music = audioList[0]
        console.log('music is set',this.music)
        this.$set(this, 'audioList', audioList)
      }
    },
    computed: {
      ...mapGetters({
        toUploadBase64: 'getToUploadBase64',
        ocrPageData: 'getOcrPageData',
        prpEditedData: 'getPrpEditedData',
        ocrImagesBase64: 'getOcrImagesBase64',
        picLanguage: 'getPicLanguage',
        step:'getStep'
      }),
    },
    methods: {
      fetchOcrResult() {
        const toUploadBase64 = this.toUploadBase64 || []
        if (toUploadBase64.length == 0) {
          this.$router.push({
            path: '/',
          })
          return
        }
        const loading = this.$loading()
        this.currentUploadBase64 = 'data:image/jpeg;base64,' + toUploadBase64[this.imageIndex]
        this.$set(this, 'resRegions', this.ocrPageData[this.imageIndex])
        var text = '';
        let pageHeadFlag = this.resRegions[0].hasPageHeadSpace
        console.log('fetchOrcResult resRegion',this.resRegions)
        for(var i=0; i<this.resRegions.length;i++) {
          const lines = this.resRegions[i].lines
          var prp = ''
          for(var j=0; j<lines.length; j++) {
            prp += lines[j].text.replace(/<\/?.+?>/g,"")
          }
          if(pageHeadFlag){
              prp =  `<div>${prp}</div>`
          } else {
              prp =  `<p>${prp}</p>`
              pageHeadFlag = true
          }
          text += prp
        }
        this.regionText = sensitivityWords(text, '<span style="color: red;">_word_</span>')
        this.regionTextCurrent = this.regionText
        // 行数据合并成段落的时候可能会出现新的敏感词，这里进行高亮
        this.words = text.replace(/<\/?.+?>/g,"").replace(/\r\n/ig, "")
        console.log('Here is documentCheck prpEditedData',JSON.stringify(this.prpEditedData))
        this.saveToPrpEditedData()
        loading.close()
      },
      pageChange(val){
        this.imageIndex = val -1
        this.fetchOcrResult()
        if (this.checkedList.indexOf(val)  == -1) {
            this.checkedList.push(val)
            const result = this.toCheckList.filter(item => item!=val)
            this.toCheckList = result
        }
      },
      editSave(){
        let isDirty = this.regionTextCurrent !== this.regionText
        this.regionText = this.regionTextCurrent
        this.words = this.regionText.replace(/<\/?.+?>/g,"").replace(/\r\n/ig, "")
        this.saveToPrpEditedData()
        console.log('Here is documentCheck prpEditedData',JSON.stringify(this.prpEditedData))
        if (isDirty) {
          // 防止鼠标快速反复移动时触发大量update
          // snapshot
          $save.saveCurrentState()
        }
      },
      // TODO(wangye) 更简洁可靠的update方案
      updateRegionText(e){
        this.regionTextCurrent = sensitivityWords(e.target.innerHTML, '<span style="color: red;">_word_</span>')
        this.currentStatus = "3"
      },
      editorBlur(e) {
        // 是去焦点时进行保存
        this.regionText = sensitivityWords(e.target.innerHTML, '<span style="color: red;">_word_</span>')
        this.words = this.regionText.replace(/<\/?.+?>/g,"").replace(/\r\n/ig, "")
        this.editLock = false
      },
      saveToPrpEditedData() {
        this.setPrpEditedData({
          index: this.imageIndex,
          data:{
              content:this.regionText.replace(/&nbsp;/g, " ").replace(/<\/?div>/g, "\\r\\n").replace(/<\/?.+?>/g, "").replace(/(^(\\r\\n)*)|((\\r\\n)*$)/g, "").replace(/(\\r\\n)+/ig, "\\r\\n").replace(/\r\n/ig, "\\r\\n"),
              hasPageHeadSpace:this.resRegions[0].hasPageHeadSpace
          }
        })
      },
      getTextAngle(){
        if (this.resRegions.length > 0) {
          if(this.resRegions[0].lines[0]['orientation']== 'UP') {
                return -this.resRegions[0].lines[0]['textAngle']
            } else if(this.resRegions[0].lines[0]['orientation']== 'DOWN') {
                return 180 + this.resRegions[0].lines[0]['textAngle']
            } else if(this.resRegions[0].lines[0]['orientation']== 'RIGHT') {
                return -90 - this.resRegions[0].lines[0]['textAngle']
            } else if (this.resRegions[0].lines[0]['orientation']== 'LEFT'){
                return 90 - this.resRegions[0].lines[0]['textAngle']
            } else {
              return 0
            }
        } else {
          return 0
        }
      },
      previousStep(){
        let _this = this
        _this.$router.push({path: '/text-check',})
        
      },
      exportWord(){
        // snapshot
        $save.saveCurrentState()
        if (this.toCheckList.length == 0){
          this.currentStatus = "4"
          this.$refs['ResultNav'].exportWord()
        } else {
          window.alert(`以下页面还未被校对 \n ${this.toCheckList} \n 请校对后再导出文档？`)
        }
      },
      exportSuccessFn(){
        this.currentStatus = "3"
      },
      ...mapActions([
        'setPrpEditedData',
        'setStep'
      ]),

    },
    components: {
      ResultNav,
      Aplayer
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .document_page
      // min-width 1395px
    .result-con
        width 1280px
        margin 20px auto 0 auto
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
    .aplayer_blcoker
      width 447px
      height 14px
      /*border 1px solid black*/
      position: absolute
      z-index: 200
      top: 55px
      left: 85px
      background: rgba(255,255,255,1)
    
    .aplayer_placeholder
      width 554px
      height 66px
      margin 5px
    .result-img-con
        display inline-block
        vertical-align top
        margin-right 4%
        width 44%
        overflow-y auto
        position relative
        z-index 1
        height 100%
    .result-image
       display block
       width 100%
    .ocr-text_con
        display inline-block
        overflow-y auto
        width 44%
        height 100%
        position relative
    .ocr-text-item
        padding 10px
        font-size 18px
        color black
        border 1px solid #409EFF
        overflow scroll
        top 81px 
        position absolute
        bottom 0
        font-family "宋体"
        width 95%
    .ocr-text-item >>> div{
        text-indent : 25px
    }
    .result-pagination
        position absolute
        bottom -60px
        right 68px
    .bottom-container
        position absolute
        bottom 48px
        width 100%
        text-align center
        min-width 1280px
</style>
<!--
.ocr-text-item
        width 90%
        margin-bottom  10px
        padding 10px
        font-size 18px
        color black
        border 1px solid #409EFF
        overflow scroll
        top 175px
        position absolute
        bottom 0
        font-family "宋体"

 -->
