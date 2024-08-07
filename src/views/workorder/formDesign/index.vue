<template>
  <div>
    <BasicTable @register="registerTable" v-if="showTableIf">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增表单设计 </a-button>

      </template>

      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'users'">

          <li v-for="(item, index) in record.users">
            <a-button class="success" >{{ item.username }}</a-button>
            <!--            <a-button  >{{ item.value }}</a-button>-->
            <!--            <a-divider> </a-divider>-->
          </li>


        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                label: '编辑表单设计'
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                label: '删除表单设计',
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

<!--    这里需要写到 v-if的外层-->
    <BasicForm @register="register" ref="formRef">
    </BasicForm>
    <div v-if="showFormDesignIf">
          <a-button type="danger" class="my-4" @click="sendPostForDesign" >
            新增或更新表单
          </a-button>
      <VFormDesign ref="formDesignRef" :form-config="formConfig" title="abc"  />
    </div>

  </div>
</template>
<script lang="ts" >
import {defineComponent, reactive, ref, toRefs, unref} from 'vue';
  import VFormDesign from '@/views/form-design/components/VFormDesign/index.vue';
  import VFormPreview from '@/views/form-design/components/VFormPreview/index.vue';
  import VFormCreate from '@/views/form-design/components/VFormCreate/index.vue';
  import { IFormDesignMethods, IPropsPanel, IToolbarMethods } from '@/views/form-design/typings/form-type';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
import {
  createProcess,
  deleteProcess,
  deleteRole,
  getProcessList,
  getFormDesignList,
  getRoleListByPage,
  setRoleStatus, updateProcess,
  createFormDesign, updateFormDesign, deleteFormDesign,
} from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import ProcessDrawer from './ProcessDrawer.vue';

  import { columns, searchFormSchema,formSchema } from './formDesign';
  import {useMessage} from "@/hooks/web/useMessage";
  import {TreeItem} from "@/components/Tree";
import {IAnyObject} from "@/views/form-design/typings/base-type";
import {IFormConfig} from "@/views/form-design/typings/v-form-component";
import {IVFormMethods} from "@/views/form-design/hooks/useVFormMethods";
import { BasicForm, FormSchema, FormActionType, FormProps,useForm  } from '/@/components/Form/index';
  export default defineComponent({
    name: 'FormDesignManagement',
    components: {
      BasicForm,
      BasicTable,
      TableAction ,
      VFormDesign,
    },
    setup() {
      // const formConfig = ref(
      //   {
      //     "schemas": [
      //       {
      //         "component": "Select",
      //         "label": "公有云选择",
      //         "field": "vendor_select",
      //         "colProps": {
      //           "span": 24
      //         },
      //         "componentProps": {
      //           "options": [
      //             {
      //               "label": "华为云",
      //               "value": "hw"
      //             },
      //             {
      //               "label": "aws",
      //               "value": "aws"
      //             }
      //           ]
      //         },
      //         "itemProps": {
      //           "labelCol": {},
      //           "wrapperCol": {}
      //         }
      //       },
      //       {
      //         "component": "Input",
      //         "label": "主机名",
      //         "field": "hostname",
      //         "colProps": {
      //           "span": 24
      //         },
      //         "componentProps": {
      //           "type": "text"
      //         },
      //         "itemProps": {
      //           "labelCol": {},
      //           "wrapperCol": {}
      //         }
      //       }
      //     ],
      //     "layout": "horizontal",
      //     "labelLayout": "flex",
      //     "labelWidth": 100,
      //     "labelCol": {},
      //     "wrapperCol": {}
      //   }
      // )

      const [ register, { resetFields, setFieldsValue, validate,getFieldsValue }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      // formConfig初始值不能为 ref()
      const formConfig = ref<IFormConfig>({
        // 表单配置
        schemas: [],
        layout: 'horizontal',
        labelLayout: 'flex',
        labelWidth: 100,
        labelCol: {},
        wrapperCol: {},
        currentItem: {
          component: '',
          componentProps: {},
        },
        activeKey: 1,
      });

      const fApi = ref<null | IVFormMethods>(null);


      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '表单设计列表',
        api: getFormDesignList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 280,
          title: '操作',
          dataIndex: 'action',
          fixed: 'left',
        },

      });

      const showFormDesignIf = ref(false)
      const showTableIf = ref(true)
      const formDesignRef = ref()
      const oneDesign = ref()
      const formRef = ref(null)
      const isUpdate = ref(false)


      const getTitle = ref('新增表单设计');


      console.log("这时候的useform",getFieldsValue())

      function sendPostForDesign() {

        var menuFunc = createFormDesign
        if (unref(isUpdate)) {
          menuFunc = updateFormDesign
          getTitle.value = '更新表单设计'

        }


        var reqData =  getFieldsValue()
        const { createMessage } = useMessage();



        console.log("表单设计操作要发起请求了 reqData",reqData)
        console.log("表单设计操作要发起请求了 oneDesign",oneDesign)
        console.log("表单设计操作要发起请求了 formDesignRef",formDesignRef.value)
        console.log("打印formDesignRef的结果子组件里面的",formConfig.value)
        reqData["formConfig"] = JSON.stringify(formConfig.value)


        menuFunc(reqData).then(() => {
          createMessage.success(`${getTitle.value}成功`);
        }).catch(() => {
          createMessage.error(`${getTitle.value}失败`);
        })
      }

      function handleCreate() {
        showFormDesignIf.value = true
        showTableIf.value = false
      }


      function handleEdit(record: Recordable) {
        isUpdate.value = true
        // formModel.value
        console.log("编辑design record ",record)
        console.log("获取外层的setFieldsValue ",formRef.value)

        // resetFields()
        // setForm()

        setFieldsValue({
          ...record,
        });
        //
        //
        //
        // setFieldsValue({
        //   "name1":"abc1",
        // });


        const jsonFormConfig = JSON.parse(record.formConfig)
        console.log("编辑design.jsonFormConfig",jsonFormConfig)

        formConfig.value =  jsonFormConfig
        showFormDesignIf.value = true
        showTableIf.value =false

      }

      function handleDelete(record: Recordable) {
        const { createMessage } = useMessage();
        deleteFormDesign(record.id).then(() => {
            createMessage.success(`已成功删除表单设计`);
          })
          .catch(() => {
            createMessage.error('删除表单设计失败');
          })
          .finally(() => {
            record.pendingStatus = false;
          });
        reload();

      }

      function handleSuccess() {
        reload();
      }

      return {
        register,
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        showFormDesignIf,
        showTableIf,
        formDesignRef,
        sendPostForDesign,
        formConfig,
        fApi,
        oneDesign,
      };
    },
  });
</script>
