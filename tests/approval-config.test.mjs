import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMaterialUpload,uploadRules,materialFiles} from '../config/project-approval.config.js';
const file=(name='test.pdf',size=1)=>({name,size});
test('附件个数仍限制为每类5个，计入已有文件',()=>{
 assert.doesNotThrow(()=>validateMaterialUpload([file(),file()],Array.from({length:3},()=>file())));
 assert.throws(()=>validateMaterialUpload([file(),file()],Array.from({length:4},()=>file())),/最多5个/);
});
test('50MB边界及原有6种扩展名保持不变',()=>{
 for(const ext of ['pdf','doc','docx','png','jpg','jpeg'])assert.doesNotThrow(()=>validateMaterialUpload([],[file('test.'+ext,50*1024*1024)]));
 assert.throws(()=>validateMaterialUpload([],[file('test.pdf',50*1024*1024+1)]),/50MB/);
 assert.throws(()=>validateMaterialUpload([],[file('test.gif')]),/仅支持/);
 assert.equal(uploadRules.accept,'.pdf,.doc,.docx,.png,.jpg,.jpeg');
});
test('重命名材料描述不删除或改写历史文件名',()=>{
 const project={attachments:['原合同.pdf','原资质.pdf','原方案.docx']};
 const original=structuredClone(project);
 const grouped=materialFiles(project);
 assert.deepEqual(Object.values(grouped).flat().map(f=>f.name),project.attachments);
 grouped.qualification.push(file('new.pdf'));
 assert.deepEqual(project,original);
});

test('六项审核资料及旧版材料归并保留全部文件',()=>{
 const old={materialAttachments:{'qualification':[{name:'资质.pdf'}],'staff-documents':[{name:'人员.pdf'}],'risk-deposit':[{name:'票据.pdf'}],'three-measures':[{name:'三措.pdf'}],'construction-drawings':[{name:'图纸.pdf'}]}};
 const before=JSON.stringify(old),grouped=materialFiles(old);
 assert.equal(Object.keys(grouped).length,6);
 assert.deepEqual(grouped['related-materials'].map(f=>f.name),['人员.pdf','票据.pdf','三措.pdf','图纸.pdf']);
 assert.deepEqual(grouped['staff-qualifications'],[]);
 assert.equal(JSON.stringify(old),before);
});
