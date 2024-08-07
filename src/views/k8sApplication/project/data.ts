import {BasicColumn, FormSchema} from '@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getMonitorScrapePoolList,
  getMonitorSendGroupList,
  getLeafStreeNodes,
  setRoleStatus,
  getStreeNodeSelect, getK8sClusterList
} from '@/api/demo/system';
import {useMessage} from '@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '英文名称 点击跳转应用列表',
    dataIndex: 'name',
  },
  {
    title: '中文名称 点击跳转计划任务列表',
    dataIndex: 'nameZh',
  },

  {
    title: '集群',
    dataIndex: 'cluster',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },


  {
    title: '绑定的服务树',
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
];

const needUpgrade = (needUpgrade: number) => needUpgrade === 1;


export const formSchema: FormSchema[] = [



  //  下面是共用的
  {
    field: 'name',
    label: '英文名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },
  {
    field: 'nameZh',
    label: '中文名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },

  {
    label: '绑定k8s集群',
    field: 'cluster',
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
    label: '绑定服务树节点(指定第三层级，可定制)',
    field: 'treeNodeId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getStreeNodeSelect,
      params: {
        // levelLt: 2,
        levelNum: 3,
      },
      // resultField: 'items',  // total items 数据结构
      labelField: 'nodePath', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
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
