<template>
  <div class="export-page">
    <div class="v-export">
      <div class="export__head">
        <xCheckbox :isGlobal="true" :counterpart="allCheckedName" :check-all-list="checkAllKeys"
                   @handleChange="handleChangeAll"><span>全选</span></xCheckbox>
      </div>
      <div class="export__body">

        <div class="export__items">
          <div v-for="(item, key) in list" class="export__item">
            <xCheckbox :id="item.dressUpId" :counterpart="allCheckedName" @handleChange="handleChange"></xCheckbox>
            <img class="export__preview" :src="item.previewBase64" alt="">
            <p class="export__item-name">{{item.name}}</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  const data = require('./simpie_model.json')
  import xCheckbox from './x-checkbox.vue'
  export default {
    name: 'export-page',
    data () {
      return {
        // ** 必须(当前选中内容) **
        allCheckedName: []
      }
    },
    components: {
      xCheckbox
    },
    computed: {
      list () {
        return data.list
      },
      // ** 必须(全选副本) **
      checkAllKeys () {
        return this.list.map((item) => {
          return item.modelKey
        })
      }
    },
    watch: {
      allCheckedName(val) {
        console.warn(`watch: allCheckedName`, val)
      }
    },
    methods: {
      handleChangeAll (data) {
        if (data.checked) {
          this.allCheckedName = data.checkAllList
        } else {
          this.allCheckedName = []
        }
      },
      handleChange (data) {
        this.allCheckedName = this.allCheckedName.filter((keyId) => {
          return keyId !== data.id
        })
        if (data.checked) {
          this.allCheckedName.push(data.id)
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  .export-page {
    padding: 0 32px 50px;

    .export__head {
      display: flex;
      padding: 0 16px;
      align-items: center;
      height: 40px;
      background-color: #F6F6F6;
    }

    .export__body {
      display: flex;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      flex-flow: row wrap;
      padding: 16px 0 0;
    }

    .export__item {
      position: relative;
    }

    .export__preview {
      display: block;
      width: 268px;
      height: 150px;
      border: 1px solid #EFEFEF;
    }

    .export__item-name {
      line-height: 2.5;
      font-size: 12px;
      color: #363738;
      height: 25px;
      margin-bottom: 6px;
    }
    .checkbox-bueaty {
      margin-top: 5px;
      margin-left: 5px;
    }
  }

</style>
