<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="800px"
    @ok="handleSubmit"
  >
    <a-tag  color="green" >输出内容</a-tag>
    <a-textarea  v-model:value="outPut" disabled autoSize ></a-textarea>

  </BasicDrawer>
</template>
<script lang="ts" setup>
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';

import {defineComponent, reactive, ref, unref, toRefs} from "vue";


import {
  createJobExecScript,
  createMenu, createProcess, createWorkOrderTemplate, updateJobExecScript,
  updateMenu, updateProcess, updateWorkOrderTemplate,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增脚本模板');
const outPut = ref(``);
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);


const {createMessage} = useMessage();





const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = data.title

  outPut.value = data.outPut
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });

});


async function handleSubmit() {
  try {
    setDrawerProps({confirmLoading: true});
    closeDrawer();

    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
  }
}
</script>
