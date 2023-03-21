import { boot } from 'quasar/wrappers'
import VueMarkdownEditor from '@kangc/v-md-editor';
import './custom-base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import './vuepress.css';

import Prism from 'prismjs';
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  extend(md) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
  },
});
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app}) => {
  // something to do
  app.use(VueMarkdownEditor);
})
