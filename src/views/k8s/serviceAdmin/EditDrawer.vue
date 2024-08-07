<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="70%"
    @ok="handleSubmit"
  >

    <a-card title="svc表单" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
    <a-form ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item
        :wrapper-col="wrapperCol1"
        label="类型"
        :name="form.type"
      >
        <a-select v-model:value="form.type"  :disabled="isUpdate">
          <a-select-option value="NodePort"> NodePort</a-select-option>
          <a-select-option value="ClusterIP"> ClusterIP</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :wrapper-col="wrapperCol1"
        label="名称"
        :name="form.name"
      >
        <a-input v-model:value="form.name"  :disabled="isUpdate"/>
      </a-form-item>

      <a-form-item
        :wrapper-col="wrapperCol1"
        label="命名空间"
        :name="form.namespace"
      >


        <a-select
          v-model:value="form.namespace"
          :wrapper-col="wrapperCol1"
          :options="nsOptions"
          showSearch
          :disabled="isUpdate"
        >
        </a-select>
      </a-form-item>


      <div class="ports" v-for="(item, index) in form.ports" :key="item">
        <a-row :span="24">
          <a-form-item
            :wrapper-col="labelCol"
            label="端口名称"
            :name="['ports', index, 'name']"
            :rules="rules.name"
          >
            <a-input v-model:value="item.name"/>
          </a-form-item>
          <a-form-item
            :wrapper-col="labelCol"
            label="协议"
            :name="['ports', index, 'protocol']"
            :rules="rules.protocol"
          >
            <a-select v-model:value="item.protocol">
              <a-select-option value="TCP"> TCP</a-select-option>
              <a-select-option value="UDP"> UDP</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :wrapper-col="labelCol"
            label="服务端口"
            :name="['ports', index, 'port']"
            :rules="rules.port"
          >
            <a-input-number v-model:value="item.port" />
          </a-form-item>

          <a-form-item
            :wrapper-col="labelCol"
            label="容器端口"
            :name="['ports', index, 'targetPort']"
            :rules="rules.targetPort"
          >
            <a-input-number v-model:value="item.targetPort"/>
          </a-form-item>

          <a-space size="large" >
          <a-form-item
            :wrapper-col="labelCol"
            label="node端口"
            :name="['ports', index, 'nodePort']"
          >
            <a-input-number v-model:value="item.nodePort"/>
          </a-form-item>

          <a-form-item>
            <a-button @click="delItem(index)" >
              <CloseOutlined/>
            </a-button>
          </a-form-item>
          </a-space>
        </a-row>
      </div>

      <div class="ports" v-for="(item, index) in form.selectors" :key="item">
        <a-row :span="24">
          <a-space size="large" >
          <a-form-item
            :wrapper-col="labelCol1"
            label="标签的key"
            :name="['selectors', index, 'key']"
          >
            <a-input v-model:value="item.key"/>
          </a-form-item>
          <a-form-item
            :wrapper-col="labelCol1"
            label="标签的value"
            :name="['selectors', index, 'value']"
          >
            <a-input v-model:value="item.value"/>
          </a-form-item>
          <a-form-item>
            <a-button @click="delItemSelectors(index)" >
              <CloseOutlined/>
            </a-button>
          </a-form-item>
          </a-space>
        </a-row>
      </div>
    </a-form>
    <a-space size="large" >
    <a-button class="add-btn" @click="addItem" type="success" >
      添加端口设置
      <PlusOutlined/>

    </a-button>

    <a-button class="add-btn" @click="addItemSelectors" type="danger" >
      添加标签选择
      <PlusOutlined/>

    </a-button>
    </a-space>
    <br />
    </a-card>


    <a-col :span="24">



      <BasicForm @register="registerForm"></BasicForm>


    </a-col>
  </BasicDrawer>
</template>
<script lang="ts" setup>
import {ref, computed, unref} from 'vue';
import {BasicForm, useForm} from '/@/components/Form/index';
import {formSchema} from './data';
import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
import {MinusOutlined, CloseOutlined,PlusOutlined} from "@ant-design/icons-vue";

import {
  createMenu,
  createK8sCluster,
  promqlExprCheck,
  k8sCreateOrUpdateServiceOne,
  updateK8sCluster,
  createMonitorScrapePool,
  createProcess,
  createWorkOrderTemplate,
  getLeafStreeNodes,
  getMenuList,
  updateMenu,
  updateMonitorOndutyGroup,
  updateMonitorScrapePool,
  updateProcess,
  updateWorkOrderTemplate,
  getMonitorAlertMangerYamlOne,
  getClusterNamespacesForCascader,
  getClusterNamespacesForSelect,
} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import json from "@/views/demo/editor/json/index.vue";

import "codemirror/mode/javascript/javascript.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type {CmComponentRef} from "codemirror-editor-vue3"
import type {Editor, EditorConfiguration} from "codemirror"


const cluster = ref('')
const namespace = ref('')
const name = ref('')
//  定义ns
const nsOptions = ref([]);



// 开始定义form
const formRef = ref("formRef")
const form = ref({
  name: "",
  namespace:"",
  type:"ClusterIP",
  ports: [
    {port: "", protocol: "", targetPort: ""}
  ],
  selectors:[
    {key:"",value:""}
  ],
})
const rules = ref({
  name: {required: true, message: "请输入name"},
  namespace: {required: true, message: "请输入ns"},
  type: { required: true, message: "请输入类型"},
  port: {required: true, message: "请输入服务端口"},
  protocol: {required: true, message: "请输入协议"},
  targetPort: {required: true, message: "请输入容器端口"},
})
// 表单标签的宽度
const labelCol = {style: {width: '100px'}}
const labelCol1 = {style: {width: '200px'}}
// 表单控件的宽度
const wrapperCol = {span: 18}
const wrapperCol1 = {span: 8}


function stringToNum(value){
  return value.replace(/[^\-?\d.]/g,'')
}

function submitForm() {
  formRef.value.validate().then(() => {

    console.log("form.value", form.value)
  }, (err) => {
    console.log("validate出错", err);
  });
}


function resetForm() {
  formRef.value.resetFields();
}

function addItem() {
  const item = {port: "", protocol: "", targetPort: ""};
  form.value.ports.push(item);
}

function addItemSelectors() {
  const item = {key: "", value: ""};
  form.value.selectors.push(item);
}

function delItem(i) {
  if (form.value.ports.length === 1) {
    return;
  }
  form.value.ports.splice(i, 1);
}

function delItemSelectors(i) {
  if (form.value.selectors.length === 1) {
    return;
  }
  form.value.selectors.splice(i, 1);
}


// 结束定义form


const podContainerOptions = ref([]);
const podContainerName = ref()
const code = ref('')
const cmDataMap = ref({})
const myRef = ref([]);
const setRef = (el) => {
  myRef.value.push(el);
};

const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  // mode: "application/json",
  // mode: {name: "javascript", json: true},
  theme: "dracula", // Theme
  autofocus: true,
}
const tagsColorMapIndex = {
  // "super":"primary danger",
  0: "pink",
  1: "orange",
  2: "green",
  3: "cyan",
  4: "purple",
  5: "red",
  "test1": "success",

};
const tagsColorFunc = function (index) {
  let tmp = tagsColorMapIndex[index]
  if (tmp == null) {
    tmp = "red"
  }
  return tmp
};


function handlePromqlCheck() {

  if (code.value === "") {
    return
  }
  const params = {
    "ql": code.value,
  }
  promqlExprCheck(params).then((res) => {
    // console.log("校验的结果", res)
    if (res.success) {
      createMessage.success(`promql校验成功`);

    } else {
      createMessage.error(`promql校验失败:${res.err}`);
    }


  }).catch((err) => {
    createMessage.error('请求失败', err);
  }).finally(() => {
  });


}


const emit = defineEmits(['success', 'register']);
const isUpdate = ref(true);
const getTitle = ref('新增svc ');
const flowNodesTableData = ref([]);
const defineUserOrGroupOptions = ref([]);

const {createMessage} = useMessage();



const promql = ref('')


const [registerForm, {
  resetFields,
  setFieldsValue,
  validate,
  getFieldsValue,
  updateSchema
}] = useForm({
  labelWidth: 100,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
  showSubmitButton: false,
});

const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {

  getTitle.value = `新增svc: 集群:${data.cluster} `
  cluster.value = data.cluster
  var params={}
  params["cluster"]=cluster.value

  getClusterNamespacesForSelect(params).then((res) => {


    nsOptions.value = res
  }).catch((err) => {
    createMessage.error('获取集群ns列表失败', err);
  }).finally(() => {
  });


  resetFields();
  setDrawerProps({
    confirmLoading: false,
    destroyOnClose: true,
    // closeFunc: data.func,
    closeFunc: reloadWeb,
  });

  isUpdate.value = !!data?.isUpdate;
  if (unref(isUpdate)) {

    getTitle.value = `更新svc: 集群:${data.cluster} ns:${data.record.namespace} name:${data.record.name}`

    form.value = data.record
    setFieldsValue({
      ...data.record,
    });

  }



});

function reloadWeb() {
  location.reload()
}

async function handleSubmit() {
  try {
    // if (!podContainerName.value){
    //   createMessage.error('请先选择容器');
    //   return
    // }

    // const values = await validate();
    const values = await formRef.value.validate();





    setDrawerProps({confirmLoading: true});

    // var reqData = getFieldsValue()
    var formValue = form.value
    //
    // // formRef.value.validate().then(() => {
    // //
    // //   console.log("form.value", form.value)
    // // }, (err) => {
    // //   console.log("validate出错", err);
    // // });
    // //
    //
    // reqData["cluster"] = cluster.value
    // reqData["namespace"] = namespace.value
    // reqData["name"] = name.value
    // reqData["container"] = podContainerName.value

    // TODO custom api

    // 发起请求
    // 判断一下menus的类型

    // 这里是给前端用的
    formValue["cluster"] =   cluster.value


    console.log("k8s集群更新deployment 容器的image 操作要发起请求了 formValue", formValue)

    // var relabelConfigsYamlString = reqData["relabelConfigsYamlString"]
    // if (relabelConfigsYamlString!==""){
    //     const jsonData = JSON.stringify(relabelConfigsYamlString)
    //     console.log("json",jsonData)
    //      reqData["relabelConfigsYamlString"] = jsonData
    //     console.log("json",jsonData)
    //
    // }

    k8sCreateOrUpdateServiceOne(formValue).then(() => {
      createMessage.success(`svc新增或创建成功`);
    }).catch(() => {
      createMessage.error(`svc新增或创建失败`);
    })


    closeDrawer();
    emit('success');
  } finally {
    setDrawerProps({confirmLoading: false});
    // reloadWeb()
  }
}
</script>
