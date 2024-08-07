import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getFormDesignList,
  getMonitorScrapePoolList,
  getLeafStreeNodes,
  setRoleStatus,
  getResourceEcslList
} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '集群名称 点击跳转排班表',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '实例ip',
    dataIndex: 'alertmanagerInstances',
  },
  {
    title: '默认恢复时间',
    dataIndex: 'resolveTimeout',
  },
  {
    title: '默认分组第一次等待时间',
    dataIndex: 'groupWait',
  },
  {
    title: '默认分组等待间隔',
    dataIndex: 'groupInterval',
  },
  {
    title: '默认重复发送时间',
    dataIndex: 'repeatInterval',
  },
  {
    title: '兜底接收者',
    dataIndex: 'receiver',
  },
  {
    title: '分组的标签',
    dataIndex: 'groupBy',
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
    label: '集群名称',
    required: true,
    component: 'Input',

    colProps: {span: 24},
  },
  {
    label: 'alert实例',
    field: 'alertmanagerInstances',
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
    field: 'resolveTimeout',
    label: '默认恢复时间',
    defaultValue: "30m",
    component: 'Input',
    show: true,
    colProps: {span: 12},
  },
  {
    field: 'groupWait',
    label: '默认分组第一次等待时间',
    defaultValue: "10s",
    component: 'Input',
    show: true,
    colProps: {span: 12},
  },
  {
    field: 'groupInterval',
    label: '默认分组等待间隔',
    defaultValue: "10s",
    component: 'Input',
    show: true,
    colProps: {span: 12},
  },
  {
    field: 'repeatInterval',
    label: '默认重复发送时间',
    defaultValue: "10s",
    component: 'Input',
    show: true,
    colProps: {span: 12},
  },

  {
    field: 'groupByFront',
    label: '分组的标签',
    defaultValue: "alertname",
    helpMessage: ['每一行1个分组的标签', '多行输入'],
    component: 'InputTextArea',
    colProps: {span: 12},
  },
  {
    field: 'receiver',
    label: '兜底接收者',
    defaultValue: "default",
    component: 'Input',
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
