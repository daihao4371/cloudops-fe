<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">

    </BasicForm>

  </BasicDrawer>
</template>
<script lang="ts" setup>
import {ref, computed, unref} from 'vue';
import {BasicForm, useForm} from '/@/components/Form/index';
import {formSchema} from './data';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';

import {
  createMenu,
  createMonitorSendGroup,
  updateMonitorSendGroup,
  createMonitorScrapePool,
  createProcess,
  createWorkOrderTemplate,
  getLeafStreeNodes,
  getMenuList,
  updateMenu, updateMonitorOndutyGroup,
  updateMonitorScrapePool,
  updateProcess,
  batchEventAlertSilence,
  updateWorkOrderTemplate, eventAlertSilence,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import json from "@/views/demo/editor/json/index.vue";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增告警屏蔽');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const {createMessage} = useMessage();

const ids = ref([])
const batch = ref(false)

const [registerForm, {
  resetFields,
  setFieldsValue,
  validate,
  getFieldsValue,
  updateSchema
}] = useForm({
  labelWidth: 200,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = '基于event屏蔽'


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("告警屏蔽模态框-isUpdate", isUpdate)
  if (unref(isUpdate)) {
    ids.value = data.ids
    if (data.batch){
      batch.value = true
    }
    setFieldsValue({
      ...data.record,
    });

  }
});


async function handleSubmit() {
  try {
    const values = await validate();
    setDrawerProps({confirmLoading: true});

    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData = getFieldsValue()

    console.log("告警屏蔽操作要发起请求了 reqData", reqData)


    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }
    const id = reqData["id"]

    // 这是单一的
    if (!batch.value){
      eventAlertSilence(id, reqData).then(() => {
        createMessage.success(`${getTitle.value}成功`);
      }).catch(() => {
        createMessage.error(`${getTitle.value}失败`);
      })
    }
    if (batch.value){
      reqData["ids"] = ids.value
      batchEventAlertSilence(reqData).then(() => {
        createMessage.success(`${getTitle.value}成功`);
      }).catch(() => {
        createMessage.error(`${getTitle.value}失败`);
      })
    }





    console.log(values);
    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
  }
}
</script>
