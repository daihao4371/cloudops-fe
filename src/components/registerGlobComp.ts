import type { App } from 'vue';
import { Button } from './Button';
// import { Input, Layout,TreeSelect } from 'ant-design-vue';
import { Input, Layout } from 'ant-design-vue';
import Antd from 'ant-design-vue';
import VXETable from 'vxe-table';

export function registerGlobComp(app: App) {
  // app.use(Input).use(Button).use(Layout).use(VXETable).use(TreeSelect);
  // app.use(Antd).use(Input).use(Button).use(Layout).use(VXETable);
  app.use(Antd).use(Button).use(VXETable);
}
