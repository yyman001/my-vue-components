/**
 * 包装jquery[推荐使用]
 * 此方法只依赖于自己，完全不需要任何其他插件与加载器，创建jquery的包装对象jquery-vendor.js
 */
import $ from 'jquery'
window.$ = $
window.jQuery = $
window.jQuery.ajaxPrefilter(function (s) {
  if (s.crossDomain) {
    s.contents.script = false
  }
})
export default $
