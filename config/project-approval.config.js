// 本次评审变更的唯一配置：2个节点与6类审核资料。
export const approvalNodes=[
 {id:'supervisor',label:'项目监督人',legacyField:'approver0'},
 {id:'safety-environment',label:'安全环保部',legacyField:'approver1'}
];
export const materials=[
 {id:'qualification',title:'施工单位资质材料'},
 {id:'main-contract',title:'项目主合同'},
 {id:'safety-agreement',title:'安全协议书'},
 {id:'equipment-inspection',title:'进场设备、材料报验单'},
 {id:'staff-qualifications',title:'施工人员资质'},
 {id:'related-materials',title:'施工人员相关材料、风险抵押金票据、三措材料、设计施工图纸'}
];
export const reviewResults=['符合','不符合','不涉及'];
export const dutyContent='从相关方安全投入和安全设施配置、主要管理人员到岗履责、现场安全管理人员配置、作业过程管理、重大隐患排查整改等方面，对相关方安全风险管控、安全管理协议履行、违章作业、违章指挥，不按设计施工、不落实安全措施作业等行为情况开展综合监督检查并严肃考核通报，对安全风险管控不力、现场管理混乱、严重违章的相关方要及时采取预警、约谈、停产整顿和督促改进，因安全问题被停产的不予工期考虑。';
export const dutyFrequency='每日对相关方作业现场开展常态化安全检查';
export const uploadRules=Object.freeze({maxFiles:5,maxBytes:50*1024*1024,accept:'.pdf,.doc,.docx,.png,.jpg,.jpeg',extensions:['pdf','doc','docx','png','jpg','jpeg']});
export function assignedApprover(project,nodeIndex){return project?.approvalAssignments?.[approvalNodes[nodeIndex].id]||project?.[approvalNodes[nodeIndex].legacyField]||(nodeIndex===0?project?.manager:'安全环保部')||'';}
export function materialFiles(project){
 const result=Object.fromEntries(materials.map(m=>[m.id,[]]));
 if(project?.materialAttachments){
  const saved=structuredClone(project.materialAttachments);
  for(const [key,files] of Object.entries(saved)){
   const target=key in result?key:'related-materials';
   result[target].push(...(files||[]));
  }
 }else (project?.attachments||[]).forEach((file,i)=>{
  // 旧版第5项及其后材料归入合并项，不丢失历史附件。
  const slot=i<4?materials[i].id:'related-materials';
  result[slot].push(typeof file==='string'?{name:file}:structuredClone(file));
 });
 return result;
}
export function validateMaterialUpload(existing,incoming,title='附件'){
 if(existing.length+incoming.length>uploadRules.maxFiles)throw Error(`${title}：每项最多5个附件`);
 for(const file of incoming){
  if(file.size>uploadRules.maxBytes)throw Error('附件不能超过50MB');
  if(!uploadRules.extensions.includes(file.name.split('.').pop().toLowerCase()))throw Error('附件仅支持pdf、doc、docx、png、jpg、jpeg格式');
 }
}
