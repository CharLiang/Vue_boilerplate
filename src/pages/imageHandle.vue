<template lang="pug">
    .image-handle
        ResultNav(ref="ResultNav" current="1", v-on:textCheck-click="saveCutStyles")
        .image-con
            ImageShow(ref="ImageShow" v-on:gotoTextCheck="textCheckOnResultNav")
</template>

<script>
  import ResultNav from '../components/ResultNav'
  import ImageShow from '../components/ImageShow'
  import services from '../services/Ocr/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'imageHandle',
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters({
        ocrImageBase64: 'getOcrImagesBase64',
        step:'getStep'
      }),
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.ocrImageBase64.length == 0) {
          vm.$router.push({
            path: '/',
          })
          return
        }
      })
    },
    mounted() {
      this.setStep(1)
      console.log('Here is step number in imageHandle', this.step)
    },
    methods: {
      saveCutStyles() {
        this.$refs['ImageShow'].saveModify()
      },
      textCheckOnResultNav(){
        this.$refs['ResultNav'].textCheck()
      },
      ...mapActions([
        'setStep'
      ]),
    },
    components: {
      ResultNav,
      ImageShow
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.image-con
    position absolute
    top 85px
    bottom 2px
    width 100%
</style>
