<template>



  <div>

    <a-card title="k8s实例编辑" :bordered=true :headStyle="{color:'#f6ac0a',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
      <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
      <a-form ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="名称"
          name="name"
        >
          <a-input v-model:value="form.name"  :disabled="isUpdate"/>
        </a-form-item>

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="从属的应用"
          name="K8sAppID"
        >


          <a-select
            v-model:value="form.K8sAppID"
            :wrapper-col="wrapperCol1"
            :options="appOptions"
            showSearch
            :disabled="isUpdate"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="镜像"
          name="image"
        >
          <a-input v-model:value="form.image"  />
        </a-form-item>

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="副本数"
          name="replicas"
        >
          <a-input-number v-model:value="form.replicas" />
        </a-form-item>

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="资源-cpuRequest"
          name="cpuRequest"

        >
          <a-input v-model:value="form.cpuRequest"  />
        </a-form-item>


        <a-form-item
          :wrapper-col="wrapperCol1"
          label="资源-cpuLimit"
          name="cpuLimit"
        >
          <a-input v-model:value="form.cpuLimit"  />
        </a-form-item>

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="资源-memoryRequest"
          name="memoryRequest"
        >
          <a-input v-model:value="form.memoryRequest"  />
        </a-form-item>

        <a-form-item
          :wrapper-col="wrapperCol1"
          label="资源-memoryLimit"
          :name="form.memoryLimit"
        >
          <a-input v-model:value="form.memoryLimit"  />

<!--          下面是嵌套的字段-->
        </a-form-item>
        <a-divider style="height: 2px; background-color: #7cb305" />
<!--       这里是env环境变量-->
        <div class="ports" v-for="(item, index) in form.envsFront" :key="item">
          <a-row :span="24">
            <a-space size="large" >
              <a-form-item
                :wrapper-col="labelCol1"
                label="环境变量的key"
                :name="['envsFront', index, 'key']"
              >
                <a-input v-model:value="item.key"/>
              </a-form-item>
              <a-form-item
                :wrapper-col="labelCol1"
                label="环境变量的value"
                :name="['envsFront', index, 'value']"
              >
                <a-input v-model:value="item.value"/>
              </a-form-item>
              <a-form-item>
                <a-button @click="delItemenvsFront(index)" >
                  <CloseOutlined/>
                </a-button>
              </a-form-item>
            </a-space>
          </a-row>
        </div>
        <a-form-item class="error-infos" :wrapper-col="{ span: 6, offset: 1}">
        <a-button class="add-btn" @click="addItemenvsFront" type="danger" >
          添加环境变量
          <PlusOutlined/>
        </a-button>
        </a-form-item>

        <a-divider style="height: 2px; background-color: #7cb305" />

        <!--       这里是标签-->
        <div class="ports" v-for="(item, index) in form.labelsFront" :key="item">
          <a-row :span="24">
            <a-space size="large" >
              <a-form-item
                :wrapper-col="labelCol1"
                label="标签的key"
                :name="['labelsFront', index, 'key']"
              >
                <a-input v-model:value="item.key"/>
              </a-form-item>
              <a-form-item
                :wrapper-col="labelCol1"
                label="标签的value"
                :name="['labelsFront', index, 'value']"
              >
                <a-input v-model:value="item.value"/>
              </a-form-item>
              <a-form-item>
                <a-button @click="delItemlabelsFront(index)" >
                  <CloseOutlined/>
                </a-button>
              </a-form-item>
            </a-space>
          </a-row>
        </div>
        <a-form-item class="error-infos" :wrapper-col="{ span: 6, offset: 1}">
          <a-button class="add-btn" @click="addItemlabelsFront" type="success" >
            添加标签选择
            <PlusOutlined/>
          </a-button>
        </a-form-item>



        <a-divider style="height: 2px; background-color: #7cb305" />
        <!--       这里是commandsFront-->
        <div class="ports" v-for="(item, index) in form.commandsFront" >
          <a-row :span="24">
            <a-space size="large" >
              <a-form-item
                :wrapper-col="labelCol2"
                label="命令"
                :name="['commandsFront', index, 'key']"
              >
                <a-input v-model:value="item.key"/>
              </a-form-item>

              <a-form-item>
                <a-button @click="delItemcommandsFront(index)" >
                  <CloseOutlined/>
                </a-button>
              </a-form-item>
            </a-space>
          </a-row>
        </div>
        <a-form-item class="error-infos" :wrapper-col="{ span: 6, offset: 1}">
          <a-button class="add-btn" @click="addItemcommandsFront" type="primary" >
            添加容器启动命令
            <PlusOutlined/>
          </a-button>
        </a-form-item>


        <a-divider style="height: 2px; background-color: #be1d7b" />
        <!--       这里是argsFronts-->
        <div class="ports" v-for="(item, index) in form.argsFront" >
          <a-row :span="24">
            <a-space size="large" >
              <a-form-item
                :wrapper-col="labelCol2"
                label="参数"
                :name="['argsFront', index, 'key']"
              >
                <a-input v-model:value="item.key"/>
              </a-form-item>

              <a-form-item>
                <a-button @click="delItemargsFront(index)" >
                  <CloseOutlined/>
                </a-button>
              </a-form-item>
            </a-space>
          </a-row>
        </div>
        <a-form-item class="error-infos" :wrapper-col="{ span: 6, offset: 1}">
          <a-button class="add-btn" @click="addItemargsFront" type="success" >
            添加容器启动参数
            <PlusOutlined/>
          </a-button>
        </a-form-item>

        <a-divider style="height: 2px; background-color: #7cb305" />



      </a-form>
      <a-space size="large" >

      </a-space>
      <br />
    </a-card>


  </div>



</template>

<script lang="ts" setup>

import {MinusOutlined, CloseOutlined,PlusOutlined} from "@ant-design/icons-vue";


// 开始定义form
import {ref, unref} from "vue";
import {
  createK8sInstanceOne, updateK8sInstanceOne,
  getClusterNamespacesUnique, getK8sInstanceOne,
  getK8sAppListForSelect,
  getStreeNodeSelect, updateProcess
} from "@/api/demo/system";
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";
import {router} from "@/router";
import {del} from "@/views/form-design/components";



const {query} = useRoute()
const {createMessage} = useMessage();


// 定义表单内容
const isUpdate = ref(false);

const formRef = ref()
/*

type OneVolume struct {
	// hostPath configmap emptydir pvc
	Type      string `json:"type"`
	Name      string `json:"name"`
	MountPath string `json:"mountPath"`
	SubPath   string `json:"subPath"`
	// 类型为pvc时才有
	PvcName      string `json:"pvcName"`
	CmName       string `json:"cmName"`
	HostPathPath string `json:"hostPathPath"`
	HostPathType string `json:"hostPathType"`
}

* */
const form = ref({
  name: "",
  // K8sProjectID: "",
  namespace:"",
  replicas: 1,
  envsFront:[],
  serviceType: "ClusterIP",
  labelsFront:[],
  commandsFront: [],
  argsFront: [],
  portJsonFront: [
    // {name:"", protocol: "",port: "", targetPort: "",nodePort: "",}
  ],
  volumeJsonFront: [
    // {name:"", type: "",mountPath: "", subPath: "",pvcName: "",cmName: "",hostPathPath: "",hostPathType: "",}
  ],

  selectors:[
    {key:"",value:""}
  ],
})
// const rules = ref({
//   required: [{required: true, message: "请输入name"}],
//   name: {required: true, message: "请输入name"},
//   namespace: {required: true, message: "请输入ns"},
//   type: { required: true, message: "请输入类型"},
//   port: {required: true, message: "请输入服务端口"},
//   protocol: {required: true, message: "请输入协议"},
//   targetPort: {required: true, message: "请输入容器端口"},
// })
const rules = {
  name: [

    { required: true, message: '请输入name', trigger: 'blur' },
    { pattern: new RegExp(/^[0-9a-zA-Z-]{1,}$/, "g") , message: '名称只允许包含数字、字母和下划线' }
  ],
  K8sAppID:[
    { required: true, message: '请选择实例', trigger: 'blur' },
  ],

  image: [

    { required: true, message: '请输入镜像', trigger: 'blur' },
  ],

  region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
  date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
  desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
};
// 表单标签的宽度
const labelCol = {style: {width: '180px'}}
const labelColSmall = {style: {width: '100px'}}
const labelColBig = {style: {width: '500px'}}
const labelCol1 = {style: {width: '200px'}}
const labelCol2 = {style: {width: '500px'}}
// 表单控件的宽度
const wrapperCol = {span: 18}
const wrapperCol1 = {span: 8}


// 定义各个 apiselect下拉列表
const projectOptions = ref([]);
const appOptions = ref([]);
const treeOptions = ref([]);
const nsOptions = ref([]);


//  如果传入了appId 说明是编辑跳转过来的，那么标记update，禁用一些字段
if (query.instanceId){
  getK8sInstanceOne(query.instanceId).then((res) => {
    //  如果不是copy 那么就是更新
    if (!query.copy){
      isUpdate.value = true
    }else {
      //  如果是copy的 那么把 id等信息删除
      delete res["id"]
      delete res["name"]
      delete res["CreatedAt"]
      delete res["cluster"]
    }
    console.log("getK8sInstanceOne",res)
    form.value = res



  }).catch((err) => {
    createMessage.error('获取实例列表失败', err);
  }).finally(() => {
  });
}


//  打开页面后就请求
getK8sAppListForSelect().then((res) => {

  appOptions.value = res

}).catch((err) => {
  createMessage.error('获取实例列表失败', err);
}).finally(() => {
});




function addItemSelectors() {
  const item = {key: "", value: ""};
  form.value.selectors.push(item);
}

function addItemenvsFront() {
  const item = {key: "", value: ""};
  form.value.envsFront.push(item);
}

function addItemlabelsFront() {
  const item = {key: "", value: ""};
  form.value.labelsFront.push(item);
}

function addItemcommandsFront() {
  const item ={key: "", value: ""};
  form.value.commandsFront.push(item);
}


function addItemargsFront() {
  const item ={key: "", value: ""};
  form.value.argsFront.push(item);
}

function addItemPortJsonFronts() {
  const item ={name:"", protocol: "",port: 0, targetPort: 0,nodePort: 0,}
  form.value.portJsonFront.push(item);
}


function addItemVolumeJsonFronts() {
  const item ={name:"", type: "",mountPath: "", subPath: "",pvcName: "",cmName: "",hostPathPath: "",hostPathType: "",}
  form.value.volumeJsonFront.push(item);
}



function delItemPortJsonFronts(i) {
  if (form.value.portJsonFront.length === 0) {
    return;
  }
  form.value.portJsonFront.splice(i, 1);
}

function delItemSelectors(i) {
  if (form.value.selectors.length === 0) {
    return;
  }
  form.value.selectors.splice(i, 1);
}

function delItemenvsFront(i) {
  if (form.value.envsFront.length === 0) {
    return;
  }
  form.value.envsFront.splice(i, 1);
}

function delItemlabelsFront(i) {
  if (form.value.labelsFront.length === 0) {
    return;
  }
  form.value.labelsFront.splice(i, 1);
}


function delItemcommandsFront(i) {
  if (form.value.commandsFront.length === 0) {
    return;
  }
  form.value.commandsFront.splice(i, 1);
}


function delItemargsFront(i) {
  if (form.value.argsFront.length === 0) {
    return;
  }
  form.value.argsFront.splice(i, 1);
}

function delItemVolumeJsonFronts(i) {
  if (form.value.volumeJsonFront.length === 0) {
    return;
  }
  form.value.volumeJsonFront.splice(i, 1);
}




async function submitForm() {
  // const form = unref(formRef);
  // if (!form) {
  //   return;
  // }
  // const valid = await form.validate();
  // if (!valid){
  //   console.log("valid", valid)
  //   return
  // }
  // console.log("valid", valid)
  var modFunc = createK8sInstanceOne
  if (unref(isUpdate)) {
    modFunc = updateK8sInstanceOne
  }


  formRef.value.validate().then((validateRes) => {

    var data = form.value
    console.log("data", data)
    modFunc(data).then((res) => {
      console.log("创建或更新成功",res)
      createMessage.info('创建或更新成功');
      // if (isUpdate){
      //
      //   location.reload()
      //   return
      // }
      var url= `/k8sApplication/instanceEditor?instanceId=${res.id}`;
      router.push(url)

    }).catch((err) => {
      createMessage.error('创建或更新app出错', err);
    }).finally(() => {
    });

  }, (err) => {
    console.log("validate表单出错", err);
  });
}





</script>

<style scoped>

</style>
