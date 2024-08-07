import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getFormDesignList, getMonitorScrapePoolList, getLeafStreeNodes,setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '采集任务名称',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '服务发现类型',
    dataIndex: 'serviceDiscoveryType',
    width: 300,
  },
  {
    title: '关联采集池',
    dataIndex: 'poolName',
  },

  {
    title: '是否开启',
    dataIndex: 'enable',
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

const isK8s = (serviceDiscoveryType: string) => serviceDiscoveryType === 'kubernetes';


export const formSchema: FormSchema[] = [
  //  下面是共用的
  {
    field: 'name',
    label: '采集任务名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },

  {
    label: '绑定采集池',
    field: 'poolId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getMonitorScrapePoolList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },
  {
    field: 'enable',
    label: '是否开启',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '启用', value: 1},
        {label: '禁用', value: 2},
      ],
    },
  },

  {
    field: 'metricsPath',
    label: '采集路径',
    component: 'Input',
    colProps: {span: 12},
  },

  {
    field: 'scheme',
    label: '采集协议',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'http', value: 'http' },
        { label: 'https', value: 'https' },
      ],
    },
    colProps: {span: 12},
  },

  {
    field: 'scrapeInterval',
    label: '采集间隔',
    component: 'InputNumber',
    show: true,
    colProps: {span: 12},
  },
  {
    field: 'scrapeTimeout',
    label: '采集超时时间',
    defaultValue: 0,
    component: 'InputNumber',
    show: true,
    colProps: {span: 12},
  },




  {
    field: 'id',
    label: 'id',
  },
  {
    field: 'UserID',
    label: 'UserID',
  },
  {
    field: 'serviceDiscoveryType',
    label: '服务发现类型',
    component: 'Select',
    required: true,
    defaultValue: "stree_http",
    componentProps: {
      options: [
        { label: '服务树http', value: 'stree_http' },
        { label: 'k8s', value: 'kubernetes' },
      ],
    },
    colProps: {span: 24},
  },


  {
    field: 'relabelConfigsYamlString',
    label: '自定义的relabel配置',

    helpMessage: ['格式为yaml','去掉外层的缩进', '-在最前'],
    component: 'InputTextArea',
    colProps: {span: 24},
  },

  //  http专属的
  {
    field: 'port',
    label: '机器组件端口',
    component: 'InputNumber',
    colProps: {span: 12},
    ifShow: ({values}) => !isK8s(values.serviceDiscoveryType),
  },
  {
    field: 'refreshInterval',
    label: 'http-sd刷新时间',
    ifShow: ({values}) => !isK8s(values.serviceDiscoveryType),
    defaultValue: 0,
    component: 'InputNumber',
    colProps: {span: 12},
  },

  {
    label: '绑定服务树叶子节点id',
    // field: 'treeNodeIds',
    field: 'treeNodeIdInts',
    component: 'ApiSelect',
    ifShow: ({values}) => !isK8s(values.serviceDiscoveryType),
    componentProps: {
      showSearch: true,
      api: getLeafStreeNodes,
      mode: "multiple",
      resultField: 'items',  // total items 数据结构
      labelField: 'nodePath', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  //  k8s专属的

  {
    field: 'kubernetesSdRole',
    label: 'k8s服务发现类型',
    component: 'Select',
    ifShow: ({values}) => isK8s(values.serviceDiscoveryType),
    componentProps: {
      options: [
        { label: 'node', value: 'node' },
        { label: 'podAdmin', value: 'podAdmin' },
        { label: 'endpoint', value: 'endpoint' },
      ],
    },
    colProps: {span: 16},
  },


  {
    field: 'kubeconfigFilePath',
    label: 'config文件路径',
    helpMessage: ['需要在采集器机器上提前建好'],
    ifShow: ({values}) => isK8s(values.serviceDiscoveryType),
    component: 'Input',
    colProps: {span: 24},
  },

  {
    field: 'tlsCaFilePath',
    label: 'tls-ca文件路径',
    helpMessage: ['需要在采集器机器上提前建好'],
    ifShow: ({values}) => isK8s(values.serviceDiscoveryType),
    component: 'Input',
    colProps: {span: 24},
  },

  {
    field: 'bearerTokenFile',
    label: 'rbac-token文件路径',
    helpMessage: ['需要在采集器机器上提前建好'],
    ifShow: ({values}) => isK8s(values.serviceDiscoveryType),
    component: 'Input',
    colProps: {span: 24},
  },


];
