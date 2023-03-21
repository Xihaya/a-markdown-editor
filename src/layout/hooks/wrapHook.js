import {storeToRefs} from "pinia";
import {reactive, watch} from "vue";
export default function wrapHook(store) {
  // we rely upon
  function minimize() {
    if (process.env.MODE === 'electron') {
      window.myWindowAPI.minimize()
    }
  }
  function toggleMaximize() {
    if (process.env.MODE === 'electron') {
      window.myWindowAPI.toggleMaximize()
    }
  }
  function closeApp() {
    if (process.env.MODE === 'electron') {
      window.myWindowAPI.close()
    }
  }
  async function selectFile() {
    let res = await window.myWindowAPI.selectFile()
    if (res) {
      store.setMarkdownContent(res)
    }
  }
  function newFile() {
    store.setMarkdownContent({content: '#', filePath: ''})
  }
  async function saveFile() {
    await store.saveMarkdownFile();
  }
  async function openHistoryFile(filePath) {
    let res = await window.myWindowAPI.openFile(filePath);
    if (res) {
      store.setMarkdownContent({content: res, filePath: filePath});
    }
  }
  function reloadPage() {
    window.location.reload();
  }
  function onSelectTheme(theme,themeName) {
    // 修改:root的css变量
    Object.entries(theme).forEach(([key, value]) => {
      setRootStyle(`${key}`, value);
    })
    window.localStorage.setItem('themeName', themeName);
    function setRootStyle(key, value) {
      document.documentElement.style.setProperty(key, value);
    }
  }

  let {markdownFilePath} = storeToRefs(store);

  // 从本地存储中获取最近打开的文件
  const localFileHistory = JSON.parse(window.localStorage.getItem('openFileHistory') || '[]')
  let openFileHistory;
  if (localFileHistory.length > 0) {
    openFileHistory = reactive(new Map(localFileHistory))
  }else {
    openFileHistory = reactive(new Map())
  }

  // 监听markdownFilePath变化 保存最近打开的文件
  watch(markdownFilePath, (path) => {
    if (path) {
      // 将path中的文件名提取出来
      let fileName = path.split('\\').pop();
      openFileHistory.set(fileName, path);
      window.localStorage.setItem('openFileHistory', JSON.stringify([...openFileHistory]));
    }
  });

  return {
    openFileHistory,
    minimize,
    toggleMaximize,
    closeApp,
    selectFile,
    saveFile,
    reloadPage,
    openHistoryFile,
    onSelectTheme,
    newFile
  }
}
