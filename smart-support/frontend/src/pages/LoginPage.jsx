import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      showToast('Welcome back!');
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'OFFICER' ? '/officer/applications' : '/dashboard');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 440, padding: '80px 24px' }}>
      <div className="card card-pad">
        <h2 className="mb-8">Welcome back</h2>
        <p className="text-muted mb-24">Login to your SmartSupport account.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-control" type="email" required
              value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control" type="password" required
              value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-muted mt-16">
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Register</Link>
        </p>
        <p className="text-center text-muted mt-8" style={{ fontSize: '0.78rem' }}>
          Admin demo login: admin@smartsupport.com / Admin@1234
        </p>
      </div>
    </div>
  );
}
