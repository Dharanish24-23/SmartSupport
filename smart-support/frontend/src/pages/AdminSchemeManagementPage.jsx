import { useEffect, useState } from 'react';
import {
  getAllSchemesAdmin, createScheme, updateScheme, deleteScheme, toggleSchemeActive,
} from '../services/adminService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const emptyScheme = {
  name: '', description: '', organization: '', category: '',
  minAge: '', maxAge: '', maxIncome: '', state: 'ANY', district: 'ANY',
  gender: 'ANY', disease: 'ANY', bplRequired: false, maximumAmount: '',
  requiredDocuments: '', applicationUrl: '', active: true,
};

export default function AdminSchemeManagementPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyScheme);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    getAllSchemesAdmin().then((res) => setSchemes(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyScheme);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (scheme) => {
    setForm({ ...scheme });
    setEditingId(scheme.id);
    setModalOpen(true);
  };

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      minAge: form.minAge ? Number(form.minAge) : null,
      maxAge: form.maxAge ? Number(form.maxAge) : null,
      maxIncome: form.maxIncome ? Number(form.maxIncome) : null,
      maximumAmount: form.maximumAmount ? Number(form.maximumAmount) : null,
    };
    try {
      if (editingId) {
        await updateScheme(editingId, payload);
        showToast('Scheme updated');
      } else {
        await createScheme(payload);
        showToast('Scheme created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save scheme', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteScheme(confirmDelete.id);
      showToast('Scheme deleted');
      setConfirmDelete(null);
      load();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete scheme', 'error');
    }
  };

  const handleToggle = async (scheme) => {
    try {
      await toggleSchemeActive(scheme.id);
      load();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-24">
        <h2>Scheme Management</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Scheme</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Category</th><th>Max Support</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.category}</td>
                  <td>₹{Number(s.maximumAmount).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${s.active ? 'badge-approved' : 'badge-rejected'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(s)}>
                        {s.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? 'Edit Scheme' : 'Add Scheme'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
          <div className="form-group">
            <label className="form-label">Scheme Name</label>
            <input className="form-control" required value={form.name} onChange={set('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={set('description')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input className="form-control" value={form.organization} onChange={set('organization')} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="form-control" value={form.category} onChange={set('category')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Min Age</label>
              <input className="form-control" type="number" value={form.minAge ?? ''} onChange={set('minAge')} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Age</label>
              <input className="form-control" type="number" value={form.maxAge ?? ''} onChange={set('maxAge')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Max Income (₹)</label>
              <input className="form-control" type="number" value={form.maxIncome ?? ''} onChange={set('maxIncome')} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Support Amount (₹)</label>
              <input className="form-control" type="number" value={form.maximumAmount ?? ''} onChange={set('maximumAmount')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State (or ANY)</label>
              <input className="form-control" value={form.state} onChange={set('state')} />
            </div>
            <div className="form-group">
              <label className="form-label">District (or ANY)</label>
              <input className="form-control" value={form.district} onChange={set('district')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender (ANY / MALE / FEMALE)</label>
              <input className="form-control" value={form.gender} onChange={set('gender')} />
            </div>
            <div className="form-group">
              <label className="form-label">Disease (ANY or comma list)</label>
              <input className="form-control" value={form.disease} onChange={set('disease')} />
            </div>
          </div>
          <div className="checkbox-row mb-16">
            <input type="checkbox" id="bplRequired" checked={!!form.bplRequired} onChange={set('bplRequired')} />
            <label htmlFor="bplRequired">BPL Card Required</label>
          </div>
          <div className="form-group">
            <label className="form-label">Required Documents (comma separated)</label>
            <input className="form-control" value={form.requiredDocuments} onChange={set('requiredDocuments')} />
          </div>
          <div className="form-group">
            <label className="form-label">Application URL</label>
            <input className="form-control" value={form.applicationUrl} onChange={set('applicationUrl')} />
          </div>
          <div className="checkbox-row mb-16">
            <input type="checkbox" id="active" checked={!!form.active} onChange={set('active')} />
            <label htmlFor="active">Active</label>
          </div>
          <button className="btn btn-primary btn-block">{editingId ? 'Save Changes' : 'Create Scheme'}</button>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        title="Delete Scheme"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }
      >
        <p>Are you sure you want to delete "{confirmDelete?.name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
