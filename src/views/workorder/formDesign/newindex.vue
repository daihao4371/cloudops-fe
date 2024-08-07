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
    <a-button type="primary" @click="handleOpenModal(eFormPreview)"> 模态框打开表单渲染 </a-button>

<!--    <h1>下面是直接调用VFormCreate 渲染 </h1>-->
    <VFormPreview ref="eFormPreview" :formConfig="formConfig" />

    <a-button type="primary" @click="handleGetData"> 提取用户创建完数据的json </a-button>
<!--    <VFormCreate-->
<!--      :form-config="formConfig"-->
<!--      v-model:fApi="fApi"-->
<!--    >-->
<!--    </VFormCreate>-->

    <div v-if="showFormDesignIf">
          <BasicForm @register="registerForm"  :model="formModelRef">

          </BasicForm>
          <a-button type="danger" class="my-4" @click="sendPostForDesign" >
            新增或更新表单
          </a-button>
      <VFormDesign ref="formDesignRef" :form-config="formConfig" title="abc" />

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
  import { BasicForm, useForm } from '/@/components/Form/index';
import {
  createProcess,
  deleteProcess,
  deleteRole,
  getProcessList,
  getFormDesignList,
  getRoleListByPage,
  setRoleStatus, updateProcess,
  createFormDesign,updateFormDesign,
} from '/@/api/demo/system';

  import { useDrawer } from '/@/components/Drawer';
  import ProcessDrawer from './ProcessDrawer.vue';

  import { columns, searchFormSchema,formSchema } from './formDesign';
  import {useMessage} from "@/hooks/web/useMessage";
  import {TreeItem} from "@/components/Tree";
import {IAnyObject} from "@/views/form-design/typings/base-type";
import {IFormConfig} from "@/views/form-design/typings/v-form-component";
import {IVFormMethods} from "@/views/form-design/hooks/useVFormMethods";
  export default defineComponent({
    name: 'ProcessManagement',
    components: {
      BasicForm,
      BasicTable,
      ProcessDrawer,
      TableAction ,
      VFormDesign,
      VFormCreate,
      VFormPreview,
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
      const modelRef = ref({});
      const formModelRef = ref({})
      const formConfig = ref({})
      const state = reactive<{
        formModel: IAnyObject;
        visible: boolean;
        formConfig: IFormConfig;
        fApi: IVFormMethods;
      }>({
        formModel: {},
        formConfig: {} as IFormConfig,
        visible: false,
        fApi: {} as IVFormMethods,
      });

      const fApi = ref<null | IVFormMethods>(null);

      const eFormPreview = ref<null | IToolbarMethods>(null);
      const [registerForm, { resetFields, setFieldsValue, validate,getFieldsValue }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

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
          // slots: { customRender: 'action' },
          fixed: 'left',
        },

      });

      const showFormDesignIf = ref(false)
      const showTableIf = ref(true)
      const formDesignRef = ref()
      const isUpdate = ref(false)
      const getTitle = ref('新增表单设计');
      const value = ref<string>();
      var oneRole =  {}

      const visible = ref<boolean>(false);
      function sendPostForDesign() {

        var menuFunc = createFormDesign
        if (unref(isUpdate)) {
          menuFunc = updateFormDesign
          getTitle.value = '更新表单设计'

        }


        var reqData =  getFieldsValue()
        const { createMessage } = useMessage();

        reqData["formConfig"] = JSON.stringify(formConfig.value)


        console.log("表单设计操作要发起请求了 reqData",reqData)
        console.log("打印formDesignRef的结果子组件里面的",formConfig)

        menuFunc(reqData).then(() => {
          createMessage.success(`${getTitle.value}成功`);
        }).catch(() => {
          createMessage.error(`${getTitle.value}失败`);
        })


      }
      var treeDataApi = ref<any[]>([]);


      function showRoleApiDrawer(record: Recordable) {
        visible.value = true;
        oneRole = record
        treeDataApi = record.apis
        console.log("打开模态框后的record",record)
        console.log("打开模态框后的treeDataApi",treeDataApi)
      }

      const onCloseRoleApi = () => {
        visible.value = false;
      };
      function handleCreate() {

        showFormDesignIf.value = true
        showTableIf.value =false
      }

      const handleOpenModal = (Modal: IToolbarMethods) => {
        const config = formConfig.value
        console.log("表单设计",config)
        console.log("表单设计2",Modal)
        console.log("表单设计3",eFormPreview)

        Modal.showModal(config);
      };


      const handleGetData = async () => {
        const getData = await fApi.value.submit?.();
        console.log("getData",getData)
        // jsonModal.value?.showModal?.(_data);
      };
      // function handleGetData() {
      //
      //   // const _data =  fApi.value.submit?.();
      //   const _data =  fApi.value.getData();
      //   const getData =  fApi.value.getData();
      //   console.log("getData",getData)
      //   console.log("_data-fApi",fApi)
      // }


      function handlePreview() {

        showFormDesignIf.value = true
        showTableIf.value =false
      }


      function handleEdit(record: Recordable) {
        // formModel.value
        formModelRef.value = record
        console.log("编辑design",record)
        // setFieldsValue({
        //   ...record,
        // });

        const jsonFormConfig = JSON.parse(record.formConfig)
        console.log("编辑design.jsonFormConfig",jsonFormConfig)
        formConfig.value =  jsonFormConfig
        showFormDesignIf.value = true
        showTableIf.value =false


      }

      function handleDelete(record: Recordable) {
        const { createMessage } = useMessage();
        deleteProcess(record.id).then(() => {
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
        registerForm,
        registerTable,
        registerDrawer,
        handleCreate,
        handlePreview,
        handleOpenModal,
        eFormPreview,
        handleEdit,
        onCloseRoleApi,
        handleDelete,
        visible,
        value,
        oneRole,
        treeDataApi,
        showRoleApiDrawer,
        handleSuccess,
        showFormDesignIf,
        showTableIf,
        formDesignRef,
        sendPostForDesign,
        formConfig,
        fApi,
        handleGetData,
        // formModel,
        formModelRef,
        model: modelRef,
      };
    },
  });
</script>
