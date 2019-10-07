## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```

## 外部依赖介绍

``` json

{
  "name": "veu_boilerplate",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "private": true,
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "test": "npm run unit",
    "lint": "eslint --ext .js,.vue src test/unit",
    "build": "node build/build.js",
    "xinhsbuild": "node build/xinhsbuild.js"
  },
  "dependencies": {
    "axios": "^0.18.0",// 用法发送HTTP 请求
    "babel-polyfill": "^6.26.0", // polyfill ECMAScript feature
    "element-ui": "^2.3.4", // UI 组件
    "echarts": "^4.1.0", //百度出品的画各种图的JS工具
    "js-md5": "^0.7.3", // calculate hex-encoded MD5 hash
    "katex": "^0.10.0", // fatest math typesetting library
    "lodash": "^4.17.11", // 处理数组和字符串的工具
    "moment": "^2.23.0", // Parse, validate, manipulate, and display dates and times in JavaScript.
    "postcss-pxtorem": "^4.0.1", // generate rem unit from pixel units
    "qs": "^6.7.0",// A querystring parsing and stringifying library with some added security. 当你的请求是x-wwww-form-urlencoded 的时候，需要使用
    "v-charts": "^1.19.0", // vue 开发的画图工具
    "whatwg-fetch": "^2.0.3",//  you are testing in an old version of a browser that doesn't support window.fetch natively. This project is a polyfill, and since all modern browsers now implement the fetch function natively
    "exif-js": "^2.3.0", //A JavaScript library for reading EXIF meta data from image files.
    "hls.js": "^0.10.1", // hls.js is a JavaScript library which implements an HTTP Live Streaming client. It relies on HTML5 video and MediaSource Extensions for playback.
    "vue": "^2.5.2", 
    "vue-aplayer": "^1.6.0",
    "vue-router": "^3.0.1",
    "vue-cookies": "^1.5.13",
    "vuex": "^3.0.1",
  },
  "devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-core": "^6.22.1",
    "babel-eslint": "^8.2.1",
    "babel-helper-vue-jsx-merge-props": "^2.0.3",
    "babel-loader": "^7.1.1",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-runtime": "^6.22.0",
    "babel-plugin-transform-vue-jsx": "^3.5.0",
    "babel-preset-env": "^1.3.2",
    "babel-preset-stage-2": "^6.22.0",
    "chalk": "^2.0.1",
    "copy-webpack-plugin": "^4.0.1",
    "css-loader": "^0.28.0",
    "eslint": "^4.15.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-friendly-formatter": "^3.0.0",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-node": "^5.2.0",
    "eslint-plugin-promise": "^3.4.0",
    "eslint-plugin-standard": "^3.0.1",
    "eslint-plugin-vue": "^4.0.0",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^1.1.4",
    "friendly-errors-webpack-plugin": "^1.6.1",
    "html-webpack-plugin": "^2.30.1",
    "node-notifier": "^5.1.2",
    "node-sass": "^4.9.0",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "ora": "^1.2.0",
    "portfinder": "^1.0.13",
    "postcss-import": "^11.0.0",
    "postcss-loader": "^2.0.8",
    "postcss-url": "^7.2.1",
    "pug": "^2.0.0-rc.4",
    "rimraf": "^2.6.0",
    "semver": "^5.3.0",
    "shelljs": "^0.7.6",
    "stylus": "^0.54.5",
    "stylus-loader": "^3.0.1",
    "uglifyjs-webpack-plugin": "^1.1.1",
    "url-loader": "^0.5.8",
    "vue-loader": "^13.3.0",
    "vue-style-loader": "^3.0.1",
    "vue-template-compiler": "^2.5.2",
    "webpack": "^3.6.0",
    "webpack-bundle-analyzer": "^2.9.0",
    "webpack-dev-server": "^2.9.1",
    "webpack-merge": "^4.1.0"
  },
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ],
  "main": "main.js",
  "repository": "https://newgitlab.corp.youdao.com/webfront-dict/eBook",
  "license": "MIT"
}


```




## 技术点

### file 转 base64

> 本地上传的图片 file 需要转为 base64 格式，用于上传 ocr 接口和本地图片展示。使用了 FileReader API 完成，但存在部分 iOS 机型拍照后的图片预览时是竖直的，通过 FileReader<br/> 
  转为 base64 后，图片是水平旋转 90 度的，原因是拍照后的图片元数据信息中 Orientation 错误，属于 iOS 系统 bug 。解决此问题引入了 [exif-js](https://github.com/exif-js/exif-js) 获取图片的 Orientation，并根据 Orientation 的值进行旋转。见 *fileToImg.js* 文件。

### 按照矩形坐标在给定图片上进行涂鸦

> 需求中需要把图片上指定位置涂抹掉，完成了 *scrawlImageToBase64* 方法通过 canvase 返回涂鸦后的图片 base64 数据。另外，ocr 接口进行图片识别的时候，会对图片进行校正处理，会返回图片的倾斜角度，涂鸦前需先按照接口角度将原图旋转。见 *scrawlImageToBase64.js* 文件。

### 敏感词高亮

> 需要对文本中的领导人等敏感词进行高亮显示，见 *sensitivityWords.js* 文件。

### 在图片的指定矩形区域进行截图

> 产品功能中需要按照指定矩形坐标在图片中进行截图，完成了 *cropImageByRegion* 方法，接受图片 base64 数据、regions 和 callback。另外也需要将原始图片按照校正角度先进行旋转，见 *cropImageByRegion.js* 文件。

### 导出文档

> 访问接口获取到 word 文档流，再通过 blob 和 createObjectURL 生成文档链接，然后利用 A 标签完成下载。注意 revokeObjectURL 和 createObjectURL 最好成对使用。

## 目录结构

<pre>
src
├── App.vue
├── assets
│   ├── index-bg.png
│   ├── logo.png
│   └── youdao.png
├── components
│   ├── ImageHandleBar.vue  // 图像处理页面下方的增加/删除框选、删除图片等功能
│   ├── ImageShow.vue   // 图像处理页面图像展示和切换组件
│   ├── ResultNav.vue   // 整个系统的导航
│   ├── header.vue  // 首页header组件
│   └── vue-draggable-resizeable    // 图片框选组件
│       ├── index.js
│       ├── utils
│       │   └── dom.js
│       └── vue-draggable-resizable.vue
├── main.js
├── pages
│   ├── documentCheck.vue   // 文档校对页面
│   ├── imageHandle.vue     // 图像处理页面
│   ├── textCheck.vue   // 文本处理页面
│   └── uploadImage.vue     // 图片上传页面
├── router
│   └── index.js    // 路由配置
├── services
│   ├── Ocr
│   │   └── index.js    // 接口请求
│   ├── authorization.js    // ocr 接口认证逻辑
│   └── index.js
├── store   // vuex, 包括 ocr 接口返回的数据、用户截图后的数据、生成的 word 数据等
│   ├── index.js
│   ├── modules
│   │   └── ocrResult.js
│   └── mutation-type.js
└── utils   // 工具集
    ├── cropImageByRegion.js    // 根据坐标在传入的图片上裁切指定位置的图片，支持角度
    ├── exportWord.js   // js 导出 word ，暂时没有使用，后续整理
    ├── fileSaver.js
    ├── fileToImg.js    // 根据 input[file] 获取图片 base64 
    ├── htmlToDocx.js   // js 导出 word ，暂时没有使用，后续整理
    ├── index.js
    ├── md5.js  // md5 加密
    ├── runHtmlScript.js
    ├── scrawlImageToBase64.js  // 根据坐标将图片指定区域涂抹掉，目前用于图像处理中框选后将框选区域涂黑后上传到 ocr 接口进行识别
    └── sensitivityWords.js     // 敏感词过滤标红
</pre>

