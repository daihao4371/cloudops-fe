<template>


  <div style="background-color: #b1aaaa; padding: 5px">
    <!--  <div >-->
    <a-row :gutter="4" type="flex">
      <!--      <a-col :flex="2">-->
      <a-col :span="8">
        <a-card :title="thisNodePath" :bordered="true">
          <!--            <div class="mt-4">-->
          <a-button type="primary" @click="addTopNode()" value="large">新增顶级节点</a-button>
          <!--            </div>-->
          <a-divider style="height: 1px; background-color: #104b14"/>

          <a-directory-tree
            v-if="isShow"
            :treeData="treeData"
            :load-data="onLoadData"
            @select="onSelect"
            multiple
            v-model:expandedKeys="expandedKeys"
            v-model:selectedKeys="selectedKeys"

          >
            <template #title="{ key: treeKey, title ,id,level,children,isLeaf }">
              <a-dropdown :trigger="['contextmenu']">
                <span>{{ title }}  </span>
                <template #overlay>
                  <a-menu
                    @click="({ key: menuKey }) => onContextMenuClick(title, menuKey,id,level,children,isLeaf)">
                    <a-menu-item key="1" v-if=" isLeaf !== true ">
                      <PlusSquareTwoTone/>
                      新增节点
                    </a-menu-item>
                    <a-menu-item key="2">
                      <MinusCircleTwoTone/>
                      删除节点
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-directory-tree>
        </a-card>
      </a-col>
      <!--      <a-col :span="16" flex="3">-->
      <a-col :span="16">
        <a-card title="服务树和关联资源详情展示" :bordered="true">
          <div>
            <a-tabs type="card" v-model:activeKey="activeKey" size="large" :tabBarGutter=10
                    :bordered="true">
              <a-tab-pane key="1">
                <template #tab>
                  <span>
                    节点详情
                  </span>

                </template>
                <a-row :span="6" v-if="isSelect">

                  <a-space :size="20">
                    <div class="info-title-g">节点描述:</div>
                    <div class="info-title-r"> {{ selectTreeNodeDesc }}</div>
                    <div class="info-title-g"> Level:</div>
                    <div class="info-title-r"> {{ selectTreeNodeLevel }}</div>
                  </a-space>
                  <a-divider type="vertical" style="height: 60px; background-color: #dac11d"/>

                  <a-col :span="3">
                    <a-button type="danger" class="my-4" @click="showNodeModal" v-if="isSelect">
                      修改节点属性
                    </a-button>
                  </a-col>


                  <a-divider/>
                  <a-space :size="20">
                    <div class="info-title-j"> 运维负责人列表:</div>
                    <div class="info-title-r"> {{ selectTreeNode.ops_admin_users }}</div>
                  </a-space>

                  <a-divider/>
                  <a-space :size="20">
                    <div class="info-title-b"> 研发负责人列表:</div>
                    <div class="info-title-r"> {{ selectTreeNode.rd_admin_users }}</div>
                  </a-space>

                  <a-divider/>
                  <a-space :size="20">
                    <div class="info-title-r"> 研发工程师列表:</div>
                    <div class="info-title-r"> {{ selectTreeNode.rd_member_users }}</div>
                  </a-space>

                  <a-divider/>
                  <a-space :size="20">

                    <div class="info-title-g"> 子节点数量:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindNodeNum }}</div>
                    <div class="info-title-g"> 叶子节点数量:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindLeafNodeNum }}</div>

                    <div class="info-title-b"> 绑定的ecs数量:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindEcsNum }}</div>
                    <div class="info-title-z"> 绑定的elb数量:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindElbNum }}</div>
                    <div class="info-title-z"> 绑定的rds数量:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindRdsNum }}</div>


                  </a-space>

                  <a-divider/>
                  <a-space :size="20">
                    <div class="info-title-z"> ECS资源</div>
                    <div class="info-title-g"> cpu总核数</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindCpuTotal }}</div>
                    <div class="info-title-g"> 内存总GB:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindMemoryTotal }}</div>
                    <div class="info-title-g"> 本地磁盘总GB:</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindDiskTotal }}</div>
                    <div class="info-title-z"> ELb资源</div>
                    <div class="info-title-g"> 带宽包上限</div>
                    <div class="info-title-r"> {{ selectTreeNodeBindElbBandWithTotal }}</div>
                  </a-space>


                </a-row>
                <a-row :span="8">
                  <div>
                    <ecs-vendor-chart :node="selectTreeNode" v-if="ecsChartShow"/>
                  </div>
                </a-row>

                <a-row :span="8">
                  <div>
                    <elb-vendor-chart :node="selectTreeNode" v-if="elbChartShow"/>
                  </div>
                </a-row>
                <a-row :span="8">
                  <div>
                    <rds-vendor-chart :node="selectTreeNode" v-if="rdsChartShow"/>
                  </div>
                </a-row>

              </a-tab-pane>

              <a-tab-pane key="5" v-if="selectTreeNodeIsLeaf">
                <template #tab>
                  <span>
                    服务发布项
                  </span>
                </template>


                <a-button type="warning" class="my-4" @click="showNodeModalCicdDeployItem"
                          v-if="isSelect">
                  新增或修改服务发布项
                </a-button>
                <a-button type="danger" class="my-4" @click="deleteNodeCicdDeployItem"
                          v-if="cicdDeployItemExist">
                  删除服务发布项
                </a-button>

                <a-row :span="6" v-if="cicdDeployItemExist">

                  <a-space :size="20">
                    <div class="info-title-g">gitlab项目名称:</div>
                    <div class="info-title-r"> {{ cicdDeployItem.gitlabRepository }}</div>
                    <div class="info-title-g"> 项目id:</div>
                    <div class="info-title-r"> {{ cicdDeployItem.gitlabProjectId }}</div>
                  </a-space>
                  <a-divider/>

                  <a-space :size="20">
                    <div class="info-title-g">harbor镜像前缀:</div>
                    <div class="info-title-r"> {{ cicdDeployItem.imagePrefix }}</div>
                  </a-space>
                  <a-divider/>

                  <a-space :size="20">
                    <div class="info-title-g">发布类型:</div>
                    <div class="info-title-r"> {{ cicdDeployItem.runType }}</div>
                  </a-space>
                  <a-divider/>

                  <BasicTable @register="registerTableCicdStage">

                    <template #bodyCell="{ column, record }">


                      <template v-if="column.key === 'name'">


                        <a-button type="primary">{{ record.name }}</a-button>

                      </template>

                    </template>
                  </BasicTable>

                  <!--                  <li v-for="(item, index) in cicdDeployItem.stagesFront">-->
                  <!--                    <a-tag :color="tagsColorFunc(index)">发布阶段: {{ item.name }} 发布集群:-->
                  <!--                      {{ item.cluster }}-->
                  <!--                    </a-tag>-->
                  <!--                    <br/>-->

                  <!--                  </li>-->


                </a-row>
              </a-tab-pane>

              <a-tab-pane key="2">
                <template #tab>
                  <span>
                    <android-outlined/>
                    ecs数据展示
                  </span>
                </template>
                <a-row :span="6">

                  <BasicTable @register="registerTableEcs" v-if="isSelect">
                    <template #form-custom> custom-slot</template>
                    <template #headerTop>
                    </template>
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'Tags'">

                        <li v-for="(item, index) in record.Tags">
                          <!--                        <a-button  >{{ item }}</a-button>-->
                          <!--                        <a-tag   color="pink">{{ item }}</a-tag>-->
                          <a-tag :color="tagsColorFunc(index)">{{ item }}</a-tag>
                          <!--            <a-button  >{{ item.value }}</a-button>-->
                          <!--            <a-divider> </a-divider>-->
                        </li>


                      </template>
                    </template>

                  </BasicTable>

                  <a-button type="primary" class="my-4" @click="showEcsBindTransfer"
                            v-if="selectTreeNodeIsLeaf">
                    打开ecs资源绑定
                  </a-button>
                  <a-button type="danger" class="my-4" @click="showEcsUnBindTransfer"
                            v-if="selectTreeNodeIsLeaf">
                    打开ecs资源解绑
                  </a-button>
                  <a-divider/>
                  <a-transfer
                    v-if="showEcsBindTransferIf"
                    :titles="['待绑定的', '已选中的']"
                    :data-source="ecsListData"
                    show-search
                    :list-style="{
                      width: '350px',
                      height: '500px',
                    }"
                    :selected-keys="ecsBindSelectedKeys"
                    :target-keys="ecsBindTargetKeys"
                    :render="item => item.title"
                    @change="ecsBindHandleChange"
                    @selectChange="ecsBindHandleSelectChange"
                  />

                  <a-divider/>

                  <a-transfer
                    v-if="showEcsUnBindTransferIf"
                    :titles="['已绑定的', '带解绑的']"
                    :data-source="ecsUnBindListData"
                    show-search
                    :list-style="{
                      width: '350px',
                      height: '500px',
                    }"
                    :selected-keys="ecsUnBindSelectedKeys"
                    :target-keys="ecsUnBindTargetKeys"
                    :render="item => item.title"
                    @change="ecsUnBindHandleChange"
                    @selectChange="ecsUnBindHandleSelectChange"
                  />

                  <a-divider/>
                  <a-button type="primary" class="my-4" @click="sendEcsBind"
                            v-if="showEcsBindTransferIf">
                    确认ecs资源绑定
                  </a-button>
                  <a-button type="danger" class="my-4" @click="closeEcsBindTransfer"
                            v-if="showEcsBindTransferIf">
                    取消ecs资源绑定
                  </a-button>

                  <a-button type="success" class="my-4" @click="sendEcsUnBind"
                            v-if="showEcsUnBindTransferIf">
                    确认ecs资源解绑
                  </a-button>
                  <a-button type="warning " class="my-4" @click="closeEcsUnBindTransfer"
                            v-if="showEcsUnBindTransferIf">
                    取消ecs资源解绑
                  </a-button>


                </a-row>


              </a-tab-pane>

              <a-tab-pane key="3">
                <template #tab>
                  <span>
                    elb数据展示
                  </span>
                </template>
                <a-row :span="6">

                  <BasicTable @register="registerTableElb" v-if="isSelect">
                    <template #form-custom> custom-slot</template>
                    <template #headerTop>
                    </template>

                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'Tags'">

                        <li v-for="(item, index) in record.Tags">
                          <!--                        <a-button  >{{ item }}</a-button>-->
                          <!--                        <a-tag   color="pink">{{ item }}</a-tag>-->
                          <a-tag :color="tagsColorFunc(index)">{{ item }}</a-tag>
                          <!--            <a-button  >{{ item.value }}</a-button>-->
                          <!--            <a-divider> </a-divider>-->
                        </li>


                      </template>
                    </template>
                  </BasicTable>

                  <a-button type="primary" class="my-4" @click="showElbBindTransfer"
                            v-if="selectTreeNodeIsLeaf">
                    打开elb资源绑定
                  </a-button>
                  <a-button type="danger" class="my-4" @click="showElbUnBindTransfer"
                            v-if="selectTreeNodeIsLeaf">
                    打开elb资源解绑
                  </a-button>
                  <a-divider/>
                  <a-transfer
                    v-if="showElbBindTransferIf"
                    :titles="['待绑定的', '已选中的']"
                    :data-source="elbListData"
                    show-search
                    :list-style="{
                      width: '350px',
                      height: '300px',
                    }"
                    :selected-keys="elbBindSelectedKeys"
                    :target-keys="elbBindTargetKeys"
                    :render="item => item.title"
                    @change="elbBindHandleChange"
                    @selectChange="elbBindHandleSelectChange"
                  />

                  <a-divider/>


                  <a-transfer
                    v-if="showElbUnBindTransferIf"
                    :titles="['已绑定的', '待解绑的']"
                    :data-source="elbUnBindListData"
                    show-search
                    :list-style="{
                      width: '350px',
                      height: '500px',
                    }"
                    :selected-keys="elbUnBindSelectedKeys"
                    :target-keys="elbUnBindTargetKeys"
                    :render="item => item.title"
                    @change="elbUnBindHandleChange"
                    @selectChange="elbUnBindHandleSelectChange"
                  />

                  <a-divider/>
                  <a-button type="primary" class="my-4" @click="sendElbBind"
                            v-if="showElbBindTransferIf">
                    确认elb资源绑定
                  </a-button>
                  <a-button type="danger" class="my-4" @click="closeElbBindTransfer"
                            v-if="showElbBindTransferIf">
                    取消elb资源绑定
                  </a-button>

                  <a-button type="success" class="my-4" @click="sendElbUnBind"
                            v-if="showElbUnBindTransferIf">
                    确认elb资源解绑
                  </a-button>
                  <a-button type="warning" class="my-4" @click="closeElbUnBindTransfer"
                            v-if="showElbUnBindTransferIf">
                    取消elb资源解绑
                  </a-button>


                </a-row>


              </a-tab-pane>

              <a-tab-pane key="4">
                <template #tab>
                  <span>
                    rds数据展示
                  </span>
                </template>
                <a-row :span="6">

                  <BasicTable @register="registerTableRds" v-if="isSelect">
                    <template #form-custom> custom-slot</template>
                    <template #headerTop>
                    </template>
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'Tags'">

                        <li v-for="(item, index) in record.Tags">
                          <!--                        <a-button  >{{ item }}</a-button>-->
                          <!--                        <a-tag   color="pink">{{ item }}</a-tag>-->
                          <a-tag :color="tagsColorFunc(index)">{{ item }}</a-tag>
                          <!--            <a-button  >{{ item.value }}</a-button>-->
                          <!--            <a-divider> </a-divider>-->
                        </li>


                      </template>
                    </template>
                  </BasicTable>

                  <a-button type="primary" class="my-4" @click="showRdsBindTransfer"
                            v-if="selectTreeNodeIsLeaf">
                    打开rds资源绑定
                  </a-button>
                  <a-button type="danger" class="my-4" @click="showRdsUnBindTransfer"
                            v-if="selectTreeNodeIsLeaf">
                    打开rds资源解绑
                  </a-button>
                  <a-divider/>
                  <a-transfer
                    v-if="showRdsBindTransferIf"
                    :titles="['待绑定的', '已选中的']"
                    :data-source="rdsListData"
                    show-search
                    :list-style="{
                      width: '350px',
                      height: '300px',
                    }"
                    :selected-keys="rdsBindSelectedKeys"
                    :target-keys="rdsBindTargetKeys"
                    :render="item => item.title"
                    @change="rdsBindHandleChange"
                    @selectChange="rdsBindHandleSelectChange"
                  />

                  <a-divider/>


                  <a-transfer
                    v-if="showRdsUnBindTransferIf"
                    :titles="['已绑定的', '待解绑的']"
                    :data-source="rdsUnBindListData"
                    show-search
                    :list-style="{
                      width: '350px',
                      height: '500px',
                    }"
                    :selected-keys="rdsUnBindSelectedKeys"
                    :target-keys="rdsUnBindTargetKeys"
                    :render="item => item.title"
                    @change="rdsUnBindHandleChange"
                    @selectChange="rdsUnBindHandleSelectChange"
                  />

                  <a-divider/>
                  <a-button type="primary" class="my-4" @click="sendRdsBind"
                            v-if="showRdsBindTransferIf">
                    确认rds资源绑定
                  </a-button>
                  <a-button type="danger" class="my-4" @click="closeRdsBindTransfer"
                            v-if="showRdsBindTransferIf">
                    取消rds资源绑定
                  </a-button>

                  <a-button type="success" class="my-4" @click="sendRdsUnBind"
                            v-if="showRdsUnBindTransferIf">
                    确认rds资源解绑
                  </a-button>
                  <a-button type="warning" class="my-4" @click="closeRdsUnBindTransfer"
                            v-if="showRdsUnBindTransferIf">
                    取消rds资源解绑
                  </a-button>


                </a-row>


              </a-tab-pane>


            </a-tabs>
          </div>
        </a-card>

      </a-col>
    </a-row>

    <StreeDrawer @register="registerDrawer" @success="handleSuccess"/>
    <TreeNodeModal @register="registerModal"/>
    <CicdDeployItemModal @register="registerModalCicdDeployItem"/>
  </div>


</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, ref, unref} from 'vue';
import {PageWrapper} from '/@/components/Page';
import {Alert, Space} from 'ant-design-vue';
import {AppleOutlined, AndroidOutlined} from '@ant-design/icons-vue';
import {TreeDataItem, AntTreeNodeSelectedEvent} from 'ant-design-vue/es/tree/Tree';
import TreeNodeModal from './TreeNodeModal.vue';
import CicdDeployItemModal from './CicdDeployItemModal.vue';

import {
  StarOutlined,
  StarFilled,
  StarTwoTone,
  PlusSquareTwoTone,
  MinusCircleTwoTone
} from '@ant-design/icons-vue';
import {
  bindElbToStreeNode,
  bindEscToStreeNode, bindRdsToStreeNode,
  deleteAccount, deleteProcess,
  deleteStreeNode,
  fetchResourceByNode,
  getChildrenStreeNodes,
  getCicdDeployItemByStreeNodeId,
  getResourceEcsUnbindList,
  deleteCicdDeployItem,
  getResourceElbUnbindList, getResourceRdsUnbindList,
  getStreeNodeList,
  getTopStreeNodes, unBindElbToStreeNode,
  unBindEscToStreeNode, unBindRdsToStreeNode
} from "@/api/demo/system";
import StreeDrawer from "@/views/stree/stree/StreeDrawer.vue";
import {useDrawer} from "@/components/Drawer";
import {useMessage} from "@/hooks/web/useMessage";
import {BasicTable, TableActionType, useTable} from '/@/components/Table';
import DargBar from "@/layouts/default/sider/DragBar.vue";
import {useModal} from "@/components/Modal";
import {
  columnsCicdStage,
  getBasicColumnsEcsTable, getBasicColumnsElbTable, getBasicColumnsRdsTable,
  getFormConfig,
  searchFormSchemaEcs, searchFormSchemaELb, searchFormSchemaRds
} from "@/views/stree/stree/stree.data";
import {searchFormSchema} from "@/views/demo/system/account/account.data";
import {Nullable} from "@vben/types";
import EcsVendorChart from "@/views/stree/stree/ecsVendorChart.vue";
import ElbVendorChart from "@/views/stree/stree/elbVendorChart.vue";
import RdsVendorChart from "@/views/stree/stree/rdsVendorChart.vue";
import {columnsNodeCondition, searchFormSchemaPods} from "@/views/k8s/node/data";


export default defineComponent({
  name: 'ServiceTreeIndexAsync',
  components: {
    EcsVendorChart,
    ElbVendorChart,
    RdsVendorChart,
    TreeNodeModal,
    CicdDeployItemModal,
    DargBar,
    BasicTable, AAlert: Alert,
    StreeDrawer,
    PageWrapper,
    StarOutlined, StarFilled, StarTwoTone, PlusSquareTwoTone, MinusCircleTwoTone,
    Space,
    AppleOutlined,
    AndroidOutlined,
  },
  setup() {

    // ecs 的表格

    const [registerModal, {openModal}] = useModal();
    const [registerModalCicdDeployItem, {openModal: openModalCicdDeployItem}] = useModal();
    const activeKey = ref('1')
    const isShow = ref(false)
    const isSelect = ref(false)
    const elbTableShow = ref(false)
    const ecsChartShow = ref(false)
    const elbChartShow = ref(false)
    const rdsChartShow = ref(false)
    const showEcsBindTransferIf = ref(false)
    const showElbBindTransferIf = ref(false)
    const showRdsBindTransferIf = ref(false)
    const showEcsUnBindTransferIf = ref(false)
    const showElbUnBindTransferIf = ref(false)
    const showRdsUnBindTransferIf = ref(false)
    const treeData = ref()
    var ecsListData = ref([])
    var elbListData = ref([])
    var rdsListData = ref([])
    var ecsUnBindListData = ref([])
    var elbUnBindListData = ref([])
    var rdsUnBindListData = ref([])
    var ecsBindSelectedKeys = ref([])
    var elbBindSelectedKeys = ref([])
    var rdsBindSelectedKeys = ref([])
    var ecsUnBindSelectedKeys = ref([])
    var elbUnBindSelectedKeys = ref([])
    var rdsUnBindSelectedKeys = ref([])
    // 右侧框内的 key 数组
    var ecsBindTargetKeys = ref([])
    var elbBindTargetKeys = ref([])
    var rdsBindTargetKeys = ref([])
    var ecsUnBindTargetKeys = ref([])
    var elbUnBindTargetKeys = ref([])
    var rdsUnBindTargetKeys = ref([])
    // var ecsSelectList = []

    const selectTreeNodeDesc = ref();
    const selectTreeNode = ref();
    const cicdDeployItem = ref();
    const cicdDeployItemStages = ref([]);
    const cicdDeployItemExist = ref(false);


    // const ecsChartHeight = ref('1000%');
    const selectTreeNodeLevel = ref();
    const selectTreeNodeIsLeaf = ref(false);
    const selectTreeNodeOpsAdmins = ref();
    const selectTreeNodeBindEcsNum = ref(0);
    const selectTreeNodeBindElbNum = ref(0);
    const selectTreeNodeBindRdsNum = ref(0);
    const selectTreeNodeBindNodeNum = ref(0);
    const selectTreeNodeBindLeafNodeNum = ref(0);
    const selectTreeNodeBindCpuTotal = ref(0);
    const selectTreeNodeBindElbBandWithTotal = ref(0);
    const selectTreeNodeBindMemoryTotal = ref(0);
    const selectTreeNodeBindDiskTotal = ref(0);
    const expandedKeys = ref<string[]>(['0-0', '0-1']);
    const selectedKeys = ref<string[]>([]);
    const [registerDrawer, {openDrawer}] = useDrawer();
    const {createMessage} = useMessage()
    let thisNodePath = ref('异步服务树展示')


    const ecsBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      ecsBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
    };

    const elbBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      elbBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
    };

    const rdsBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      rdsBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
    };

    const ecsUnBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      ecsUnBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
    };

    const elbUnBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      elbUnBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
    };

    const rdsUnBindHandleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      rdsUnBindSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
    };
    const ecsBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
      ecsBindTargetKeys.value = nextTargetKeys;
    };

    const elbBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
      elbBindTargetKeys.value = nextTargetKeys;
    };
    const rdsBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
      rdsBindTargetKeys.value = nextTargetKeys;
    };
    const ecsUnBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
      ecsUnBindTargetKeys.value = nextTargetKeys;
    };

    const elbUnBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
      elbUnBindTargetKeys.value = nextTargetKeys;
    };
    const rdsUnBindHandleChange = (nextTargetKeys, direction, moveKeys) => {
      rdsUnBindTargetKeys.value = nextTargetKeys;
    };

    const tagsColorMap = {
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
      let tmp = tagsColorMap[index]
      if (tmp == null) {
        tmp = "blue"
      }
      return tmp
    };

    function showNodeModal() {

      console.log("打开节点信息编辑模态框", selectTreeNode.value)
      openModal(true, {
        node: selectTreeNode.value,
      });
    }

    function showNodeModalCicdDeployItem() {
      if (!selectTreeNode.value.canAdminNode) {
        createMessage.error(`你没有节点${selectTreeNode.value.nodePath} 管理员权限，不能编辑服务发布项`);
        return
      }

      openModalCicdDeployItem(true, {
        node: selectTreeNode.value,
        cicdDeployItem: cicdDeployItem,
      });
    }

    function deleteNodeCicdDeployItem(){
      deleteCicdDeployItem(cicdDeployItem.value.id).then(() => {
        createMessage.success(`已成功删除服务发布项`);
      })
        .catch(() => {
          createMessage.error('删除流程失败');
        })
        .finally(() => {

        });
    }

    //  打开 ecs绑定的穿梭框
    //  打开的时候就应该请求后端数据
    function showEcsBindTransfer() {

      //  请求后端数据


      getResourceEcsUnbindList().then((res) => {

        console.log("获取未绑定节点的ecs数据", res)

        ecsListData.value = res
        // createMessage.success(`已成功删除节点 ${treeKey} id=${id} `);
      }).catch(() => {
        createMessage.error(`获取未绑定节点的ecs数据`);
      }).finally(() => {
      });

      //  打开一方的时候关闭另一方
      showEcsBindTransferIf.value = true
      showEcsUnBindTransferIf.value = false
    }

    function showElbBindTransfer() {


      //  打开绑定穿梭框的时候关闭表格
      elbTableShow.value = false
      //  请求后端数据

      getResourceElbUnbindList().then((res) => {

        console.log("获取未绑定节点的elb数据", res)

        elbListData.value = res
        // createMessage.success(`已成功删除节点 ${treeKey} id=${id} `);
      }).catch(() => {
        createMessage.error(`获取未绑定节点的elb数据错误`);
      }).finally(() => {
      });

      //  打开一方的时候关闭另一方
      showElbBindTransferIf.value = true
      showElbUnBindTransferIf.value = false
    }

    function showRdsBindTransfer() {


      //  打开绑定穿梭框的时候关闭表格
      elbTableShow.value = false
      //  请求后端数据

      getResourceRdsUnbindList().then((res) => {

        console.log("获取未绑定节点的rds数据", res)

        rdsListData.value = res
      }).catch(() => {
        createMessage.error(`获取未绑定节点的rds数据错误`);
      }).finally(() => {
      });

      //  打开一方的时候关闭另一方
      showRdsBindTransferIf.value = true
      showRdsUnBindTransferIf.value = false
    }


    function showEcsUnBindTransfer() {

      //  请求后端数据
      ecsUnBindListData.value = selectTreeNode.value.bind_ecss
      showEcsUnBindTransferIf.value = true
      showEcsBindTransferIf.value = false
    }

    function showElbUnBindTransfer() {

      //  请求后端数据
      elbUnBindListData.value = selectTreeNode.value.bind_elbs
      showElbUnBindTransferIf.value = true
      showElbBindTransferIf.value = false
    }


    function showRdsUnBindTransfer() {

      //  请求后端数据
      rdsUnBindListData.value = selectTreeNode.value.bind_rdss
      showRdsUnBindTransferIf.value = true
      showRdsBindTransferIf.value = false
    }


    function closeEcsBindTransfer() {
      showEcsBindTransferIf.value = false
    }


    function closeElbBindTransfer() {
      showElbBindTransferIf.value = false
    }

    function closeRdsBindTransfer() {
      showRdsBindTransferIf.value = false
    }


    function closeEcsUnBindTransfer() {
      showEcsUnBindTransferIf.value = false
    }

    function closeElbUnBindTransfer() {
      showElbUnBindTransferIf.value = false
    }

    function closeRdsUnBindTransfer() {
      showRdsUnBindTransferIf.value = false
    }


    function sendEcsBind() {
      console.log("获取穿梭框已选择ecs数据 ecsBindTargetKeys", ecsBindTargetKeys)
      // 给1个服务树叶子节点绑定 一堆机器 ，key数组是 机器的id

      var data = {}
      data["node_id"] = selectTreeNode.value.id
      data["resource_ids"] = ecsBindTargetKeys.value
      const num = ecsBindTargetKeys.value.length

      bindEscToStreeNode(data).then((res) => {
        createMessage.success(`已成功将 ${num} 个 ecs 绑定到节点 ${selectTreeNode.value.nodePath} `);
      }).catch(() => {
        createMessage.error(`绑定出错`);
      }).finally(() => {
      });

      ecsBindTargetKeys.value = []


    }

    function sendRdsBind() {
      console.log("获取穿梭框已选择rds数据 rdsBindTargetKeys", rdsBindTargetKeys)
      // 给1个服务树叶子节点绑定 一堆机器 ，key数组是 机器的id

      var data = {}
      data["node_id"] = selectTreeNode.value.id
      data["resource_ids"] = rdsBindTargetKeys.value
      const num = rdsBindTargetKeys.value.length

      bindRdsToStreeNode(data).then((res) => {
        createMessage.success(`已成功将 ${num} 个 rds 绑定到节点 ${selectTreeNode.value.nodePath} `);
      }).catch(() => {
        createMessage.error(`绑定出错`);
      }).finally(() => {
      });

      rdsBindTargetKeys.value = []


    }


    function sendElbBind() {
      console.log("获取穿梭框已选择elb数据 elbBindTargetKeys", elbBindTargetKeys)
      // 给1个服务树叶子节点绑定 一堆机器 ，key数组是 机器的id

      var data = {}
      data["node_id"] = selectTreeNode.value.id
      data["resource_ids"] = elbBindTargetKeys.value
      const num = elbBindTargetKeys.value.length

      bindElbToStreeNode(data).then((res) => {
        createMessage.success(`已成功将 ${num} 个 elb 绑定到节点 ${selectTreeNode.value.nodePath} `);
      }).catch(() => {
        createMessage.error(`绑定出错`);
      }).finally(() => {
      });

      elbBindTargetKeys.value = []


    }


    function sendEcsUnBind() {
      console.log("获取穿梭框已选择ecs数据 ecsUnBindTargetKeys", ecsUnBindTargetKeys)
      // 给1个服务树叶子节点绑定 一堆机器 ，key数组是 机器的id

      var data = {}
      data["node_id"] = selectTreeNode.value.id
      data["resource_ids"] = ecsUnBindTargetKeys.value
      const num = ecsUnBindTargetKeys.value.length

      unBindEscToStreeNode(data).then((res) => {
        createMessage.success(`已成功将 ${num} 个ecs 从 节点 ${selectTreeNode.value.nodePath} 解绑`);
      }).catch(() => {
        createMessage.error(`解绑出错`);
      }).finally(() => {
      });
      ecsUnBindTargetKeys.value = []


    }


    function sendElbUnBind() {
      console.log("获取穿梭框已选择elb数据 elbUnBindTargetKeys", elbUnBindTargetKeys)
      // 给1个服务树叶子节点绑定 一堆机器 ，key数组是 机器的id

      var data = {}
      data["node_id"] = selectTreeNode.value.id
      data["resource_ids"] = elbUnBindTargetKeys.value
      const num = elbUnBindTargetKeys.value.length

      unBindElbToStreeNode(data).then((res) => {
        createMessage.success(`已成功将 ${num} 个elb 从 节点 ${selectTreeNode.value.nodePath} 解绑`);
      }).catch(() => {
        createMessage.error(`解绑出错`);
      }).finally(() => {
      });
      elbUnBindTargetKeys.value = []


    }

    function sendRdsUnBind() {
      console.log("获取穿梭框已选择rds数据 rdsUnBindTargetKeys", rdsUnBindTargetKeys)
      // 给1个服务树叶子节点绑定 一堆机器 ，key数组是 机器的id

      var data = {}
      data["node_id"] = selectTreeNode.value.id
      data["resource_ids"] = rdsUnBindTargetKeys.value
      const num = rdsUnBindTargetKeys.value.length

      unBindRdsToStreeNode(data).then((res) => {
        createMessage.success(`已成功将 ${num} 个rds 从 节点 ${selectTreeNode.value.nodePath} 解绑`);
      }).catch(() => {
        createMessage.error(`解绑出错`);
      }).finally(() => {
      });
      rdsUnBindTargetKeys.value = []


    }


    //  添加顶级节点
    async function addTopNode(): Promise<void> {

      openDrawer(true, {
        level: 1,
        pid: 0,
      });
    }


    // 让他拿到第一层级

    getTopStreeNodes().then((res) => {

      treeData.value = res
      isShow.value = true
    })

    function handleSuccess() {
    }


    const firstSelect = ref(true);

    // function(selectedKeys, e:{selected: bool, selectedNodes, node, event})
    const onSelect = (selectedKeys, e) => {
      cicdDeployItem.value = null
      cicdDeployItemStages.value = []
      cicdDeployItemExist.value = false

      if (activeKey.value == '3') {
        elbTableShow.value = true
      }
      fetchResourceEcsParams = {}

      selectTreeNodeDesc.value = e.node.desc


      isSelect.value = true
      if (activeKey.value == '1') {
        ecsChartShow.value = true
        elbChartShow.value = true
        rdsChartShow.value = true
      }
      dataSourceTableEcs.value = []


      thisNodePath.value = "当前树节点全路径: " + e.node.nodePath


      selectTreeNode.value = e.node
      selectTreeNodeIsLeaf.value = e.node.isLeaf
      selectTreeNodeLevel.value = e.node.level
      selectTreeNodeOpsAdmins.value = e.node.ops_admin_users
      selectTreeNodeBindEcsNum.value = e.node.ecsNum
      selectTreeNodeBindElbNum.value = e.node.elbNum
      selectTreeNodeBindRdsNum.value = e.node.rdsNum
      selectTreeNodeBindLeafNodeNum.value = e.node.leafNodeNum
      selectTreeNodeBindNodeNum.value = e.node.nodeNum
      selectTreeNodeBindCpuTotal.value = e.node.ecsCpuTotal
      selectTreeNodeBindElbBandWithTotal.value = e.node.elbBandWithTotal
      selectTreeNodeBindMemoryTotal.value = e.node.ecsMemoryTotal
      selectTreeNodeBindDiskTotal.value = e.node.ecsDiskTotal
      console.log("服务树节点被选中了", selectTreeNode.value, selectTreeNodeIsLeaf)

      //  这一步已经被 before那个回调替代了，不再需要了
      fetchResourceEcsParams["resourceType"] = "ecs"
      fetchResourceEcsParams["nodeId"] = e.node.id

      // 如果不是第一次选中
      // 并且 标签页key=2 代表选择了ecs数据页面
      // console.log("当前标签页的key是多少",)
      if (firstSelect.value == false && activeKey.value == '2') {
        console.log("执行ecs表格reload")
        reload()
      }

      if (firstSelect.value == false && activeKey.value == '3') {
        // elbTableShow.value=true
        console.log("执行elb表格reload")
        // reloadElb()
        methodsElbs.reload()
      }

      if (firstSelect.value == false && activeKey.value == '4') {
        // elbTableShow.value=true
        console.log("执行rds表格reload")
        methodsRdss.reload()
      }

      firstSelect.value = false

      // fetchResourceByNode({"resourceType": "ecs", "nodeId": e.node.id}).then((res) => {
      //   console.log("获取服务树ecs数据获取下一层级结果", res)
      //   dataSourceTableEcs.value = res.items
      //
      //   getTableAction().setPagination({
      //     total:res.total
      //   })
      // }).catch(() => {
      //   createMessage.error(`获取服务树ecs数据失败 `);
      // }).finally(() => {
      //   });

      showEcsBindTransferIf.value = false
      showEcsUnBindTransferIf.value = false
      fetchNodeCicdDeployItem()
    }


    function fetchNodeCicdDeployItem() {
      if (!selectTreeNodeIsLeaf.value) {
        return
      }
      getCicdDeployItemByStreeNodeId(selectTreeNode.value.id).then((res) => {
        console.log("获取服务树绑定的发布项:", selectTreeNode.value.id, res)
        cicdDeployItem.value = res
        cicdDeployItemStages.value = res.stagesFront
        cicdDeployItemExist.value = true
      }).catch(() => {
        // createMessage.error(`获取服务树绑定的发布项失败  id=${selectTreeNode.value.id} `);
      })
        .finally(() => {
        });

    }

    const onLoadData = (treeNode: any) => {
      return new Promise((resolve: (value?: unknown) => void) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        const title = treeNode.dataRef.title
        const id = treeNode.dataRef.id
        // 真正的去请求数据
        // 以当前id 查询下一级别的 children 列表
        getChildrenStreeNodes(id).then((res) => {

          console.log("异步获取下一层级结果", res)
          treeNode.dataRef.children = res
          treeData.value = [...treeData.value];
          resolve();
          // createMessage.success(`已成功删除节点 ${treeKey} id=${id} `);
        }).catch(() => {
          createMessage.error(`获取当前节点子节点失败  title=${title} id=${id} `);
        })
          .finally(() => {
          });

      });
    };


    const dataSourceTableEcs = ref([])
    var fetchResourceEcsParams = {}
    // 右键菜单的处理
    const onContextMenuClick = (treeKey, menuKey, id, level, children, isLeaf) => {
      console.log("v-if的isLeaf", isLeaf)
      if (menuKey == "1") {
        // 新增节点 level本节点的下一级
        // pid 应该传本节点的id
        openDrawer(true, {
          level: level + 1,
          pid: id,
          title: treeKey,
        });

      }

      console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}  id:${id} level:${level} children:${children} `);
      if (menuKey == "2") {
        // 只让删除叶子节点
        if (children != null) {
          if (children.length > 0) {
            createMessage.error("禁止删除非叶子节点")
            return
          }

        }

        // 真正的删除
        deleteStreeNode(id).then(() => {
          createMessage.success(`已成功删除节点 ${treeKey} id=${id} `);
        })
          .catch(() => {
            createMessage.error(`删除节点失败 ${treeKey} id=${id} `);
          })
          .finally(() => {
          });
      }

    };

    const [registerTableCicdStage, {reloadCondition,}] = useTable({
      title: '发布阶段',
      dataSource: cicdDeployItemStages,
      columns: columnsCicdStage,

      bordered: true,
      showIndexColumn: false,


    });


    //  useTable 反馈
    const [registerTableEcs, {getForm, getPaginationRef, reload}] = useTable({
      title: '关联的ecs列表',
      useSearchForm: true,
      // dataSource: dataSourceTableEcs,
      api: fetchResourceByNode,
      //  vben 表格的 beforeFetch 中的data 就是参数 无需自己拼接
      beforeFetch: (data) => {
        //

        data["resourceType"] = "ecs"
        data["nodeId"] = selectTreeNode.value.id
        console.log("fetchResourceByNode.beforeFetch", data)
        return data

        // 就不需要下面的逻辑了
        // 接口请求前 参数处理
        const pagination = getPaginationRef()
        //  获取查询的数据
        const searchForm = getForm().getFieldsValue()

        if (searchForm.Vendor != undefined) {
          fetchResourceEcsParams["Vendor"] = searchForm.Vendor
        }
        if (searchForm.OSName != undefined) {
          fetchResourceEcsParams["OSName"] = searchForm.OSName
        }
        fetchResourceEcsParams["pageSize"] = pagination["pageSize"]
        fetchResourceEcsParams["page"] = pagination["current"]

        // getForm().resetFields()
        return fetchResourceEcsParams;

      },
      formConfig: {
        labelWidth: 60,
        // labelAlign: 'left',
        schemas: searchFormSchemaEcs,
        autoSubmitOnEnter: true,
      },
      defSort: {
        field: 'title',
        order: 'ascend',
        // order: 'descend',
      },
      bordered: true,
      pagination: {pageSizeOptions: ['5', '10', '20', '50', '80', '100'],},

      columns: getBasicColumnsEcsTable(),
      showTableSetting: true,
      tableSetting: {fullScreen: true},
      showIndexColumn: false,
      rowKey: 'id',
    });


    //
    const [registerTableElb, methodsElbs] = useTable({
      title: '关联的elb列表',
      useSearchForm: true,
      // dataSource: dataSourceTableEcs,
      api: fetchResourceByNode,
      //  vben 表格的 beforeFetch 中的data 就是参数 无需自己拼接
      beforeFetch: (data) => {
        //

        data["resourceType"] = "elb"
        data["nodeId"] = selectTreeNode.value.id
        console.log("fetchResourceByNode.beforeFetch", data)
        return data

      },
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchemaELb,
        autoSubmitOnEnter: true,
      },
      defSort: {
        field: 'title',
        order: 'ascend',
        // order: 'descend',
      },
      bordered: true,
      pagination: {pageSizeOptions: ['5', '10', '20', '50', '80', '100'],},

      columns: getBasicColumnsElbTable(),
      showTableSetting: true,
      tableSetting: {fullScreen: true},
      showIndexColumn: false,
      rowKey: 'id',
    });

    const [registerTableRds, methodsRdss] = useTable({
      title: '关联的rds列表',
      useSearchForm: true,
      // dataSource: dataSourceTableEcs,
      api: fetchResourceByNode,
      //  vben 表格的 beforeFetch 中的data 就是参数 无需自己拼接
      beforeFetch: (data) => {
        //

        data["resourceType"] = "rds"
        data["nodeId"] = selectTreeNode.value.id
        console.log("fetchResourceByNode.beforeFetch", data)
        return data

      },
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchemaRds,
        autoSubmitOnEnter: true,
      },
      defSort: {
        field: 'title',
        order: 'ascend',
        // order: 'descend',
      },
      bordered: true,
      pagination: {pageSizeOptions: ['5', '10', '20', '50', '80', '100'],},

      columns: getBasicColumnsRdsTable(),
      showTableSetting: true,
      tableSetting: {fullScreen: true},
      showIndexColumn: false,
      rowKey: 'id',
    });


    return {
      fetchResourceEcsParams,
      registerTableEcs,
      registerTableCicdStage,
      registerTableElb,
      registerTableRds,
      dataSourceTableEcs,
      // registerTableEcs,
      // getFormValuesTableEcs,
      // checkedKeysTableEcs,
      // onSelectTableEcs,
      // onSelectAllTableEcs,
      ecsBindHandleSelectChange,
      elbBindHandleSelectChange,
      rdsBindHandleSelectChange,
      ecsUnBindHandleSelectChange,
      elbUnBindHandleSelectChange,
      rdsUnBindHandleSelectChange,
      ecsBindHandleChange,
      elbBindHandleChange,
      rdsBindHandleChange,
      ecsUnBindHandleChange,
      elbUnBindHandleChange,
      rdsUnBindHandleChange,
      sendEcsBind,
      sendRdsBind,
      sendElbBind,
      // sendEcsBind,
      sendEcsUnBind,
      sendRdsUnBind,
      sendElbUnBind,
      ecsBindSelectedKeys,
      elbBindSelectedKeys,
      rdsBindSelectedKeys,
      ecsUnBindSelectedKeys,
      elbUnBindSelectedKeys,
      rdsUnBindSelectedKeys,
      ecsBindTargetKeys,
      elbBindTargetKeys,
      rdsBindTargetKeys,
      ecsUnBindTargetKeys,
      elbUnBindTargetKeys,
      rdsUnBindTargetKeys,
      ecsListData,
      elbListData,
      rdsListData,
      ecsUnBindListData,
      elbUnBindListData,
      rdsUnBindListData,
      closeEcsBindTransfer,
      closeElbBindTransfer,
      closeRdsBindTransfer,
      closeEcsUnBindTransfer,
      closeElbUnBindTransfer,
      closeRdsUnBindTransfer,
      showEcsBindTransferIf,
      showElbBindTransferIf,
      showRdsBindTransferIf,
      showEcsUnBindTransferIf,
      showElbUnBindTransferIf,
      showRdsUnBindTransferIf,
      showEcsBindTransfer,
      showElbBindTransfer,
      showRdsBindTransfer,
      showEcsUnBindTransfer,
      showElbUnBindTransfer,
      showRdsUnBindTransfer,
      showNodeModal,
      showNodeModalCicdDeployItem,
      deleteNodeCicdDeployItem,
      registerModal,
      registerModalCicdDeployItem,
      activeKey,
      treeData,
      onLoadData,
      isShow,
      isSelect,
      elbTableShow,
      // ecsChartHeight,
      onSelect,
      onContextMenuClick,
      expandedKeys,
      selectedKeys,
      registerDrawer,
      addTopNode,
      handleSuccess,
      thisNodePath,
      selectTreeNodeDesc,
      selectTreeNodeLevel,
      selectTreeNodeIsLeaf,
      cicdDeployItemExist,
      cicdDeployItem,
      cicdDeployItemStages,
      selectTreeNode,
      ecsChartShow,
      elbChartShow,
      rdsChartShow,
      selectTreeNodeOpsAdmins,
      selectTreeNodeBindEcsNum,
      selectTreeNodeBindElbNum,
      selectTreeNodeBindRdsNum,
      selectTreeNodeBindNodeNum,
      selectTreeNodeBindLeafNodeNum,
      selectTreeNodeBindCpuTotal,
      selectTreeNodeBindElbBandWithTotal,
      selectTreeNodeBindMemoryTotal,
      selectTreeNodeBindDiskTotal,
      tagsColorFunc,
    };
  },
});
</script>

<style lang="less" scoped>
.ant-tabs-tab {
  margin-left: 0 !important;
}

//下划线修改
:deep(.ant-tabs-ink-bar) {
  background-color: #36bad5;
}

//选中颜色修改
:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #f90606;
  background-color: #93093e;
}

//悬浮颜色修改
:deep(.ant-tabs-tab:hover) {
  color: #FF9900;
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
