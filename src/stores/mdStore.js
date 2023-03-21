import {defineStore} from 'pinia';
import store from './index';
export const useMarkdownStore = defineStore('md', {
  state: () => ({
    markdownContent: '#',
    mdEditorHeight: '539px',
    markdownFilePath: '',
  }),
  actions: {
    setMarkdownContent(markdown) {
      this.markdownContent = markdown.content;
      this.markdownFilePath = markdown.filePath;
    },
    setMdEditorHeight(height) {
      this.mdEditorHeight = (height - 61) + 'px';
    },
    /**
     * 保存markdown文件
     * @returns Promise<Boolean>
     */
    async saveMarkdownFile() {
      if (this.markdownFilePath === ''){
        // 如果文件路径为空，则走另存为逻辑 返回值为{writeFileResult, filePath}
        const saveResult = await window.myWindowAPI.saveFile(this.markdownContent, this.markdownFilePath);
        if (saveResult) {
          this.markdownFilePath = saveResult.filePath;
          return saveResult.writeFileResult;
        }
      }
      return await window.myWindowAPI.saveFile(this.markdownContent, this.markdownFilePath);
    }
  },
  persist: {
    afterRestore: (ctx) => {
      const FilePath = ctx.store.markdownFilePath;
      if (FilePath) {
        window.myWindowAPI.openFile(FilePath).then((mdContent) => {
          ctx.store.setMarkdownContent({content: mdContent, filePath: FilePath});
        })
      }
    }
  },
});

export function useMarkdownStoreWithOut() {
  return useMarkdownStore(store);
}
