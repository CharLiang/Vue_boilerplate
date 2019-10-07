<template lang="pug">
  div.recovering 恢复中...
</template>

<script>
  import utils from '../utils'
  import { mapGetters, mapActions } from 'vuex'
  import $save from '../services/saveRecovery/index.js'
  export default {
    name: 'recoverData',
    computed: {
    ...mapGetters({
        flownumber: 'getFlownumber',
        ocrImagesBase64: 'getOcrImagesBase64',
        imagesUrl: 'getImagesUrl',
        cutImageStylesProcess: 'getCutImageStylesProcess',
        cutImageStylesDisplay: 'getCutImageStylesDisplay',
        toUploadBase64: 'getToUploadBase64',
        ocrPageData: 'getOcrPageData',
        prpEditedData: 'getPrpEditedData',
        picLanguage: 'getPicLanguage'
      }),
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        let flownumber = vm.$route.params.flownumber
        let success = false
        if (flownumber && flownumber > 0) {
          vm.saveStateAndRedirect(flownumber)
        } else {
          vm.gotoSection(0)
        }
      })
    },
    methods: {
      async saveStateAndRedirect(flownumber) {
        let step = await $save.recoverToCurrent(flownumber)
        this.gotoSection(step)
      },
      gotoSection(i) {
        let PATHS = ['/upload-image', '/image-handle', '/text-check', '/document-check']
        let path = PATHS[i]
        this.$router.push({
          path
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .recovering
    height 300px 
    font-size 16px
    color #8E959E
    display flex
    justify-content center
    align-items center
</style>
