<template lang="pug">
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
  export default {
    name: "App",
    components: {},
    mounted() {
      // 友盟统计添加
      const script = document.createElement("script");
      script.src =
        "https://s23.cnzz.com/z_stat.php?id=1277665212&web_id=1277665212";
      script.language = "JavaScript";
      document.body.appendChild(script);
    },
    watch: {
      '$route'(){
        if (window._czc) {
          let location = window.location;
          let contentUrl = location.pathname + location.hash;
          let refererUrl = "/";
          window._czc.push(["_trackPageview", contentUrl, refererUrl]);
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  html, body, div, p, h1, h2, h3, h4, h5, ol, ul, li, dl, dt, dd, form, input, textarea, select, span, table, tr, td, img {
    margin: 0;
    padding: 0;
    border: 0;
  }
  html, body {
    background:rgba(255,255,255,0.94);
    color: rgba(122,122,122,1);
    font-family: "HYQiHei-EES", "Hiragino Sans GB", "Noto Sans", "MicrosoftYahei", "Helvetica Neue", "Arial";
    user-select: element;
    -webkit-user-select: element;
    -webkit-touch-callout:none;
    -webkit-font-smoothing: antialiased;
    font-size: 0.32rem;
    color: rgba(122,122,122,1);
    height 100%
  }
  *:focus, *:hover {
    outline: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }
  :not(input,textarea) {
    -webkit-touch-callout: none;
    -webkit-user-select: element;
    user-select: element;
  }
  input, textarea {
    box-shadow:0px 0px 0px rgba(0,0,0,0);
    -webkit-appearance: none;
  }
  input, textarea {
    outline: none;
    border: none;
    border-radius: 0;
  }
  input::-moz-focus-inner,input::-webkit-focus-inner,input::focus-inner {
    border: 0;
  }
  textarea {
    resize: none;
  }
  ul, ol, li {
    list-style: none;
  }
  a {
    text-decoration: none;
    color: #333;
    outline: none;
  }
  a,input{
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }
  a:focus, input:focus {
    outline: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }
  .lx-toast {
    height: 0.96rem;
    line-height: 0.96rem;
    padding: 0 0.48rem;
    font-size: 0.32rem;
    background: rgba(0, 0, 0, 0.7);
    font-family:HYQiHei-GZS;
    background:rgba(77,77,77,1);
    box-shadow: 0px 10px 30px 0px rgba(111,114,117,0.4)
    border-radius: 8px ;
  }
  #app
    min-height 100%
</style>
