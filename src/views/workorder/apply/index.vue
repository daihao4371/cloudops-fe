<template>

  <div style="background-color: #ececec; padding: 20px">
    <a-row :gutter="16">
      <a-col :span="8" v-for="item in cardContents" >


          <a-card :title="item.name" :bordered="true"  >

            <a-button type="primary"  @click="clickCard(item)"> 审批流程：{{ item.processName }} </a-button>
          </a-card>


        <a-divider/>
      </a-col>


    </a-row>
  </div>

</template>

<script lang="ts" setup>

import {ref} from "vue";
import {useMessage} from "@/hooks/web/useMessage";
import {getWorkOrderTemplateList} from "@/api/demo/system";
import {EditRecordRow} from "@/components/Table";
import {useGo} from "@/hooks/web/usePage";
import {PageEnum} from "@/enums/pageEnum";
import {router} from "@/router";

const { createMessage } = useMessage();
const cardContents = ref([])

function clickCard(item) {
  console.log("点击了",item)
  // 执行刷新
  // go();
  // router.push(PageEnum.BASE_HOME);
  router.push("/workOrder/create?tplId="+item.id);
  // go(PageEnum.BASE_HOME,false);

}


getWorkOrderTemplateList({}).then(( res) => {
  cardContents.value = res.items
}).catch(() => {
    createMessage.error('获取工单模板失败');
  }).finally(() => {});




</script>

<style scoped>
.ant-card-head-title {
  font-size: 20px;
  color: blue;
}
</style>
