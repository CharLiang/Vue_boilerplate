<template lang="pug">
  .result-nav-container
    .result-nav(@click="headerClick")
      .title
        .subtitle( v-if="xinhsSpecial")
          .sub-tag 新华社定制版
          .sub-desc 简单・高效・准确

    .result-nav-btns
      //- <el-button :type='current=="图像处理" ? "success": "primary"' @click="$router.push({path: '/image-handle',})">图像处理</el-button>
      <span>
        <img v-if="current==1" src="../assets/1_light.png" class="breadcrumb-image-style" />
        <img v-else src="../assets/1_dark.png" class="breadcrumb-image-style" />
        <span :class='current==1? "breadcrumb-text-style-active":"breadcrumb-text-style"'>图像处理</span>
      </span>
      span.el-icon-arrow-right.split
      //- <el-button :type='current=="文本校对" ? "success": "primary"' @click="textCheck">文本校对</el-button>
      <span>
        <img v-if="current==2" src="../assets/2_light.png" class="breadcrumb-image-style" />
        <img v-else src="../assets/2_dark.png" class="breadcrumb-image-style" />
        <span :class='current==2? "breadcrumb-text-style-active":"breadcrumb-text-style"'>文本校对</span>
      </span>
      span.el-icon-arrow-right.split
      //- <el-button :type='current=="文档校对" ? "success": "primary"' @click="$router.push({path: '/document-check',})">文档校对</el-button>
      <span>
        <img v-if="current==3" src="../assets/3_light.png" class="breadcrumb-image-style" />
        <img v-else src="../assets/3_dark.png" class="breadcrumb-image-style" />
        <span :class='current==3? "breadcrumb-text-style-active":"breadcrumb-text-style"'>文档校对</span>
      </span>
      span.el-icon-arrow-right.split
      //- <el-button :type='current=="导出文档" ? "success": "primary"' @click="exportWord">导出文档</el-button>
      <span>
        <img v-if="current==4" src="../assets/4_light.png" class="breadcrumb-image-style" />
        <img v-else src="../assets/4_dark.png" class="breadcrumb-image-style" />
        <span :class='current==4? "breadcrumb-text-style-active":"breadcrumb-text-style"'>导出文档</span>
      </span>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import scrawlImageToBase64 from '../utils/scrawlImageToBase64'
import exportWord from '../utils/exportWord'
import service from '../services'

export default {
  name: 'ResultNav',
  data() {
    return {
      xinhsSpecial: `${xinhsSpecial}` === 'false'? false : true,
    }
  },

  props: {
    current: String,
  },
  computed: {
    ...mapGetters({
      ocrImagesBase64: 'getOcrImagesBase64',
      cutImageStylesProcess: 'getCutImageStylesProcess',
      prpEditedData: 'getPrpEditedData'
    }),
  },
  methods: {
    textCheck() { // 文本校对
      this.$emit('textCheck-click')
      const ocrImagesBase64 = this.ocrImagesBase64
      const loading = this.$loading()
      const that = this
//      console.log("ocrImagesBase64.length=", ocrImagesBase64.length)
      for (var i=0; i<ocrImagesBase64.length; i ++) {
        (function(index){
          setTimeout(function(){
            scrawlImageToBase64(ocrImagesBase64[index], that.cutImageStylesProcess[index] || [], 960, base64 => {
              that.setToUploadBase64({base64: base64.split(',')[1], index: index})
              if (index == ocrImagesBase64.length-1) {
                loading.close()
                that.$router.push({path: '/text-check',})
              }
            })
          }, 100)
        })(i)
      }
    },
    headerClick(){
      location.reload()
    },
    exportWord(){ // 导出 word
      let _this = this
      if (this.prpEditedData.length == 0) {
        return
      }
      const pages = JSON.parse(JSON.stringify(this.prpEditedData))
      var content = ''

      for (var i=0; i<pages.length; i++) {
          console.log('Here are undefine',pages[i+1])
        if(pages[i+1]==undefined || pages[i+1].hasPageHeadSpace){
            content += pages[i].content + '\\r\\n'
        } else{
            content += pages[i].content
        }
      }

      const url = exportWordBaseUrl
      let formData = new FormData()
      formData.append('content', content)
      console.log('Here are content about to send',content)
      service.postOnly(url, formData).then(res => res.blob().then(blob => {
        console.log(blob)
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = '校对结果.docx'
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        alert("Word文档导出成功,请查看已下载的文件")
        _this.$emit('exportSuccess')
      }));
    },
    ...mapActions([
      'setToUploadBase64',
    ]),
  }
}

// Warning before leaving the page (back button, or outgoinglink)
window.onbeforeunload = function() {
   return "所有数据都会丢失，您确定要离开本页面吗？";
   //if we return nothing here (just calling return;) then there will be no pop-up question at all
   //return;
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus" scoped>
  .result-nav-container
    min-width 1280px
    width 100%
    display inline-flex
    background-color #ffffff
    box-shadow 0 0 12px 0 rgba(82,139,204,0.08)
  .result-nav
    width 40%
    padding 20px 36px
    // padding-left 200px
    text-align right
    background rgb(255, 255, 255) url("../assets/logo_document.png") 60px 50% no-repeat
    background-size 190px 30px
    cursor pointer
  .breadcrumb-text-style-active
    font-size 14px
    color #2B333D
    letter-spacing 0
  .breadcrumb-text-style
    font-size 14px
    color #8E959E
    letter-spacing 0
  .breadcrumb-image-style
    width 20px
    height 20px
    margin -5px 16px
  .result-nav-btns
    width 60%
    min-width 580px
    padding 16px
    text-align center
  .split
    height 40px
    width 60px
    font-size 30px
    text-align center
    line-height 40px
    vertical-align middle
    color #ddd
  .title a
    display inline-block
    vertical-align top
    font-size 24px
    color #ddd
  .title
    float left
  .subtitle
    margin-left 16px
    display inline-block
    vertical-align top
    padding-top: 2px;
    position relative
    left 230px
  .sub-tag
    display block
    background #409eff
    text-align center
    letter-spacing 2px
    border-radius 4px
    color white
    font-size 10px
    width 96px
    height 17px
    display flex
    justify-content center
    align-items center
    font-family "Times New Roman", "Times", "serif"
  .sub-desc
    color black
    font-size 10px
    width 96px
    height 17px
    display flex
    justify-content center
    align-items center
    font-family "Times New Roman", "Times", "serif"
    font-size 12px
</style>
