import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const defaulRoutes = {
  mode: 'hash',
  routes: [
    {
      path: '/recover/:flownumber', // 页面恢复
      name: 'recover',
      component: resolve => require(['../pages/RecoverData'], resolve),
      children: []
    },
    {
      path: '/upload-image', // 图片上传
      name: 'uploadImage',
      component: resolve => require(['../pages/uploadImage'], resolve),
      children: []
    },
    {
      path: '/image-handle', // 图像处理
      name: 'imageHandle',
      component: resolve => require(['../pages/imageHandle'], resolve),
      children: []
    },
    {
      path: '/text-check', // 文本校对
      name: 'textCheck',
      component: resolve => require(['../pages/textCheck'], resolve),
      children: []
    },
    {
      path: '/document-check', // 文档校对
      name: 'documentCheck',
      component: resolve => require(['../pages/documentCheck'], resolve),
      children: []
    },
    {
      path: '*',
      redirect: '/upload-image'
    }
  ]
}

const router = new Router(defaulRoutes)

export default router
