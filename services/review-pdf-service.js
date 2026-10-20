import {repo} from './repository.js';
import {approvalState} from './approval-service.js';
import {projectMaterials} from '../config/project-approval.config.js';
let libraryPromise,fontPromise;
function loadLibrary(){
 if(!libraryPromise)libraryPromise=new Promise((resolve,reject)=>{if(window.jspdf?.jsPDF)return resolve(window.jspdf.jsPDF);const script=document.createElement('script');script.src=new URL('../assets/vendor/jspdf-4.2.1.umd.min.js',import.meta.url).href;script.onload=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(Error('PDF组件加载失败'));script.onerror=()=>{script.remove();libraryPromise=null;reject(Error('PDF组件加载失败，请重试'));};document.head.append(script);});
 return libraryPromise;
}
async function loadFont(){
 if(!fontPromise)fontPromise=(async()=>{const response=await fetch(new URL('../assets/fonts/LBReviewSans-Regular.ttf',import.meta.url));if(!response.ok)throw Error('中文字体加载失败，请重试');const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);})().catch(error=>{fontPromise=null;throw error;});
 return fontPromise;
}
const text=value=>String(value??'').trim()||'--';
const time=value=>value?new Date(value).toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'}):'--';
const status=node=>node.last?.result||node.status||'待审核';
export async function createReviewPdf(projectId){
 const [project,partners,jsPDF,font]=await Promise.all([repo.get('projects',projectId),repo.list('partners',{projectId}),loadLibrary(),loadFont()]);
 if(!project)throw Error('项目不存在');
 const doc=new jsPDF({unit:'mm',format:'a4',putOnlyUsedFonts:true,compress:true});
 doc.addFileToVFS('LBReviewSans-Regular.ttf',font);doc.addFont('LBReviewSans-Regular.ttf','LBReviewSans','normal');doc.setFont('LBReviewSans','normal');
 doc.setProperties({title:'项目开工申请审批单',subject:'项目监督人一审 / 安全环保部终审',author:text(project.org)});
 const flow=approvalState(project),first=flow.nodes[0],final=flow.nodes[1],firstEvent=first.last,finalEvent=final.last;
 const left=15,width=180,bottom=280;let y=30;
 const reset=()=>{doc.setFont('LBReviewSans','normal');doc.setTextColor(25);doc.setDrawColor(80);doc.setLineWidth(.2);};reset();
 const wrap=(value,w,size=9)=>{doc.setFontSize(size);return doc.splitTextToSize(text(value),Math.max(5,w-6));};
 const write=(value,x,top,w,size=9)=>{doc.setFontSize(size);const lines=wrap(value,w,size);doc.text(lines,x+3,top+4.5,{lineHeightFactor:1.4});return lines.length*size*.3528*1.4;};
 const newPage=()=>{doc.addPage();reset();y=15;};
 const ensure=h=>{if(y+h>bottom)newPage();};
 function row(cells,widths,minHeight=10,size=9,fill=false){
  const h=Math.max(minHeight,...cells.map((v,i)=>wrap(v,widths[i],size).length*size*.3528*1.4+5));
  if(h>bottom-15)throw Error('单条内容过长，请缩短后导出');ensure(h);let x=left;
  cells.forEach((v,i)=>{if(fill){doc.setFillColor(240);doc.rect(x,y,widths[i],h,'FD');}else doc.rect(x,y,widths[i],h);write(v,x,y,widths[i],size);x+=widths[i];});y+=h;
 }
 function signature(event,x,top,w=120){
  let cursor=top;
  doc.setFontSize(9);doc.text(`确认人：${text(event?.reviewer)}`,x,cursor+4);
  if(event?.signature){const info=doc.getImageProperties(event.signature),ratio=Math.min(40/info.width,13/info.height);doc.addImage(event.signature,'PNG',x+45,cursor,info.width*ratio,info.height*ratio,undefined,'FAST');}
  doc.setFontSize(8);doc.text(`签字时间：${time(event?.time)}`,x,cursor+18);
 }
 doc.setFontSize(17);doc.text('项目开工申请审批单',105,21,{align:'center'});
 const contractors=partners.map(p=>p.name).join('，');
 const contacts=partners.map(p=>[p.leader,p.phone].filter(Boolean).join(' / ')).filter(Boolean).join('；');
 row(['项目名称',project.name,'作业地点',project.location],[27,63,27,63],12);
 row(['施工单位',contractors,'负责人及电话',contacts],[27,63,27,63],12);
 row(['开工日期',project.start,'计划工期',`${text(project.start)} 至 ${text(project.end)}`],[27,63,27,63],12);
 // 申请说明为中性申请表述，不替用户声明风险抵押金已交、资料已齐等事实。
 const application=text(project.applicationNote||`现就“${text(project.name)}”提出开工申请，相关资料审查情况及审核意见详见下表，请予审批。`);
 const greeting=text(project.org)+'：';
 const applicationLines=wrap(application,width-8,9);
 const unitLines=wrap('申请单位：'+text(contractors),width-8,9);
 const applicationHeight=Math.max(40,applicationLines.length*4.5+unitLines.length*4.5+23);
 ensure(applicationHeight);doc.rect(left,y,width,applicationHeight);write(greeting,left,y+1,width);write(application,left,y+9,width);const unitTop=y+13+applicationLines.length*4.5;write('申请单位：'+text(contractors),left,unitTop,width);write('申请日期：'+text(project.applicationDate||project.submittedAt?.slice(0,10)),left,unitTop+unitLines.length*4.5+2,width,8);y+=applicationHeight;
 const materialHeight=103,materialLeft=32;ensure(materialHeight);doc.rect(left,y,materialLeft,materialHeight);doc.rect(left+materialLeft,y,width-materialLeft,materialHeight);doc.setFontSize(10);doc.text('资料审核情况',left+materialLeft/2,y+materialHeight/2,{align:'center'});
 const contentX=left+materialLeft+4;
 doc.setFontSize(7.5);doc.setTextColor(110);doc.text('勾选表示已审查。',contentX,y+6);doc.setTextColor(25);
 projectMaterials.forEach((material,i)=>{
  const reviewId=i<4?material.id:'related-materials';
  const checked=!!firstEvent&&(firstEvent.checkedMaterials?.includes(reviewId)||!!firstEvent.materialReviews?.[reviewId]?.result);
  const lineY=y+11+i*7;
  doc.rect(contentX,lineY,3.5,3.5);if(checked){doc.line(contentX+.5,lineY+1.8,contentX+1.4,lineY+2.8);doc.line(contentX+1.4,lineY+2.8,contentX+3,lineY+.6);}
  doc.setFontSize(9);doc.text(material.title,contentX+6,lineY+3);
 });
 doc.setFontSize(8);doc.text(`一审结果：${status(first)}`,contentX,y+72);doc.text('项目监督人：'+text(firstEvent?.reviewer),contentX,y+79);
 if(firstEvent?.signature){const info=doc.getImageProperties(firstEvent.signature),ratio=Math.min(38/info.width,12/info.height);doc.addImage(firstEvent.signature,'PNG',contentX+54,y+74,info.width*ratio,info.height*ratio,undefined,'FAST');}
 doc.text('签字时间：'+time(firstEvent?.time),contentX,y+96);y+=materialHeight;
 const finalOpinion=wrap(finalEvent?.opinion, width-materialLeft-6,9),finalHeight=Math.max(44,finalOpinion.length*4.45+36);
 ensure(finalHeight);doc.rect(left,y,materialLeft,finalHeight);doc.rect(left+materialLeft,y,width-materialLeft,finalHeight);doc.setFontSize(9);doc.text(['安全环保部意见','（终审）'],left+materialLeft/2,y+finalHeight/2-2,{align:'center',lineHeightFactor:1.5});
 write('审核结果：'+status(final),left+materialLeft,y,width-materialLeft,8);write(finalEvent?.opinion,left+materialLeft,y+7,width-materialLeft,9);signature(finalEvent,contentX,y+14+finalOpinion.length*4.45);y+=finalHeight;
 row(['备注',project.note||project.remark],[25,155],9,8);
 ensure(10);doc.setFontSize(8);doc.text('注：本表填写一式两份，施工单位和安全环保部各执一份。',left+3,y+7);
 const count=doc.getNumberOfPages();for(let n=1;n<=count;n++){doc.setPage(n);doc.setFontSize(8);doc.setTextColor(120);doc.text(`第 ${n} 页 / 共 ${count} 页`,105,289,{align:'center'});}
 const filename=`项目开工申请审批单_${text(project.name).replace(/[<>:"/\\|?*\x00-\x1F]/g,'_')}.pdf`;
 return {blob:doc.output('blob'),filename,pages:count};
}
export async function downloadReviewPdf(projectId){
 const result=await createReviewPdf(projectId),url=URL.createObjectURL(result.blob),anchor=document.createElement('a');anchor.href=url;anchor.download=result.filename;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);return result;
}
