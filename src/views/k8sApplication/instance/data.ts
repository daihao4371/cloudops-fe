import {BasicColumn, FormSchema} from '@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getMonitorScrapePoolList,
  getMonitorSendGroupList,
  getLeafStreeNodes,
  setRoleStatus,
  getStreeNodeSelect,
  getK8sClusterList,
  getK8sProjectListForSelect, getClusterNamespacesUnique,

} from '@/api/demo/system';
import {useMessage} from '@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '名称 点击跳转查看pod日志和执行命令',
    dataIndex: 'name',
  },

  {
    title: '集群',
    dataIndex: 'cluster',
  },
  {
    title: '所属应用',
    dataIndex: 'k8sAppName',
  },

  {
    title: 'dep的状态',
    dataIndex: 'readyStatus',
  },


  {
    title: '镜像',
    dataIndex: 'image',
  },

  {
    title: '副本数',
    dataIndex: 'replicas',
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
    label: '绑定的项目',
    field: 'K8sProjectID',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getK8sProjectListForSelect,
      // resultField: 'items',  // total items 数据结构
      // labelField: 'nameZh', // 这个是展示的中文
      // valueField: 'name',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },
  {
    label: '绑定服务树节点(指定第4层级，可定制)',
    field: 'treeNodeId',

    required: true,
    componentProps: {
      showSearch: true,
      api: getStreeNodeSelect,
      params: {
        // levelLt: 2,
        levelNum: 4,
      },
      // resultField: 'items',  // total items 数据结构
      labelField: 'nodePath', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },
  {
    field: 'namespace',
    label: '命名空间:填入和项目所在集群的',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      api: getClusterNamespacesUnique,
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
