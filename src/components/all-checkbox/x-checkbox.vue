<!--
用于<全选>操作的<复选框>
@a:wangdongman
-->
<template>
  <label :for="`${id}-checkbox`" class="x-checkbox" :class="{ action: targetChecked }">
    <input :id="`${id}-checkbox`" type="checkbox" :value="targetChecked" @change="onChangeCheckbox">
    <slot></slot>
  </label>
</template>

<script>
  export default {
    name: 'x-checkbox',
    data () {
      return {}
    },
    props: {
      // 全选不填写
      id: {
        type: String,
        default: 'id'
      },
      // 选中匹配列表
      counterpart: {
        type: Array,
        default () {
          return []
        }
      },
      // 全选列表(副本)
      checkAllList: {
        type: Array,
        default () {
          return []
        }
      },
      // 是否为全选按钮
      isGlobal: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // 单选按钮属性
      isChecked () {
        if (!this.counterpart.length) {
          return false
        }

        if (this.counterpart.includes(this.id)) {
          return true
        }
      },
      // 全选难属性
      isCheckedAll () {
        if (!this.checkAllList.length) {
          return false
        }

        return this.counterpart.length === this.checkAllList.length
      },
      // 当前选中状态
      targetChecked () {
        if (this.isGlobal) {
          return this.isCheckedAll
        }
        return this.isChecked
      }
    },
    methods: {
      onChangeCheckbox () {
        this.$emit('handleChange', {
          // 如果点击-列表没有点中则是要添加进列表 (反向状态判断)
          checked: !this.targetChecked,
          id: this.id,
          counterpart: this.counterpart,
          checkAllList: this.checkAllList
        })
      }
    }
  }
</script>

<style lang="scss">
  // 通用样式
  .x-checkbox {
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
