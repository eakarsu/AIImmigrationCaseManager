const STAGES=Object.freeze(['intake','evidence_ready','professional_review','authorized','filing_ready','filed','decision','appeal','closed']);
function calculateDeadline({trigger_date,days,calendar_version}) {
  if(!calendar_version) throw new Error('calendar_version is required');
  const date=new Date(trigger_date), count=Number(days);
  if(Number.isNaN(date.valueOf())||!Number.isInteger(count)||count<0) throw new Error('invalid deadline inputs');
  date.setUTCDate(date.getUTCDate()+count);
  return {due_at:date.toISOString(),calendar_version,advisory:true};
}
function validateEvidence({document_type,storage_key,checksum,version,citations,privilege_classification}) { if(!document_type||!storage_key||!checksum||!version) throw new Error('versioned document provenance is required'); if(!Array.isArray(citations)) throw new Error('citations must be an array'); if(!['privileged','confidential','client_shareable'].includes(privilege_classification)) throw new Error('invalid privilege classification'); return {document_type,storage_key,checksum,version,citations,privilege_classification}; }
function validateNotification({due_at,recipient_scope,template_version}) { const due=new Date(due_at); if(Number.isNaN(due.valueOf())||!recipient_scope||!template_version) throw new Error('versioned notification inputs required'); return {due_at:due.toISOString(),recipient_scope,template_version}; }
function validateTransition(from,to,context={}) {
  const allowed={intake:['evidence_ready'],evidence_ready:['professional_review'],professional_review:['evidence_ready','authorized'],authorized:['filing_ready'],filing_ready:['filed'],filed:['decision'],decision:['appeal','closed'],appeal:['decision','closed'],closed:[]};
  if(!allowed[from]?.includes(to)) throw new Error('invalid matter transition');
  if(['authorized','filing_ready','filed','appeal','closed'].includes(to)&&!['attorney','accredited_representative','admin'].includes(context.role)) throw new Error('authorized professional review required');
  if(to==='authorized'&&context.createdBy===context.actorId) throw new Error('independent professional review required');
  if(['professional_review','authorized','filing_ready'].includes(to)&&(!context.ruleVersion||!context.documentCount)) throw new Error('versioned rules and evidence required');
  if(to==='filed'&&!context.filingReceipt) throw new Error('filing receipt required');
  return true;
}
module.exports={STAGES,calculateDeadline,validateEvidence,validateNotification,validateTransition};
