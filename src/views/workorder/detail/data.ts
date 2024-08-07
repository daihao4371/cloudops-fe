import {BasicColumn, FormSchema} from '/@/components/Table';
import {getAccountList, getAllRoleList, setRoleStatus} from '/@/api/demo/system';

export const columns: BasicColumn[] = [

  {
    title: '工单',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 50,
  },
  {
    title: '工单状态',
    dataIndex: 'status',
    width: 50,
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 70,
  },

];

//  	WorkOrderInstanceStatusPendingApproval = "pendingApproval"
// 	WorkOrderInstanceStatusApprovalFaild   = "approvalFailed"
// 	WorkOrderInstanceStatusPendingAction   = "pendingAction"
// 	WorkOrderInstanceStatusFinished        = "finished"
export const workOrderInstanceStatus: object = {
  WorkOrderInstanceStatusPendingApproval: "pendingApproval",
  WorkOrderInstanceStatusPendingAction: "pendingAction"

}


export const workOrderInstanceSearchFormSchema: FormSchema[] = [

  {
    field: 'queryMode',
    label: '查询模式',
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        { label: '我创建的', value: 'mine' },
        { label: '待我审批的', value: 'Approval' },
        { label: '待我执行的', value: 'Action' },
        { label: '全部的', value: 'all' },
      ],
    },
    colProps: {span: 12},
  },
  {
    field: 'name',
    label: '工单名称',
    component: 'Input',
    colProps: {span: 12},
  },
  {
    field: 'status',
    label: '工单状态',
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        //   "pendingApproval": "待审批的",
        //   "approvalReject": "审批拒绝的",
        //   "pendingAction": "待执行的",
        //   "finished": "已执行完成的",
        { label: '待审批的', value: 'pendingApproval' },
        { label: '审批拒绝的', value: 'approvalReject' },
        { label: '待执行的', value: 'pendingAction' },
        { label: '已执行完成的', value: 'finished' },
      ],
    },
    colProps: {span: 12},
  },
  {
    label: '创建人',
    field: 'UserID',
    component: 'ApiSelect',
    componentProps: {
      api: getAccountList,
      resultField: 'items',  // total items 数据结构
      labelField: 'username', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 12},
  },

];



// export const formSchema: FormSchema[] = [
//   {
//     field: 'comment',
//     label: '评论',
//     required: true,
//     component: 'Input',
//     colProps: {span: 12},
//   },
//   {
//     field: 'desireFinishTime',
//     component: 'DatePicker',
//     label: '期望完成时间',
//     colProps: { span: 15 },
//   },
// ];



export const formSchema: FormSchema[] = [


  {
    field: 'comment',
    label: '评论',
    required: true,
    component: 'InputTextArea',
    colProps: {span: 24},
  },
];
