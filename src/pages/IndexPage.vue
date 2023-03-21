<template>
  <div class="index-page-container">
    <Editor/>
  </div>
</template>

<script setup>
import {defineComponent} from "vue";
import Editor from "components/Editor/Editor.vue";

defineComponent({
  name: 'IndexPage',
})
</script>

<style lang="scss" scoped>
.index-page-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
}
</style>
