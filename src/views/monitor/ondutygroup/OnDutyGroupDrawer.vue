<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="70%"
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
  createMenu, createMonitorOndutyGroup, createMonitorScrapeJob,
  createMonitorScrapePool,
  createProcess,
  createWorkOrderTemplate,
  getLeafStreeNodes,
  getMenuList,
  updateMenu, updateMonitorOndutyGroup,
  updateMonitorScrapePool,
  updateProcess,
  updateWorkOrderTemplate,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import json from "@/views/demo/editor/json/index.vue";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增值班组');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const { createMessage } = useMessage();



const [registerForm, { resetFields, setFieldsValue, validate,getFieldsValue,updateSchema }] = useForm({
  labelWidth: 200,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {

  getTitle.value = '新增值班组'


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("值班组模态框-isUpdate",isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑值班组'



    // updateSchema({
    //   field: 'pId',
    //   componentProps: { treeData },
    // });
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
    var modFunc = createMonitorOndutyGroup
    if (unref(isUpdate)) {
      modFunc = updateMonitorOndutyGroup
    }
    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData =  getFieldsValue()

    console.log("值班组操作要发起请求了 reqData",reqData)

    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }

    modFunc(reqData).then(() => {
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
