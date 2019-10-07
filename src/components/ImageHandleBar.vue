<template lang="pug">
  .image-handle-bar
    //- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="add">遮盖蒙板</el-button>
    //- <el-button type="warning" icon="el-icon-remove-outline" @click="deleteCut">删除蒙板</el-button>
    //- <el-button type="danger" icon="el-icon-delete" @click="deleteEvent">删除图片</el-button>
    //- <el-button type="success" icon="el-icon-edit-outline" @click="saveEvent">保存修改</el-button>
    //- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="cntclkRotate">逆时针转90度</el-button>
    //- <el-button type="warning" icon="el-icon-remove-outline" @click="clkRotate">顺时针转90度</el-button>
    div(class="pic-btn-container" @mouseover="mouseoverAdd" @mouseleave="mouseleaveAdd" @click="add")
      img(v-if="addStatus" src="../assets/ic_mask_hover.png" )
      img(v-else src="../assets/ic_mask_normal.png" )
      <span :class='addStatus?"pic-btn-active":"pic-btn-disabled"'>遮盖蒙板</span>
    div(class="pic-btn-container" @mouseover="mouseoverDelete" @mouseleave="mouseleaveDelete" @click="deleteCut")
      img(v-if="deleteStatus" src="../assets/ic_deletemask_hover.png" )
      img(v-else src="../assets/ic_deletemask_disabled.png" ) 
      <span :class='deleteStatus?"pic-btn-active":"pic-btn-disabled"'>删除蒙板</span>
    //-div(class="pic-btn-container" @mouseover="mouseoverAntiClk" @mouseleave="mouseleaveAntiClk" @click="cntclkRotate")
      img(v-if="antiClkStatus" src="../assets/ic_anticlock_hover.png" )
      img(v-else src="../assets/ic_anticlock_disabled.png" )
      <span :class='antiClkStatus?"pic-btn-active":"pic-btn-disabled"'>逆时针旋转</span>
    //-div(class="pic-btn-container" @mouseover="mouseoverClk" @mouseleave="mouseleaveClk" @click="clkRotate")
      img(v-if="clkStatus" src="../assets/ic_clock_hover.png" )
      img(v-else src="../assets/ic_clock_disabled.png" )
      <span :class='clkStatus?"pic-btn-active":"pic-btn-disabled"'>顺时针旋转</span>
    //- div(class="pic-btn-container" @mouseover="mouseoverReset" @mouseleave="mouseleaveReset" @click="reset")
      img(v-if="resetStatus" src="../assets/ic_restoration_hover.png" )
      img(v-else src="../assets/ic_restoration_disabled.png" )
      <span :class='resetStatus?"pic-btn-active":"pic-btn-disabled"'>复位图片</span>
</template>

<script>

export default {
  name: 'ImageHandleBar',
  data() {
    return {
      addStatus: false,
      deleteStatus: false,
      antiClkStatus: false,
      clkStatus: false,
      resetStatus: false
    }
  },
  props: {
  },
  methods: {
    add(){
      this.$emit('add')
    },
    mouseoverAdd(){
      this.addStatus = true
    },
    mouseleaveAdd(){
      this.addStatus = false
    },
    deleteCut(){
      this.$emit('deleteCut')
    },
    mouseoverDelete(){
      this.deleteStatus = true
    },
    mouseleaveDelete(){
      this.deleteStatus = false
    },
    deleteEvent(){
      this.$emit('deleteEvent')
    },
    saveEvent(){
      this.$emit('saveEvent')
    },
    cntclkRotate(){
        this.$emit('cntclkRotate')
    },
    mouseoverAntiClk(){
      this.antiClkStatus = true
    },
    mouseleaveAntiClk(){
      this.antiClkStatus = false
    },
    clkRotate(){
        this.$emit('clkRotate')
    },
    mouseoverClk(){
      this.clkStatus = true
    },
    mouseleaveClk(){
      this.clkStatus = false
    },
    reset(){
      this.$emit('reset')
    },
    mouseoverReset(){
      this.resetStatus = true
    },
    mouseleaveReset(){
      this.resetStatus = false
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus" scoped>
  .image-handle-bar
    display inline-flex
    justify-content center
    align-items center
    margin auto auto 
    text-align center
    width 100%
    position absolute
    bottom 121px
  .add, .delete, .delete-cut
    display inline-block
    width 32px
    height 32px
    vertical-align middle
    font-size 24px
    margin-right 20px
    cursor pointer
  .delete
    margin-right 0
  .pic-btn-container
    width 87px
    height 24px
    display flex
    justify-content space-evenly
    align-items center
    cursor pointer
    margin-left 12px
    margin-right 12px
  .pic-btn-disabled
    font-size 12px
    color #ADB1B8
    letter-spacing 0
  .pic-btn-active
    font-size 12px
    color #0081FF
    letter-spacing 0
</style>
