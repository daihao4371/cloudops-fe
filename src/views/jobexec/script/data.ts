import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getFormDesignList, getProcessList, setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '脚本模板',
    dataIndex: 'name',
    width: 200,
  },

  {
    title: '语言',
    dataIndex: 'lang',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 200,
  },


  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 180,
  },

];





export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {span: 8},
  },
];



export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'lang',
    label: '语言',
  },
  {
    field: 'content',
    label: '内容',
  },
  {
    field: 'id',
    label: 'id',
  },
];
