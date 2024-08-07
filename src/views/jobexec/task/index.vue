<template>
  <div>
    <BasicTable @register="registerTable" v-if="!isTaskEdit">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增任务</a-button>
      </template>
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'createUserName'">

            <a-button class="primary">{{ record.createUserName }}</a-button>


        </template>
        <template v-if="column.key === 'title'">

          <a-button type="danger"  shape="round" @click="clickDetail(record)" > {{  record.title }}</a-button>


        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑任务'
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除任务',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <a-row>
      <a-col :span="12" v-if="isTaskEdit">
        <a-card :title="editTitle" :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}"
                :bodyStyle="{padding:'5'}">
          <BasicForm @register="registerForm">

          </BasicForm>
          <a-divider/>
          <a-tag color="#55acee"> 选择脚本</a-tag>
          <a-select
            ref="selectdefineUserOrGroup"
            v-model:value="selectScriptObj"
            style="width: 120px"
            :options="selectScriptsOptions"
            @select="selectScriptsFunc"
            showSearch
          >
          </a-select>
          <a-divider/>
          <div v-if="codeShow">
            <a-tag color="#55acee"> 选择语言</a-tag>
            <a-select
              ref="select"
              v-model:value="lang"
              style="width: 120px"
            >
              <a-select-option value="shell">shell</a-select-option>
              <a-select-option value="python">python</a-select-option>
              <a-select-option value="json">json</a-select-option>
              <a-select-option value="yaml">yaml</a-select-option>
            </a-select>
            <Codemirror
              v-model:value="code"
              :options="cmOptions"
              border
              ref="cmRef"
              height="1000"
              width="1000"
            >
            </Codemirror>


          </div>


          <a-button type="primary" shape="round" @click="cancelEdit"> 取消编辑</a-button>
          <a-button type="danger" shape="round" @click="handleSubmit"> 提交编辑</a-button>
        </a-card>
      </a-col>

      <a-col :span="12" v-if="isTaskEdit">
        <a-card title="树节点选择" :bordered=true :headStyle="{color:'#f9033e',fontSize: 20}"
                :bodyStyle="{padding:'5'}">
          <a-tag color="#55acee">
            选择节点
          </a-tag>
          <a-tree-select
            v-model:value="nodeSelect"
            @select="onSelect"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeDataApi"
            treeDataSimpleMode
            placeholder="Please select"
            allow-clear
            tree-default-expand-all
            title="选择执行节点"
          >
          </a-tree-select>


          <a-transfer
            v-if="showHostTransferIf"
            :titles="['待选择的', '已选中的']"
            :data-source="ecsListData"
            show-search
            :list-style="{
                    width: '350px',
                    height: '500px',
                  }"
            :selected-keys="ecsBindSelectedKeys"
            :target-keys="ecsBindTargetKeys"
            :render="item => item.ipAddr"
            @change="ecsBindHandleChange"
            @selectChange="ecsBindHandleSelectChange"
          />


        </a-card>
      </a-col>
    </a-row>
  </div>


</template>

<script lang="ts" setup>

import {BasicForm, useForm} from '/@/components/Form/index';
import {BasicTable, useTable, TableAction} from '/@/components/Table';
import {
  deleteWorkOrderTemplate, fetchResourceByNode,
  getAllUserAndRoles,
  getJobExecScriptList, getJobExecScriptOne,
  getJobTaskList, createJobTask,
  getJobExecScriptSelect, getResourceEcsUnbindList, getStreeNodeSelect
} from "@/api/demo/system";
import {columns, searchFormSchema, formSchema} from "./data";
import {useMessage} from "@/hooks/web/useMessage";


import "codemirror/mode/javascript/javascript.js"
import Codemirror from "codemirror-editor-vue3"
import "codemirror/theme/dracula.css";
import type { CmComponentRef } from "codemirror-editor-vue3"
import type { Editor, EditorConfiguration } from "codemirror"


import {defineComponent, reactive, ref, unref, toRefs} from "vue";
import DynamicInfo from "@/views/dashboard/workbench/components/DynamicInfo.vue";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";
const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  // mode: "application/json",
  // mode: {name: "javascript", json: true},
  theme: "dracula", // Theme
  autofocus: true,
}


const {createMessage} = useMessage();
const code = ref(``)
const lang = ref(`python`)

const isTaskEdit = ref(false)
const isUpdate = ref(false)
const codeShow = ref(false)
const showHostTransferIf = ref(false)
const editTitle = ref(`新增任务`)
const selectScriptsOptions = ref([])
const selectScriptObj = ref('')
const nodeSelect = ref()


//  穿梭框的数据

var ecsListData = ref([])
var ecsBindSelectedKeys = ref([])
var ecsBindTargetKeys = ref([])
const ecsBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
  ecsBindTargetKeys.value = nextTargetKeys;
};
const ecsBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
  ecsBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
};


function clickDetail(item) {
  // 执行刷新
  // go();
  // router.push(PageEnum.BASE_HOME);
  router.push("/jobexec/detail?taskId="+item.id);
  // go(PageEnum.BASE_HOME,false);

}

const treeDataApi = ref<TreeItem[]>([]);


const onSelect = (selectedKeys, e) => {
  console.log(selectedKeys)
  console.log(e)
  nodeSelect.value = e
  var fetchResourceEcsParams = {}
  fetchResourceEcsParams["resourceType"] = "ecs"
  fetchResourceEcsParams["nodeId"] = e.id
  fetchResourceEcsParams["pageSize"] = 100
  fetchResourceByNode(fetchResourceEcsParams).then((res) => {

    console.log("获取这个节点的ecs数据", res)
    if (res === null) {
      createMessage.error(`获取这个节点和它的子节点下面没有挂载机器，换个节点或者去挂载机器吧`);
      return
    }
    ecsListData.value = res.items

    showHostTransferIf.value = true
    // createMessage.success(`已成功删除节点 ${treeKey} id=${id} `);
  }).catch(() => {
    createMessage.error(`获取未绑定节点的ecs数据`);
  }).finally(() => {
  });
}

const [registerTable, {reload}] = useTable({
  title: '任务列表',
  api: getJobTaskList,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  // actionColumn: {
  //   width: 280,
  //   title: '操作',
  //   dataIndex: 'action',
  //   fixed: 'left',
  // },

});
const [registerForm, {resetFields, setFieldsValue, validate, getFieldsValue}] = useForm({
  labelWidth: 120,
  baseColProps: {span: 24},
  schemas: formSchema,
  showActionButtonGroup: false,
});




//  当脚本被选中的时候
function selectScriptsFunc(value, option) {

  // 再根据这个id去查一下 内容
  //  把用户数据给你设置好
  getJobExecScriptOne(value).then((res) => {
    code.value = res.code
    lang.value = res.lang
  }).catch(() => {
    createMessage.error(`查询单一任务脚本`);
  })
  console.log("value-option", value)
  console.log("value-option", option)
  codeShow.value = true
}

function handleCreate() {


  // 我就去拉取脚本列表

  //  把脚本数据给你设置好
  getJobExecScriptSelect({}).then((res) => {
    selectScriptsOptions.value = res
  }).catch(() => {
    createMessage.error(`拉取脚本列表失败`);
  })

  getStreeNodeSelect().then((res) => {
    treeDataApi.value = res
  }).catch(() => {
    createMessage.error(`拉取树节点列表失败`);
  })


  isTaskEdit.value = true
}

function cancelEdit() {
  // location.reload()

  clearData()
}

function handleEdit(record) {
  isUpdate.value = true
  editTitle.value = `编辑任务${record.title}`
}

function clearData(){
  isTaskEdit.value = false
  codeShow.value = false
  code.value = ``
  nodeSelect.value = undefined
  ecsBindSelectedKeys = ref([])

}

//  创建
async function handleSubmit() {

  console.log("nodeSelect", nodeSelect)
  const values = await validate();

  if (code.value === ``) {
    createMessage.error('脚本内容为空，请选择');
    return
  }
  if (nodeSelect.value === undefined) {
    createMessage.error('树节点为空，请选择');
    return
  }
  var reqData = getFieldsValue()


  reqData["lang"] = lang.value
  reqData["scriptContent"] = code.value
  reqData["treeNodeId"] = nodeSelect.value.id
  reqData["nodePath"] = nodeSelect.value.nodePath
  reqData["hostsIdsRaw"] = JSON.stringify(ecsBindTargetKeys.value)
  console.log("脚本模板操作要发起请求了 reqData", reqData)
  console.log("脚本模板操作要发起请求了 ecsBindTargetKeys", ecsBindTargetKeys.value)
  console.log("脚本模板操作要发起请求了 lang", lang.value)

  createJobTask(reqData).then((res) => {
    createMessage.success(`已成功创建任务`);
  }).catch(() => {
    createMessage.error(`创建任务失败`);
  })


  // location.reload()
  clearData()
}

function handleDelete(record: Recordable) {
  const {createMessage} = useMessage();
  deleteWorkOrderTemplate(record.id).then(() => {
    createMessage.success(`已成功删除工单模板`);
  })
    .catch(() => {
      createMessage.error('删除工单模板失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  reload();

}

</script>

<style scoped>

</style>
