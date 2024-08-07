<template>

  <div>

    <a-card title="值班组信息: 点击日期可进行换班操作" :bordered=true
            :headStyle="{color:'#1271d4',fontSize: 20}"
            :bodyStyle="{padding:'0'}">
      <div class="info-title-j"> 值班组名称: {{ ondutyName }} || 轮班周期:{{ shiftDays }} 天</div>
      <div class="info-title-g"> 值班人总数：{{ ondutyUsers.length }} 列表 : {{ ondutyUsers }}</div>


      <a-divider/>
      <a-calendar v-model:value="value" v-if="planShow" @panelChange="onPanelChange"
                  @select="onSelect">
        <template #dateCellRender="{ current: value }">
          <ul class="events">
            <li v-for="item in getListData(value)" :key="item.content">

              <!--              <a-tooltip>-->
              <!--                <template #title>prompt text</template>-->
              <!--                 {{ item.originUser }}-->
              <!--              </a-tooltip>-->


              <a-tag :color="item.type" v-if="!item.originUser"><h1>{{ item.content }} </h1></a-tag>
              <div v-if="item.originUser ">
                <h1>有换班</h1>
                <a-button type="danger"> {{ item.originUser }} --></a-button>

                <a-button type="success"> {{ item.content }}</a-button>
              </div>
            </li>
          </ul>
        </template>

        <template #monthCellRender="{ current: value }">
          <div v-if="getMonthData(value)" class="notes-month">
            <section>{{ getMonthData(value) }}</section>
            <span>Backlog number</span>
          </div>
        </template>
      </a-calendar>


      <OndutyChangeModal @register="registerModal" @success="handleSuccess"/>

    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {Moment} from 'moment';
import {
  getJobTaskOne,
  getMonitorOndutyGroupOne,
  getMonitorOndutyGroupOneFuturePlan
} from "@/api/demo/system";

const value = ref<Moment>();
import moment from 'moment'
import {useRoute} from "vue-router";
import {useMessage} from "@/hooks/web/useMessage";

import OndutyChangeModal from './OndutyChangeModal.vue';
import {useModal} from "@/components/Modal";
//  中文map
const ondutyMap = ref({})
//  英文userName map
const userNameMap = ref({})


const originUserMap = ref({})

const planShow = ref(false)
const fromOnPanelChange = ref(false)
const ondutyName = ref("")
const ondutyUsers = ref("")
const shiftDays = ref(0)

const [registerModal, {openModal}] = useModal();
const startDay = moment().subtract(1, 'months').startOf("month").format("YYYY-MM-DD");
const endDay = moment().add(1, 'months').endOf("month").format("YYYY-MM-DD");
//  先解析 值班组id
const planQueryParams = {
  "startDay": startDay,
  "endDay": endDay,
}

function handleSuccess({isUpdate, values}) {

}

// 日期变化了，再构造月初和月末的日期去请求
const onPanelChange = (value: Moment, mode: string) => {


  console.log("onPanelChange mode", mode);
  fromOnPanelChange.value = true
  // 构造月初和月末

  const startDay = value.subtract(1, 'months').startOf("month").format("YYYY-MM-DD");
  const endDay = value.add(1, 'months').endOf("month").format("YYYY-MM-DD");
  const planQueryParams = {
    "startDay": startDay,
    "endDay": endDay,

  }
  // console.log("onPanelChange value", value.format('YYYY-MM-DD'), startDay, endDay);
  getMonitorOndutyGroupOneFuturePlan(query.id, planQueryParams).then((res) => {


    ondutyMap.value = res.map
    userNameMap.value = res.userNameMap
    originUserMap.value = res.originUserMap
    // planShow.value = true
  }).catch((err) => {
    createMessage.error('获取值班组失败', err);
    console.log('获取值班组失败', err);
  }).finally(() => {
  });

};

const {query} = useRoute()
const {createMessage} = useMessage();


getMonitorOndutyGroupOne(query.id).then((res) => {

  ondutyName.value = res.name
  ondutyUsers.value = res.userNames
  shiftDays.value = res.shiftDays
}).catch((err) => {
  createMessage.error('获取值班组失败', err);
  console.log('获取值班组失败', err);
}).finally(() => {
});


getMonitorOndutyGroupOneFuturePlan(query.id, planQueryParams).then((res) => {


  ondutyMap.value = res.map
  userNameMap.value = res.userNameMap
  originUserMap.value = res.originUserMap
  planShow.value = true
}).catch((err) => {
  createMessage.error('获取值班组失败', err);
  console.log('获取值班组失败', err);
}).finally(() => {
});


// pink
// red
// yellow
// orange
// cyan
// green
// blue
// purple
// geekblue
// magenta
// volcano
// gold
// lime


const tagsColorMap = {
  // "super":"primary danger",
  0: "red",
  1: "yellow",
  2: "orange",
  3: "cyan",
  4: "green",
  5: "blue",
  6: "purple",
  7: "volcano",

};
const getListData = (value: Moment) => {
  const dayString = value.format('YYYY-MM-DD')
  //  星期几
  const day = value.day()
  const userName = ondutyMap.value[dayString]
  const originUser = originUserMap.value[dayString]
  // console.log("value-->",dayString,userName)
  let listData = [];
  if (userName === undefined) {
    listData.push({
      type: 'red', content: '没有找到值班人', originUser: originUser,
    })
  } else {
    listData.push({
      type: tagsColorMap[day], content: userName, originUser: originUser,
    })
  }

  return listData || [];
};

const getMonthData = (value: Moment) => {
  if (value.month() === 8) {
    return 1394;
  }
};


const onSelect = (value: Moment) => {

  if (fromOnPanelChange.value){
    fromOnPanelChange.value = false
    return;
  }

  let today = moment();


  let diff = value.diff(today, 'day');
  console.log("点击单一日期的value打印", value ,today, diff)
  if (diff < 0) {
    createMessage.error('历史日期不能换班');
    return
  }
  const dateString = value.format('YYYY-MM-DD')
  //  星期几
  const userNameCh = ondutyMap.value[dateString]
  const userNameEn = userNameMap.value[dateString]
  openModal(true, {
    userNameCh: userNameCh,
    originUserName: userNameEn,
    dateString: dateString,
    ondutyGroupId: query.id,

  });

  fromOnPanelChange.value = false

};


</script>

<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}

.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}

.notes-month {
  text-align: center;
  font-size: 28px;
}

.notes-month section {
  font-size: 28px;
}

.info-title-g {

  font: 20px Extra large;
  color: green;
}

.info-title-j {

  font: 20px Extra large;
  color: #fd5701;
}


.info-title-r {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #881934;
}

.info-title-b {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #0474fd;
}

.info-title-z {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  /*border-radius: 30px;*/
  font: 20px Extra large;
  color: #aa04fd;
}
</style>
