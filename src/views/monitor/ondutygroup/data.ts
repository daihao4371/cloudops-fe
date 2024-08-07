import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getFormDesignList, getMonitorScrapePoolList, getLeafStreeNodes,setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '值班组名称 点击跳转排班表',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '成员列表',
    dataIndex: 'userNames',
    width: 300,
  },
  {
    title: '轮班周期(天)',
    dataIndex: 'shiftDays',
  },

  {
    title: '当天值班人',
    dataIndex: 'todayDutyUser',
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
    label: '值班组名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },
  {
    field: 'shiftDays',
    label: '轮班周期(天)',
    defaultValue: 1,
    component: 'InputNumber',
    show: true,
    colProps: {span: 12},
  },

  {
    label: '调整值班人',
    field: 'userNames',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getAccountList,
      mode: "multiple",
      showSearch: true,
      resultField: 'items',  // total items 数据结构
      labelField: 'realName',
      valueField: 'username',
    },
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
