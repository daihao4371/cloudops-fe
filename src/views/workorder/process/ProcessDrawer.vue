<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="800px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">

    </BasicForm>
    <div>
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'type'">
          <a-select
            ref="select"
            v-model:value="record.type"
            style="width: 120px"
            :options="flowNodeTypeOptions"
          >
          </a-select>
        </template>

        <template v-if="column.key === 'defineUserOrGroup'">
          <a-select
            ref="selectdefineUserOrGroup"
            v-model:value="record.defineUserOrGroup"
            style="width: 120px"
            :options="defineUserOrGroupOptions"
            showSearch
          >
          </a-select>
        </template>

        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)" />
        </template>


      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd" > 新增工作流节点 </a-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import {columnsFlowNode, flowNodeTypeOptions, formSchema } from './process.data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { BasicTree, TreeItem } from '/@/components/Tree';
import {
  BasicTable,
  useTable,
  TableAction,
  BasicColumn,
  ActionItem,
  EditRecordRow,
} from '/@/components/Table';

import {
  createMenu, createProcess,
  createRole, getAllUserAndRoles, getApiList, getApiListAll,
  getMenuList,
  getMenuListAll,
  updateMenu, updateProcess,
  updateRole
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import {useTree} from "@/components/Tree/src/hooks/useTree";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增流程');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const { createMessage } = useMessage();

function handleAdd() {
  const data = getDataSource();
  const addRow: EditRecordRow = {
    type: '',
    defineUserOrGroup: '',
    editable: true,
    key: `${Date.now()}`,
    isNew: true,
  };
  data.push(addRow);
}
const [registerTable, { getDataSource,reload }] = useTable({
  columns: columnsFlowNode,
  showIndexColumn: false,
  dataSource: flowNodesTableData,
  actionColumn: {
    width: 160,
    title: '操作',
    dataIndex: 'action',
    // slots: { customRender: 'action' },
  },
  bordered: true,
  scroll: { y: '100%' },
  pagination: false,
});


function handleEdit(record: EditRecordRow) {
  record.onEdit?.(true);
}




function handleCancel(record: EditRecordRow) {
    const data = getDataSource();
    const index = data.findIndex((item) => item.key === record.key);
    data.splice(index, 1);
}

function handleSave(record: EditRecordRow) {

  console.log("单行保存，record",record)
  record.onEdit?.(false, true);
}

function handleEditChange(data: Recordable) {
  console.log(data);
}

function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {

  return [
    {
      label: '删除',
      onClick: handleCancel.bind(null, record, column),
    },
  ];
}

const [registerForm, { resetFields, setFieldsValue, validate,getFieldsValue }] = useForm({
  labelWidth: 90,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {

  flowNodesTableData.value = []
  getTitle.value = '新增流程'



  //  把用户数据给你设置好
  getAllUserAndRoles().then(( res ) => {
    defineUserOrGroupOptions.value = res
  }).catch(() => {
    createMessage.error(`拉取用户列表失败`);
  })
  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("流程模态框-isUpdate",isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑流程'
    // 这里能拿到data
    // 进行表格的赋值
    flowNodesTableData.value = data.record.flowNodes
    setFieldsValue({
      ...data.record,
    });
  }
});


async function handleSubmit() {
  try {
    const values = await validate();
    setDrawerProps({ confirmLoading: true });
    // TODO custom api
    var menuFunc = createProcess
    if (unref(isUpdate)) {
      menuFunc = updateProcess
    }
    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData =  getFieldsValue()


    console.log("流程操作要发起请求了 reqData",reqData)
    console.log("流程操作要发起请求了 getDataSource",getDataSource())

    reqData["flowNodes"] = getDataSource()


    menuFunc(reqData).then(() => {
      createMessage.success(`${getTitle.value}成功`);
    }).catch(() => {
      createMessage.error(`${getTitle.value}失败`);
    })


    console.log(values);
    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({ confirmLoading: false });
  }
}
</script>
