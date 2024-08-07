import { getAllRoleList, isAccountExist } from '/@/api/demo/system';

export const columns = [
  { title: '用户名', dataIndex: 'username', width: 120 },
  { title: '昵称', dataIndex: 'realName', width: 120 },
  { title: '创建时间', dataIndex: 'CreatedAt', width: 180 },
  { title: '角色列表', dataIndex: 'roles', width: 200 },
  { title: '备注', dataIndex: 'desc' },
];

export const searchFormSchema = [
  { field: 'account', label: '用户名', component: 'Input', colProps: { span: 8 } },
  { field: 'nickname', label: '昵称', component: 'Input', colProps: { span: 8 } },
];

const isNormalUser = (accountType) => accountType === 1;

export const accountFormSchema = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      { required: true, message: '请输入用户名' },
      {
        validator(rule, value) {
          return new Promise((resolve, reject) => {
            isAccountExist(value)
                .then(() => resolve())
                .catch((err) => reject(err.message || '验证失败'));
          });
        },
      },
    ],
  },
  {
    field: 'accountType',
    label: '账号类型',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '普通用户', value: 1 },
        { label: '服务账号', value: 2 },
      ],
    },
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: ({ values }) => isNormalUser(values.accountType) && !values.id,
  },
  { field: 'id', label: 'id' },
  { field: 'homePath', label: 'homePath' },
  {
    label: '角色',
    field: 'roles',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      mode: 'multiple',
      resultField: 'roles',
      labelField: 'roleName',
      valueField: 'roleValue',
    },
    required: true,
    ifShow: ({ values }) => isNormalUser(values.accountType),
  },
  {
    field: 'realName',
    label: '中文名',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isNormalUser(values.accountType),
  },
  {
    field: 'feiShuUserId',
    label: '飞书私聊id',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isNormalUser(values.accountType),
  },
  {
    label: '备注',
    field: 'desc',
    component: 'InputTextArea',
    ifShow: ({ values }) => isNormalUser(values.accountType),
  },
  {
    field: 'serviceAccountToken',
    label: 'token',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isNormalUser(values.accountType),
  },
  { label: 'enable', field: 'enable' },
];
