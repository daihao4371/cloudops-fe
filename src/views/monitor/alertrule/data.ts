import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getMonitorScrapePoolList,
  getMonitorSendGroupList,
  getLeafStreeNodes,
  setRoleStatus,
  getStreeNodeSelect
} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left',
  },
  {
    title: '告警规则名称',
    dataIndex: 'name',
  },

  {
    title: '关联Prometheus规则池',
    dataIndex: 'poolName',
  },
  {
    title: '关联发送组',
    dataIndex: 'sendGroupName',
  },
  {
    title: '告警级别',
    dataIndex: 'severity',
  },
  {
    title: '是否开启',
    dataIndex: 'enable',
  },
  {
    title: '绑定服务树节点',
    dataIndex: 'nodePath',
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 180,
  },

];





//   {
//     title: '分组英文名称 点击跳转排班表',
//     dataIndex: 'name',
//   },
//   {
//     title: '分组中文名称',
//     dataIndex: 'nameZh',
//   },

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {span: 8},
  },

  {
    field: 'nodePath',
    label: '服务树节点名称',
    component: 'Input',
    colProps: {span: 8},
  },


];

const needUpgrade = (needUpgrade: number) => needUpgrade === 1;


export const formSchema: FormSchema[] = [


  {
    field: 'enable',
    label: '是否开启',
    defaultValue: 1,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '开启', value: 1},
        {label: '禁用', value: 2},
      ],
    },
  },

  {
    field: 'severity',
    label: '告警级别',
    required: true,
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        //   "pendingApproval": "待审批的",
        //   "approvalReject": "审批拒绝的",
        //   "pendingAction": "待执行的",
        //   "finished": "已执行完成的",
        { label: '严重的', value: 'critical' },
        { label: '一般的', value: 'warning' },
        { label: '通知型', value: 'info' },
      ],
    },
    colProps: {span: 24},
  },
  //  下面是共用的
  {
    field: 'name',
    label: '告警规则名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },



  {
    label: '绑定Prometheus规则池',
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
    label: '绑定发送组',
    field: 'sendGroupId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getMonitorSendGroupList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  {
    label: '绑定服务树节点',
    field: 'treeNodeId',
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      api: getStreeNodeSelect,
      // resultField: 'items',  // total items 数据结构
      labelField: 'nodePath', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },


  {
    field: 'forTime',
    label: '告警持续时间for',
    required: true,
    defaultValue: "1m",
    component: 'Input',
    show: true,
    colProps: {span: 24},
  },
  {
    field: 'grafanaLink',
    label: 'grafana大盘链接',
    component: 'InputTextArea',
    show: true,
    colProps: {span: 24},
  },

  {
    field: 'labelsFront',
    label: '标签组labels',
    helpMessage: ['每一行1个分组的标签', '多行输入'],
    component: 'InputTextArea',
    colProps: {span: 24},
  },

  {
    field: 'annotationsFront',
    label: '信息标签annotations',
    helpMessage: ['每一行1个分组的标签', '多行输入'],
    component: 'InputTextArea',
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
