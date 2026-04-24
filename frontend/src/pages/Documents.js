import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

const emptyDoc = { document_name: '', document_type: '', case_id: '', client_id: '', status: 'pending', file_path: '', notes: '' };
const docTypes = ['USCIS Form', 'DOL Form', 'Identity Document', 'Travel Document', 'Supporting Document', 'Employment Document', 'Education Document', 'Legal Document', 'Medical Document', 'Financial Document'];
const docStatuses = ['pending', 'submitted', 'verified', 'approved', 'rejected', 'completed'];

function Documents() {
  const [items, setItems] = useState([]);
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState(emptyDoc);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    api.get('/documents').then(r => setItems(r.data)).catch(() => {});
    api.get('/cases').then(r => setCases(r.data)).catch(() => {});
    api.get('/clients').then(r => setClients(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const getBadgeClass = (s) => {
    const m = { pending: 'badge-warning', submitted: 'badge-info', verified: 'badge-primary', approved: 'badge-success', rejected: 'badge-danger', completed: 'badge-success' };
    return m[s] || 'badge-secondary';
  };

  const handleRowClick = (item) => { setSelected(item); setShowDetail(true); };
  const handleNew = () => { setForm(emptyDoc); setEditing(false); setShowModal(true); };
  const handleEdit = () => {
    setForm({ document_name: selected.document_name, document_type: selected.document_type || '', case_id: selected.case_id || '', client_id: selected.client_id || '', status: selected.status, file_path: selected.file_path || '', notes: selected.notes || '' });
    setEditing(true); setShowDetail(false); setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) { await api.put(`/documents/${selected.id}`, form); setToast({ message: 'Document updated', type: 'success' }); }
      else { await api.post('/documents', form); setToast({ message: 'Document created', type: 'success' }); }
      setShowModal(false); load();
    } catch (err) { setToast({ message: 'Error saving document', type: 'error' }); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/documents/${selected.id}`); setToast({ message: 'Document deleted', type: 'success' }); setShowDelete(false); setShowDetail(false); setSelected(null); load(); }
    catch (err) { setToast({ message: 'Error deleting', type: 'error' }); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Documents</h1><p>Manage case documents</p></div>
        <div className="page-actions"><button className="btn btn-primary" onClick={handleNew}><i className="fa-solid fa-plus"></i> New Document</button></div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr><th>Document Name</th><th>Type</th><th>Case</th><th>Client</th><th>Status</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} onClick={() => handleRowClick(item)}>
                <td style={{ fontWeight: 600 }}>{item.document_name}</td>
                <td>{item.document_type || '—'}</td>
                <td>{item.case_number || '—'}</td>
                <td>{item.client_name || '—'}</td>
                <td><span className={`badge ${getBadgeClass(item.status)}`}>{item.status}</span></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5}><div className="empty-state"><i className="fa-solid fa-file-alt"></i><h3>No documents yet</h3></div></td></tr>}
          </tbody>
        </table>
      </div>

      {showDetail && selected && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header"><h2>Document Details</h2><button className="modal-close" onClick={() => setShowDetail(false)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-field"><label>Document Name</label><span>{selected.document_name}</span></div>
                <div className="detail-field"><label>Type</label><span>{selected.document_type || '—'}</span></div>
                <div className="detail-field"><label>Case</label><span>{selected.case_number || '—'}</span></div>
                <div className="detail-field"><label>Client</label><span>{selected.client_name || '—'}</span></div>
                <div className="detail-field"><label>Status</label><span className={`badge ${getBadgeClass(selected.status)}`}>{selected.status}</span></div>
                <div className="detail-field"><label>File Path</label><span>{selected.file_path || '—'}</span></div>
                <div className="detail-field full-width"><label>Notes</label><p>{selected.notes || '—'}</p></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={() => { setShowDetail(false); setShowDelete(true); }}><i className="fa-solid fa-trash"></i> Delete</button>
              <button className="btn btn-primary" onClick={handleEdit}><i className="fa-solid fa-pen"></i> Edit</button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Document' : 'New Document'} onSubmit={handleSubmit}>
        <div className="form-group"><label>Document Name</label><input value={form.document_name} onChange={e => setForm({...form, document_name: e.target.value})} required /></div>
        <div className="form-row">
          <div className="form-group"><label>Document Type</label><select value={form.document_type} onChange={e => setForm({...form, document_type: e.target.value})}><option value="">Select type...</option>{docTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="form-group"><label>Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>{docStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Case</label><select value={form.case_id} onChange={e => setForm({...form, case_id: e.target.value})}><option value="">Select case...</option>{cases.map(c => <option key={c.id} value={c.id}>{c.case_number}</option>)}</select></div>
          <div className="form-group"><label>Client</label><select value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})}><option value="">Select client...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}</select></div>
        </div>
        <div className="form-group"><label>File Path</label><input value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} /></div>
        <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
      </Modal>
      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Documents;
