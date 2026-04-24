import React, { useState } from 'react';
import api from '../services/api';
import AIOutput from '../components/AIOutput';
import Toast from '../components/Toast';

const aiFeatures = [
  { id: 'case-assessment', icon: 'fa-solid fa-gavel', title: 'AI Case Assessment', desc: 'Get AI-powered analysis of case strength and recommendations' },
  { id: 'document-analysis', icon: 'fa-solid fa-file-magnifying-glass', title: 'AI Document Analysis', desc: 'Analyze documents for completeness and compliance' },
  { id: 'legal-research', icon: 'fa-solid fa-book-open', title: 'AI Legal Research', desc: 'Research immigration laws, regulations, and precedents' },
  { id: 'form-assist', icon: 'fa-solid fa-file-pen', title: 'AI Form Assistant', desc: 'Get help filling out immigration forms correctly' },
  { id: 'translate', icon: 'fa-solid fa-language', title: 'AI Translation', desc: 'Translate documents for immigration purposes' },
  { id: 'compliance-check', icon: 'fa-solid fa-clipboard-check', title: 'AI Compliance Check', desc: 'Verify case compliance with immigration regulations' },
  { id: 'status-prediction', icon: 'fa-solid fa-crystal-ball', title: 'AI Status Prediction', desc: 'Predict processing times and case outcomes' },
];

function AIFeatures() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  // Form states for each feature
  const [caseForm, setCaseForm] = useState({ case_type: '', client_nationality: '', current_status: '', description: '' });
  const [docForm, setDocForm] = useState({ document_type: '', document_content: '', case_type: '' });
  const [researchForm, setResearchForm] = useState({ research_topic: '', case_context: '' });
  const [formAssistForm, setFormAssistForm] = useState({ form_type: '', client_info: '', questions: '' });
  const [translateForm, setTranslateForm] = useState({ text: '', source_language: '', target_language: 'English' });
  const [complianceForm, setComplianceForm] = useState({ case_type: '', case_details: '', documents_submitted: '' });
  const [predictionForm, setPredictionForm] = useState({ case_type: '', filing_date: '', service_center: '', case_details: '' });

  const handleSubmit = async (endpoint, data) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post(`/ai/${endpoint}`, data);
      const key = Object.keys(res.data)[0];
      setResult(res.data[key]);
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'AI request failed. Check your OpenRouter API key.', type: 'error' });
    }
    setLoading(false);
  };

  const renderFeatureForm = () => {
    switch (activeFeature) {
      case 'case-assessment':
        return (
          <div>
            <div className="form-row">
              <div className="form-group"><label>Case Type</label><input value={caseForm.case_type} onChange={e => setCaseForm({...caseForm, case_type: e.target.value})} placeholder="e.g. H-1B Petition" /></div>
              <div className="form-group"><label>Client Nationality</label><input value={caseForm.client_nationality} onChange={e => setCaseForm({...caseForm, client_nationality: e.target.value})} placeholder="e.g. Indian" /></div>
            </div>
            <div className="form-group"><label>Current Immigration Status</label><input value={caseForm.current_status} onChange={e => setCaseForm({...caseForm, current_status: e.target.value})} placeholder="e.g. F-1 OPT" /></div>
            <div className="form-group"><label>Case Description</label><textarea value={caseForm.description} onChange={e => setCaseForm({...caseForm, description: e.target.value})} placeholder="Describe the case details..." /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('case-assessment', caseForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Analyze Case</button>
          </div>
        );
      case 'document-analysis':
        return (
          <div>
            <div className="form-row">
              <div className="form-group"><label>Document Type</label><input value={docForm.document_type} onChange={e => setDocForm({...docForm, document_type: e.target.value})} placeholder="e.g. I-129, Passport" /></div>
              <div className="form-group"><label>Related Case Type</label><input value={docForm.case_type} onChange={e => setDocForm({...docForm, case_type: e.target.value})} placeholder="e.g. H-1B Petition" /></div>
            </div>
            <div className="form-group"><label>Document Content/Description</label><textarea value={docForm.document_content} onChange={e => setDocForm({...docForm, document_content: e.target.value})} placeholder="Paste document content or describe the document..." style={{ minHeight: 150 }} /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('document-analysis', docForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Analyze Document</button>
          </div>
        );
      case 'legal-research':
        return (
          <div>
            <div className="form-group"><label>Research Topic</label><input value={researchForm.research_topic} onChange={e => setResearchForm({...researchForm, research_topic: e.target.value})} placeholder="e.g. H-1B specialty occupation requirements" /></div>
            <div className="form-group"><label>Case Context</label><textarea value={researchForm.case_context} onChange={e => setResearchForm({...researchForm, case_context: e.target.value})} placeholder="Provide context about the specific case..." /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('legal-research', researchForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Research</button>
          </div>
        );
      case 'form-assist':
        return (
          <div>
            <div className="form-group"><label>Form Type</label><input value={formAssistForm.form_type} onChange={e => setFormAssistForm({...formAssistForm, form_type: e.target.value})} placeholder="e.g. I-129, I-485, N-400" /></div>
            <div className="form-group"><label>Client Information</label><textarea value={formAssistForm.client_info} onChange={e => setFormAssistForm({...formAssistForm, client_info: e.target.value})} placeholder="Name, nationality, status, relevant details..." /></div>
            <div className="form-group"><label>Specific Questions</label><textarea value={formAssistForm.questions} onChange={e => setFormAssistForm({...formAssistForm, questions: e.target.value})} placeholder="What specific questions do you need help with?" /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('form-assist', formAssistForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Get Assistance</button>
          </div>
        );
      case 'translate':
        return (
          <div>
            <div className="form-row">
              <div className="form-group"><label>Source Language</label><input value={translateForm.source_language} onChange={e => setTranslateForm({...translateForm, source_language: e.target.value})} placeholder="e.g. Spanish, Chinese" /></div>
              <div className="form-group"><label>Target Language</label><input value={translateForm.target_language} onChange={e => setTranslateForm({...translateForm, target_language: e.target.value})} placeholder="e.g. English" /></div>
            </div>
            <div className="form-group"><label>Text to Translate</label><textarea value={translateForm.text} onChange={e => setTranslateForm({...translateForm, text: e.target.value})} placeholder="Enter text to translate..." style={{ minHeight: 150 }} /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('translate', translateForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Translate</button>
          </div>
        );
      case 'compliance-check':
        return (
          <div>
            <div className="form-group"><label>Case Type</label><input value={complianceForm.case_type} onChange={e => setComplianceForm({...complianceForm, case_type: e.target.value})} placeholder="e.g. H-1B, L-1A" /></div>
            <div className="form-group"><label>Case Details</label><textarea value={complianceForm.case_details} onChange={e => setComplianceForm({...complianceForm, case_details: e.target.value})} placeholder="Describe the case details..." /></div>
            <div className="form-group"><label>Documents Submitted</label><textarea value={complianceForm.documents_submitted} onChange={e => setComplianceForm({...complianceForm, documents_submitted: e.target.value})} placeholder="List all documents that have been submitted..." /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('compliance-check', complianceForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Check Compliance</button>
          </div>
        );
      case 'status-prediction':
        return (
          <div>
            <div className="form-row">
              <div className="form-group"><label>Case Type</label><input value={predictionForm.case_type} onChange={e => setPredictionForm({...predictionForm, case_type: e.target.value})} placeholder="e.g. H-1B, EB-2 NIW" /></div>
              <div className="form-group"><label>Filing Date</label><input type="date" value={predictionForm.filing_date} onChange={e => setPredictionForm({...predictionForm, filing_date: e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Service Center</label><input value={predictionForm.service_center} onChange={e => setPredictionForm({...predictionForm, service_center: e.target.value})} placeholder="e.g. USCIS Texas Service Center" /></div>
            <div className="form-group"><label>Case Details</label><textarea value={predictionForm.case_details} onChange={e => setPredictionForm({...predictionForm, case_details: e.target.value})} placeholder="Describe the case..." /></div>
            <button className="btn btn-primary btn-lg" onClick={() => handleSubmit('status-prediction', predictionForm)} disabled={loading}><i className="fa-solid fa-robot"></i> Predict Status</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>AI Assistant</h1><p>AI-powered immigration tools using OpenRouter</p></div>
        {activeFeature && (
          <button className="btn btn-secondary" onClick={() => { setActiveFeature(null); setResult(null); }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Tools
          </button>
        )}
      </div>

      {!activeFeature ? (
        <div className="ai-feature-grid">
          {aiFeatures.map(f => (
            <div key={f.id} className="ai-feature-card" onClick={() => setActiveFeature(f.id)}>
              <h3><i className={f.icon} style={{ color: 'var(--primary-light)' }}></i> {f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32, marginBottom: 24 }}>
            <h2 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className={aiFeatures.find(f => f.id === activeFeature)?.icon} style={{ color: 'var(--primary-light)' }}></i>
              {aiFeatures.find(f => f.id === activeFeature)?.title}
            </h2>
            {renderFeatureForm()}
          </div>
          <AIOutput title={aiFeatures.find(f => f.id === activeFeature)?.title + ' Results'} content={result} loading={loading} />
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default AIFeatures;
