import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEligibility } from '../services/eligibilityService';
import { useToast } from '../context/ToastContext';

const DOCUMENT_OPTIONS = ['Aadhaar', 'Medical Report', 'Address Proof', 'Income Certificate', 'Bank Passbook', 'BPL Card'];
const ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

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
  const [medicalBills, setMedicalBills] = useState([]);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const setMedicalReportAvailable = (event) => {
    const available = event.target.checked;
    setForm((currentForm) => ({ ...currentForm, medicalReportAvailable: available }));
    if (!available) setMedicalBills([]);
  };

  const addMedicalBill = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
      showToast('Please upload a PDF, JPG, JPEG, or PNG file', 'error');
      event.target.value = '';
      return;
    }
    setMedicalBills((currentBills) => [...currentBills, { id: `${file.name}-${file.lastModified}-${Math.random()}`, file }]);
    event.target.value = '';
  };

  const replaceMedicalBill = (billId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
      showToast('Please upload a PDF, JPG, JPEG, or PNG file', 'error');
      event.target.value = '';
      return;
    }
    setMedicalBills((currentBills) => currentBills.map((bill) => bill.id === billId ? { ...bill, file } : bill));
    event.target.value = '';
  };

  const removeMedicalBill = (billId) => {
    setMedicalBills((currentBills) => currentBills.filter((bill) => bill.id !== billId));
  };

  const [documentFiles, setDocumentFiles] = useState({});

  const setDocumentAvailability = (documentName, hasDocument) => {
    setForm((currentForm) => ({
      ...currentForm,
      documentsAvailable: hasDocument
        ? [...new Set([...currentForm.documentsAvailable, documentName])]
        : currentForm.documentsAvailable.filter((document) => document !== documentName),
    }));
    if (!hasDocument) {
      setDocumentFiles((currentFiles) => {
        const nextFiles = { ...currentFiles };
        delete nextFiles[documentName];
        return nextFiles;
      });
    }
  };

  const handleDocumentFile = (documentName, event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
      showToast('Please upload a PDF, JPG, JPEG, or PNG file', 'error');
      event.target.value = '';
      return;
    }

    setDocumentFiles((currentFiles) => ({ ...currentFiles, [documentName]: selectedFile }));
  };

  const removeDocumentFile = (documentName) => {
    setDocumentFiles((currentFiles) => {
      const nextFiles = { ...currentFiles };
      delete nextFiles[documentName];
      return nextFiles;
    });
  };

  const next = () => {
    if (step === 4) {
      const missingFiles = form.documentsAvailable.filter((documentName) => !documentFiles[documentName]);
      if (missingFiles.length > 0) {
        showToast(`Please upload: ${missingFiles.join(', ')}`, 'error');
        return;
      }
    }
    setStep((currentStep) => Math.min(currentStep + 1, 5));
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleCheck = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
        familySize: form.familySize ? Number(form.familySize) : null,
        medicalBillFileNames: medicalBills.map(({ file }) => file.name),
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
                <input type="checkbox" checked={form.medicalReportAvailable} onChange={setMedicalReportAvailable} id="report" />
                <label htmlFor="report">Medical report available</label>
              </div>
            </div>
            {form.medicalReportAvailable && (
              <div className="form-group mt-24">
                <label className="form-label">Upload Medical Bills</label>
                <p className="form-hint mb-8">Upload any medical bills you currently have. Bills are optional.</p>
                <div className="flex-col gap-8">
                  {medicalBills.map((bill, index) => {
                    const inputId = `medical-bill-${index}`;
                    return (
                      <div className="flex justify-between items-center" style={{ gap: 12, flexWrap: 'wrap' }} key={bill.id}>
                        <span className="text-muted">{bill.file.name}</span>
                        <div className="flex items-center" style={{ gap: 8 }}>
                          <label className="btn btn-outline btn-sm" htmlFor={inputId}>Replace</label>
                          <input id={inputId} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => replaceMedicalBill(bill.id, event)} style={{ display: 'none' }} />
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeMedicalBill(bill.id)}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <label className="btn btn-outline btn-sm mt-8" htmlFor="add-medical-bill">+ Add Another Bill</label>
                <input id="add-medical-bill" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={addMedicalBill} style={{ display: 'none' }} />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="mb-16">Documents Available</h3>
            <p className="text-muted mb-16">Tell us which documents you have. Upload files only for documents marked Yes.</p>
            <div className="flex-col gap-16">
              {DOCUMENT_OPTIONS.map((documentName) => {
                const hasDocument = form.documentsAvailable.includes(documentName);
                const inputId = `document-${documentName.toLowerCase().replaceAll(' ', '-')}`;
                return (
                  <div className="card card-pad" key={documentName}>
                    <div className="flex justify-between items-center" style={{ gap: 16, flexWrap: 'wrap' }}>
                      <strong>{documentName}</strong>
                      <div className="flex items-center" style={{ gap: 16 }}>
                        <label className="checkbox-row" htmlFor={`${inputId}-yes`}>
                          <input
                            id={`${inputId}-yes`}
                            type="radio"
                            name={inputId}
                            checked={hasDocument}
                            onChange={() => setDocumentAvailability(documentName, true)}
                          />
                          Yes / I have it
                        </label>
                        <label className="checkbox-row" htmlFor={`${inputId}-no`}>
                          <input
                            id={`${inputId}-no`}
                            type="radio"
                            name={inputId}
                            checked={!hasDocument}
                            onChange={() => setDocumentAvailability(documentName, false)}
                          />
                          No / I don't have it
                        </label>
                      </div>
                    </div>
                    {hasDocument && (
                      <div className="mt-16">
                        <label className="form-label" htmlFor={`${inputId}-file`}>Upload File</label>
                        {documentFiles[documentName] ? (
                          <div className="flex justify-between items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
                            <span className="text-muted">{documentFiles[documentName].name}</span>
                            <div className="flex items-center" style={{ gap: 8 }}>
                              <label className="btn btn-outline btn-sm" htmlFor={`${inputId}-file`}>Replace</label>
                              <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeDocumentFile(documentName)}>Remove</button>
                            </div>
                          </div>
                        ) : (
                          <input
                            id={`${inputId}-file`}
                            className="form-control"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) => handleDocumentFile(documentName, event)}
                          />
                        )}
                        <div className="form-hint">PDF, JPG, JPEG, or PNG</div>
                      </div>
                    )}
                  </div>
                );
              })}
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
              <p><strong>Medical Bills:</strong> {medicalBills.length ? medicalBills.map(({ file }) => file.name).join(', ') : 'None uploaded'}</p>
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
