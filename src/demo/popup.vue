<template>
  <div class="">
    <h2>popup</h2>

    <button class="button" @click.stop="winState = !winState">默认参数</button>
    <button class="button" @click.stop="noMask = !noMask">无mask层</button>
    <button class="button" @click.stop="maskClickHideS">mask层点击不关闭</button>

    <m-popup v-model="winState"  v-on:success="" v-on:fail="">
      <p>popup样例(默认参数)</p>
    </m-popup>

    <m-popup v-model="noMask" :mask="false"  v-on:success="" v-on:fail="">
      <p>无mask层</p>
      <p>:mask="false"</p>
    </m-popup>

    <!--mask-click-hide="false"-->
    <m-popup v-model="maskClickHide" :mask-click-hide="false" v-on:success="" v-on:fail="">
      <p>mask层点击不关闭</p>
      <p>:mask-click-hide="false"</p>
    </m-popup>

  </div>
</template>

<script>
  import  MPopup  from '@/components/m-popup.vue';
  export default {
    name: 'app',
    data () {
      return {
        title: 'title',
        msg: 'Welcome to Your Vue.js App',
        winState: false,
        maskClickHide:false,
        noMask:false,
      }
    },
    components: {
      MPopup
    }
    , mounted () {
      document.title = this.title;
    },
    // Options / Data
    // data () { return {} },
    // props: [],
    // propsData: {},
    // computed: {},
    methods: {
      show(){
        this.winState = true;
      },
      maskClickHideS(){
      	this.maskClickHide = true;
      }
    },
    // watch: {},
    // Options / DOM
    // el () {},
    // template: '',
    // render () {},
    // Options / Lifecycle Hooks
    // beforeCreate () {},
    // created () {},
    // beforeMount () {},
    // mounted () {},
    // beforeUpdate () {},
    // updated () {},
    // activated () {},
    // deactivated () {},
    // beforeDestroy () {},
    // destroyed () {},
    // Options / Assets
    // directives: {},
    // filters: {},

    // Options / Misc
    // parent: null,
    // mixins: [],
    // name: '',
    // extends: {},
    // delimiters: [ '{{', '}}' ],
    // functional: false
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss" type="text/css">
  h2{
    font-size: 40px;
    text-align: center;
  }
  .button {
    display: block;
    margin-top: 20px;
    width: 100%;
    height: 1rem;
    border:1px dashed #2c3e50;
  }
  p{
    font-size: 20px;
  }
</style>
