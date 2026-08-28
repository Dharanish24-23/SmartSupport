import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const initialState = {
  fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  dateOfBirth: '', gender: '', state: '', district: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await register(form);
      showToast('Account created successfully!');
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 560, padding: '48px 24px' }}>
      <div className="card card-pad">
        <h2 className="mb-8">Create your account</h2>
        <p className="text-muted mb-24">Register to check eligibility and apply for support schemes.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={form.fullName} onChange={update('fullName')} />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={update('email')} />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" value={form.phone} onChange={update('phone')} />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" value={form.password} onChange={update('password')} />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-control" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-control" type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control" value={form.gender} onChange={update('gender')}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State</label>
              <input className="form-control" value={form.state} onChange={update('state')} />
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input className="form-control" value={form.district} onChange={update('district')} />
            </div>
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-muted mt-16">
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
