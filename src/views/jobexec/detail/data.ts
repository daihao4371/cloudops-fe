import {BasicColumn, FormSchema} from '/@/components/Table';
import {getAccountList, getAllRoleList, setRoleStatus} from '/@/api/demo/system';

export const columns: BasicColumn[] = [

  {
    title: '主机名',
    dataIndex: 'hostName',
    width: 50,
  },
  {
    title: 'ip',
    dataIndex: 'hostIp',
    width: 50,
  },
  {
    title: '当前状态',
    dataIndex: 'status',
    width: 50,
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 70,
  },
  {
    title: '更新时间',
    dataIndex: 'UpdatedAt',
    width: 70,
  },


];



export const searchFormSchema: FormSchema[] = [
  {
    field: 'ip',
    label: 'ip模糊查询',
    component: 'Input',
    colProps: {span: 6},
  },
  {
    field: 'status',
    label: '执行状态',
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        { label: '执行中', value: 'running' },
        { label: '成功', value: 'success' },
        { label: '失败', value: 'failed' },
        { label: '被杀死', value: 'killed' },
      ],
    },
    colProps: {span: 8},
  },
];
