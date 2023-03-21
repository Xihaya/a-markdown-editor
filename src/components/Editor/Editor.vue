<template>
  <div class="container">
    <v-md-editor
      v-model="markdownContent"
      :height="mdEditorHeight"
      :right-toolbar="rightToolbar"
      :left-toolbar="leftToolbar"
      @save="methods.save"
    ></v-md-editor>
  </div>
</template>

<script setup>
import {defineComponent, reactive, toRefs} from 'vue'
import {useMarkdownStore} from "stores/mdStore";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const store = useMarkdownStore();
const $q = useQuasar();
const editorData = reactive({
  rightToolbar: "preview toc sync-scroll",
  leftToolbar: "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save"
})

let {text, rightToolbar, leftToolbar} = toRefs(editorData);
let {markdownContent,mdEditorHeight} = storeToRefs(store);

const methods = {
  async save() {
    const res = await store.saveMarkdownFile();
    if (res) {
      $q.notify({
        message: '保存成功',
        color: 'positive',
        position: 'top',
        timeout: 1000
      })
    }
  }
}

defineComponent({
  name: 'Editor'
})
</script>

<style scoped lang="scss">
.container{
  height: v-bind(mdEditorHeight);
  width: 100%;
  margin-top: calc(32px + 29px); // q-header高度
  overflow: hidden;
}
</style>
