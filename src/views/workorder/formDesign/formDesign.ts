import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getAllRoleList, setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '表单设计名称',
    dataIndex: 'name',
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


export const columnsFlowNode: BasicColumn[] = [
  {
    title: '节点类型',
    dataIndex: 'type',
    // editRow: true,
  },
  {
    title: '执行的人或者组',
    dataIndex: 'defineUserOrGroup',
    // editRow: true,
  },
];


export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '表单设计名称',
    component: 'Input',
    colProps: {span: 8},
  },
  {
    label: '创建人',
    field: 'UserID',
    component: 'ApiSelect',
    componentProps: {
      api: getAccountList,
      resultField: 'items',  // total items 数据结构
      labelField: 'username', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 8},
  },
];

export const  flowNodeTypeOptions = [
  {
    value: 'Approval',
    label: '审批节点',
  },
  {
    value: 'Action',
    label: '执行节点',
  },
  {
    value: 'Stop',
    label: '结束节点',
  }
]



export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '表单设计名称',
    required: true,
    component: 'Input',
    colProps: {span: 12},

  },
  {
    field: 'id',
    label: 'id',
  },
];
