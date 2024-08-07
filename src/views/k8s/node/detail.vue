<template>

  <div>



    <a-row :gutter="4" type="flex">
      <a-col :span="24">
        <h1>  </h1>
        <Description
          class="mt-4"
          :title=title
          layout="vertical"
          :collapseOptions="{ canExpand: true, helpMessage: '' }"
          :column="6"
          :data="nodeObj"
          :schema="K8sNodeDetailSchema"
        />

        <a-card :bordered=true :headStyle="{color:'#f90606',fontSize: 50}"
                :bodyStyle="{padding:'0'}">





          <div style="background-color: #aa88cc; padding: 20px">
              <a-space >
              <div class="info-title-a"> 标签组:</div>
<!--              <a-textarea   v-model:value="nodeObj.labelsFront"  auto-size  size="large" ></a-textarea>-->

              <a-tooltip>
                <a-tag color="green" > 标签</a-tag>

                <template #title>{{ nodeObj.labelsFront }}</template>

              </a-tooltip>
              </a-space>
              <a-space >
              <div class="info-title-b"> 污点:</div>

              <a-tooltip>
                <a-tag color="green" > 污点</a-tag>

                <template #title>{{ nodeObj.taintsFront }}</template>

              </a-tooltip>
              </a-space>
          </div>


        </a-card>


      </a-col>
    </a-row>

    <a-col :span="24">

    </a-col>

    <BasicTable @register="registerTable">
      <template #toolbar>
                <a-button class="mr-2" type="success" @click="batchEnableSwitch"> 批量开关规则 </a-button>
      </template>
      <template #bodyCell="{ column, record }">


        <template v-if="column.key === 'enable'">

          <!--          <a-switch checked-children="开启" un-checked-children="关闭" :checked="enableCheckFunc(record.enable)"   />-->
          <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.enable === 1 ? true : false"  @change="changeEnable(record)"  />


        </template>

        <template v-if="column.key === 'name'">


          <a-button type="primary" >{{ record.name }}</a-button>

        </template>

        <template v-if="column.key === 'status'">


          <a-tag :color="tagsColorFunc(record.status)" >{{ record.status }}</a-tag>

        </template>


        <template v-if="column.key === 'ip'">


          <a-tag :color="tagsColorFunc(record.ip)" >{{ record.ip }}</a-tag>

        </template>


        <template v-if="column.key === 'cpuRequestInfo'">

          <div   :style="{ color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}"> {{ record.cpuRequestInfo }}</div>

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
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑'
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
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <BasicTable @register="registerTableCondition">

      <template #bodyCell="{ column, record }">




        <template v-if="column.key === 'name'">


          <a-button type="primary" >{{ record.name }}</a-button>

        </template>

        <template v-if="column.key === 'status'">


          <a-tag :color="tagsColorFunc(record.status)" >{{ record.status }}</a-tag>

        </template>


        <template v-if="column.key === 'ip'">


          <a-tag :color="tagsColorFunc(record.ip)" >{{ record.ip }}</a-tag>

        </template>


        <template v-if="column.key === 'cpuRequestInfo'">

          <div   :style="{ color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}"> {{ record.cpuRequestInfo }}</div>

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
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑'
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
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <BasicTable @register="registerTableEvent">

      <template #bodyCell="{ column, record }">




        <template v-if="column.key === 'name'">


          <a-button type="primary" >{{ record.name }}</a-button>

        </template>

        <template v-if="column.key === 'status'">


          <a-tag :color="tagsColorFunc(record.status)" >{{ record.status }}</a-tag>

        </template>


        <template v-if="column.key === 'ip'">


          <a-tag :color="tagsColorFunc(record.ip)" >{{ record.ip }}</a-tag>

        </template>


        <template v-if="column.key === 'cpuRequestInfo'">

          <div   :style="{ color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '宋体'}"> {{ record.cpuRequestInfo }}</div>

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
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑'
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
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>

</template>

<script lang="ts" setup>

import {useRoute} from "vue-router";
import {getK8sNodeDetail, getPodsListByNodeName} from "@/api/demo/system";
import {ref} from "vue";
import {useMessage} from "@/hooks/web/useMessage";
import { Description, DescItem, useDescription } from '@/components/Description';
import {columnsNodeCondition, columnsNodeEvent, K8sNodeDetailSchema} from './data';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { columnsPodOnNode, searchFormSchemaPods } from './data';
import {refundTableData} from "@/views/demo/page/desc/basic/data";
const {query} = useRoute()
const nodeObj = ref({})
const Conditions = ref([])
const Events = ref([])
const title = ref('')

const {createMessage} = useMessage();

// 首先去请求一下节点详情

var params = {}
params["clusterName"] = query.clusterName
params["nodeName"] = query.nodeName
getK8sNodeDetail(params).then((res) => {
  console.log("getK8sNodeDetail", res)
  nodeObj.value = res
  Conditions.value = res.conditions
  Events.value = res.events
  title.value  = `节点基础信息 集群:${query.clusterName}`

}).catch((err) => {
  createMessage.error('获取节点详情错误', err);
}).finally(() => {
});

const tagsColorMap = {
  "Running":"green" ,
  "prod" :"red" ,
  "stage": "blue",
  "press": "yellow"
}
const tagsColorFunc = function (index){
  let tmp = tagsColorMap[index]
  if (tmp==null ){
    tmp = "red"
  }
  return tmp
};


const [registerTable, { reload,          getSelectRowKeys, }] = useTable({
  title: 'pod列表',
  api: getPodsListByNodeName,
  beforeFetch: (data) => {
    data["clusterName"] = query.clusterName
    data["nodeName"] = query.nodeName
    return data
  },
  columns: columnsPodOnNode,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchemaPods,
  },
  rowKey: 'name',
  rowSelection: {
    type: 'checkbox',
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  // actionColumn: {
  //   width: 280,
  //   title: '操作',
  //   dataIndex: 'action',
  //   // slots: { customRender: 'action' },
  // },

});

const [registerTableCondition, { reloadCondition,  }] = useTable({
  title: 'Condition列表',
  // api: getPodsListByNodeName,
  // beforeFetch: (data) => {
  //   data["clusterName"] = query.clusterName
  //   data["nodeName"] = query.nodeName
  //   return data
  // },
  dataSource: Conditions,
  columns: columnsNodeCondition,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchemaPods,
  },

  // useSearchForm: true,
  // showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  // actionColumn: {
  //   width: 280,
  //   title: '操作',
  //   dataIndex: 'action',
  //   // slots: { customRender: 'action' },
  // },

});


const [registerTableEvent, { reloadEvent,  }] = useTable({
  title: 'Event列表',
  // api: getPodsListByNodeName,
  // beforeFetch: (data) => {
  //   data["clusterName"] = query.clusterName
  //   data["nodeName"] = query.nodeName
  //   return data
  // },
  dataSource: Events,
  columns: columnsNodeEvent,
  formConfig: {
    labelWidth: 200,
    schemas: searchFormSchemaPods,
  },

  // useSearchForm: true,
  // showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  // actionColumn: {
  //   width: 280,
  //   title: '操作',
  //   dataIndex: 'action',
  //   // slots: { customRender: 'action' },
  // },

});


function handleEdit(){}
function handleDelete(){}
function batchEnableSwitch(){}

</script>

<style scoped>
.info-title-a {

  font: 20px Extra large;
  color: green;
}

.info-title-b {

  font: 20px Extra large;
  color: #fd5701;
}


.info-title-c {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #881934;
}

.info-title-d {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #0474fd;
}

.info-title-e {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #aa04fd;
}

.info-title-f {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: blue;
}

.info-title-g {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: yellow;
}

</style>
