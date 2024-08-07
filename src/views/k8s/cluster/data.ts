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
    title: '创建人',
    dataIndex: 'createUserName',
  },
  {
    title: '近一次探活成功',
    dataIndex: 'lastProbeSuccess',
  },
  {
    title: '英文名称',
    dataIndex: 'name',
  },
  {
    title: '中文名称',
    dataIndex: 'nameZh',
  },
  {
    title: '运行环境',
    dataIndex: 'env',
  },

  {
    title: 'apiserver地址',
    dataIndex: 'apiServerAddr',
  },
  {
    title: '集群版本',
    dataIndex: 'version',
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
    field: 'env',
    label: '运行环境',
    required: true,
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        //   "pendingApproval": "待审批的",
        //   "approvalReject": "审批拒绝的",
        //   "pendingAction": "待执行的",
        //   "finished": "已执行完成的",
        { label: '生产集群', value: 'prod' },
        { label: '预发集群', value: 'stage' },
        { label: '测试集群', value: 'dev' },
        { label: '压测集群', value: 'press' },
      ],
    },
    colProps: {span: 24},
  },


  {
    field: 'actionTimeoutSeconds',
    label: '操作超时秒数',
    defaultValue: 5,
    component: 'InputNumber',
    show: true,
    colProps: {span: 24},
  },


  {
    field: 'kubeConfigContent',
    label: '连接k8s集群的kubeconfig内容',
    helpMessage: ['默认在/root/.kube/config'],
    component: 'InputTextArea',
    colProps: {span: 24},
    componentProps: {
      placeholder: '默认在/root/.kube/config',
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
