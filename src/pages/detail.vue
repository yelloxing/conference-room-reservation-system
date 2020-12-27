<template>
  <div class="detail-view">
    <header></header>
    <div class="container">
      <h2>会议室详情</h2>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {},
};
</script>
<style lang="scss" scoped>
.detail-view {
  & > header {
    height: 3.8rem;
    background-image: url("../assets/images/icon4.jpg");
    background-size: auto 180%;
    background-position: center top;
  }
  & > .container {
    width: 12rem;
    background-color: #ffffff;
    margin: auto;
    padding: 0.1rem 0;
    box-shadow: 0 0 0.03rem 0.01rem #e4dede;
    border-radius: 0.03rem;
    margin-top: -0.2rem;
    margin-bottom: 0.2rem;
    min-height: 3rem;
    &>h2{
      border-bottom: 1px solid #d2c8c8;
      padding:.2rem 0;
      text-align: center;
    }
  }
}
</style>