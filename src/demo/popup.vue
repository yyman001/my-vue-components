<template>
  <div class="">
    <h2>popup</h2>
    <button class="button" @click.stop="show">出现</button>

    <m-popup v-model="winState" v-on:success="" v-on:fail="">
      <p>popup样例</p>
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
        winState: false
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
  .button {
    display: block;
    width: 2rem;
    height: 1rem;
  }
</style>
