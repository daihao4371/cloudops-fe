import {BasicColumn, FormSchema} from "@/components/Table";

export const columnsConfigmap: BasicColumn[] = [

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
    title: '文件数量',
    dataIndex: 'fileNum',
  },

  {
    title: 'age',
    dataIndex: 'age',
  },

];


export const columnsConfigmapOne: BasicColumn[] = [
  {
    title: '文件名称',
    dataIndex: 'fileName',
    width: 150,
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: 600,
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


];

export const formSchemaEdit: FormSchema[] = [

  {
    field: 'namespace',
    label: 'namespace',
  },
  {
    field: 'name',
    label: 'name',
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
