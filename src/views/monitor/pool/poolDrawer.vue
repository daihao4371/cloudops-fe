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
  createMenu, createMonitorScrapePool, createProcess, createWorkOrderTemplate,
  updateMenu, updateMonitorScrapePool, updateProcess, updateWorkOrderTemplate,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增采集池');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const { createMessage } = useMessage();



const [registerForm, { resetFields, setFieldsValue, validate,getFieldsValue }] = useForm({
  labelWidth: 200,
  baseColProps: { span: 24 },
  schemas: formSchema,
  showActionButtonGroup: false,
});

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {

  getTitle.value = '新增采集池'


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
  });
  isUpdate.value = !!data?.isUpdate;
  console.log("采集池模态框-isUpdate",isUpdate)
  if (unref(isUpdate)) {
    getTitle.value = '编辑采集池'
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
    var modFunc = createMonitorScrapePool
    if (unref(isUpdate)) {
      modFunc = updateMonitorScrapePool
    }
    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    var reqData =  getFieldsValue()
    var externalLabelsFront =  reqData["externalLabelsFront"]
    var externalLabelsSplitted  = []
    console.log("externalLabelsFront",externalLabelsFront)
    if (externalLabelsFront!=undefined ){
      externalLabelsSplitted = externalLabelsFront.split("\n", );
      // 格式的判断  每个元素都是 k=v
      var externalLabelsOk = true
      externalLabelsSplitted.forEach((val, idx, array) => {
        var kvSplits = val.split("=")
        if (kvSplits.length !==2){
          createMessage.error(`标签格式不符合k=v规范${val}`);
          externalLabelsOk = false
          return
        }

      })
      if (!externalLabelsOk){
        return
      }
    }


    reqData["externalLabels"] = externalLabelsSplitted
    console.log("采集池操作要发起请求了 reqData",reqData)



    modFunc(reqData).then((res) => {
      createMessage.success(`${getTitle.value}成功`);
    }).catch((res) => {
      console.log("返回",res)
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
