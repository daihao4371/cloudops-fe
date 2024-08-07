import {BasicColumn, FormSchema} from "@/components/Table";

export const columnsPod: BasicColumn[] = [

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
    title: '状态和webshell执行命令',
    dataIndex: 'status',
    width: 300,
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
  },

  {
    title: '容器组点击查看日志',
    dataIndex: 'containers',
    width: 300,
  },

  {
    title: '容器ready状态',
    dataIndex: 'ready',
  },
  {
    title: '重启次数',
    dataIndex: 'restarts',
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'age',
    sorter: true,
  },
  {
    title: 'cpu申请率',
    dataIndex: 'cpuRequestInfo',
    sorter: true,
  },

  {
    title: 'mem申请率',
    dataIndex: 'memRequestInfo',
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
