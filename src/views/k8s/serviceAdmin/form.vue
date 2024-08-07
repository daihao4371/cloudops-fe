<template>
  <div>
    <h2 style="margin-bottom: 20px">Form 数组表单验证</h2>
    <a-form ref="formRef" :model="form">
      <a-form-item
        label="名称"
        :name="form.name"
      >
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item
        label="命名空间"
        :name="form.namespace"
      >
        <a-input v-model:value="form.namespace" />
      </a-form-item>
      <div class="member" v-for="(item, index) in form.member" :key="item">
        <a-form-item
          label="服务端口"
          :name="['member', index, 'port']"
          :rules="rules.name"
        >
          <a-input v-model:value="item.port" />
        </a-form-item>
        <a-form-item
          label="协议"
          :name="['member', index, 'protocol']"
          :rules="rules.protocol"
        >
          <a-select v-model:value="item.protocol">
            <a-select-option value="TCP"> TCP </a-select-option>
            <a-select-option value="UDP"> UDP </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="容器端口"
          :name="['member', index, 'targetPort']"
          :rules="rules.targetPort"
        >
          <a-input v-model:value="item.targetPort" />
        </a-form-item>
        <a-form-item>
          <a-button @click="delItem(index)">
            <MinusOutlined />
          </a-button>
        </a-form-item>
      </div>

    </a-form>
    <a-button class="add-btn" @click="addItem"><PlusOutlined /></a-button>
    <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
    <a-button @click="resetForm">Reset</a-button>
  </div>
</template>

<script lang="ts" setup>
import { Form, Input, Select, Button } from "ant-design-vue";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {ref} from "vue";


const form = ref({
  name:"",
  member: [
    { port: "", protocol: "", targetPort: "" }
  ],
})
const formRef = ref("formRef")

const rules = ref({
  port: {required: true, message: "请输入服务端口"},
  protocol: {required: true, message: "请输入协议"},
  targetPort: {required: true, message: "请输入容器端口"},
})

function  submitForm() {
  formRef.value.validate().then(() => {

    console.log("form.value",form.value)
  }, (err) => {
    console.log("validate出错",err);
  });
}


function resetForm() {
  formRef.value.resetFields();
}
function addItem() {
  const item = { port: "", protocol: "", targetPort: "" };
  form.value.member.push(item);
}
function delItem(i) {
  if (form.value.member.length === 1) {
    return;
  }
  form.value.member.splice(i, 1);
}

</script>

<style lang='less' scoped>
.member {
  display: flex;

  .ant-form-item {
    margin-right: 10px;
    width: 200px;
  }
}

.ant-btn {
  margin-right: 10px;
}
</style>```

