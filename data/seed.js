export const organization='鞍钢集团矿业有限公司';
export const siteTypes=['动土作业','井场','集气站','改扩建','其他'];
export const statuses=['待审核','待开始','进行中','暂停中','已退场','审核不通过'];
export const organizations=[organization,'东鞍山烧结厂','齐大山选矿厂','弓长岭有限公司选矿分公司','大孤山球团厂','齐大山分公司','鞍千矿业有限责任公司','东鞍山分公司','关宝山矿业有限公司','弓长岭矿业公司','弓长岭有限公司露采分公司','弓长岭有限公司井采分公司','弓长岭有限公司灯塔分公司','眼前山分公司'];
const names=['示例项目—人员核查','示例项目—企业单位数据导出','示例设备安装项目','示例项目—多项目人员','示例检修施工项目','示例钻井项目','示例项目—审核流程','示例动土施工作业','示例建设施工项目','示例维修工程','示例改扩建工程','示例现场检查'];
export const seed={
 projects:names.map((name,i)=>({id:'P'+(i+1),name,status:statuses[i<4?0:(i-3)%6],org:organization,department:organization,type:['钻井作业','动土施工作业','项目类型2'][i%3],siteType:i%3===1?'动土作业':'井场',siteId:i%3===1?'S2':'S1',location:'示例施工区域',start:'2026-08-25',end:'2026-09-30',manager:'演示管理员',description:'本记录为虚构演示数据，用于页面复刻与交互验证。',creator:'演示管理员',attachments:['安全管理协议（示例）.pdf','施工资质（示例）.pdf','安全技术措施方案（示例）.pdf']})),
 sites:[{id:'S1',name:'示例施工现场001',siteType:'井场',org:organization,department:organization,stage:'钻井作业',status:'进行中',start:'2026-08-25',end:'2026-09-30',location:'示例井场区域'},{id:'S2',name:'示例动土施工现场',siteType:'动土作业',org:'东鞍山烧结厂',department:'东鞍山烧结厂',stage:'--',status:'待开始',start:'2026-08-03',end:'2026-08-06',location:'示例动土区域'}],
 partners:[{id:'E1',projectId:'P1',name:'示例设备安装有限公司',type:'设备安装',leader:'演示负责人甲',phone:'138****0001',score:100},{id:'E2',projectId:'P1',name:'示例工程机械有限公司',type:'维保服务',leader:'演示负责人乙',phone:'138****0002',score:100},{id:'E3',projectId:'P2',name:'示例建设有限公司',type:'建筑施工',leader:'演示负责人丙',phone:'138****0003',score:100}],
 people:[{id:'U1',projectId:'P1',partnerId:'E1',name:'演示人员甲',role:'项目负责人',phone:'138****0101',job:'焊工',department:'示例设备安装有限公司',status:'正常',age:36,special:'否'},{id:'U2',projectId:'P1',partnerId:'E1',name:'演示人员乙',role:'否',phone:'138****0102',job:'焊工',department:'示例设备安装有限公司',status:'正常',age:35,special:'否'}],
 certificates:[{id:'C1',projectId:'P1',personId:'U1',name:'演示作业证书',type:'安全生产',number:'DEMO-001',start:'2026-08-08',end:'2027-09-30',issuer:'示例发证机构',review:'正常'}],
 training:[],plans:[],reports:[],
 types:['钻井作业','动土施工作业','项目类型2','集气站维修','录井作业','固井作业','测井作业','试气作业','保供作业','动土改造','项目大类','项目小类'].map((name,i)=>({id:'T'+i,name,siteType:siteTypes[i%5],order:i+1,creator:'演示管理员',created:'2026-08-05 14:56'})),
 risks:[['示例集气站风险库','集气站维修'],['示例施工风险库','项目类型2'],['钻井作业风险库（示例）','钻井作业'],['示例动土风险库','动土施工作业']].map(([name,type],i)=>({id:'R'+(i+1),name,type,status:i===3?'停用':'启用',created:'2025-07-25 14:48:05'})),
 points:['自然环境','三项分离器','场地环境','钻具区','循环罐','远程控制间','沉沙罐','营房','井口','配电房','挖掘机','气瓶储存间'].map((name,i)=>({id:'F'+i,libraryId:'R3',projectId:'P1',name,code:'FDX'+String(i+1).padStart(3,'0'),level:i%3===0?'较大风险':'一般风险',checks:[{category:'现场安全',content:'演示检查内容：检查作业区域设施状态。'}]})),
 owners:['东鞍山选矿厂','齐大山选矿厂','东鞍山烧结厂','鞍钢基石矿业有限公司'].map((name,i)=>({id:'O'+i,name})),
 categories:['动火作业','动土作业','搬迁作业','安装作业'].map((name,i)=>({id:'A'+i,name})),
 settings:[{id:'base',allow:true,link:true,sms:true,warning:true,text:'【演示短信】{项目名称}人员资质预警：{人员姓名}存在{预警类型}，请及时核查处理。'}]
};
