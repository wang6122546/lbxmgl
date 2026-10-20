import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMaterialUpload,uploadRules,materialFiles,projectMaterials,materials,legacyMaterialFiles} from '../config/project-approval.config.js';
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

test('项目保留8类附件，审核仍为6项且只映射滚动位置',()=>{
 assert.equal(projectMaterials.length,8);
 assert.equal(materials.length,6);
 assert.equal(materials[5].targetMaterialId,'staff-documents');
 const old={materialAttachments:{'qualification':[{name:'资质.pdf'}],'staff-documents':[{name:'人员.pdf'}],'risk-deposit':[{name:'票据.pdf'}],'three-measures':[{name:'三措.pdf'}],'construction-drawings':[{name:'图纸.pdf'}]}};
 const before=JSON.stringify(old),grouped=materialFiles(old);
 assert.equal(Object.keys(grouped).length,8);
 for(const [key,files] of Object.entries(old.materialAttachments))assert.deepEqual(grouped[key],files);
 assert.equal(JSON.stringify(old),before);
});
test('曾保存的合并附件不推测拆分，不丢失',()=>{
 const old={materialAttachments:{'related-materials':[{name:'历史图纸.pdf'}],'staff-qualifications':[{name:'历史人员.pdf'}]}};
 const grouped=materialFiles(old);
 assert.deepEqual(legacyMaterialFiles(old).map(f=>f.name),['历史图纸.pdf','历史人员.pdf']);
 assert.deepEqual(grouped['related-materials'],old.materialAttachments['related-materials']);
});
