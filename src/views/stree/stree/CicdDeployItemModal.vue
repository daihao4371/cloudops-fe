<template>
  <BasicModal :width="1500" v-bind="$attrs" @register="registerModal" :title="getTitle"
              @ok="handleSubmit">
    <BasicForm @register="registerForm"/>


    <a-form ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol"
            :rules="rules">
      <a-divider style="height: 2px; background-color: #7cb305"/>

      <!--       这里是标签-->
      <div class="ports" v-for="(item, index) in form.stagesFront" :key="item">
        <a-row :span="24">
          <a-space size="large">
            <a-form-item
              :wrapper-col="labelCol1"
              label="发布阶段"
              :name="['stagesFront', index, 'name']"
            >
              <a-input v-model:value="item.name"/>
            </a-form-item>

            <a-form-item
              :wrapper-col="labelCol1"
              label="k8s集群和应用"
              name="k8sAppId"
            >

              <a-select
                v-model:value="item.k8sAppId"
                :wrapper-col="labelCol1"
                :options="appOptions"
                showSearch
              >
              </a-select>
            </a-form-item>

            <a-form-item
              :wrapper-col="labelColSmall"
              label="副本数"
              name="replicas"
            >

              <a-input-number
                v-model:value="item.replicas"
                :wrapper-col="labelColSmall"
              >
              </a-input-number>
            </a-form-item>
            <a-form-item>
              <a-button @click="delItemStage(index)">
                <CloseOutlined/>
              </a-button>
            </a-form-item>
          </a-space>
        </a-row>
      </div>
      <a-form-item class="error-infos" :wrapper-col="{ span: 6, offset: 1}">
        <a-button class="add-btn" @click="addItemStage" type="success">
          添加发布阶段
          <PlusOutlined/>
        </a-button>
      </a-form-item>

    </a-form>
  </BasicModal>


</template>
<script lang="ts" setup>
import {defineComponent, ref, computed, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {BasicForm, useForm} from '/@/components/Form/index';
import {MinusOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons-vue";

import {
  createAccount,
  createRole,
  getDeptList, getK8sAppListForSelect, isAccountExist,
  updateAccount,
  updateRole,
  createCicdDeployItem,
  updateCicdDeployItem,

} from '/@/api/demo/system';
import {useMessage} from "@/hooks/web/useMessage";
import {modalFormSchema, modalFormSchemaCicdDeployItem} from "@/views/stree/stree/stree.data";


const isUpdate = ref(false);
const rowId = ref('');
const getTitle = ref("")
const formRef = ref()
const form = ref({
  stagesFront: [
    // {name:"", type: "",mountPath: "", subPath: "",pvcName: "",cmName: "",hostPathPath: "",hostPathType: "",}
  ],
})

const appOptions = ref([]);
const {createMessage} = useMessage();

//  打开页面后就请求
getK8sAppListForSelect().then((res) => {

  appOptions.value = res

}).catch((err) => {
  createMessage.error('获取实例列表失败', err);
}).finally(() => {
});


// 表单标签的宽度
const labelCol = {style: {width: '120px'}}
const labelColSmall = {style: {width: '100px'}}
const labelColBig = {style: {width: '500px'}}
const labelCol1 = {style: {width: '300px'}}
const labelCol2 = {style: {width: '500px'}}
// 表单控件的宽度
const wrapperCol = {span: 12}
const wrapperCol1 = {span: 8}
const node = ref()
const rules = {
  name: [

    {required: true, message: '请输入name', trigger: 'blur'},
    {pattern: new RegExp(/^[0-9a-zA-Z-]{1,}$/, "g"), message: '名称只允许包含数字、字母和下划线'}
  ],
}


function addItemStage() {
  const item = {name: "", k8sAppId: "",replicas:1,};
  form.value.stagesFront.push(item);
}

function delItemStage(i) {
  if (form.value.stagesFront.length === 0) {
    return;
  }
  form.value.stagesFront.splice(i, 1);
}

const [registerForm, {
  setFieldsValue,
  removeSchemaByField,
  updateSchema,
  appendSchemaByField,
  resetFields,
  validate,
  getFieldsValue,
  clearValidate
}] = useForm({
  labelWidth: 200,
  baseColProps: {span: 24},
  schemas: modalFormSchemaCicdDeployItem,
  showActionButtonGroup: false,
  actionColOptions: {
    span: 23,
  },
});


const emit = defineEmits(['success', 'register']);
const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
  console.log("打开模态框的数据", data)
  resetFields();
  setModalProps({
    confirmLoading: false,
    afterClose: () => {
      //  模态框完成后的回调 重新刷新
      // location.reload()
    },

  });

  var opsAdmins = data.node.ops_admin_users
  if (opsAdmins == null) {
    opsAdmins = []
    data.node.ops_admin_users = opsAdmins
  }

  getTitle.value = "编辑树节点的服务发布项：" + data.node.nodePath
  //  打开模态框的时候 就应该把数据塞入form
  setFieldsValue({
    ...data.cicdDeployItem,

  });
  console.log("data.cicdDeployItem",data.cicdDeployItem)
  if (data.cicdDeployItem) {
    form.value.stagesFront = data.cicdDeployItem.stagesFront
    isUpdate.value = true
  }

  node.value = data.node
});


async function handleSubmit() {
  try {


    const values = await validate();
    setModalProps({confirmLoading: true});
    // TODO custom api
    var reqData = getFieldsValue()
    var stageData = form.value

    console.log("node.value", node.value)
    console.log("stageData", stageData)
    reqData["stagesFront"] = stageData.stagesFront
    reqData["treeNodeId"] = node.value.id


    const {createMessage} = useMessage();

    var modFunc = createCicdDeployItem
    if (unref(isUpdate)) {
      modFunc = updateCicdDeployItem
    }
    modFunc(reqData).then(() => {
      // menuFunc(getFieldsValue()).then(() => {
      createMessage.success(`${getTitle.value}成功`);
    }).catch(() => {
      createMessage.error(`${getTitle.value}失败`);
    })


    closeModal();
    emit('success', {isUpdate: unref(isUpdate), values: {...values, id: rowId.value}});

  } finally {
    setModalProps({confirmLoading: false});

  }

}

</script>
