<template lang="pug">
    header
      .title
        router-link(to="/") 文档智能审校系统
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus" scoped>
  header
    overflow hidden
    height 68px
    box-shadow 0 0 3px 0 rgba(0,0,0,.2)
    min-width 960px
    margin-bottom 38px
    padding 0 60px
    padding-left 200px
    background rgb(84, 92, 100) url("../assets/youdao.png") 60px 50% no-repeat
    background-size 122px 26px
  .title a
    margin-top 20px
    font-size 24px
    color #ddd
    display inline-block
    vertical-align top
</style>
