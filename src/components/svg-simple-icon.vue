<!--
 单色系图标状态
 -->
<template>
  <svg-icon :class="targetColorStatusClass" :name="name" :size="size" :type="type"></svg-icon>
</template>

<script>
  export default {
    name: 'svg-simple-icon',
    components: {},
    props: {
      status: {
        type: String,
        default: 'normal'
      },
      // 是否为单色图标
      simple: {
        type: Boolean,
        default: true
      },
      name: String,
      size: String,
      type: String
    },
    data () {
      return {
        color: {
          normal: '#ccc',
          hover: '#f00',
          active: '#faa',
          disabled: '#fff'
        }
      }
    },
    watch: {},
    computed: {
      targetColorStatusClass () {
        return `svg-simple-icon--${this.status}`
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
  .svg-simple-icon,
  .svg-full-icon {
    &--normal {
      color: #828C99;
    }
    &--hover {
      color: #555F6D;
    }
    &--disabled {
      color: #fff;
    }
    &--reverse {
      color: #fff;
    }
  }

  // 单色图标
  .svg-simple-icon {
    &--active {
      color: #242741;
    }
  }

  // 非单色图标
  .svg-full-icon {
    &--active {
      color: #fff;
    }
  }
</style>
