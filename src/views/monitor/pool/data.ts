import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getFormDesignList, getProcessList, getResourceEcslList,setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '采集池名称',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '远程写入地址',
    dataIndex: 'remoteWriteUrl',
    width: 300,
  },
  {
    title: '采集器ip',
    dataIndex: 'prometheusInstances',
  },
  {
    title: '标签组',
    dataIndex: 'externalLabels',
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 180,
  },

];



const supportAlert = (supportAlert: number) => supportAlert === 1;
const supportRecord = (supportRecord: number) => supportRecord === 1;


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
    label: '采集池名称',
    required: true,
    component: 'Input',
    colProps: {span: 12},
  },
  {
    field: 'remoteWriteUrl',
    label: '远端存储地址',
    required: true,
    component: 'Input',
    colProps: {span: 13},
    rules: [{ required: true,type :"url", message: '请输入合法的url' }],
  },

  {
    field: 'externalLabelsFront',
    label: '标签',
    helpMessage: ['每一行key=v', '多行输入'],
    component: 'InputTextArea',
    colProps: {span: 24},
  },


  {
    field: 'scrapeInterval',
    label: '采集间隔',
    component: 'InputNumber',
    show: true,
    colProps: {span: 8},
  },
  {
    field: 'scrapeTimeout',
    label: '采集超时时间',
    defaultValue: 0,
    component: 'InputNumber',
    show: true,
    colProps: {span: 8},
  },
  {
    field: 'remoteTimeoutSeconds',
    label: '写入超时秒数',
    defaultValue: 0,
    component: 'InputNumber',
    show: true,
    colProps: {span: 8},
  },

  {
    label: '采集器实例',
    field: 'prometheusInstances',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getResourceEcslList,
      mode: "multiple",
      resultField: 'items',  // total items 数据结构
      labelField: 'title', // 这个是展示的中文
      valueField: 'ipAddr',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  {
    field: 'supportAlert',
    label: '是否支持告警',
    defaultValue: 2,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '支持', value: 1},
        {label: '不支持', value: 2},
      ],
    },
  },


  {
    field: 'remoteReadUrl',
    label: '远程读取的地址',
    component: 'Input',
    colProps: {span: 24},
    ifShow: ({values}) => supportAlert(values.supportAlert),
  },
  {
    field: 'alertManagerUrl',
    label: 'alertmanager的地址',
    component: 'Input',
    colProps: {span: 24},
    ifShow: ({values}) => supportAlert(values.supportAlert),
  },
  {
    field: 'ruleFilePath',
    label: 'rule文件路径',
    component: 'Input',
    colProps: {span: 24},
    ifShow: ({values}) => supportAlert(values.supportAlert),
  },


  {
    field: 'supportRecord',
    label: '是否支持预聚合',
    defaultValue: 1,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '支持', value: 1},
        {label: '不支持', value: 2},
      ],
    },
  },
  {
    field: 'recordFilePath',
    label: 'record文件路径',
    component: 'Input',
    defaultValue: '/opt/app/prometheus/record.yml',
    colProps: {span: 24},
    ifShow: ({values}) => supportRecord(values.supportRecord),
  },

  {
    field: 'id',
    label: 'id',
  },
  {
    field: 'UserID',
    label: 'UserID',
  },
];
