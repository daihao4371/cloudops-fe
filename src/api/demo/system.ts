import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel, MenuForm,
} from './model/systemModel';
import {defHttp} from '/@/utils/http/axios';

enum Api {
  AccountList = '/api/system/getAccountList',
  createAccount = '/api/system/createAccount',
  updateAccount = '/api/system/updateAccount',
  changePassword = '/api/system/changePassword',

  deleteAccount = '/api/system/deleteAccount',
  IsAccountExist = '/api/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/api/system/setRoleStatus',
  createRole = '/api/system/createRole',
  updateRole = '/api/system/updateRole',
  deleteRole = '/api/system/deleteRole',
  MenuList = '/api/system/getMenuList',
  StreeNodeList = '/api/stree/getStreeNodeList',
  getStreeNodeSelect = '/api/stree/getStreeNodeSelect',
  getStreeNodeSelectWithCicdItem = '/api/stree/getStreeNodeSelectWithCicdItem',
  getTopStreeNodes = '/api/stree/getTopStreeNodes',
  createStreeNode = '/api/stree/createStreeNode',
  updateStreeNode = '/api/stree/updateStreeNode',
  MenuListAll = '/api/system/getMenuListAll',
  ApiList = '/api/system/getApiList',
  ApiListAll = '/api/system/getApiListAll',
  createMenu = '/api/system/createMenu',
  createApi = '/api/system/createApi',
  updateApi = '/api/system/updateApi',
  deleteMenu = '/api/system/deleteMenu',
  deleteApi = '/api/system/deleteApi',
  //  如果加了 /api 就访问不到 mock了，而是请求golang后端
  updateMenu = '/api/system/updateMenu',
  // RolePageList = '/system/getRoleListByPage',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/api/system/getRoleListAll',

  deleteStreeNode = '/api/stree/deleteStreeNode',
  getChildrenStreeNodes = '/api/stree/getChildrenStreeNodes',

  getResourceEcsUnbindList = '/api/stree/getResourceEcsUnbindList',
  getResourceEcslList = '/api/stree/getResourceEcslList',
  getResourceElbUnbindList = '/api/stree/getResourceElbUnbindList',
  getResourceRdsUnbindList = '/api/stree/getResourceRdsUnbindList',

  bindEscToStreeNode = '/api/stree/bindEscToStreeNode',
  bindElbToStreeNode = '/api/stree/bindElbToStreeNode',
  bindRdsToStreeNode = '/api/stree/bindRdsToStreeNode',
  unBindEscToStreeNode = '/api/stree/unBindEscToStreeNode',
  unBindElbToStreeNode = '/api/stree/unBindElbToStreeNode',
  unBindRdsToStreeNode = '/api/stree/unBindRdsToStreeNode',
  fetchResourceByNode = '/api/stree/fetchResourceByNode',
  getLeafStreeNodes = '/api/stree/getLeafStreeNodes',


  createProcess = '/api/workorder/createProcess',
  updateProcess = '/api/workorder/updateProcess',

  getAllUserAndRoles = '/api/system/getAllUserAndRoles',
  getProcessList = '/api/workorder/getProcessList',
  deleteProcess = '/api/workorder/deleteProcess',


  createFormDesign = '/api/workorder/createFormDesign',
  updateFormDesign = '/api/workorder/updateFormDesign',
  getFormDesignList = '/api/workorder/getFormDesignList',
  deleteFormDesign = '/api/workorder/deleteFormDesign',


  createWorkOrderTemplate = '/api/workorder/createWorkOrderTemplate',
  updateWorkOrderTemplate = '/api/workorder/updateWorkOrderTemplate',
  getWorkOrderTemplateList = '/api/workorder/getWorkOrderTemplateList',

  deleteWorkOrderTemplate = '/api/workorder/deleteWorkOrderTemplate',
  getWorkOrderTemplateDetail = '/api/workorder/getWorkOrderTemplateDetail',

  createWorkOrderInstance = '/api/workorder/createWorkOrderInstance',

  getWorkOrderInstanceList = '/api/workorder/getWorkOrderInstanceList',
  approvalWorkOrderInstance = '/api/workorder/approvalWorkOrderInstance',
  actionWorkOrderInstance = '/api/workorder/actionWorkOrderInstance',
  commentWorkOrderInstance = '/api/workorder/commentWorkOrderInstance',
  getWorkOrderInstanceOne = '/api/workorder/getWorkOrderInstanceOne',
  getJobExecScriptList = '/api/jobexec/getJobExecScriptList',
  createJobExecScript = '/api/jobexec/createJobExecScript',
  updateJobExecScript = '/api/jobexec/updateJobExecScript',
  deleteJobExecScript = '/api/jobexec/deleteJobExecScript',
  getJobExecScriptSelect = '/api/jobexec/getJobExecScriptSelect',


  getJobExecScriptOne = '/api/jobexec/getJobExecScriptOne',


  getJobTaskList = '/api/jobexec/getJobTaskList',
  createJobTask = '/api/jobexec/createJobTask',

  getJobTaskOne = '/api/jobexec/getJobTaskOne',


  actionJobTaskOne = '/api/jobexec/actionJobTaskOne',


  getJobExecResultByJobId = '/api/jobexec/getJobExecResultByJobId',

  getMonitorScrapePoolList = '/api/monitor/getMonitorScrapePoolList',


  createMonitorScrapePool = '/api/monitor/createMonitorScrapePool',
  updateMonitorScrapePool = '/api/monitor/updateMonitorScrapePool',

  getMonitorPrometheusYamlOne = '/api/monitor/getMonitorPrometheusYamlOne',
  getMonitorPrometheusAlertYamlOne = '/api/monitor/getMonitorPrometheusAlertYamlOne',
  getMonitorAlertMangerYamlOne = '/api/monitor/getMonitorAlertMangerYamlOne',
  deleteMonitorScrapePool = '/api/monitor/deleteMonitorScrapePool',

  getMonitorScrapeJobList = '/api/monitor/getMonitorScrapeJobList',
  createMonitorScrapeJob = '/api/monitor/createMonitorScrapeJob',
  updateMonitorScrapeJob = '/api/monitor/updateMonitorScrapeJob',

  getMonitorOndutyGroupList = '/api/monitor/getMonitorOndutyGroupList',


  createMonitorOndutyGroup = '/api/monitor/createMonitorOndutyGroup',
  updateMonitorOndutyGroup = '/api/monitor/updateMonitorOndutyGroup',
  deleteMonitorOndutyGroup = '/api/monitor/deleteMonitorOndutyGroup',
  getMonitorOndutyGroupOneFuturePlan = '/api/monitor/getMonitorOndutyGroupOneFuturePlan',
  getMonitorOndutyGroupOne = '/api/monitor/getMonitorOndutyGroupOne',

  createMonitorOndutyGroupChange = '/api/monitor/createMonitorOndutyGroupChange',

  getMonitorAlertmanagerPoolList = '/api/monitor/getMonitorAlertmanagerPoolList',
  createMonitorAlertmanagerPool = '/api/monitor/createMonitorAlertmanagerPool',
  updateMonitorAlertmanagerPool = '/api/monitor/updateMonitorAlertmanagerPool',

  deleteMonitorAlertmanagerPool = '/api/monitor/deleteMonitorAlertmanagerPool',
  getMonitorSendGroupList = '/api/monitor/getMonitorSendGroupList',


  createMonitorSendGroup = '/api/monitor/createMonitorSendGroup',
  updateMonitorSendGroup = '/api/monitor/updateMonitorSendGroup',
  deleteMonitorSendGroup = '/api/monitor/deleteMonitorSendGroup',

  getMonitorAlertRuleList = '/api/monitor/getMonitorAlertRuleList',
  promqlExprCheck = '/api/monitor/promqlExprCheck',

  createMonitorAlertRule = '/api/monitor/createMonitorAlertRule',
  updateMonitorAlertRule = '/api/monitor/updateMonitorAlertRule',
  enableSwitchMonitorAlertRule = '/api/monitor/enableSwitchMonitorAlertRule',
  deleteMonitorAlertRule = '/api/monitor/deleteMonitorAlertRule',
  batchEnableSwitchMonitorAlertRule = '/api/monitor/batchEnableSwitchMonitorAlertRule',
  batchDeleteMonitorAlertRule = '/api/monitor/batchDeleteMonitorAlertRule',
  getMonitorAlertEventList = '/api/monitor/getMonitorAlertEventList',
  eventAlertSilence = '/api/monitor/eventAlertSilence',
  eventAlertRenLing = '/api/monitor/eventAlertRenLing',
  eventAlertUnSilence = '/api/monitor/eventAlertUnSilence',
  batchEventAlertSilence = '/api/monitor/batchEventAlertSilence',
  getMonitorPrometheusRecordYamlOne = '/api/monitor/getMonitorPrometheusRecordYamlOne',
  getMonitorRecordRuleList = '/api/monitor/getMonitorRecordRuleList',
  createMonitorRecordRule = '/api/monitor/createMonitorRecordRule',
  updateMonitorRecordRule = '/api/monitor/updateMonitorRecordRule',
  deleteMonitorRecordRule = '/api/monitor/deleteMonitorRecordRule',
  batchDeleteMonitorRecordRule = '/api/monitor/batchDeleteMonitorRecordRule',
  enableSwitchMonitorRecordRule = '/api/monitor/enableSwitchMonitorRecordRule',
  batchEnableSwitchMonitorRecordRule = '/api/monitor/batchEnableSwitchMonitorRecordRule',

  //  k8s模块了
  getK8sClusterList = '/api/k8s/getK8sClusterList',
  createK8sCluster = '/api/k8s/createK8sCluster',
  updateK8sCluster = '/api/k8s/updateK8sCluster',
  getK8sNodeList = '/api/k8s/getK8sNodeList',
  getK8sClusterListForSelect = '/api/k8s/getK8sClusterListForSelect',
  getClusterNamespacesForSelect = '/api/k8s/getClusterNamespacesForSelect',
  scheduleEnableSwitchK8sNodes = '/api/k8s/scheduleEnableSwitchK8sNodes',
  labelK8sNodes = '/api/k8s/labelK8sNodes',
  taintsK8sNodes = '/api/k8s/taintsK8sNodes',
  taintYamlCheck = '/api/k8s/taintYamlCheck',

  drainK8sNodes = '/api/k8s/drainK8sNodes',
  getK8sNodeDetail = '/api/k8s/getK8sNodeDetail',
  getPodsListByNodeName = '/api/k8s/getPodsListByNodeName',


  getK8sYamlTemplateList = '/api/k8s/getK8sYamlTemplateList',
  createK8sYamlTemplate = '/api/k8s/createK8sYamlTemplate',
  deleteK8sYamlTemplate = '/api/k8s/deleteK8sYamlTemplate',
  getK8sYamlTaskList = '/api/k8s/getK8sYamlTaskList',
  createK8sYamlTask = '/api/k8s/createK8sYamlTask',
  updateK8sYamlTask = '/api/k8s/updateK8sYamlTask',
  applyK8sYamlTaskOne = '/api/k8s/applyK8sYamlTaskOne',
  deleteK8sYamlTask = '/api/k8s/deleteK8sYamlTask',
  getClusterNamespacesForCascader = '/api/k8s/getClusterNamespacesForCascader',
  getK8sPodListByNs = '/api/k8s/getK8sPodListByNs',
  getK8sPodContainers = '/api/k8s/getK8sPodContainers',
  getPodContainerNormalLog = '/api/k8s/getPodContainerNormalLog',
  getK8sPodYamlOne = '/api/k8s/getK8sPodYamlOne',
  getK8sDeployListByNs = '/api/k8s/getK8sDeployListByNs',
  setDeployOneContainerImage = '/api/k8s/setDeployOneContainerImage',
  k8sScaleDeployOne = '/api/k8s/k8sScaleDeployOne',
  k8sBatchDeleteDeploy = '/api/k8s/k8sBatchDeleteDeploy',
  k8sBatchRestartDeploy = '/api/k8s/k8sBatchRestartDeploy',
  getK8sDeployYamlOne = '/api/k8s/getK8sDeployYamlOne',
  getK8sConfigmapListByNs = '/api/k8s/getK8sConfigmapListByNs',
  k8sUpdateConfigmapDataOne = '/api/k8s/k8sUpdateConfigmapDataOne',
  getK8sConfigmapYamlOne = '/api/k8s/getK8sConfigmapYamlOne',
  getK8sServiceListByNs = '/api/k8s/getK8sServiceListByNs',
  k8sCreateOrUpdateServiceOne = '/api/k8s/k8sCreateOrUpdateServiceOne',
  k8sBatchDeleteService = '/api/k8s/k8sBatchDeleteService',
  k8sBatchDeleteConfigmap = '/api/k8s/k8sBatchDeleteConfigmap',
  getK8sServiceYamlOne = '/api/k8s/getK8sServiceYamlOne',

  //  k8s project
  getK8sProjectList = '/api/k8sApp/getK8sProjectList',
  createK8sProject = '/api/k8sApp/createK8sProject',
  updateK8sProject = '/api/k8sApp/updateK8sProject',
  deleteK8sProjectOne = '/api/k8sApp/deleteK8sProjectOne',

  //  k8s app
  getK8sAppList = '/api/k8sApp/getK8sAppList',
  getK8sProjectListForSelect = '/api/k8sApp/getK8sProjectListForSelect',
  getClusterNamespacesUnique = '/api/k8sApp/getClusterNamespacesUnique',
  getK8sAppOne = '/api/k8sApp/getK8sAppOne',
  createK8sAppOne = '/api/k8sApp/createK8sAppOne',
  updateK8sAppOne = '/api/k8sApp/updateK8sAppOne',
  deleteK8sAppOne = '/api/k8sApp/deleteK8sAppOne',

  // k8s instance

  getK8sInstanceList =  '/api/k8sApp/getK8sInstanceList',
  getK8sAppListForSelect =  '/api/k8sApp/getK8sAppListForSelect',
  getK8sInstanceOne =  '/api/k8sApp/getK8sInstanceOne',
  createK8sInstanceOne =  '/api/k8sApp/createK8sInstanceOne',
  updateK8sInstanceOne =  '/api/k8sApp/updateK8sInstanceOne',
  batchDeleteK8sInstance =  '/api/k8sApp/batchDeleteK8sInstance',
  batchRestartK8sInstance =  '/api/k8sApp/batchRestartK8sInstance',
  getK8sPodListByDeploy =  '/api/k8sApp/getK8sPodListByDeploy',

  //  k8s cronjob
  getK8sCronjobList =  '/api/k8sApp/getK8sCronjobList',
  createK8sCronjobOne =  '/api/k8sApp/createK8sCronjobOne',
  updateK8sCronjobOne =  '/api/k8sApp/updateK8sCronjobOne',
  getK8sCronjobOne =  '/api/k8sApp/getK8sCronjobOne',
  batchDeleteK8sCronjob =  '/api/k8sApp/batchDeleteK8sCronjob',
  getK8sCronjobLastPod =  '/api/k8sApp/getK8sCronjobLastPod',


  // cicd

  getCicdDeployWorkOrderList =  '/api/cicd/getCicdDeployWorkOrderList',
  getCicdDeployItemList =  '/api/cicd/getCicdDeployItemList',
  listGitlabTagsByCicdItemId =  '/api/cicd/listGitlabTagsByCicdItemId',
  createCicdDeployWorkOrder =  '/api/cicd/createCicdDeployWorkOrder',
  getCicdWorkOrderOne =  '/api/cicd/getCicdWorkOrderOne',
  getCicdDeployItemByStreeNodeId =  '/api/cicd/getCicdDeployItemByStreeNodeId',
  listGitlabProjects =  '/api/cicd/listGitlabProjects',
  createCicdDeployItem =  '/api/cicd/createCicdDeployItem',
  updateCicdDeployItem =  '/api/cicd/updateCicdDeployItem',
  deleteCicdDeployItem =  '/api/cicd/deleteCicdDeployItem',
  approvalCicdDeployWorkOrder =  '/api/cicd/approvalCicdDeployWorkOrder',
  getCicdDeployStageListByOrderId =  '/api/cicd/getCicdDeployStageListByOrderId',
  actionCicdDeployStage =  '/api/cicd/actionCicdDeployStage',
  updateTestResultCicdDeployStage =  '/api/cicd/updateTestResultCicdDeployStage',
  rollBackCicdDeployStage =  '/api/cicd/rollBackCicdDeployStage',
  closeCicdDeployWorkOrder =  '/api/cicd/closeCicdDeployWorkOrder',
  approveRolloutCicdDeployStage =  '/api/cicd/approveRolloutCicdDeployStage',
  getCicdDeployStagePodList =  '/api/cicd/getCicdDeployStagePodList',




}


export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({url: Api.AccountList, params});

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({url: Api.DeptList, params});

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({url: Api.MenuList, params});


export const getStreeNodeList = (params?: MenuParams) =>
  defHttp.get({url: Api.StreeNodeList, params});

export const getTopStreeNodes = (params?: MenuParams) =>
  defHttp.get({url: Api.getTopStreeNodes, params});


export const updateStreeNode = (data) =>
  defHttp.post({url: Api.updateStreeNode, data});


export const getMenuListAll = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({url: Api.MenuListAll, params});


export const getApiList = (params?: MenuParams) =>
  defHttp.get({url: Api.ApiList, params});

export const getApiListAll = (params?: MenuParams) =>
  defHttp.get({url: Api.ApiListAll, params});


export const createMenu = (data) =>
  defHttp.post({url: Api.createMenu, data});

export const createApi = (data) =>
  defHttp.post({url: Api.createApi, data});


export const updateApi = (data) =>
  defHttp.post({url: Api.updateApi, data});


// export const updateMenu = (data) =>
//   defHttp.post({ url: Api.updateMenu, data });

export const updateMenu = (data) =>
  defHttp.post({url: Api.updateMenu, data: data});


export const deleteMenu = (id: number) =>
  defHttp.delete({url: Api.deleteMenu + "/" + id});

export const deleteApi = (id: number) =>
  defHttp.delete({url: Api.deleteApi + "/" + id});


export const getRoleListByPage = (params?: RolePageParams) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get<RolePageListGetResultModel>({url: Api.GetAllRoleList, params});

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({url: Api.GetAllRoleList, params});

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({url: Api.setRoleStatus, params: {id, status}});


export const createRole = (data) =>
  defHttp.post({url: Api.createRole, data});

export const updateRole = (data) =>
  defHttp.post({url: Api.updateRole, data});


export const deleteRole = (id: number) =>
  defHttp.delete({url: Api.deleteRole + "/" + id,});


export const createAccount = (data) =>
  defHttp.post({url: Api.createAccount, data});

export const updateAccount = (data) =>
  defHttp.post({url: Api.updateAccount, data});

export const deleteAccount = (id: number) =>
  defHttp.delete({url: Api.deleteAccount + "/" + id,});

export const changePassword = (data) =>
  defHttp.post({url: Api.changePassword, data});


export const isAccountExist = (account: string) =>
  defHttp.post({url: Api.IsAccountExist, params: {account}}, {errorMessageMode: 'none'});

export const createStreeNode = (data) =>
  defHttp.post({url: Api.createStreeNode, data});

export const deleteStreeNode = (id) =>
  defHttp.delete({url: Api.deleteStreeNode + "/" + id});

export const getChildrenStreeNodes = (id) =>
  defHttp.get({url: Api.getChildrenStreeNodes + "/" + id});

export const getResourceEcsUnbindList = () =>
  defHttp.get({url: Api.getResourceEcsUnbindList});

export const getResourceEcslList = () =>
  defHttp.get({url: Api.getResourceEcslList});


export const bindEscToStreeNode = (data) =>
  defHttp.post({url: Api.bindEscToStreeNode, data});

export const bindElbToStreeNode = (data) =>
  defHttp.post({url: Api.bindElbToStreeNode, data});

export const bindRdsToStreeNode = (data) =>
  defHttp.post({url: Api.bindRdsToStreeNode, data});


export const unBindEscToStreeNode = (data) =>
  defHttp.post({url: Api.unBindEscToStreeNode, data});

export const unBindElbToStreeNode = (data) =>
  defHttp.post({url: Api.unBindElbToStreeNode, data});
export const unBindRdsToStreeNode = (data) =>
  defHttp.post({url: Api.unBindRdsToStreeNode, data});


export const fetchResourceByNode = (params) =>
  defHttp.get({url: Api.fetchResourceByNode, params: params});


export const getResourceElbUnbindList = () =>
  defHttp.get({url: Api.getResourceElbUnbindList});

export const getResourceRdsUnbindList = () =>
  defHttp.get({url: Api.getResourceRdsUnbindList});

export const createProcess = (data) =>
  defHttp.post({url: Api.createProcess, data});

export const updateProcess = (data) =>
  defHttp.post({url: Api.updateProcess, data});

export const getAllUserAndRoles = () =>
  defHttp.get({url: Api.getAllUserAndRoles});

export const getProcessList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getProcessList, params});

export const deleteProcess = (id: number) =>
  defHttp.delete({url: Api.deleteProcess + "/" + id,});

export const createFormDesign = (data) =>
  defHttp.post({url: Api.createFormDesign, data});
export const updateFormDesign = (data) =>
  defHttp.post({url: Api.updateFormDesign, data});

export const getFormDesignList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getFormDesignList, params});

export const deleteFormDesign = (id: number) =>
  defHttp.delete({url: Api.deleteFormDesign + "/" + id,});

export const createWorkOrderTemplate = (data) =>
  defHttp.post({url: Api.createWorkOrderTemplate, data});

export const updateWorkOrderTemplate = (data) =>
  defHttp.post({url: Api.updateWorkOrderTemplate, data});


export const getWorkOrderTemplateList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getWorkOrderTemplateList, params});


export const deleteWorkOrderTemplate = (id: number) =>
  defHttp.delete({url: Api.deleteWorkOrderTemplate + "/" + id,});

export const getWorkOrderTemplateDetail = (id) =>
  defHttp.get({url: Api.getWorkOrderTemplateDetail + "/" + id,});

export const createWorkOrderInstance = (data) =>
  defHttp.post({url: Api.createWorkOrderInstance, data});

export const getWorkOrderInstanceList = (params) =>
  defHttp.get({url: Api.getWorkOrderInstanceList, params});

export const approvalWorkOrderInstance = (id, approvalAction) =>
  defHttp.post({url: Api.approvalWorkOrderInstance + "/" + id + "?approvalAction=" + approvalAction});

export const getWorkOrderInstanceOne = (id) =>
  defHttp.get({url: Api.getWorkOrderInstanceOne + "/" + id,});


export const actionWorkOrderInstance = (id, data) =>
  defHttp.post({url: Api.actionWorkOrderInstance + "/" + id, data});

export const commentWorkOrderInstance = (id, data) =>
  defHttp.post({url: Api.commentWorkOrderInstance + "/" + id, data});

export const getJobExecScriptList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getJobExecScriptList, params});


export const createJobExecScript = (data) =>
  defHttp.post({url: Api.createJobExecScript, data});
export const updateJobExecScript = (data) =>
  defHttp.post({url: Api.updateJobExecScript, data});

export const deleteJobExecScript = (id: number) =>
  defHttp.delete({url: Api.deleteJobExecScript + "/" + id,});
export const getJobExecScriptSelect = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getJobExecScriptSelect, params});


export const getJobExecScriptOne = (id: number) =>
  defHttp.get({url: Api.getJobExecScriptOne + "/" + id,});


export const getStreeNodeSelect = (params?: MenuParams) =>
  defHttp.get({url: Api.getStreeNodeSelect, params});

export const getStreeNodeSelectWithCicdItem = (params?: MenuParams) =>
  defHttp.get({url: Api.getStreeNodeSelectWithCicdItem, params});



export const getJobTaskList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getJobTaskList, params});

export const createJobTask = (data) =>
  defHttp.post({url: Api.createJobTask, data});

export const getJobTaskOne = (id) =>
  defHttp.get({url: Api.getJobTaskOne + "/" + id,});

export const actionJobTaskOne = (id, action) =>
  defHttp.post({url: Api.actionJobTaskOne + "/" + id + "?action=" + action});


export const getJobExecResultByJobId = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getJobExecResultByJobId, params});


export const getMonitorScrapePoolList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getMonitorScrapePoolList, params});

export const createMonitorScrapePool = (data) =>
  defHttp.post({url: Api.createMonitorScrapePool, data});

export const updateMonitorScrapePool = (data) =>
  defHttp.post({url: Api.updateMonitorScrapePool, data});

export const getMonitorPrometheusYamlOne = (ip) =>
  defHttp.get({url: Api.getMonitorPrometheusYamlOne + "?ip=" + ip,});


export const getMonitorPrometheusAlertYamlOne = (ip) =>
  defHttp.get({url: Api.getMonitorPrometheusAlertYamlOne + "?ip=" + ip,});


export const getMonitorAlertMangerYamlOne = (ip) =>
  defHttp.get({url: Api.getMonitorAlertMangerYamlOne + "?ip=" + ip,});


export const deleteMonitorScrapePool = (id: number) =>
  defHttp.delete({url: Api.deleteMonitorScrapePool + "/" + id,});


export const getMonitorScrapeJobList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getMonitorScrapeJobList, params});

export const getLeafStreeNodes = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getLeafStreeNodes, params});


export const createMonitorScrapeJob = (data) =>
  defHttp.post({url: Api.createMonitorScrapeJob, data});

export const updateMonitorScrapeJob = (data) =>
  defHttp.post({url: Api.updateMonitorScrapeJob, data});

export const getMonitorOndutyGroupList = (params) =>
  defHttp.get({url: Api.getMonitorOndutyGroupList, params});

export const createMonitorOndutyGroup = (data) =>
  defHttp.post({url: Api.createMonitorOndutyGroup, data});


export const updateMonitorOndutyGroup = (data) =>
  defHttp.post({url: Api.updateMonitorOndutyGroup, data});


export const deleteMonitorOndutyGroup = (id: number) =>
  defHttp.delete({url: Api.deleteMonitorOndutyGroup + "/" + id,});

export const getMonitorOndutyGroupOneFuturePlan = (id, params) =>
  defHttp.get({url: Api.getMonitorOndutyGroupOneFuturePlan + "/" + id, params});

export const getMonitorOndutyGroupOne = (id) =>
  defHttp.get({url: Api.getMonitorOndutyGroupOne + "/" + id});

export const createMonitorOndutyGroupChange = (data) =>
  defHttp.post({url: Api.createMonitorOndutyGroupChange, data});

export const getMonitorAlertmanagerPoolList = (params) =>
  // defHttp.get<RolePageListGetResultModel>({url: Api.RolePageList, params});
  defHttp.get({url: Api.getMonitorAlertmanagerPoolList, params});


export const createMonitorAlertmanagerPool = (data) =>
  defHttp.post({url: Api.createMonitorAlertmanagerPool, data});

export const updateMonitorAlertmanagerPool = (data) =>
  defHttp.post({url: Api.updateMonitorAlertmanagerPool, data});


export const deleteMonitorAlertmanagerPool = (id: number) =>
  defHttp.delete({url: Api.deleteMonitorAlertmanagerPool + "/" + id,});

export const getMonitorSendGroupList = (params) =>
  defHttp.get({url: Api.getMonitorSendGroupList, params});

export const createMonitorSendGroup = (data) =>
  defHttp.post({url: Api.createMonitorSendGroup, data});


export const updateMonitorSendGroup = (data) =>
  defHttp.post({url: Api.updateMonitorSendGroup, data});


export const deleteMonitorSendGroup = (id: number) =>
  defHttp.delete({url: Api.deleteMonitorSendGroup + "/" + id,});

export const getMonitorAlertRuleList = (params) =>
  defHttp.get({url: Api.getMonitorAlertRuleList, params});

export const promqlExprCheck = (params) =>
  defHttp.get({url: Api.promqlExprCheck, params});

export const createMonitorAlertRule = (data) =>
  defHttp.post({url: Api.createMonitorAlertRule, data});

export const updateMonitorAlertRule = (data) =>
  defHttp.post({url: Api.updateMonitorAlertRule, data});


export const enableSwitchMonitorAlertRule = (id: number) =>
  defHttp.post({url: Api.enableSwitchMonitorAlertRule + "/" + id,});


export const deleteMonitorAlertRule = (id: number) =>
  defHttp.delete({url: Api.deleteMonitorAlertRule + "/" + id,});

export const batchEnableSwitchMonitorAlertRule = (data) =>
  defHttp.post({url: Api.batchEnableSwitchMonitorAlertRule, data});


export const batchDeleteMonitorAlertRule = (data) =>
  defHttp.delete({url: Api.batchDeleteMonitorAlertRule, data});

export const getMonitorAlertEventList = (params) =>
  defHttp.get({url: Api.getMonitorAlertEventList, params});

export const eventAlertSilence = (id, params) =>
  defHttp.post({url: Api.eventAlertSilence + "/" + id, params,});

export const eventAlertRenLing = (id) =>
  defHttp.post({url: Api.eventAlertRenLing + "/" + id,});


export const eventAlertUnSilence = (id) =>
  defHttp.post({url: Api.eventAlertUnSilence + "/" + id,});

export const batchEventAlertSilence = (data) =>
  defHttp.post({url: Api.batchEventAlertSilence, data,});


export const getMonitorPrometheusRecordYamlOne = (ip) =>
  defHttp.get({url: Api.getMonitorPrometheusRecordYamlOne + "?ip=" + ip,});


export const getMonitorRecordRuleList = (params) =>
  defHttp.get({url: Api.getMonitorRecordRuleList, params});


export const createMonitorRecordRule = (data) =>
  defHttp.post({url: Api.createMonitorRecordRule, data});


export const updateMonitorRecordRule = (data) =>
  defHttp.post({url: Api.updateMonitorRecordRule, data});


export const deleteMonitorRecordRule = (id: number) =>
  defHttp.delete({url: Api.deleteMonitorRecordRule + "/" + id,});


export const batchDeleteMonitorRecordRule = (data) =>
  defHttp.delete({url: Api.batchDeleteMonitorRecordRule, data});


export const enableSwitchMonitorRecordRule = (id: number) =>
  defHttp.post({url: Api.enableSwitchMonitorRecordRule + "/" + id,});

export const batchEnableSwitchMonitorRecordRule = (data) =>
  defHttp.post({url: Api.batchEnableSwitchMonitorRecordRule, data});


export const getK8sClusterList = (params) =>
  defHttp.get({url: Api.getK8sClusterList, params});




export const createK8sCluster = (data) =>
  defHttp.post({url: Api.createK8sCluster, data});

export const updateK8sCluster = (data) =>
  defHttp.post({url: Api.updateK8sCluster, data});

export const getK8sNodeList = (params) =>
  defHttp.get({url: Api.getK8sNodeList, params});

export const getK8sClusterListForSelect = () =>
  defHttp.get({url: Api.getK8sClusterListForSelect});




export const scheduleEnableSwitchK8sNodes = (data) =>
  defHttp.post({url: Api.scheduleEnableSwitchK8sNodes, data});

export const labelK8sNodes = (data) =>
  defHttp.post({url: Api.labelK8sNodes, data});

export const taintYamlCheck = (params) =>
  defHttp.get({url: Api.taintYamlCheck, params});

export const taintsK8sNodes = (data) =>
  defHttp.post({url: Api.taintsK8sNodes, data});


export const drainK8sNodes = (data) =>
  defHttp.post({url: Api.drainK8sNodes, data});


export const getK8sNodeDetail = (params) =>
  defHttp.get({url: Api.getK8sNodeDetail, params});

export const getPodsListByNodeName = (params) =>
  defHttp.get({url: Api.getPodsListByNodeName, params});


export const getK8sYamlTemplateList = (params) =>
  defHttp.get({url: Api.getK8sYamlTemplateList, params});

export const createK8sYamlTemplate = (data) =>
  defHttp.post({url: Api.createK8sYamlTemplate, data});


export const updateK8sYamlTemplate = (data) =>
  defHttp.post({url: Api.updateK8sYamlTemplate, data});



export const deleteK8sYamlTemplate = (id: number) =>
  defHttp.delete({url: Api.deleteK8sYamlTemplate + "/" + id,});


export const getK8sYamlTaskList = (params) =>
  defHttp.get({url: Api.getK8sYamlTaskList, params});

export const deleteK8sYamlTask = (id: number) =>
  defHttp.delete({url: Api.deleteK8sYamlTask + "/" + id,});



export const createK8sYamlTask = (data) =>
  defHttp.post({url: Api.createK8sYamlTask, data});

export const updateK8sYamlTask = (data) =>
  defHttp.post({url: Api.updateK8sYamlTask, data});



export const applyK8sYamlTaskOne = (id: number)=>
  defHttp.post({url: Api.applyK8sYamlTaskOne + "/" + id,});

export const getClusterNamespacesForCascader = () =>
  defHttp.get({url: Api.getClusterNamespacesForCascader});

export const getK8sPodListByNs = (params) =>
  defHttp.get({url: Api.getK8sPodListByNs, params});




export const getK8sPodContainers = (params) =>
  defHttp.get({url: Api.getK8sPodContainers, params});

export const getPodContainerNormalLog = (params) =>
  defHttp.get({url: Api.getPodContainerNormalLog, params});

export const getK8sPodYamlOne = (params) =>
  defHttp.get({url: Api.getK8sPodYamlOne, params});

export const getK8sDeployListByNs = (params) =>
  defHttp.get({url: Api.getK8sDeployListByNs, params});

export const setDeployOneContainerImage = (data) =>
  defHttp.post({url: Api.setDeployOneContainerImage, data});

export const k8sScaleDeployOne = (data) =>
  defHttp.post({url: Api.k8sScaleDeployOne, data});

export const k8sBatchDeleteDeploy = (data) =>
  defHttp.delete({url: Api.k8sBatchDeleteDeploy, data});

export const k8sBatchRestartDeploy = (data) =>
  defHttp.post({url: Api.k8sBatchRestartDeploy, data});


export const getK8sDeployYamlOne = (params) =>
  defHttp.get({url: Api.getK8sDeployYamlOne, params});

export const getK8sConfigmapListByNs = (params) =>
  defHttp.get({url: Api.getK8sConfigmapListByNs, params});



export const k8sUpdateConfigmapDataOne = (data) =>
  defHttp.post({url: Api.k8sUpdateConfigmapDataOne, data});


export const getK8sConfigmapYamlOne = (params) =>
  defHttp.get({url: Api.getK8sConfigmapYamlOne, params});


export const getK8sServiceListByNs = (params) =>
  defHttp.get({url: Api.getK8sServiceListByNs, params});
export const k8sCreateOrUpdateServiceOne = (data) =>
  defHttp.post({url: Api.k8sCreateOrUpdateServiceOne, data});


export const getClusterNamespacesForSelect = (params) =>
  defHttp.get({url: Api.getClusterNamespacesForSelect,params});


export const k8sBatchDeleteService = (data) =>
  defHttp.delete({url: Api.k8sBatchDeleteService, data});

export const k8sBatchDeleteConfigmap = (data) =>
  defHttp.delete({url: Api.k8sBatchDeleteConfigmap, data});


export const getK8sServiceYamlOne = (params) =>
  defHttp.get({url: Api.getK8sServiceYamlOne, params});
export const getK8sProjectList = (params) =>
  defHttp.get({url: Api.getK8sProjectList, params});


export const createK8sProject = (data) =>
  defHttp.post({url: Api.createK8sProject, data});

export const updateK8sProject = (data) =>
  defHttp.post({url: Api.updateK8sProject, data});

export const deleteK8sProjectOne = (id: number)=>
  defHttp.delete({url: Api.deleteK8sProjectOne + "/" + id,});


export const getK8sAppList = (params) =>
  defHttp.get({url: Api.getK8sAppList, params});


export const getK8sProjectListForSelect = () =>
  defHttp.get({url: Api.getK8sProjectListForSelect});

export const getClusterNamespacesUnique = () =>
  defHttp.get({url: Api.getClusterNamespacesUnique});


export const getK8sAppOne = (id)=>
  defHttp.get({url: Api.getK8sAppOne + "/" + id,});


export const createK8sAppOne = (data) =>
  defHttp.post({url: Api.createK8sAppOne, data});

export const updateK8sAppOne = (data) =>
  defHttp.post({url: Api.updateK8sAppOne, data});

export const deleteK8sAppOne = (id: number)=>
  defHttp.delete({url: Api.deleteK8sAppOne + "/" + id,});

export const getK8sInstanceList = (params) =>
  defHttp.get({url: Api.getK8sInstanceList, params});


export const getK8sAppListForSelect = () =>
  defHttp.get({url: Api.getK8sAppListForSelect});



export const getK8sInstanceOne = (id)=>
  defHttp.get({url: Api.getK8sInstanceOne + "/" + id,});


export const createK8sInstanceOne = (data) =>
  defHttp.post({url: Api.createK8sInstanceOne, data});

export const updateK8sInstanceOne = (data) =>
  defHttp.post({url: Api.updateK8sInstanceOne, data});

export const batchDeleteK8sInstance = (data) =>
  defHttp.delete({url: Api.batchDeleteK8sInstance, data});

export const batchRestartK8sInstance = (data) =>
  defHttp.post({url: Api.batchRestartK8sInstance, data});

export const getK8sPodListByDeploy = (params) =>
  defHttp.get({url: Api.getK8sPodListByDeploy, params});

export const getK8sCronjobList = (params) =>
  defHttp.get({url: Api.getK8sCronjobList, params});

export const createK8sCronjobOne = (data) =>
  defHttp.post({url: Api.createK8sCronjobOne, data});

export const updateK8sCronjobOne = (data) =>
  defHttp.post({url: Api.updateK8sCronjobOne, data});



export const getK8sCronjobOne = (id)=>
  defHttp.get({url: Api.getK8sCronjobOne + "/" + id,});

export const batchDeleteK8sCronjob = (data) =>
  defHttp.delete({url: Api.batchDeleteK8sCronjob, data});

export const getK8sCronjobLastPod = (id)=>
  defHttp.get({url: Api.getK8sCronjobLastPod + "/" + id,});



export const getCicdDeployWorkOrderList = (params) =>
  defHttp.get({url: Api.getCicdDeployWorkOrderList, params});

export const getCicdDeployItemList = (params) =>
  defHttp.get({url: Api.getCicdDeployItemList, params});


export const listGitlabTagsByCicdItemId = (id ) =>
  defHttp.get({url: Api.listGitlabTagsByCicdItemId+ "/" + id,});


export const createCicdDeployWorkOrder = (data) =>
  defHttp.post({url: Api.createCicdDeployWorkOrder, data});

export const getCicdWorkOrderOne = (id ) =>
  defHttp.get({url: Api.getCicdWorkOrderOne+ "/" + id,});

export const getCicdDeployItemByStreeNodeId = (id ) =>
  defHttp.get({url: Api.getCicdDeployItemByStreeNodeId+ "/" + id,});

export const listGitlabProjects = () =>
  defHttp.get({url: Api.listGitlabProjects});

export const createCicdDeployItem = (data) =>
  defHttp.post({url: Api.createCicdDeployItem, data});

export const updateCicdDeployItem = (data) =>
  defHttp.post({url: Api.updateCicdDeployItem, data});

export const deleteCicdDeployItem = (id ) =>
  defHttp.delete({url: Api.deleteCicdDeployItem+ "/" + id,});



export const approvalCicdDeployWorkOrder = (id, approvalAction) =>
  defHttp.post({url: Api.approvalCicdDeployWorkOrder + "/" + id + "?approvalAction=" + approvalAction});


export const getCicdDeployStageListByOrderId = (data ) =>
  defHttp.get({url: Api.getCicdDeployStageListByOrderId+ "/" + data.id,});


export const actionCicdDeployStage = (id ) =>
  defHttp.post({url: Api.actionCicdDeployStage+ "/" + id,});


export const updateTestResultCicdDeployStage = (id,result ) =>
  defHttp.post({url: Api.updateTestResultCicdDeployStage+ "/" + id + "?result=" + result});


export const rollBackCicdDeployStage = (id ) =>
  defHttp.post({url: Api.rollBackCicdDeployStage+ "/" + id,});

export const closeCicdDeployWorkOrder = (id ) =>
  defHttp.post({url: Api.closeCicdDeployWorkOrder+ "/" + id,});


export const approveRolloutCicdDeployStage = (id ) =>
  defHttp.post({url: Api.approveRolloutCicdDeployStage+ "/" + id,});


export const getCicdDeployStagePodList = (data ) =>
  defHttp.get({url: Api.getCicdDeployStagePodList+ "/" + data.id,});


