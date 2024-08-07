import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getMonitorOndutyGroupList,
  getMonitorAlertmanagerPoolList,
  getLeafStreeNodes,
  setRoleStatus
} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import {defineComponent, ref} from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '告警名称',
    dataIndex: 'alertName',
  },
  {
    title: 'fingerprint指纹id',
    dataIndex: 'fingerprint',
  },

  {
    title: '关联告警规则',
    dataIndex: 'alertRuleName',
  },
  {
    title: '关联发送组',
    dataIndex: 'sendGroupName',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '已重复发送次数',
    dataIndex: 'eventTimes',
  },
  {
    title: '第一次告警时间',
    dataIndex: 'createdTime',
  },
  {
    title: '最近更新时间',
    dataIndex: 'updatedTime',
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
    field: 'silence_time',
    label: '屏蔽时间',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },
  {
    field: 'by_name',
    label: '是否按告警名称屏蔽',
    defaultValue: false,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {label: '启用', value: true},
        {label: '禁用', value: false},
      ],
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
