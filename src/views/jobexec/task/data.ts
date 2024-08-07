import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getFormDesignList,
  getJobExecScriptList,
  getProcessList,
  setRoleStatus
} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'title',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '执行账号',
    dataIndex: 'account',
  },
  {
    title: '执行超时时间',
    dataIndex: 'execTimeoutSeconds',
  },

  {
    title: '机器并发数量',
    dataIndex: 'batchSize',
  },
  {
    title: '错误策略',
    dataIndex: 'onErrorStrategy',
  },

  {
    title: '当前状态',
    dataIndex: 'status',
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
    field: 'title',
    label: '任务名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'account',
    label: '执行账号',
    component: 'Select',
    defaultValue: "root",
    componentProps: {
      options: [
        { label: 'root', value: 'root' },
        { label: 'devops', value: 'devops' },
      ],
    },
    colProps: {span: 12},
  },
  {
    field: 'onErrorStrategy',
    label: '错误策略',
    component: 'Select',
    defaultValue: "ignore",
    componentProps: {
      options: [
        { label: 'ignore', value: 'ignore' },
        { label: 'pause', value: 'pause' },
        { label: 'stop', value: 'stop' },
      ],
    },
    // colProps: {span: 12},
  },

  {
    field: 'execTimeoutSeconds',
    label: '执行超时时间',
    required: true,
    defaultValue: 0,
    component: 'InputNumber',
    show: true,
  },
  {
    field: 'batchSize',
    label: '机器并发数量',
    required: true,
    defaultValue: 0,
    component: 'InputNumber',
    show: true,
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
