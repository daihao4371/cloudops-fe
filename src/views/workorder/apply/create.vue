<template>


<div>
  <PageWrapper
    :title="title"
    contentBackground
    :content="flowNodeStr"
    contentClass="p-4"
  >
    <a-col :span="16">
    <BasicForm @register="register" />
    <VFormCreate
      :form-config="formConfig"
      v-model:fApi="fApi"
    >
    </VFormCreate>
    <a-button type="primary" @click="handleCreateOrder"> 点击创建工单 </a-button>
    </a-col>
  </PageWrapper>

</div>
</template>

<script lang="ts" setup>
import { PageWrapper } from '/@/components/Page';
import { useRoute } from 'vue-router'
import {createWorkOrderInstance, getWorkOrderTemplateDetail} from "@/api/demo/system";
import {useMessage} from "@/hooks/web/useMessage";
import { BasicForm, useForm } from '/@/components/Form';
import VFormCreate from '@/views/form-design/components/VFormCreate/index.vue';
import {IVFormMethods} from "@/views/form-design/hooks/useVFormMethods";
import {formSchema} from "./data"
import {IFormConfig} from "@/views/form-design/typings/v-form-component";
import {ref} from "vue";
import {router} from "@/router";

// const formConfig = ref({})    // 这样写会报错 useFormInstanceMethods.ts:20 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'forEach')
// const formConfig = ref()    // 这样写会报错 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'layout')
const formConfig = ref<IFormConfig>({
  // 表单配置
  schemas: [],
  layout: 'horizontal',
  labelLayout: 'flex',
  labelWidth: 100,
  labelCol: {},
  wrapperCol: {},
  currentItem: {
    component: '',
    componentProps: {},
  },
  activeKey: 1,
});
const fApi = ref<null | IVFormMethods>(null);



const { query } = useRoute()
const  workOrderTemplate = ref()
const  title = ref("")
const  flowNodeStr = ref("")
const { createMessage } = useMessage();

const [register, { validate,getFieldsValue, setProps }] = useForm({
  showActionButtonGroup: false,
  labelWidth: 100,
  labelCol: {
    span: 40,
  },
  wrapperCol: {
    span:24,
  },
  schemas: formSchema,
  actionColOptions: {
    offset: 8,
    span: 23,
  },
  submitButtonOptions: {
    text: '提交',
  },
  // submitFunc: customSubmitFunc,
});

console.log("请求的参数",query)
console.log("请求的参数",query.tplId)


getWorkOrderTemplateDetail(query.tplId).then(( res) => {
  console.log("请求的结果",res)
  workOrderTemplate.value = res
  const jsonConfig = JSON.parse(res.formDesign.formConfig)

  formConfig.value = jsonConfig
  console.log("formConfig结果",formConfig.value)
  title.value = `创建${workOrderTemplate.value.name}工单`
  flowNodeStr.value = `审批流程为 ${ workOrderTemplate.value.process.flowNodeStr }`
}).catch(() => {
  createMessage.error('获取工单模板失败');
}).finally(() => {});



const handleCreateOrder = async () => {
  const formDesignData = await fApi.value.submit?.();

  const reqData = getFieldsValue()
  console.log("formDesign的数据",formDesignData)
  reqData["templateId"] = Number(query.tplId)
  reqData["actualApiJsonData"] =  JSON.stringify(formDesignData)
  console.log("reqData",reqData)

  createWorkOrderInstance(reqData).then(() => {
    createMessage.success('创建工单成功');
  }).catch(() => {
    createMessage.error('创建工单失败');
  }).finally(() => {});

  // 跳转到工单查询的页面
  router.push("/workOrder/search");

};

</script>

<style scoped>

</style>
