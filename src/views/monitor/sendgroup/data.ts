import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getMonitorOndutyGroupList, getMonitorAlertmanagerPoolList, getLeafStreeNodes,setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '分组英文名称 点击跳转排班表',
    dataIndex: 'name',
  },
  {
    title: '分组中文名称',
    dataIndex: 'nameZh',
  },
  {
    title: '关联AlertManager集群',
    dataIndex: 'poolName',
  },
  {
    title: '关联值班组',
    dataIndex: 'onDutyGroupName',
  },
  {
    title: '默认重复发送时间',
    dataIndex: 'repeatInterval',
  },
  {
    title: '是否发送恢复消息',
    dataIndex: 'sendResolved',
  },
  {
    title: 'im飞书群token',
    dataIndex: 'feishuQunRobotToken',
  },
  {
    title: '第一升级人列表',
    dataIndex: 'firstUpgradeUsers',
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
];

const needUpgrade = (needUpgrade: number) => needUpgrade === 1;


export const formSchema: FormSchema[] = [
  //  下面是共用的
  {
    field: 'name',
    label: '发送组英文名称 给alertmanager配置使用',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },
  {
    field: 'nameZh',
    label: '发送组中文名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },


  {
    label: '绑定alertmanager集群',
    field: 'poolId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getMonitorAlertmanagerPoolList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  {
    label: '绑定值班组',
    field: 'onDutyGroupId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getMonitorOndutyGroupList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  {
    field: 'feishuQunRobotToken',
    label: 'Im飞书群webhook机器人token',
    required: true,
    component: 'Input',
    show: true,
    colProps: {span: 24},
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
    field: 'sendResolved',
    label: '是否发送恢复消息',
    defaultValue: 1,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '启用', value: 1},
        {label: '禁用', value: 2},
      ],
    },
  },


  {
    field: 'needUpgrade',
    label: '是否告警升级',
    defaultValue: 2,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '升级', value: 1},
        {label: '不升级', value: 2},
      ],
    },
  },

  {
    label: '第一升级人列表',
    field: 'firstUserNames',
    component: 'ApiSelect',
    componentProps: {
      api: getAccountList,
      mode: "multiple",
      showSearch: true,
      resultField: 'items',  // total items 数据结构
      labelField: 'realName',
      valueField: 'username',
    },
    colProps: {span: 24},
    ifShow: ({values}) => needUpgrade(values.needUpgrade),
  },
  {
    field: 'upgradeMinutes',
    label: '告警多久没恢复就升级(单位分钟)',
    ifShow: ({values}) => needUpgrade(values.needUpgrade),
    defaultValue: 30,
    component: 'InputNumber',
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
