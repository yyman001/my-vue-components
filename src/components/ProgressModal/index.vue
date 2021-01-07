<template>
  <div>
    <div class="mask"></div>

    <div class="modal">
      <div class="header">
        {{text}}
      </div>
      <div class="content">
        <div class="progressBg">
          <div class="progress" :style="{ width: progress + '%' }">
            <p class="progressInfo">{{progress}}%</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'ProgressModal',
  props: {
    text: {
      type: String,
      default: '游戏模板下载中，请稍后…'
    },
    progress: {
      type: [Number, String],
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .mask {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 100001;
    user-select: none;
    opacity: 0.45;
    background: #000;
  }
  .modal {
    width:950px;
    height:100px;
    box-shadow:0px 9px 50px 0px rgba(0,0,0,0.6);
    border-radius:4px;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 100002;
    margin: -50px -475px;
    background: #2C2C2C;
  }
  .header{
    width:950px;
    height:30px;
    background:#E9E8EA;
    border-radius:4px 4px 0px 0px;
    line-height: 30px;
    text-align: center;
    height:30px;
    font-size:14px;
    font-weight:500;
    color:#2C2C2C;
    position: relative;
  }
  .close{
    width:16px;
    height:16px;
    display: inline-block;
    background: #8A8A8A;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
    position: absolute;
    top: 7px;
    right: 8px;
    border-radius: 100%;
  }
  .progressBg{
    width:820px;
    height:22px;
    background:#383838;
    margin: 24px auto;
  }
  .progress{
    height:22px;
    background:linear-gradient(270deg,#DE6F80 0%,#FC425F 100%);
    line-height: 22px;
    text-align: right;
    color: #fff;
    font-size: 14px;
  }
  .progressInfo{
    margin-right: 5px;
  }
</style>
