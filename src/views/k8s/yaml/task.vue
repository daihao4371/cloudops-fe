<template>
  <div>



    <a-cascader v-model:value="clusterNsValue" :options="options" size="large"  style="width: 50%" placeholder="Please select" @change="nsChange" :show-search="{ filter }"/>


    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增yaml任务 </a-button>
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'enable'">

          <!--          <a-switch checked-children="开启" un-checked-children="关闭" :checked="enableCheckFunc(record.enable)"   />-->
          <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.enable === 1 ? true : false"  @change="changeEnable(record)"  />


        </template>



        <template v-if="column.key === 'severity'">

          <a-tag :color="tagsColorFunc(record.severity)" >{{ record.severity }}</a-tag>


        </template>

        <template v-if="column.key === 'poolName'">

          <router-link target="_blank"  :to="{path:'/monitor/pool'}">
            <a-button type="success">  {{ record.poolName }}</a-button>
          </router-link>
        </template>


        <template v-if="column.key === 'nodePath'">

          <router-link target="_blank"  :to="{path:'/serviceTree/streeAsync'}">
            <a-tag color="orange">  {{ record.nodePath }}</a-tag>
          </router-link>
        </template>

        <template v-if="column.key === 'sendGroupName'">

          <router-link target="_blank"  :to="{path:'/monitor/sendgroup'}">
            <a-button type="danger">  {{ record.sendGroupName }}</a-button>
          </router-link>
        </template>

        <!--        <template v-if="column.key === 'name'">-->

        <!--          <router-link target="_blank" :to="{path:'/monitor/ondutygroup-plan',query:{id: record.id}}">-->
        <!--            <button>  {{ record.name }}</button>-->
        <!--          </router-link>-->
        <!--        </template>-->
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
               {
                icon: 'clarity:star-line',
                onClick: handleApply.bind(null, record),
                label: '应用',
                ifShow: () => {
                 return record.status === 'pending'; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
              },



              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑',
                ifShow: () => {
                  return record.status === 'pending'; // 根据业务控制是否显示: enable状态的显示禁用按钮
                },
              },


              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },

              {
                icon: 'ant-design:export-outlined',
                color: 'success',
                label: '下载yaml文件',
                onClick: handleDownLoadYamlFile.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ProcessDrawer @register="registerDrawer" @success="handleSuccess" />


  </div>
</template>

<script lang="ts" setup>

import { defineComponent , ref } from 'vue';

import { BasicTable, useTable, TableAction } from '/@/components/Table';
import {
  deleteProcess,
  deleteRole,
  getProcessList,
  getK8sYamlTaskList,
  deleteK8sYamlTask,
  applyK8sYamlTaskOne,
  enableSwitchMonitorRecordRule,
  batchEnableSwitchMonitorRecordRule,
  setRoleStatus
} from '/@/api/demo/system';

import {
  downloadByUrl,
  downloadByData,
  downloadByBase64,
  downloadByOnlineUrl,
} from '/@/utils/file/download';


import { useDrawer } from '/@/components/Drawer';
import ProcessDrawer from './TaskDrawer.vue';

import { columnsYamlTask, searchFormSchema } from './data';
import {useMessage} from "@/hooks/web/useMessage";
import {TreeItem} from "@/components/Tree";
import {router} from "@/router";
const { createMessage } = useMessage();
const [registerDrawer, { openDrawer }] = useDrawer();
const [registerTable, { reload,          getSelectRowKeys, }] = useTable({
  title: 'k8s-yaml任务列表',
  api: getK8sYamlTaskList,
  columns:  columnsYamlTask,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchema,
  },
  rowKey: 'name',
  rowSelection: {
    type: 'checkbox',
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  actionColumn: {
    width: 380,
    title: '操作',
    dataIndex: 'action',
  },

});



const clusterNsValue = ref([])
interface Option {
  value: string;
  label: string;
  children?: Option[];
}
const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const filter = (inputValue: string, path: Option[]) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

function nsChange(value, selectedOptions){
  console.log("集群-ns选择器",value,selectedOptions)
}

// const tagsColorMap = {
//   "warning":"green" ,
//   "critical" :"red" ,
//   "test1": "success"
// }
// const tagsColorFunc = function (index){
//   let tmp = tagsColorMap[index]
//   if (tmp==null ){
//     tmp = "blue"
//   }
//   return tmp
// };



const tagsColorFunc1 = function (index){
  let tmp = tagsColorMap[template]
  if (tmp==null ){
    tmp = "blue"
  }
  return tmp
};
const tagsColorMap = {
  "dev":"green" ,
  "prod" :"red" ,
  "stage": "blue",
  "press": "yellow"
}
const tagsColorFunc = function (index){
  let tmp = tagsColorMap[template]
  if (tmp==null ){
    tmp = "blue"
  }
  return tmp
};

const tagsColorFuncBool = function (b:boolean){
  if (b){
    return "green"
  }
  return "red"
};


const enableCheckFunc = function (enable:number){
  if ( enable ===1){
    return true
  }
  return false
};

function batchEnableSwitch() {
  var keys = getSelectRowKeys()
  if (keys.length ===0 ) {
    createMessage.error('请选择规则');
    return
  }
  const data ={}
  data["ids"] =keys
  batchEnableSwitchMonitorRecordRule(data).then(() => {
    createMessage.success(`已批量开关k8s集群`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('批量开关k8s集群失败');
    })
    .finally(() => {
    });

}




function changeEnable(record){
  // console.log("changeEnable",record)

  enableSwitchMonitorRecordRule(record.id).then(() => {
    createMessage.success(`已成功开关k8s集群`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('开关k8s集群失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });
  // reload();

  // record.enable=2

}


function handleSuccess() {
  reload();
}

function handleCreate() {
  openDrawer(true, {
    isUpdate: false,
    func: reload,
  });
}

function handleEdit(record: Recordable) {

  openDrawer(true, {
    record,
    isUpdate: true,
    func: reload,
  });
}


function handleApply(record: Recordable) {

  applyK8sYamlTaskOne(record.id).then(() => {
    createMessage.success(`已成功应用任务`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('应用任务失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });

}

function handleDownLoadYamlFile(record: Recordable) {


  downloadByData(record.yamlString, `${record.name}.yaml`);

}

function handleDelete(record: Recordable) {

  deleteK8sYamlTask(record.id).then(() => {
    createMessage.success(`已成功删除任务`);
    location.reload()
  })
    .catch(() => {
      createMessage.error('删除任务失败');
    })
    .finally(() => {
      record.pendingStatus = false;
    });

}

</script>

<style scoped>

</style>
