// 本次评审变更的唯一配置：2个节点与6类审核资料。
export const approvalNodes=[
 {id:'supervisor',label:'项目监督人',legacyField:'approver0'},
 {id:'safety-environment',label:'安全环保部',legacyField:'approver1'}
];
// 项目新增、编辑、查看始终使用8类附件；审核项单独配置。
export const projectMaterials=[
 {id:'qualification',title:'施工单位资质材料'},
 {id:'main-contract',title:'项目主合同'},
 {id:'safety-agreement',title:'安全协议书'},
 {id:'equipment-inspection',title:'进场设备、材料报验单'},
 {id:'staff-documents',title:'施工人员相关材料'},
 {id:'risk-deposit',title:'风险抵押金票据'},
 {id:'three-measures',title:'三措材料'},
 {id:'construction-drawings',title:'设计施工图纸（需要时）'}
];
export const materials=[
 {id:'qualification',title:'施工单位资质材料'},
 {id:'main-contract',title:'项目主合同'},
 {id:'safety-agreement',title:'安全协议书'},
 {id:'equipment-inspection',title:'进场设备、材料报验单'},
 {id:'staff-qualifications',title:'施工人员资质'},
 {id:'related-materials',title:'施工人员相关材料、风险抵押金票据、三措材料、设计施工图纸',targetMaterialId:'staff-documents'}
];
export const reviewResults=['符合','不符合','不涉及'];
export const dutyContent='从相关方安全投入和安全设施配置、主要管理人员到岗履责、现场安全管理人员配置、作业过程管理、重大隐患排查整改等方面，对相关方安全风险管控、安全管理协议履行、违章作业、违章指挥，不按设计施工、不落实安全措施作业等行为情况开展综合监督检查并严肃考核通报，对安全风险管控不力、现场管理混乱、严重违章的相关方要及时采取预警、约谈、停产整顿和督促改进，因安全问题被停产的不予工期考虑。';
export const dutyFrequency='每日对相关方作业现场开展常态化安全检查';
export const uploadRules=Object.freeze({maxFiles:5,maxBytes:50*1024*1024,accept:'.pdf,.doc,.docx,.png,.jpg,.jpeg',extensions:['pdf','doc','docx','png','jpg','jpeg']});
export function assignedApprover(project,nodeIndex){return project?.approvalAssignments?.[approvalNodes[nodeIndex].id]||project?.[approvalNodes[nodeIndex].legacyField]||(nodeIndex===0?project?.manager:'安全环保部')||'';}
export function materialFiles(project){
 const result=Object.fromEntries(projectMaterials.map(m=>[m.id,[]]));
 if(project?.materialAttachments){
  // 原8类键值逐项保留。曾存入合并项的文件保留原键，禁止推测拆分或删除。
  for(const [key,files] of Object.entries(structuredClone(project.materialAttachments)))result[key]=files||[];
 }else (project?.attachments||[]).forEach((file,i)=>{
  const slot=projectMaterials[Math.min(i,projectMaterials.length-1)].id;
  result[slot].push(typeof file==='string'?{name:file}:structuredClone(file));
 });
 return result;
}
export function legacyMaterialFiles(project){const ids=new Set(projectMaterials.map(m=>m.id));return Object.entries(materialFiles(project)).filter(([id])=>!ids.has(id)).flatMap(([,files])=>files);}
export function validateMaterialUpload(existing,incoming,title='附件'){
 if(existing.length+incoming.length>uploadRules.maxFiles)throw Error(`${title}：每项最多5个附件`);
 for(const file of incoming){
  if(file.size>uploadRules.maxBytes)throw Error('附件不能超过50MB');
  if(!uploadRules.extensions.includes(file.name.split('.').pop().toLowerCase()))throw Error('附件仅支持pdf、doc、docx、png、jpg、jpeg格式');
 }
}
