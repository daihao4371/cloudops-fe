import {BasicColumn, FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Switch} from 'ant-design-vue';
import {
  getAccountList,
  getMonitorScrapePoolList,
  getMonitorSendGroupList,
  getLeafStreeNodes,
  setRoleStatus,
  getStreeNodeSelectWithCicdItem,
  getCicdDeployItemList,
  listGitlabTagsByCicdItemId, batchDeleteMonitorRecordRule,
} from '/@/api/demo/system';
import {useMessage} from '/@/hooks/web/useMessage';
import {defineComponent, ref} from 'vue';
import {DescItem} from "@/components/Description";

const {createMessage} = useMessage();

export const getCicdWorkOrderSchema: DescItem[] = [
  {
    field: 'name',
    label: '工单名称',
    // labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,fontFamily: '微软雅黑', fontStyle:'italic'}
    labelStyle: {color: 'red', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
    // labelStyle: { color: 'red',fontSize: '20px' ,fontWeight: 'bold' ,}
  },
  {
    field: 'createUserName',
    label: '创建人',
    labelStyle: {color: 'green', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'createdTime',
    label: '创建时间',
  },
  {
    field: 'gitlabRepository',
    label: 'git仓库',
    labelStyle: {color: 'red', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },

  {
    field: 'gitTag',
    label: '要发布版本',
    labelStyle: {color: 'blue', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'lastVersion',
    label: '当前版本号',
    labelStyle: {color: 'blue', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'imageUrl',
    label: '镜像地址',
    labelStyle: {color: 'green', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'statusChinese',
    label: '工单状态',
    labelStyle: {color: 'red', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'approvalStatus',
    label: '审批状态',
    labelStyle: {color: 'blue', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'approvalUserName',
    label: '实际审批人',
    labelStyle: {color: 'red', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'nodePath',
    label: '绑定的服务树节点',
    labelStyle: {color: 'green', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },
  {
    field: 'isCanary',
    label: '是否灰度发布',
    labelStyle: {color: 'blue', fontSize: '20px', fontWeight: 'bold', fontFamily: '宋体'}
  },

];


export const columns: BasicColumn[] = [

  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
  },

  {
    title: '服务树节点',
    dataIndex: 'nodePath',
  },

  {
    title: '版本号',
    dataIndex: 'gitTag',
  },
  {
    title: '当前状态',
    dataIndex: 'statusChinese',
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    width: 180,
  },

];

export const columnsPod: BasicColumn[] = [

  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    width: 300,
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '镜像版本',
    dataIndex: 'imageVersion',
    sorter: true,
  },
  {
    title: '哈希值',
    dataIndex: 'podTemplateHash',
  },
  {
    title: '容器组点击查看日志',
    dataIndex: 'containers',
    width: 300,
  },
  {
    title: '创建时间',
    dataIndex: 'age',
    sorter: true,
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
  },

  {
    title: '容器ready状态',
    dataIndex: 'ready',
  },


];

export const columnsStage: BasicColumn[] = [
  {
    title: '点击详情查看pod列表',
    dataIndex: 'indexNum',
    width: 280,
  },
  {
    title: '当前状态',
    dataIndex: 'statusChinese',
  },
  {
    title: '灰度状态',
    dataIndex: 'rolloutMessage',
  },
  {
    title: '详情展示',
    dataIndex: 'detail',
  },

  {
    title: '发布阶段',
    dataIndex: 'name',
    width: 280,
  },

  {
    title: '集群',
    dataIndex: 'cluster',
  },

  {
    title: '应用名称',
    dataIndex: 'k8sAppName',
  },
  {
    title: '执行人',
    dataIndex: 'actionUserName',
  },

  {
    title: '最近一次的错误',
    dataIndex: 'lastError',
  },
  // {
  //   title: '是否结束',
  //   dataIndex: 'finished',
  // },


];


//   {
//     title: '分组英文名称 点击跳转排班表',
//     dataIndex: 'name',
//   },
//   {
//     title: '分组中文名称',
//     dataIndex: 'nameZh',
//   },

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: {span: 8},
  },
];

const needUpgrade = (needUpgrade: number) => needUpgrade === 1;

const envOptions = [
  // {label: '生产集群', value: 'prod'},
  // {label: '预发集群', value: 'stage'},
]
const var1 = ref([])
const gitTags = ref([])
const gitRepo = ref([])


export const formSchema: FormSchema[] = [


  //  下面是共用的
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
    colProps: {span: 24},
  },


  {
    label: '选择服务发布项',
    field: 'cicdDeployItemId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      onChange: (e, v) => {
        if (!e) {
          return
        }
        console.log("选择服务发布项切换变化 我去根据发布项id获取这个gitlab仓库id 再去获取gitTags", e, v);
        listGitlabTagsByCicdItemId(e).then((res) => {
          console.log("根据发布项id获取这个gitlab仓库id 再去获取gitTags结果", res)
          gitTags.value = []
          gitTags.value = res
        })
          .catch(() => {
            createMessage.error('根据发布项id获取这个gitlab仓库id 再去获取gitTags结果失败');
          })
          .finally(() => {
          });


        // 选择之后再
      },
      showSearch: true,
      api: getCicdDeployItemList,
      // params: {
      //   // levelLt: 2,
      //   levelNum: 3,
      // },
      resultField: 'items',  // total items 数据结构
      labelField: 'nodePath', // 这个是展示的中文
      valueField: 'id',  //  下面是查询的字段
    },
    colProps: {span: 24},
  },

  {
    field: 'gitTag',
    label: '分支选择(联动服务发布项)',
    required: true,
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: gitTags,
    },
    colProps: {span: 24},
  },

  {
    field: 'id',
    label: 'id',
  },
  {
    field: 'UserID',
    label: 'UserID',
  },


];

export const ondutyChangeFormSchema: FormSchema[] = [

  {
    label: '调整值班人',
    field: 'targetUserName',
    component: 'ApiSelect',
    // required: true,
    componentProps: {
      api: getAccountList,
      showSearch: true,
      resultField: 'items',  // total items 数据结构
      labelField: 'realName',
      valueField: 'username',
    },
    colProps: {span: 24},
  },

];
