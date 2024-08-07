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
import { Description, DescItem, useDescription } from '/@/components/Description/index';

export const K8sNodeDetailSchema: DescItem[] = [
  {
    field: 'name',
    label: '节点名称',
    // labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '微软雅黑', fontStyle:'italic'}
    labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
    // labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,}
  },
  {
    field: 'ip',
    label: 'ip地址',
    labelStyle: { color: 'green',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'podNum',
    label: 'pod数量',
    labelStyle: { color: 'blue',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'age',
    label: '创建时间',
  },
  {
    field: 'status',
    label: '状态',
  },


  {
    field: 'osVersion',
    label: '操作系统',
    labelStyle: { color: 'green',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'kubeletVersion',
    label: 'k8s版本',
    labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },



  {
    field: 'kernelVersion',
    label: '内核版本',
  },
  {
    field: 'criVersion',
    label: 'cri版本',
  },
  {
    field: 'cpuCores',
    label: 'cpu核数',
    labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },

  {
    field: 'memGibs',
    label: '内存大小',
    labelStyle: { color: 'blue',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'ephemeralStorage',
    label: '临时存储大小',
  },

  {
    field: 'cpuRequestInfo',
    label: 'cpu申请率',
    labelStyle: { color: 'orange',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'cpuLimitInfo',
    label: 'cpu限制率',
  },
  {
    field: 'cpuUsageInfo',
    label: 'cpu使用率',
    labelStyle: { color: 'green',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'memoryRequestInfo',
    label: '内存申请率',
    labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}
  },
  {
    field: 'memoryLimitInfo',
    label: '内存限制率',
  },
  {
    field: 'memoryUsageInfo',
    label: '内存使用率',
  },


];

export const columns: BasicColumn[] = [

  {
    title: '节点名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
  },

  {
    title: '标签和污点',
    dataIndex: 'labels',
  },
  {
    title: 'pod数量',
    dataIndex: 'podNum',
    sorter: true,
  },

  {
    title: '创建时间',
    dataIndex: 'age',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '是否可调度',
    dataIndex: 'scheduleEnable',
  },
  {
    title: '操作系统',
    dataIndex: 'osVersion',
  },
  {
    title: 'k8s版本',
    dataIndex: 'kubeletVersion',
  },



  {
    title: 'cpu申请率',
    dataIndex: 'cpuRequestInfo',
  },
  {
    title: 'cpu使用率',
    dataIndex: 'cpuUsageInfo',
  },
  {
    title: 'mem申请率',
    dataIndex: 'memoryRequestInfo',
  },
  {
    title: 'mem使用率',
    dataIndex: 'memoryUsageInfo',
  },


];



export const columnsPodOnNode: BasicColumn[] = [

  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: 'ns',
    dataIndex: 'namespace',
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '容器ready状态',
    dataIndex: 'ready',
  },
  {
    title: '重启次数',
    dataIndex: 'restarts',
  },
  {
    title: '创建时间',
    dataIndex: 'age',
  },
  {
    title: 'cpu申请率',
    dataIndex: 'cpuRequestInfo',
  },

  {
    title: 'mem申请率',
    dataIndex: 'memRequestInfo',
  },

];

export const columnsNodeCondition: BasicColumn[] = [

  {
    title: '类别',
    dataIndex: 'type',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '原因',
    dataIndex: 'reason',
  },
  {
    title: '信息',
    dataIndex: 'message',
  },

  {
    title: '最后的检测时间',
    dataIndex: 'lastHeartbeatTime',
  },
  {
    title: '最后的迁移时间',
    dataIndex: 'lastTransitionTime',
  },


];

// type OneEvent struct {
// 	Type      string `json:"type"`
// 	Component string `json:"component"`
// 	Reason    string `json:"reason"`
// 	Message   string `json:"message"`
// 	FirstTime string `json:"firstTime"`
// 	LastTime  string `json:"lastTime"`
// 	Object    string `json:"object"`
// 	Count     int    `json:"count"`
// }

export const columnsNodeEvent: BasicColumn[] = [

  {
    title: '状态',
    dataIndex: 'type',
  },
  {
    title: '事件源',
    dataIndex: 'component',
  },
  {
    title: '对象',
    dataIndex: 'object',
  },
  {
    title: '原因',
    dataIndex: 'reason',
  },
  {
    title: '信息',
    dataIndex: 'message',
  },

  {
    title: '首次检测时间',
    dataIndex: 'firstTime',
  },
  {
    title: '最后检测时间',
    dataIndex: 'lastTime',
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

export const searchFormSchemaPods: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {span: 8},
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


export const formSchema: FormSchema[] = [



];


export const formSchemaTaint: FormSchema[] = [

  {
    field: 'modType',
    label: '修改类型',
    required: true,
    component: 'Select',
    defaultValue: "add",
    componentProps: {
      options: [
        { label: '新增污点', value: 'add' },
        { label: '删除污点', value: 'del' },
      ],
    },
    colProps: {span: 24},
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

