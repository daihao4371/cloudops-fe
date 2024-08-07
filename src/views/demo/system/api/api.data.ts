import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Tag} from 'ant-design-vue';
import name from '@/components/Icon/Icon.vue';


export const columns: BasicColumn[] = [
  {
    title: '中文名称',
    dataIndex: 'title',
    width: 200,
    align: 'left',
  },
  {
    title: 'id',
    dataIndex: 'id',
    width: 50,

  },
  {
    title: 'api路径',
    dataIndex: 'path',
    width: 180,
  },
  {
    title: 'http方法',
    dataIndex: 'method',
    width: 80,
  },
  {
    title: '上级id',
    dataIndex: 'pId',
    width: 50,
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 180,
  },
];

const isDir = (type: string) => type === '0';
const isMenu = (type: string) => type === '1';
const isButton = (type: string) => type === '2';

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '菜单名称',

    component: 'Input',
    colProps: {span: 8},
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        {label: '启用', value: '0'},
        {label: '停用', value: '1'},
      ],
    },
    colProps: {span: 8},
  },
];

export const formSchema: FormSchema[] = [

  {
    field: 'type',
    label: 'api类型',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        {label: '父级', value: '0'},
        {label: '子api', value: '1'},
      ],
    },
    colProps: {lg: 24, md: 24},
    required: true,

  },
  {
    field: 'title',
    label: '名称',
    rules: [
      {required: true, message: 'Please input Activity name', trigger: 'blur'},
      // {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
    ],

    component: 'Input',
    required: true,
  },
  {
    field: 'path',
    label: 'api路径',
    rules: [
      {required: true, message: 'Please input Activity name', trigger: 'blur'},
      // {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
    ],

    component: 'Input',
    required: true,
  },

  {
    field: 'pId',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    ifShow: ({values}) => !isDir(values.type),
    required: true,
  },

  {
    field: 'id',
    label: 'id',
  },

  {
    field: 'method',
    defaultValue: 'GET',
    component: 'Select',
    label: 'http方法',
    colProps: { span: 24 },
    componentProps: {
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'UPDATE', label: 'UPDATE' },
        { value: 'DELETE', label: 'DELETE' },
      ],
    },
  },

];
