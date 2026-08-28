import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/profileService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const emptyProfile = {
  fullName: '', email: '', phone: '', address: '', dateOfBirth: '', gender: '',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getProfile()
      .then((response) => {
        const nextProfile = { ...emptyProfile, ...response.data, dateOfBirth: response.data.dateOfBirth || '' };
        setProfile(nextProfile);
        setDraft(nextProfile);
      })
      .finally(() => setLoading(false));
  }, []);

  const beginEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!draft.fullName.trim() || !draft.email.trim() || !draft.phone.trim()) {
      showToast('Full name, email, and phone number are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const response = await updateProfile(draft);
      const nextProfile = { ...emptyProfile, ...response.data, dateOfBirth: response.data.dateOfBirth || '' };
      setProfile(nextProfile);
      setDraft(nextProfile);
      setEditing(false);
      showToast('Profile updated successfully');
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="container" style={{ maxWidth: 760, padding: '48px 24px' }}>
      <div className="flex justify-between items-center mb-24" style={{ gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 className="mb-8">Profile</h2>
          <p className="text-muted">Manage your SmartSupport account details.</p>
        </div>
        {!editing && <button type="button" className="btn btn-primary" onClick={beginEdit}>Edit Profile</button>}
      </div>

      <form className="card card-pad" onSubmit={save}>
        <div className="form-row">
          <ProfileField label="Full Name" value={editing ? draft.fullName : profile.fullName} editing={editing} onChange={(value) => setDraft({ ...draft, fullName: value })} />
          <ProfileField label="Email" type="email" value={editing ? draft.email : profile.email} editing={editing} onChange={(value) => setDraft({ ...draft, email: value })} />
          <ProfileField label="Phone Number" value={editing ? draft.phone : profile.phone} editing={editing} onChange={(value) => setDraft({ ...draft, phone: value })} />
          <ProfileField label="Date of Birth" type="date" value={editing ? draft.dateOfBirth : profile.dateOfBirth} editing={editing} onChange={(value) => setDraft({ ...draft, dateOfBirth: value })} />
        </div>
        <ProfileField label="Gender" value={editing ? draft.gender : profile.gender} editing={editing} onChange={(value) => setDraft({ ...draft, gender: value })} />
        <ProfileField label="Address" value={editing ? draft.address : profile.address} editing={editing} onChange={(value) => setDraft({ ...draft, address: value })} multiline />
        {editing && (
          <div className="flex" style={{ gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" className="btn btn-ghost" onClick={cancelEdit} disabled={saving}>Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
}

function ProfileField({ label, value, editing, onChange, type = 'text', multiline = false }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {editing ? (
        multiline
          ? <textarea className="form-control" rows={3} value={value || ''} onChange={(event) => onChange(event.target.value)} />
          : <input className="form-control" type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} />
      ) : <div className="profile-value">{value || 'Not provided'}</div>}
    </div>
  );
}
