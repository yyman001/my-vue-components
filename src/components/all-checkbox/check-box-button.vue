<!--
复选框
-->
<template>
  <label :for="`${id}-checkbox`" class="checkbox-bueaty" :class="{ action: isChecked }">
    <input :id="`${id}-checkbox`" type="checkbox" v-model="isChecked">
    <slot></slot>
  </label>
</template>

<script>
  export default {
    data () {
      return {
        isChecked: false
      }
    },
    props: {
      id: {
        type: String,
        default: 'id'
      },
      checked: {
        type: Boolean,
        default: false
      },
      val: String
    },
    watch: {
      checked (val) {

      },
      isChecked (val) {
        this.$emit('handleChange', {
          checked: val,
          id: this.id,
          val: this.val
        })
      }
    },
    created () {
      this.isChecked = this.checked
    }
  }
</script>

<style scoped lang="scss">
  // 通用样式
  .checkbox-bueaty {
    position: absolute;
    cursor: pointer;
    user-select: none;
    padding-left: 18px;
    font-size: 12px;
    input {
      display: none;
    }
    &:before {
      content: '';
      position: absolute;
      top: 3px;
      left: 0;
      display: block;
      height: 12px;
      width: 12px;
      border: 1px solid #828C99;
      border-radius: 2px;
      transition: all .3s ease;
      background-color: #fff;
    }
    &:after {
      box-sizing: content-box;
      content: "";
      position: absolute;
      transform: rotate(45deg) scaleY(0);
      transition: transform .15s cubic-bezier(.71, -.46, .88, .6) .05s;
    }
    &.action {
      &:before {
        background-color: #82BCFF;
        border: 1px solid #82BCFF;
      }
      &:after {
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        top: 3px;
        width: 3px;
        transform: rotate(45deg) scaleY(1);
        transform-origin: center;
      }
    }
  }
</style>
