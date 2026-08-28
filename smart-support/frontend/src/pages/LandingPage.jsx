import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🧠', title: 'Smart Eligibility Checking', desc: 'Answer a few questions and instantly see which schemes match your profile.' },
  { icon: '🏛️', title: 'Multiple Support Schemes', desc: 'Browse government and NGO financial assistance schemes in one place.' },
  { icon: '🔍', title: 'Transparent Eligibility Reasons', desc: 'See exactly why you are or aren\u2019t eligible for each scheme.' },
  { icon: '📋', title: 'Easy Application Tracking', desc: 'Apply directly and track your application status from submission to approval.' },
];

const STEPS = ['Enter Details', 'Check Eligibility', 'Find Matching Schemes', 'Apply', 'Track Application'];

export default function LandingPage() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Find Financial Support You May Be Eligible For</h1>
          <p>
            Check government and NGO financial assistance schemes based on your income, age,
            location, medical condition and documents.
          </p>
          <div className="hero-actions">
            <Link to="/eligibility-checker" className="btn btn-accent">Check Eligibility</Link>
            <Link to="/schemes" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              Explore Schemes
            </Link>
          </div>
        </div>
      </section>

      <section className="container mt-32">
        <h2 className="text-center mb-24">Why SmartSupport?</h2>
        <div className="grid grid-4">
          {FEATURES.map((f) => (
            <div className="card card-pad" key={f.title}>
              <div style={{ fontSize: '1.8rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', margin: '12px 0 8px' }}>{f.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.88rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-32" style={{ marginBottom: 60 }}>
        <div className="card card-pad">
          <h2 className="text-center mb-24">How It Works</h2>
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
            {STEPS.map((step, idx) => (
              <div key={step} className="flex items-center gap-12">
                <div className="flex-col text-center" style={{ minWidth: 130 }}>
                  <div className="step-circle" style={{ background: 'var(--color-primary)', margin: '0 auto 8px' }}>{idx + 1}</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{step}</span>
                </div>
                {idx < STEPS.length - 1 && <span className="text-muted" style={{ fontSize: '1.4rem' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
