import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {getAccountList, getFormDesignList, getProcessList, setRoleStatus} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import { defineComponent, ref } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '工单模板名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 200,
  },
  {
    title: '关联审批流程',
    dataIndex: 'processName',
    width: 300,
  },
  {
    title: '关联表单设计',
    dataIndex: 'formDesignName',
    width: 300,
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



export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '工单模板名称',
    required: true,
    component: 'Input',
  },
  {
    label: '关联审批流程',
    field: 'formDesignID',
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      api: getFormDesignList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 8},
  },

  {
    label: '关联表单设计',
    field: 'processID',
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      api: getProcessList,
      resultField: 'items',  // total items 数据结构
      labelField: 'name', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 8},
  },
  {
    field: 'id',
    label: 'id',
  },
];
