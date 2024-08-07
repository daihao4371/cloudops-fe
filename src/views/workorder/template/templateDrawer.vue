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

  </BasicDrawer>
</template>
<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema} from './data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

import {
  createMenu, createProcess, createWorkOrderTemplate,
  updateMenu, updateProcess, updateWorkOrderTemplate,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增工单模板');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const { createMessage } = useMessage();



const [registerForm, { resetFields, setFieldsValue, validate,getFieldsValue }] = useForm({
  labelWidth: 90,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {

  getTitle.value = '新增工单模板'


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("工单模板模态框-isUpdate",isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑工单模板'
    // 这里能拿到data
    // 进行表格的赋值
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
    var menuFunc = createWorkOrderTemplate
    if (unref(isUpdate)) {
      menuFunc = updateWorkOrderTemplate
    }
    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData =  getFieldsValue()


    console.log("工单模板操作要发起请求了 reqData",reqData)



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
