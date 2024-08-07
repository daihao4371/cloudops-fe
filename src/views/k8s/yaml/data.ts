import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getMonitorScrapePoolList,
  getMonitorSendGroupList,
  getLeafStreeNodes,
  setRoleStatus,
  getStreeNodeSelect, getMonitorAlertmanagerPoolList, getK8sClusterList, getK8sYamlTemplateList
} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columnsYamlTemplate: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },

  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 180,
  },

];

export const columnsYamlTask: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '集群名称',
    dataIndex: 'clusterName',
  },
  {
    title: '关联模板',
    dataIndex: 'templateName',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '执行结果',
    dataIndex: 'applyResult',
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

const needUpgrade = (needUpgrade: number) => needUpgrade === 1;


export const formSchemaTemplate: FormSchema[] = [



  //  下面是共用的
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
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

export const formSchemaTask: FormSchema[] = [



  //  下面是共用的
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },



  {
    label: '绑定k8s集群',
    field: 'clusterName',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getK8sClusterList,
      resultField: 'items',  // total items 数据结构
      labelField: 'nameZh', // 这个是展示的中文
      valueField: 'name',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  {
    label: '绑定yaml模板',
    field: 'templateId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getK8sYamlTemplateList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },
  {
    field: 'variablesFront',
    label: '模板的变量 格式k=v',
    helpMessage: ['k=v多行输入'],
    component: 'InputTextArea',
    colProps: {span: 24},
    componentProps: {
      placeholder: 'k=v',
      rows: 16,
    },
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


export const ondutyChangeFormSchema: FormSchema[] = [

  {
    label: '调整值班人',
    field: 'targetUserName',
    component: 'ApiSelect',
    // required: true,
    componentProps: {
      api: getAccountList,
      showSearch: true,
      resultField: 'items',  // total items 数据结构
      labelField: 'realName',
      valueField: 'username',
    },
    colProps: {span: 24},
  },

];
