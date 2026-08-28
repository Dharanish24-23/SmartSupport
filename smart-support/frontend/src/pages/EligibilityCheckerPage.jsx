import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEligibility } from '../services/eligibilityService';
import { useToast } from '../context/ToastContext';

const DOCUMENT_OPTIONS = ['Aadhaar', 'Income Certificate', 'Medical Report', 'Bank Passbook', 'Address Proof', 'BPL Card'];

const STEP_LABELS = ['Personal', 'Financial', 'Medical', 'Documents', 'Review'];

const initialForm = {
  age: '', gender: '', state: '', district: '', occupation: '',
  annualIncome: '', employmentStatus: '', bplStatus: false, familySize: '',
  disease: '', treatmentRequired: false, medicalEmergency: false, medicalReportAvailable: false,
  documentsAvailable: [],
};

export default function EligibilityCheckerPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleDocument = (doc) => {
    setForm((f) => {
      const exists = f.documentsAvailable.includes(doc);
      return {
        ...f,
        documentsAvailable: exists
          ? f.documentsAvailable.filter((d) => d !== doc)
          : [...f.documentsAvailable, doc],
      };
    });
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleCheck = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
        familySize: form.familySize ? Number(form.familySize) : null,
      };
      const res = await checkEligibility(payload);
      sessionStorage.setItem('smartsupport_eligibility_results', JSON.stringify(res.data));
      navigate('/eligibility-result');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to check eligibility', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720, padding: '48px 24px' }}>
      <h2 className="mb-8">Eligibility Checker</h2>
      <p className="text-muted mb-24">Answer a few quick questions to see which schemes you may qualify for.</p>

      <div className="stepper">
        {STEP_LABELS.map((label, idx) => (
          <div key={label} className={`step-item ${step === idx + 1 ? 'active' : ''} ${step > idx + 1 ? 'done' : ''}`}>
            <div className="step-circle">{idx + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="card card-pad">
        {step === 1 && (
          <div>
            <h3 className="mb-16">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-control" type="number" value={form.age} onChange={set('age')} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={form.gender} onChange={set('gender')}>
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
                <input className="form-control" value={form.state} onChange={set('state')} placeholder="e.g. Tamil Nadu" />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input className="form-control" value={form.district} onChange={set('district')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input className="form-control" value={form.occupation} onChange={set('occupation')} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="mb-16">Financial Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Annual Income (₹)</label>
                <input className="form-control" type="number" value={form.annualIncome} onChange={set('annualIncome')} />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select className="form-control" value={form.employmentStatus} onChange={set('employmentStatus')}>
                  <option value="">Select</option>
                  <option value="EMPLOYED">Employed</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                  <option value="SELF_EMPLOYED">Self-employed</option>
                  <option value="STUDENT">Student</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Family Size</label>
                <input className="form-control" type="number" value={form.familySize} onChange={set('familySize')} />
              </div>
              <div className="form-group">
                <label className="form-label">BPL Card Holder?</label>
                <div className="checkbox-row" style={{ marginTop: 12 }}>
                  <input type="checkbox" checked={form.bplStatus} onChange={set('bplStatus')} id="bpl" />
                  <label htmlFor="bpl">Yes, I hold a BPL card</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-16">Medical Information</h3>
            <div className="form-group">
              <label className="form-label">Disease / Medical Condition</label>
              <input className="form-control" value={form.disease} onChange={set('disease')} placeholder="Leave blank if none" />
              <div className="form-hint">If none, leave this blank.</div>
            </div>
            <div className="flex-col gap-8">
              <div className="checkbox-row">
                <input type="checkbox" checked={form.treatmentRequired} onChange={set('treatmentRequired')} id="treatment" />
                <label htmlFor="treatment">Treatment required</label>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" checked={form.medicalEmergency} onChange={set('medicalEmergency')} id="emergency" />
                <label htmlFor="emergency">This is a medical emergency</label>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" checked={form.medicalReportAvailable} onChange={set('medicalReportAvailable')} id="report" />
                <label htmlFor="report">Medical report available</label>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="mb-16">Documents Available</h3>
            <p className="text-muted mb-16">Select the documents you currently have available.</p>
            <div className="grid grid-2">
              {DOCUMENT_OPTIONS.map((doc) => (
                <div className="checkbox-row" key={doc}>
                  <input
                    type="checkbox"
                    id={doc}
                    checked={form.documentsAvailable.includes(doc)}
                    onChange={() => toggleDocument(doc)}
                  />
                  <label htmlFor={doc}>{doc}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="mb-16">Review & Submit</h3>
            <p className="text-muted mb-24">
              We'll match your details against all active support schemes and show you which ones you're
              eligible for, along with clear reasons.
            </p>
            <div className="card card-pad" style={{ background: 'var(--color-bg)' }}>
              <p><strong>Age:</strong> {form.age || '-'} &nbsp; <strong>Gender:</strong> {form.gender || '-'}</p>
              <p><strong>Location:</strong> {form.district || '-'}, {form.state || '-'}</p>
              <p><strong>Annual Income:</strong> ₹{form.annualIncome || '-'}</p>
              <p><strong>Medical Condition:</strong> {form.disease || 'None specified'}</p>
              <p><strong>Documents:</strong> {form.documentsAvailable.length ? form.documentsAvailable.join(', ') : 'None selected'}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-24">
          <button className="btn btn-ghost" onClick={back} disabled={step === 1}>Back</button>
          {step < 5 ? (
            <button className="btn btn-primary" onClick={next}>Next</button>
          ) : (
            <button className="btn btn-accent" onClick={handleCheck} disabled={submitting}>
              {submitting ? 'Checking...' : 'Check My Eligibility'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
