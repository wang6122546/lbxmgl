// 来宾原型演示目录；组织名称沿用用户提供的来宾页面，人员非真实组织接口。
export const projectCompany='广西来宾广投新材料有限公司';
export const projectDepartments=['经营层','综合管理部','生产管理部','财务部','安全环保部','劳务工作人员'];
export const projectTeams=['锯切班','生产一班','生产二班','生产四班','生产三班','质检班','维修班','行政','仓库班','结晶器维修班'];
const names=['简文豪','桂奇','黄国系','卢海贵','韦栋','姚尚星','李志强','陈建国','王海峰','刘志勇','周文斌','梁晓东','莫志明','何俊','罗敏','韦宝亭'];
export const projectPeople=names.map((name,i)=>({id:'LB-STAFF-'+(i+1),name,phone:'未录入',org:projectCompany,department:i<14?'生产管理部':i===14?'综合管理部':'安全环保部',team:projectTeams[i%projectTeams.length],post:i===15?'安全员':i===14?'行政专员':'作业人员',source:'org'}));
export const projectEnterprises=[
 {enterpriseId:'LB-COMPANY-1',name:'示例设备安装有限公司',leader:'演示负责人甲',phone:'138****0001',org:projectCompany,type:'设备安装'},
 {enterpriseId:'LB-COMPANY-2',name:'示例工程机械有限公司',leader:'演示负责人乙',phone:'138****0002',org:projectCompany,type:'维保服务'},
 {enterpriseId:'LB-COMPANY-3',name:'示例建设有限公司',leader:'演示负责人丙',phone:'138****0003',org:projectCompany,type:'建筑施工'}
];
