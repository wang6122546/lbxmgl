import {downloadReviewPdf} from '../services/review-pdf-service.js';
import {uploadSignature} from '../services/signature-service.js';
import {shell,esc,drawer,notify} from '../components/layout.js';
import {repo} from '../services/repository.js';
import {currentAccount} from '../config/account.config.js';
import {approvalNodes,materials,assignedApprover,reviewResults,dutyContent,dutyFrequency} from '../config/project-approval.config.js';
import {approvalState,submitApproval} from '../services/approval-service.js';
const id=new URLSearchParams(location.search).get('id')||'P1';
const recordsOnly=document.body.dataset.mode==='records';
const [project,partners]=await Promise.all([repo.get('projects',id),repo.list('partners',{projectId:id})]);
shell('projects');
document.body.classList.add('project-audit-page');
document.querySelector('.breadcrumb').innerHTML=`施工项目管理　/　${recordsOnly?'相关方安全准入审核记录':'项目审核'} <a href="projects.html" class="primary report-back">返回</a>`;
const formatTime=value=>value?new Date(value).toLocaleString('zh-CN',{hour12:false}):'--';
const signatureRecord=(event,compact=false)=>`<div class="approval-signature-record ${compact?'compact':''}"><span class="signature-caption">确认人签字：</span>${event?.signature?`<img src="${esc(event.signature)}" alt="${esc(event.reviewer||'审核人')}签字" class="saved-signature">`:'<span class="muted">暂无签字</span>'}<span>签字时间：${esc(formatTime(event?.time))}</span></div>`;
const stageHeader=(index,node)=>`<h3 class="audit-section-title ${index===1?'':'review-change'}"><span>${esc(approvalNodes[index].label)}${index===1?'（终审）':''}</span><span class="approval-status ${node.status==='已通过'?'passed':''}">${esc(node.status==='已通过'?'审核通过':node.status)}</span></h3>`;
const signatureEditor=()=>`<div class="signature-editor"><span class="sign-label"><i>*</i> 签字</span><div class="signature-box"><canvas id="signature" width="900" height="400" aria-label="手写签字区域"></canvas><div class="signature-tools"><button type="button" id="clear-sign">清空</button><button type="button" class="primary" id="upload-sign">上传签字</button><span id="signature-upload-status" role="status"></span></div></div></div>`;
if(!project)document.querySelector('#page').textContent='项目不存在';else{
 const flow=approvalState(project),active=recordsOnly||flow.baselineOnly||flow.current>=2?-1:flow.current;
 const first=flow.nodes[0],second=flow.nodes[1],evidence=first.last;
 const materialReviews=structuredClone(evidence?.materialReviews||{});
 const reviewed=new Set(active===0?[]:evidence?.checkedMaterials||[]);
 const renderMaterials=()=>materials.map((m,i)=>`<div class="material-check-group" data-check-id="${m.id}"><div class="material-check-row"><span class="material-check-title review-change">${i+1}、${esc(m.title)}</span>${active===0?`<button type="button" class="check-review-btn outline" data-inspect="${m.id}">审查</button><div class="check-options" role="group" aria-label="${esc(m.title)}审查结论">${reviewResults.map(result=>`<label><input type="radio" name="material-${m.id}" value="${result}" disabled><span>${result}</span></label>`).join('')}</div>`:`<span class="material-result">${esc(evidence?.materialReviews?.[m.id]?.result||'--')}</span>`}</div>${active!==0?signatureRecord(evidence,true):''}</div>`).join('');
 const dutyRow=(key,label)=>`<div class="duty-row"><span>${label}</span><p>${esc(evidence?.duties?.[key]?.content||dutyContent)}</p>${active===0?`<select name="duty-${key}" aria-label="${label}频次" required><option value="">请选择履职频次</option><option value="${dutyFrequency}">${dutyFrequency}</option></select>`:`<span>${esc(evidence?.duties?.[key]?.frequency||'--')}</span>`}</div>`;
 const firstOpinion=active!==0&&evidence?`<div class="previous-opinion"><b>项目监督人审核意见：</b><span>${esc(evidence.opinion||evidence.result)}</span><span>审核人：${esc(evidence.reviewer)}</span></div>`:'';
 const editable=active>=0;
 document.querySelector('#page').innerHTML=`<form id="review-form"><div class="toolbar audit-topbar"><span class="grow"></span><button type="button" class="gold" id="download-review-pdf">下载PDF</button><button type="button" class="primary" id="audit-records">审核记录</button></div><section class="audit-section basic-audit-info"><h3 class="audit-section-title">基础信息</h3><div class="audit-basic-grid"><div><b>发包审核单位名称：</b>${esc(project.org)}</div><div><b>相关方单位名称：</b>${esc(partners.map(p=>p.name).join('，')||'--')}</div><div><b>安全生产管理责任：</b>${esc(project.type)}</div><div><b>相关方合同名称：</b>${esc(project.attachments?.[1]||'--')}</div><div><b>相关方是否分包：</b>否</div></div></section><section class="audit-section" data-approval-node="supervisor">${stageHeader(0,first)}<div class="material-audit-list">${renderMaterials()}</div>${firstOpinion}</section><section class="audit-section audit-duties"><h3 class="audit-section-title">履职内容和频次</h3>${dutyRow('leadDept','引入责任部门负责人履职内容')}${dutyRow('supervisor','监管责任人履职内容')}</section>${active!==0?`<section class="audit-section" data-approval-node="safety-environment">${stageHeader(1,second)}${active!==1?`${signatureRecord(second.last,true)}${second.last?.opinion?`<div class="final-saved-opinion"><b>安全环保部意见：</b>${esc(second.last.opinion)}</div>`:''}`:''}</section>`:''}${editable?`<section class="audit-submit"><div class="review-result"><span>审核结果：</span><label><input type="radio" name="result" required value="通过">通过</label><label><input type="radio" name="result" value="不通过">不通过</label></div><label class="audit-opinion"><span>${active===1?'安全环保部意见':'审核意见'}：</span><textarea name="opinion" aria-label="审核意见" rows="3" maxlength="1000" placeholder="请输入审核意见"></textarea></label>${signatureEditor()}</section>`:''}<div class="review-footer"><a href="projects.html"><button type="button">${recordsOnly||!editable?'返回':'取消'}</button></a>${editable?'<button type="submit" class="primary">提交</button>':''}</div></form>`;
 document.querySelectorAll('[data-inspect]').forEach(button=>button.onclick=()=>{
  const m=materials.find(item=>item.id===button.dataset.inspect),people=m.id==='staff-qualifications';
  const src=`${people?'people':'project'}.html?id=${encodeURIComponent(id)}&reviewEmbed=1${people?'':'&material='+encodeURIComponent(m.targetMaterialId||m.id)}`;
  const d=drawer(people?'进场人员管理':'项目信息',`<iframe class="review-material-frame" title="${esc(m.title)}" src="${src}"></iframe>`,null,people?'85%':'45%',{className:'review-inspection-drawer',onClose:()=>{
   reviewed.add(m.id);materialReviews[m.id]={...(materialReviews[m.id]||{}),reviewedAt:new Date().toISOString()};
   button.textContent='✓ 已审查';button.classList.remove('outline');button.classList.add('primary');
   const row=button.closest('.material-check-row');row.querySelectorAll('input').forEach(r=>r.disabled=false);
  }});d.querySelector('.dialog-foot [data-close]').textContent='关闭';
 });
 document.querySelectorAll('.check-options input').forEach(r=>r.onchange=()=>{const mid=r.closest('[data-check-id]').dataset.checkId;if(!reviewed.has(mid)){r.checked=false;return notify('请先审查当前审核内容',true);}materialReviews[mid]={...materialReviews[mid],result:r.value};});
 document.querySelectorAll('[name=result]').forEach(input=>input.onchange=()=>{const opinion=document.querySelector('[name=opinion]'),required=input.value==='不通过';opinion.required=required;opinion.setAttribute('aria-required',String(required));const label=opinion.closest('label').querySelector('span');label.innerHTML=(required?'<i class="opinion-required">*</i> ':'')+(active===1?'安全环保部意见':'审核意见')+'：';});
 document.querySelector('#download-review-pdf').onclick=async e=>{const button=e.currentTarget;button.disabled=true;button.textContent='正在生成…';try{await downloadReviewPdf(id);}catch(error){notify(error.message||'PDF生成失败',true);}finally{button.disabled=false;button.textContent='下载PDF';}};
 document.querySelector('#audit-records').onclick=()=>{
  const events=[...(project.auditHistory||[])].filter(e=>approvalNodes.some(n=>n.id===e.nodeId)).reverse();
  drawer('审核记录',`<div class="audit-timeline">${events.map(event=>`<article class="timeline-entry ${event.result==='通过'?'approved':'rejected'}"><div class="timeline-card"><div class="timeline-card-top"><span class="timeline-status">${event.result==='通过'?'✓ 审核通过':'✕ 审核不通过'}</span><time>${esc(formatTime(event.time))}</time></div><p>审核节点：<span class="timeline-node review-change">${esc(approvalNodes.find(n=>n.id===event.nodeId)?.label)}</span></p><p>审核人：<b>${esc(event.reviewer)}</b></p><p>部门：${esc(event.department||project.department||project.org||'--')}</p>${event.opinion?`<p>审核意见：${esc(event.opinion)}</p>`:''}${event.rejectReason?`<p>不通过原因：${esc(event.rejectReason)}</p>`:''}</div></article>`).join('')||'<div class="timeline-empty">暂无审核记录</div>'}</div>`,null,'648px',{footer:false,className:'audit-timeline-drawer'});
 };
 let signed=false,down=false,uploadedSignature=null,uploading=false;const invalidateSignature=()=>{uploadedSignature=null;const status=document.querySelector('#signature-upload-status');if(status)status.textContent='';};const canvas=document.querySelector('#signature');
 if(canvas){const ctx=canvas.getContext('2d');ctx.lineWidth=2;ctx.lineCap='round';const point=e=>{const rect=canvas.getBoundingClientRect();return [(e.clientX-rect.left)*canvas.width/rect.width,(e.clientY-rect.top)*canvas.height/rect.height];};canvas.onpointerdown=e=>{if(uploading)return;invalidateSignature();down=true;canvas.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(...point(e));};canvas.onpointermove=e=>{if(down){ctx.lineTo(...point(e));ctx.stroke();signed=true;}};canvas.onpointerup=canvas.onpointercancel=()=>down=false;
  document.querySelector('#clear-sign').onclick=()=>{if(uploading)return;ctx.clearRect(0,0,canvas.width,canvas.height);signed=false;invalidateSignature();};
  document.querySelector('#upload-sign').onclick=async()=>{
   if(!signed)return notify('请先在签字区域手写签字',true);
   if(uploading)return;uploading=true;const upload=document.querySelector('#upload-sign'),clear=document.querySelector('#clear-sign');upload.disabled=clear.disabled=true;
   try{uploadedSignature=await uploadSignature({projectId:id,nodeId:approvalNodes[active].id,reviewer:currentAccount().name,username:currentAccount().username,image:canvas.toDataURL()});document.querySelector('#signature-upload-status').textContent='已上传';notify('签字上传成功');}
   catch(error){notify(error.message||'签字上传失败',true);}finally{uploading=false;upload.disabled=clear.disabled=false;}
  };
 }
 document.querySelector('#review-form').onsubmit=async event=>{
  event.preventDefault();if(!editable)return;
  if(active===0&&materials.some(m=>!reviewed.has(m.id)))return notify('请先完成全部审查项',true);
  if(active===0&&materials.some(m=>!reviewResults.includes(materialReviews[m.id]?.result)))return notify('请逐项选择符合、不符合或不涉及',true);
  if(event.target.elements.result.value==='不通过'&&!event.target.elements.opinion.value.trim())return notify('请输入审核意见',true);
  if(!signed)return notify('请签字',true);
  if(uploading)return notify('签字正在上传，请稍候',true);
  if(!uploadedSignature)return notify('请点击上传签字',true);
  const submit=event.submitter;submit.disabled=true;
  try{const v=Object.fromEntries(new FormData(event.target));const duties=active===0?Object.fromEntries(['leadDept','supervisor'].map(key=>[key,{content:dutyContent,frequency:v['duty-'+key]}])):undefined;
   const updated=await submitApproval(id,{nodeId:approvalNodes[active].id,result:v.result,opinion:v.opinion||'',signature:uploadedSignature.image,signatureId:uploadedSignature.id,checkedMaterials:[...reviewed],materialReviews:active===0?materialReviews:undefined,duties,reviewer:currentAccount().name,username:currentAccount().username,department:project.department||project.org});
   notify(updated.current===2?'终审已完成':'审核已提交');location.reload();
  }catch(error){notify(error.message,true);submit.disabled=false;}
 };
}
