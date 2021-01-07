<!--
@弹窗
@wangdongman
-->
<template>
  <transition name="fade"
              v-on:before-enter="onBeforeEnter"
              v-on:after-enter="onAfterEnter"

              v-on:before-leave="onBeforeLeave"
              v-on:after-leave="onAfterLeave">
    <div class="dm-dialog__wrap" v-show="visible">
      <transition name="slide-fade">
      <div class="dm-dialog" v-show="visible" @click.self="handleClose">
        <slot></slot>
      </div>
      </transition>
    </div>
  </transition>
</template>

<script>
/**
 * 弹窗
 * @author wangdongman
 * @example
 * // eg:
 * <Dialog :visible.sync="dialogVisible"></Dialog>
 */
export default {
  name: 'dm-dialog',
  props: {
    // 控制弹窗显示/隐藏
    visible: {
      type: Boolean,
      default: false
    },
    callback: {
      type: Function,
      default: function () {
      }
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskClickHide: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onBeforeEnter (el) {
      this.$emit('handle-before-enter', el)
    },
    onAfterEnter (el) {
      this.$emit('handle-after-enter', el)
    },
    onBeforeLeave (el) {
      this.$emit('handle-before-leave', el)
    },
    onAfterLeave (el) {
      this.$emit('handle-after-leave', el)
    },
    show () {
      this.$emit('update:visible', true)
    },
    hide () {
      this.$emit('update:visible', false)
    },
    handleClose () {
      if (this.mask) {
        this.hide()
      }
    }
  }
}
</script>

<style scoped lang="scss" type="text/scss">
  /*
  动画样式
  */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-fade-enter-active {
    transition: all .35s ease-out;
  }

  .slide-fade-leave-active {
    transition: all .35s ease-out;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(-50px);
    opacity: 0;
  }

  .dm-dialog__wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .dm-dialog {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99;

    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
</style>
