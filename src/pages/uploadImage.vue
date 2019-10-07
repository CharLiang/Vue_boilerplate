<template lang="pug">
    .upload-image_page
        top( current = "1")
        div.upload-container
          div.upload-upper-container
            img(src="../assets/ic_access_empty.png" class="empty-img-style")
            div.upload-text-style  支持bmp, jpg, png格式；原始图片大小 &le; 1.5M
            div.upload-btn-container
              <el-select v-model="selectedLan" placeholder="请选择语言" class="language-style" @change="onSelectChange">
                <el-option key="zh-CHS" label="      中文      " value="zh-CHS"></el-option>
                <el-option v-if="notxinhsSpecial" key="en" label="      英文      " value="en"></el-option>
              </el-select>
              a(href="javascript:;", class="upload-btn el-icon-upload")  上传图片
                  input(type="file", class="upload", @change="uploadImg", :value="images", accept="image/*", multiple)
          div.upload-lower-container
            div.pic-btn-container
              img(src="../assets/ic_mask_disabled.png" )
              //- img(src="../assets/ic_mask_hover.png" )
              <span class="pic-btn-disabled">遮盖蒙板</span>
            div.pic-btn-container
              img(src="../assets/ic_deletemask_disabled.png" )
              //- img(src="../assets/ic_deletemask_hover.png" )
              <span class="pic-btn-disabled">删除蒙板</span>
            //- div.pic-btn-container
              img(src="../assets/ic_anticlock_disabled.png" )
              //- img(src="../assets/ic_anticlock_hover.png" )
              <span class="pic-btn-disabled">逆时针旋转</span>
            //- div.pic-btn-container
              img(src="../assets/ic_clock_disabled.png" )
              //- img(src="../assets/ic_clock_hover.png" )
              <span class="pic-btn-disabled">顺时针旋转</span>
            //- div.pic-btn-container
              img(src="../assets/ic_restoration_disabled.png" )
              //- img(src="../assets/ic_restoration_hover.png" )
              <span class="pic-btn-disabled">复位图片</span>
                  

</template>

<script>
  import top from '../components/ResultNav'
  import utils from '../utils'
  import { mapGetters, mapActions } from 'vuex'
  import $http from '../services/index.js'
  import $save from '../services/saveRecovery/index.js'
  
  export default {
    name: 'uploadImage',
    data () {
      return {
        images: '',
        selectedLan: 'zh-CHS',
        notxinhsSpecial: `${xinhsSpecial}` === 'false'? true : false,
      }
    },
    computed: {
    ...mapGetters({
        ocrImagesBase64: 'getOcrImagesBase64',
        imagesUrl: 'getImagesUrl',
        cutImageStylesProcess: 'getCutImageStylesProcess',
        cutImageStylesDisplay: 'getCutImageStylesDisplay',
        toUploadBase64: 'getToUploadBase64',
        picLanguage: 'getPicLanguage',
        flownumber:'getFlownumber'
      }),
    },
    mounted() {
      this.setStep(0)
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        console.log('beforeRouteEnter in uploadImage', vm)
        if (!vm.ocrImageBase64) {
          vm.$router.push({
            path: '/',
          })
          return
        }
      })
    },
    methods: {
      ...mapActions([
        'setOcrImagesBase64',
        'setImagesUrl',
        'setPicLanguage',
        'setFlownumber',
        'setStep'
      ]),
      onSelectChange(event){
        console.log('on select change is being called', event)
        this.selectedLan = event
      },
      uploadImg: function(event) {
        let _this = this
        const target = event.target
        var imgUrl = ''
        var base64 = ''
        const files = target.files
        // ${} => 产生是一个string，而不是一个boolean
        const flag = `${xinhsSpecial}` === 'false'? false : true;
        // xinhsSpecial set to false, 此处需要一个反的逻辑
        if( !flag && (files.length > 5) ) {
          window.alert("您最多可上传5张图片，请减少照片的数量");
          return;
        }
        // if (files[files.length - 1].size >= 1500000) {
      //     window.alert("您选择的文件过大，请控制大小在1.5M以内");
      //     return;
      // }
        const loading = this.$loading()
        var base64Count = 0
        for (let i=0; i<files.length; i++) {
          const file = files[i] || files.item(i)
          if (!flag && (file.size >= 1500000)) {
            window.alert("您选择的文件过大，请控制大小在1.5M以内");
            loading.close()
            break;
          }
          const name = file.name.toLowerCase()
          if (file && name.indexOf(".png") != -1 || name.indexOf(".jpg") != -1 || name.indexOf(".jpeg") != -1) {
            // file 转 base64
            utils.getBase64(file, async (info) => {
              base64Count += 1
              if (info && info.result) {
                imgUrl = info.result
                base64 = info.base64
                // getBase64是异步的，这里设置数据的时候要带着 index 来保证图片顺序
                this.setOcrImagesBase64( {index: i, data: base64} )
                this.setImagesUrl( {index: i, data: {src: imgUrl, angel: 0}} )
                // 全部转化完毕
                if (base64Count == files.length) {
                  loading.close()
                  this.setPicLanguage(_this.selectedLan)
                  // create new task
                  $save.saveCurrentState(true)
                  this.toSection1()
                }
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
      toSection1() {
        this.$router.push({
          path: '/image-handle',
        })
      }
    },
    components: {
      top
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .upload-container
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 708px
      height 431px
      background #f5f7fa
      border-radius 4px
      margin 32px auto
    .upload-text-style
      font-size 14px
      color #8E959E
      text-align center
    .upload-image_page
        position absolute
        top 0
        bottom 0
        width 100%
    .empty-img-style
      margin-top 83px
    .upload-upper-container
      width 668px
      height 351px
      background #FFFFFF
      border-radius 4px
      display flex
      flex-direction column
      align-items center
      margin-top 20px
    .upload-lower-container
      display inline-flex
      justify-content center
      align-items center
      margin auto auto 
    .pic-btn-container
      width 87px
      height 24px
      display flex
      justify-content space-evenly
      align-items center
      margin-right 12px
      margin-left 12px
    .pic-btn-disabled
      font-size 12px
      color #ADB1B8
      letter-spacing 0
    .upload-btns-container
      display flex
      flex-direction row
      align-items center
      margin 32px auto
      justify-content center
    .upload-btn
        width 120px
        height 40px
        line-height 40px!important
        text-align center
        background #409eff
        color white
        display block!important
        position relative
        font-size 16px
        margin-top 24px
        border-radius 4px
    .upload-btn:hover
        box-shadow 0 0 8px 0 rgba(232,237,250,.6)
        background #5BA7FF
    .upload
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        opacity 0
        cursor pointer
    .language-style
        width 120px
        height 40px
        position relative
        margin-right 20px
        margin-top 25px
    .upload-btn-container
        display inline-flex
</style>
