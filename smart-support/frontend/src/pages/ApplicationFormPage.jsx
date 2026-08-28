import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSchemeById } from '../services/schemeService';
import { submitApplication } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ApplicationFormPage() {
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    applicantName: '', phone: '', email: '', address: '', income: '', bankAccount: '', ifsc: '',
  });

  useEffect(() => {
    getSchemeById(schemeId)
      .then((res) => setScheme(res.data))
      .finally(() => setLoading(false));
    if (user) {
      setForm((f) => ({ ...f, applicantName: user.fullName, email: user.email }));
    }
  }, [schemeId, user]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitApplication({
        schemeId: Number(schemeId),
        ...form,
        income: Number(form.income),
      });
      showToast(`Application submitted! ID: ${res.data.applicationNumber}`);
      navigate('/applications');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading application form..." />;

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 620 }}>
      <div className="card card-pad">
        <h2 className="mb-8">Apply for {scheme?.name}</h2>
        <p className="text-muted mb-24">Fill in your details below to submit your application.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Applicant Name</label>
            <input className="form-control" required value={form.applicantName} onChange={set('applicantName')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" required value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" required value={form.email} onChange={set('email')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-control" required rows={3} value={form.address} onChange={set('address')} />
          </div>
          <div className="form-group">
            <label className="form-label">Annual Income (₹)</label>
            <input className="form-control" type="number" required value={form.income} onChange={set('income')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bank Account Number</label>
              <input className="form-control" required value={form.bankAccount} onChange={set('bankAccount')} />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input className="form-control" required value={form.ifsc} onChange={set('ifsc')} />
            </div>
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
