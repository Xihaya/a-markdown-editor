<template>
  <Wrap>
    <router-view/>
  </Wrap>
</template>

<script setup>
import {defineComponent} from 'vue'
import Wrap from "src/layout/wrap.vue";

defineComponent({
  name: "Layout"
})
</script>

<style scoped lang="scss">
.wrap {
  height: 100vh;
  width: 100vw;
  // 关闭滚动条
  overflow: hidden;

  .window-title {
    color: #FFFFFF;
    font-weight: bolder;
    span {
      display: inline-block;
      background-color: var(--primary-color--);
      color: var(--text-color--);
      padding: 0 5px;
      border-radius: 2px;
    }
  }
}
</style>

