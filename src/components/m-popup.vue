<template>

 <div class="popup-page-wrap">
    <div v-if="mask" class="popup-mask" :data-show="popupState" @click.stop="maskHide"></div>
    <div class="popup-page" :class="`popup-page--${position}`" :data-show="popupState">
        <div class="popup-content">
          <slot></slot>
        </div>
    </div>
    <input :value="value" style="display:none;">
 </div>

</template>

<script>

  export default {
    name: 'm-popup',
    data () {
      return {
        popupState:false,
        state: false,
        items:[]
      }
    }
    , mounted () {
      // this.callback();
      if(this.value){
        this.show();
      }

    }
    , props: {
      callback: {
        type: Function,
        default:function(){}
      },
      mask:{
      	type:Boolean,
        default:true,
      },
      maskClickHide:{
        type:Boolean,
        default:true,
      },
      value:{
        type:Boolean,
        default:false
      }
      ,position:{
        type:String,
        default:'bottom'
      }
    }
    ,watch:{
      popupState(val){
        this.$emit('input', val);
      },
      value(val){
        this.popupState = val;
      }
    }
    , methods: {
    	success(msg) {
        this.$emit('success',msg)
      },
      fail(msg){
        this.$emit('fail',msg)
      }

      , show(){
        this.popupState = !!1;
      }
      , hide(){
        this.popupState = !!0;
      },
      maskHide(){
        if(this.maskClickHide){
          this.popupState = !!0;
        }
      }
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" type="text/css">
  .popup-page-wrap {

    .popup-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      tap-highlight-color: rgba(0, 0, 0, 0);
      opacity: 0;
      z-index: -1;
      visibility: hidden;
      // transition: opacity 1400ms;
      transition: all linear 350ms;
      &[data-show="true"] {
        opacity: 1;
        z-index: 1;
        visibility: visible;
      }
      &[data-show="false"] {
        opacity: 0;
        z-index: -1;
        visibility: hidden;
      }
    }

  }

  .popup-page {
    position: fixed;
    left: 0;

    z-index: 9;
    width: 100%;
    height: auto;
    transition-property: transform;
    transition-duration: 300ms;
    // transform: translate3d(0,-100%,0);//在上面出现
    // transform: translate3d(0,100%,0);//在下面出现[默认]
    &--bottom {
      bottom: 0;
      transform: translate3d(0, 100%, 0);
    }
    &--top {
      top: 0;
      transform: translate3d(0, -100%, 0);
    }

    &[data-position="bottom"] {
      transform: translate3d(0, 100%, 0);
    }
    &[data-position="top"] {
      transform: translate3d(0, -100%, 0);
    }

    &[data-show="show"], &[data-show="true"] {
      transform: translate3d(0, 0, 0);
    }
    &[data-show="hide"], &[data-show="false"] {
      // &[data-position="top"]{transform: translate3d(0,100%,0);}
      // &[data-position="bottom"]{transform: translate3d(0,100%,0);}
    }
    .popup-content {
      height: auto;
    }
  }
</style>
