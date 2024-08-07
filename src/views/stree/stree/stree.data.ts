import {FormSchema} from "@/components/Form";
import {getAccountList, getAllRoleList ,listGitlabProjects} from "@/api/demo/system";
import {BasicColumn} from "@/components/Table";

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        component: 'Select',
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}

export const searchFormSchemaEcs: FormSchema[] = [
  {
    field: 'Vendor',
    label: '厂商',
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        { label: '华为云', value: '华为云' },
        { label: '阿里云', value: '阿里云' },
        { label: '腾讯云', value: '腾讯云' },
        { label: 'aws', value: 'aws' },
      ],
    },
    colProps: {span: 4},
  },
  //  "win10", "ubuntu", "centos", "Eurla", "debian"
  {
    field: 'OSName',
    label: '系统版本',
    defaultValue: "",
    component: 'Select',
    componentProps: {
      options: [
        { label: '巨硬', value: 'win10' },
        { label: '乌班图', value: 'ubuntu' },
        { label: 'centos', value: 'centos' },
        { label: '欧拉', value: 'Eurla' },
        { label: '德班', value: 'debian' },
      ],
    },
    colProps: {span: 7},
  },
];

export const searchFormSchemaELb: FormSchema[] = [
  {
    field: 'Vendor',
    label: '厂商',
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        { label: '华为云', value: '华为云' },
        { label: '阿里云', value: '阿里云' },
        { label: '腾讯云', value: '腾讯云' },
        { label: 'aws', value: 'aws' },
      ],
    },
    colProps: {span: 7},
  },
  //  "win10", "ubuntu", "centos", "Eurla", "debian"
  {
    field: 'LoadBalancerType',
    label: '负载均衡器类型',
    defaultValue: "",
    component: 'Select',
    componentProps: {
      options: [
        { label: 'alb', value: 'alb' },
        { label: 'clb', value: 'clb' },
        { label: 'nlb', value: 'nlb' },
      ],
    },
    colProps: {span: 7},
  },

  {
    field: 'DNSName',
    label: '域名',
    defaultValue: "",
    component: 'Input',
    colProps: {span: 7},
  },
];

export const searchFormSchemaRds: FormSchema[] = [
  {
    field: 'Vendor',
    label: '厂商',
    component: 'Select',
    defaultValue: "",
    componentProps: {
      options: [
        { label: '华为云', value: '华为云' },
        { label: '阿里云', value: '阿里云' },
        { label: '腾讯云', value: '腾讯云' },
        { label: 'aws', value: 'aws' },
      ],
    },
    colProps: {span: 7},
  },
  //  mysql mariadb postgresql
  //  "Primary", "Readonly", "Guard", "Temp", "Master", "Slave"
  {
    field: 'Engine',
    label: '数据库类型',
    defaultValue: "",
    component: 'Select',
    componentProps: {
      options: [
        { label: 'mysql', value: 'mysql' },
        { label: 'mariadb', value: 'mariadb' },
        { label: 'postgresql', value: 'postgresql' },
        { label: 'oracle', value: 'oracle' },
      ],
    },
    colProps: {span: 7},
  },
  {
    field: 'DBInstanceType',
    label: '主备类型',
    defaultValue: "",
    component: 'Select',
    componentProps: {
      options: [
        { label: '主实例', value: 'Primary' },
        { label: '只读实例', value: 'Readonly' },
        { label: '灾备实例', value: 'Guard' },
        { label: '临时实例', value: 'Temp' },
      ],
    },
    colProps: {span: 7},
  },

  {
    field: 'InstanceName',
    label: '名称',
    defaultValue: "",
    component: 'Input',
    colProps: {span: 7},
  },
];

export const columnsCicdStage: BasicColumn[] = [

  {
    title: '发布阶段',
    dataIndex: 'name',
  },
  {
    title: '集群',
    dataIndex: 'cluster',
  },
  {
    title: 'k8s应用id',
    dataIndex: 'k8sAppId',
  },


];


export function getBasicColumnsEcsTable(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
      // 排序按钮
      sorter: true,
    },
    {
      title: '主机名',
      dataIndex: 'title',
      width: 150,
      sorter: true,
    },

    {
      title: 'InstanceId',
      dataIndex: 'InstanceId',
    },
    {
      title: '标签',
      dataIndex: 'Tags',
    },
    // {
    //   title: '主机名',
    //   dataIndex: 'title',
    //   width: 150,
    //   filters: [
    //     { text: 'Male', value: 'male' },
    //     { text: 'Female', value: 'female' },
    //   ],
    // },
    {
      title: '厂商',
      dataIndex: 'Vendor',
      filters: [
        { text: '华为云', value: '华为云' },
        { text: '阿里云', value: '阿里云' },
        { text: '腾讯云', value: '腾讯云' },
        { text: 'aws', value: 'aws' },
      ],
    },

    {
      title: '可用区',
      dataIndex: 'ZoneId',
    },

    {
      title: '系统版本',
      dataIndex: 'OSName',
    },
    {
      title: 'Cpu核数',
      dataIndex: 'Cpu',
      sorter: true,
    },
    {
      title: 'Memory-GB',
      dataIndex: 'Memory',
      sorter: true,
    },

    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'CreatedAt',
    },
  ];
}

export function getBasicColumnsElbTable(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
      // 排序按钮
      sorter: true,
    },
    {
      title: '名称',
      dataIndex: 'title',
      width: 150,
      sorter: true,
    },

    {
      title: 'InstanceId',
      dataIndex: 'InstanceId',
    },
    // {
    //   title: '主机名',
    //   dataIndex: 'title',
    //   width: 150,
    //   filters: [
    //     { text: 'Male', value: 'male' },
    //     { text: 'Female', value: 'female' },
    //   ],
    // },
    {
      title: '标签',
      dataIndex: 'Tags',
    },
    {
      title: '厂商',
      dataIndex: 'Vendor',
      filters: [
        { text: '华为云', value: '华为云' },
        { text: '阿里云', value: '阿里云' },
        { text: '腾讯云', value: '腾讯云' },
        { text: 'aws', value: 'aws' },
      ],
    },

    {
      title: '可用区',
      dataIndex: 'ZoneId',
    },

    {
      title: '负载均衡器类型',
      dataIndex: 'LoadBalancerType',
    },
    {
      title: '带宽上限',
      dataIndex: 'BandwidthCapacity',
      sorter: true,
    },

    {
      title: '域名',
      dataIndex: 'DNSName',
      sorter: true,
    },

    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'CreatedAt',
    },
  ];
}

export function getBasicColumnsRdsTable(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
      // 排序按钮
      sorter: true,
    },
    {
      title: '名称',
      dataIndex: 'title',
      width: 150,
      sorter: true,
    },

    {
      title: 'InstanceId',
      dataIndex: 'InstanceId',
    },
    {
      title: '标签',
      dataIndex: 'Tags',
    },
    {
      title: '厂商',
      dataIndex: 'Vendor',
      filters: [
        { text: '华为云', value: '华为云' },
        { text: '阿里云', value: '阿里云' },
        { text: '腾讯云', value: '腾讯云' },
        { text: 'aws', value: 'aws' },
      ],
    },

    {
      title: '可用区',
      dataIndex: 'ZoneId',
    },

    {
      title: '数据库类型',
      dataIndex: 'Engine',
    },
    {
      title: '数据库主备类型',
      dataIndex: 'DBInstanceType',
      sorter: true,
    },
    {
      title: '数据库版本',
      dataIndex: 'EngineVersion',
      sorter: true,
    },


    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'CreatedAt',
    },
  ];
}



export const formSchema: FormSchema[] = [


  {
    field: 'title',
    label: '名称',
    rules: [
      {required: true, message: 'Please input Activity name', trigger: 'blur'},
    ],
    component: 'Input',
    required: true,
  },
  {
    field: 'isLeaf',
    label: '是否为叶子节点',
    component: 'RadioButtonGroup',
    colProps: {lg: 24, md: 24},
    defaultValue: false,
    componentProps: {
      options: [
        {label: '否', value: false},
        {label: '是', value: true},
      ],
    },
  },
];



export const modalFormSchema: FormSchema[] = [

  {
    field: 'title',
    label: '树节点标识',
    rules: [
      {required: true, message: 'Please input Activity name', trigger: 'blur'},
    ],

    component: 'Input',
    required: true,
  },
  {
    field: 'desc',
    label: '部门或服务说明',
    rules: [
      {required: true, message: 'Please input Activity name', trigger: 'blur'},
    ],

    component: 'Input',
    required: true,
  },



  {
    field: 'id',
    label: 'id',
  },

  {
    field: 'level',
    label: 'level',
  },
  {
    field: 'pId',
    label: 'pId',
  },


  {
    label: '运维负责人',
    //  这里使用 ops_admin_users 代表可以编辑填充上
    //  发起请求的时候 再用这个 getAccountList 填充
    field: 'ops_admin_users',
    component: 'ApiSelect',
    componentProps: {
      api: getAccountList,
      mode: "multiple",
      resultField: 'items',
      labelField: 'realName',
      valueField: 'username',
    },
    required: true,
  },
  {
    label: '研发负责人',
    //  这里使用 ops_admin_users 代表可以编辑填充上
    //  发起请求的时候 再用这个 getAccountList 填充
    field: 'rd_admin_users',
    component: 'ApiSelect',
    componentProps: {
      api: getAccountList,
      mode: "multiple",
      resultField: 'items',
      labelField: 'realName',
      valueField: 'username',
    },
  },
  {
    label: '研发工程师',
    //  这里使用 ops_admin_users 代表可以编辑填充上
    //  发起请求的时候 再用这个 getAccountList 填充
    field: 'rd_member_users',
    component: 'ApiSelect',
    componentProps: {
      api: getAccountList,
      mode: "multiple",
      resultField: 'items',
      labelField: 'realName',
      valueField: 'username',
    },
  },
];


const isCanary = (isCanary: boolean) => isCanary === true;

const canaryStrategyPlaceHolder = `
steps:
    - replicas: 1
    - replicas: 50%
    - replicas: 100%
`

export const modalFormSchemaCicdDeployItem: FormSchema[] = [
  {
    label: 'gitlab项目',
    //  这里使用 ops_admin_users 代表可以编辑填充上
    //  发起请求的时候 再用这个 getAccountList 填充
    field: 'gitlabProjectId',
    component: 'ApiSelect',
    componentProps: {
      api: listGitlabProjects,
      // resultField: 'items',
      // labelField: 'realName',
      // valueField: 'username',
    },
    required: true,
  },
  {
    field: 'isCanary',
    label: '是否灰度',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        {label: '启用', value: true},
        {label: '禁用', value: false},
      ],
    },
  },
  {
    field: 'canaryStrategyYamlString',
    label: '灰度发布策略yaml配置',

    helpMessage: ['格式为yaml','去掉外层的缩进', '-在最前'],
    component: 'InputTextArea',
    colProps: {span: 24},
    componentProps: {
      placeholder: canaryStrategyPlaceHolder,
      rows: 8,
      style: {
        width: '20%',
        color: '#f6023b',
        background: 'green',
      },
    },
    ifShow: ({values}) => isCanary(values.isCanary),
  },


  {
    field: 'imagePrefix',
    label: 'harbor镜像名称前缀',
    component: 'Input',
    required: true,
  },

  {
    field: 'id',
    label: 'id',
  },


];

//
