<template>
  <div class="wrap">
    <!--
      Anything after view="lHh lpr lFf" is only needed
      so we can display this example in the documentation

      Remove this part: container style="height: 400px" class="shadow-2 rounded-borders"
    -->
    <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-bar class="q-electron-drag">
          <q-icon name="laptop_chromebook"/>
          <div class="window-title">
            Markdown
            <span>Editor</span>
          </div>

          <q-space/>

          <q-btn dense flat icon="minimize" @click="minimize"/>
          <q-btn dense flat icon="crop_square" @click="toggleMaximize"/>
          <q-btn dense flat icon="close" @click="closeApp"/>
        </q-bar>

        <div class="q-pa-xs q-pl-md row items-center">
          <div class="cursor-pointer non-selectable q-mr-lg">
            文件
            <q-menu class="text-white wrap-menu">
              <q-list dense style="min-width: 130px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="selectFile">打开...</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="saveFile">保存 ctrl + s</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="newFile">新建 (记得保存)</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>最近的文件</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right"/>
                  </q-item-section>

                  <!-- 最近文件子菜单 -->
                  <q-menu class="text-white wrap-menu" anchor="top end" self="top start">
                    <q-list dense style="min-width: 130px">
                      <q-item
                        clickable
                        v-close-popup
                        v-for="(item,index) in openFileHistory"
                        :key="index"
                      >
                        <q-item-section @click="openHistoryFile(item[1])">{{ item[0] }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-separator/>
                <q-item clickable v-close-popup>
                  <q-item-section @click="reloadPage">重新加载</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <div class="cursor-pointer non-selectable q-mr-lg">
            主题
            <q-menu class="text-white wrap-menu">
              <q-list dense style="min-width: 130px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="onSelectTheme(pornhub,'pornhub')">pornhub</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="onSelectTheme(pica,'pica')">pica</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-header>

      <slot>

      </slot>
    </q-layout>
  </div>
</template>

<script setup>
import {defineComponent, onBeforeMount} from 'vue'
import {useMarkdownStore} from "stores/mdStore";
import wrapHook from "./hooks/wrapHook";

defineComponent({
  name: 'LayoutWrap'
})

const store = useMarkdownStore();
const pica = {
  "--primary-color--": "#ee76a3",
  "--bg-color--": "#ffffff",
  "--text-color--": "#333333",
  "--menu-color--": "#626262",
  "--code-bg-color--": "#a5527c",
  "--border-color--": "#000000",
  "--wrap-bg-color--": "#dd86b2",
  "--menu-tooltip-color--": "#ffffff",
}
const pornhub = {
  "--primary-color--": "#ff9000",
  "--bg-color--": "#1e1e1e",
  "--text-color--": "#e8e8e8",
  "--menu-color--": "#fcfcfc",
  "--code-bg-color--": "#282c34",
  "--border-color--": "#ffffff",
  "--wrap-bg-color--": "#000000",
  "--menu-tooltip-color--": "#000000",
}
const {
  minimize,
  toggleMaximize,
  closeApp,
  selectFile,
  newFile,
  saveFile,
  reloadPage,
  openFileHistory,
  openHistoryFile,
  onSelectTheme,
} = wrapHook(store);

onBeforeMount(() => {
  store.setMdEditorHeight(window.innerHeight);
  window.addEventListener('resize', () => {
    store.setMdEditorHeight(window.innerHeight);
  })
  const themeName = window.localStorage.getItem('themeName');
  themeName && onSelectTheme(
    themeName === 'pica' ? pica : pornhub,
    themeName
  )
})

</script>

<style scoped lang="scss">
.wrap {
  height: 100vh;
  width: 100vw;
  // 关闭滚动条
  overflow: hidden;

  .window-title {
    color: var(--text-color--);
    font-weight: bolder;

    span {
      display: inline-block;
      background-color: var(--primary-color--);
      color: var(--menu-tooltip-color--);
      padding: 0 5px;
      border-radius: 2px;
    }
  }
}
</style>

<style>
.border-gray {
  border: 1px solid #666666;
}
.q-layout__section--marginal {
  background-color: var(--wrap-bg-color--);
  color: #fff;
}
.wrap-menu{
  background-color: var(--wrap-bg-color--);
}
</style>
