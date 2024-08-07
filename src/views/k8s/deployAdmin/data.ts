import {BasicColumn, FormSchema} from "@/components/Table";

export const columnsDeploy: BasicColumn[] = [

  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'ns',
    dataIndex: 'namespace',
  },
  {
    title: 'ready状态',
    dataIndex: 'readyStatus',
  },
  {
    title: '已更新副本数',
    dataIndex: 'updatedReplicas',
  },
  {
    title: '可用副本数',
    dataIndex: 'availableReplicas',
  },

  {
    title: '容器组点击查看日志',
    dataIndex: 'containerImages',
    width: 800,
  },


];


export const searchFormSchemaPods: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {span: 8},
  },
];

export const formSchema: FormSchema[] = [

  {
    field: 'image',
    label: '镜像地址',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },

];


export const formSchemaScale: FormSchema[] = [
  {
    field: 'replicas',
    label: '目标副本数',
    defaultValue: 1,
    component: 'InputNumber',
    colProps: {span: 12},
    required: true,
  },
];
