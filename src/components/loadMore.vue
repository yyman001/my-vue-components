<!--
 @加载更多组件
 -->
<template>
  <div class="load-more-button">
    {{loadText}}
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'loadMoreButton',
    components: {},
    props: {
      item: Object,
      modelCode: String,
      // # 是否正在加载
      isLoading: {
        type: Boolean,
        default: false
      },
      // # 是否全部加载完毕
      isAllLoaded: {
        type: Boolean,
        default: false
      },
      // # 按钮提前多少距离
      marginTop: {
        type: Number,
        default: 0
      },
      // # 检测间隔
      timer: {
        type: Number,
        default: 500
      }
    },
    data () {
      return {
        hd: null
      }
    },
    watch: {},
    computed: {
      loadText () {
        if (this.isAllLoaded) {
          return '已全部加载完毕!'
        }
        return this.isLoading ? '加载中...' : '加载更多...'
      }
    },
    created () {
    },
    beforeDestroy () {
      this.clear()
    },
    mounted () {
      this.init()
    },
    methods: {
      clear () {
        if (this.hd) {
          clearInterval(this.hd)
        }
      },
      init () {
        this.clear()
        this.hd = setInterval(() => {
          if (this.isLoading) {
            console.log('正在加载中')
            return
          }

          if (this.isAllLoaded) {
            this.clear()
            return
          }

          try {
            let rectObject = this.$el.getBoundingClientRect()
            // 元素在当前屏下面
            let isView = rectObject.top - this.marginTop < window.innerHeight
            this.$emit('handleCallback', {
              isView,
              modelCode: this.modelCode,
              item: this.item
            })
          } catch (error) {
            console.warn(`error:`, error)
          }
        }, this.timer)
      }
    }
  }
</script>

<style type="text/scss" lang="scss">
  .load-more-button {
    padding: 12px 17px;
    width: 100%;
    line-height: 1;
    text-align: center;
    outline: none;
    user-select: none;
    font-size: 14px;
    color: #555f6d;
  }
</style>
