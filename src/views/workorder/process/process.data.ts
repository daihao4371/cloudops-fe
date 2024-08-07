import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '流程名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 200,
  },
  {
    title: '审批流程',
    dataIndex: 'flowNodeStr',
    width: 300,
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
    label: '名称',
    component: 'Input',
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
    label: '流程名称',
    required: true,
    component: 'Input',
  },
  {
    label: ' ',
    field: 'flowNodes',
    slot: 'flowNodes',
    component: 'Input',
  },

  {
    field: 'id',
    label: 'id',
  },
];
