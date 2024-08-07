<template>

  <PageWrapper title="服务树展示">
    <div class="mt-4">
      <a-divider style="height: 2px; background-color: #7cb305" />
        <a-button type="primary" @click="addTopNode()" value="large">新增顶级节点</a-button>

    </div>
    <a-row>
      <a-col :span="8">
        <a-directory-tree
          v-if="isShow"
          :treeData="treeData"
          multiple
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"

        >
          <template #title="{ key: treeKey, title ,id,level,children }">
            <a-dropdown :trigger="['contextmenu']">
              <span>{{ title }}  </span>
              <template #overlay>
                <a-menu
                  @click="({ key: menuKey }) => onContextMenuClick(title, menuKey,id,level,children)">
                  <a-menu-item key="1"><PlusSquareTwoTone/>新增节点</a-menu-item>
                  <a-menu-item key="2"><MinusCircleTwoTone/>删除节点</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-directory-tree>
      </a-col>
    </a-row>


    <StreeDrawer @register="registerDrawer" @success="handleSuccess"/>
  </PageWrapper>
</template>
<script lang="ts">
import {defineComponent, ref, unref} from 'vue';
import {PageWrapper} from '/@/components/Page';
import {Alert, Space} from 'ant-design-vue';
import {
  StarOutlined,
  StarFilled,
  StarTwoTone,
  PlusSquareTwoTone,
  MinusCircleTwoTone
} from '@ant-design/icons-vue';
import {deleteAccount, deleteStreeNode, getStreeNodeList} from "@/api/demo/system";
import {RoleEnum} from "@/enums/roleEnum";
import projectSetting from "@/settings/projectSetting";
import {PermissionModeEnum} from "@/enums/appEnum";
import {isArray} from "@/utils/is";
import StreeDrawer from "@/views/stree/stree/StreeDrawer.vue";
import {useDrawer} from "@/components/Drawer";
import {useMessage} from "@/hooks/web/useMessage";

export default defineComponent({
  name: 'ServiceTreeIndex',
  components: {
    StreeDrawer,
    PageWrapper,
    StarOutlined, StarFilled, StarTwoTone, PlusSquareTwoTone, MinusCircleTwoTone,
    Space,
  },
  setup() {
    const isShow = ref(false)
    const treeData = ref()
    const expandedKeys = ref<string[]>(['0-0', '0-1']);
    const selectedKeys = ref<string[]>([]);
    const [registerDrawer, {openDrawer}] = useDrawer();


    //  添加顶级节点
    async function addTopNode(): Promise<void> {

      openDrawer(true, {
        level: 1,
        pid: 0,
      });
    }

    getStreeNodeList().then((res) => {

      console.log("结果", res)
      treeData.value = res
      isShow.value = true
    })

    function handleSuccess() {
    }

    const onContextMenuClick = (treeKey, menuKey, id, level,children,isLeaf) => {
      console.log("v-if的isLeaf",isLeaf)

      if (menuKey == "1") {
        // 新增节点 level本节点的下一级
        // pid 应该传本节点的id
        openDrawer(true, {
          level: level + 1,
          pid: id,
          title: treeKey,
        });

      }
      const { createMessage } = useMessage();
      console.log(`isLeaf:${isLeaf} treeKey: ${treeKey}, menuKey: ${menuKey}  id:${id} level:${level} children:${children}  `);
      if (menuKey=="2"){
        // 只让删除叶子节点
        if (children!=null){
          createMessage.error("禁止删除非叶子节点")
          return
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

    return {
      treeData,
      isShow,
      onContextMenuClick,
      expandedKeys,
      selectedKeys,
      registerDrawer,
      addTopNode,
      handleSuccess,

    };
  },
});
</script>

