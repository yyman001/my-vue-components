<!--
 svg-icon图标组件
 @author: wangdongman
 -->
<template>
  <i :style="{fontSize: `${fontSize}`}"
     :data-icon="name"
     :class="className">
    <svg v-if="type === 'svg' " class="svg-icon" aria-hidden="true">
      <use :xlink:href="`#icon-${name}`"></use>
    </svg>
  </i>
</template>

<script>
  require('./null/iconfont')
  require('./all/iconfont')
  require('./msg/iconfont')
  export default {
    name: 'svg-icon',
    components: {},
    props: {
      name: String,
      size: {
        type: String,
        default: '2'
      },
      type: {
        type: String,
        default: 'svg'
      },
      units: {
        type: String,
        default: 'em'
      }
    },
    data () {
      return {
        fontUnits: ['px', 'em', '%', 'rem']
      }
    },
    watch: {},
    computed: {
      hasFontUnits () {
        return this.fontUnits.some((item) => {
          return this.size.indexOf(item) > -1
        })
      },
      fontSize () {
        return this.hasFontUnits ? this.size : this.size + this.units
      },
      className () {
        if (this.type === 'font') {
          return `iconfont icon-${this.name}`
        }
        return 'svg-icon__wrap'
      }
    },
    created () {
    },
    beforeDestroy () {
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style type="text/scss" lang="scss">
  @import "all/iconfont.css";
  @import "null/iconfont.css";
  @import "msg/iconfont.css";
  .svg-icon__wrap {
    display: inline-block;
    line-height: 0;
  }
  .svg-icon {
    width: 1em;
    height: 1em;
    line-height: 1;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
