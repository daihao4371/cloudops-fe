<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <!-- 菜单分配 -->
      <template #menus="{ model, field }">
        <a-tag color="#55acee">分配菜单</a-tag>
        <a-tree-select
          v-model:value="model[field]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          treeDataSimpleMode
          placeholder="Please select"
          tree-checkable
          allow-clear
          tree-default-expand-all
        >
        </a-tree-select>
      </template>

      <!-- API分配 -->
      <template #apis="{ model, field }">
        <a-tag color="#55acee">分配API</a-tag>
        <a-tree-select
          v-model:value="model[field]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeDataApi"
          treeDataSimpleMode
          placeholder="Please select"
          tree-checkable
          allow-clear
          tree-default-expand-all
        >
        </a-tree-select>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema } from './role.data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { TreeItem } from '/@/components/Tree';
import {
  createRole,
  updateRole,
  getMenuListAll,
  getApiListAll,
} from '/@/api/demo/system';
import { useMessage } from "@/hooks/web/useMessage";

const emit = defineEmits(['success', 'register']);
const isUpdate = ref(false); // 初始化为 false 表示新增模式
const treeData = ref<TreeItem[]>([]);
const treeDataApi = ref<TreeItem[]>([]);

// 使用表单和抽屉
const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
  labelWidth: 90,
  baseColProps: { span: 24 },
  schemas: formSchema(isUpdate.value), // 动态传入 isUpdate
  showActionButtonGroup: false,
});

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  resetFields();
  setDrawerProps({ confirmLoading: false });

  if (unref(treeData).length === 0) {
    treeData.value = (await getMenuListAll()) as any as TreeItem[];
  }
  if (unref(treeDataApi).length === 0) {
    treeDataApi.value = (await getApiListAll()) as any as TreeItem[];
  }

  isUpdate.value = !!data?.isUpdate; // 更新 isUpdate 变量
  setFieldsValue({
    ...data?.record,
  });
});

const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

async function handleSubmit() {
  try {
    const values = await validate();
    setDrawerProps({ confirmLoading: true });

    const reqData = getFieldsValue();
    const menus = reqData["menus"];
    const menuIds = menus ? menus.map(val => (val.id ? val.id : val)) : [];

    const apis = reqData["apis"];
    const apiIds = apis ? apis.map(val => (val.id ? val.id : val)) : [];

    delete reqData["menus"];
    reqData["menuIds"] = menuIds;

    delete reqData["apis"];
    reqData["apiIds"] = apiIds;

    const { createMessage } = useMessage();
    const menuFunc = unref(isUpdate) ? updateRole : createRole;

    menuFunc(reqData)
      .then(() => {
        createMessage.success(`${getTitle.value}成功`);
        closeDrawer();
        emit('success');
      })
      .catch(() => {
        createMessage.error(`${getTitle.value}失败`);
      });
  } finally {
    setDrawerProps({ confirmLoading: false });
  }
}
</script>
