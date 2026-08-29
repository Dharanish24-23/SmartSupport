import { Link } from 'react-router-dom';

const HELP_FEATURES = [
  {
    icon: '🎯',
    title: 'Personalized Scheme Matching',
    desc: 'Answer a few simple questions and get schemes matched to your profile.',
  },
  {
    icon: '✅',
    title: 'Verified Scheme Information',
    desc: 'Explore organized details about available government and NGO support programs.',
  },
  {
    icon: '📄',
    title: 'Easy Application Process',
    desc: 'Submit applications digitally with required documents in one place.',
  },
  {
    icon: '📈',
    title: 'Real-Time Application Tracking',
    desc: 'Track your application journey from submission to approval.',
  },
];

const PROCESS_STEPS = [
  { title: 'Create Your Profile', desc: 'Provide basic personal and eligibility details.' },
  { title: 'Check Eligibility', desc: 'Our system analyzes your information.' },
  { title: 'Discover Matching Schemes', desc: 'View schemes suitable for your needs.' },
  { title: 'Apply Online', desc: 'Submit applications with required documents.' },
  { title: 'Track Progress', desc: 'Monitor approval status and updates.' },
];

const ADVANTAGES = [
  'Saves time searching for support programs',
  'Simple eligibility checking process',
  'Transparent eligibility reasons',
  'Digital document management',
  'Application status tracking',
  'User-friendly experience',
];

const WHO_CAN_USE = [
  { icon: '👨‍👩‍👧', title: 'Families', desc: 'Find financial and welfare support.' },
  { icon: '🏥', title: 'Patients', desc: 'Discover medical assistance programs.' },
  { icon: '🎓', title: 'Students', desc: 'Explore education-related support.' },
  { icon: '👵', title: 'Senior Citizens', desc: 'Access suitable assistance schemes.' },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero landing-hero">
        <div className="container">
          <div className="hero-badge">Support made easier</div>
          <h1>Find the Right Support Schemes Made Simple</h1>
          <p>
            Discover government and NGO assistance programs you may qualify for based on your
            personal details, financial situation, medical needs, and documents.
          </p>
          <div className="hero-actions">
            <Link to="/eligibility-checker" className="btn btn-accent">Check Your Eligibility</Link>
            <Link to="/schemes" className="btn hero-secondary-btn">Explore Available Schemes</Link>
          </div>
          <p className="hero-trust">One platform to discover, apply, and track support schemes easily.</p>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow-text">How SmartSupport Helps You</span>
            <h2>Support that matches real-life needs</h2>
          </div>
          <div className="feature-grid">
            {HELP_FEATURES.map((feature) => (
              <div className="feature-card card card-pad" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section section-alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow-text">How It Works</span>
            <h2>Your journey from discovery to approval</h2>
          </div>
          <div className="process-timeline">
            {PROCESS_STEPS.map((step, idx) => (
              <div className="process-step" key={step.title}>
                <div className="process-number">{idx + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow-text">Why Choose SmartSupport?</span>
            <h2>Designed to make support access simpler</h2>
          </div>
          <div className="advantages-grid">
            {ADVANTAGES.map((item) => (
              <div className="advantage-item" key={item}>
                <span className="advantage-check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section section-alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow-text">Who Can Use SmartSupport?</span>
            <h2>Built for people seeking practical support</h2>
          </div>
          <div className="audience-grid">
            {WHO_CAN_USE.map((person) => (
              <div className="audience-card card card-pad" key={person.title}>
                <div className="audience-icon">{person.icon}</div>
                <h3>{person.title}</h3>
                <p>{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section promise-section">
        <div className="container">
          <div className="promise-box card card-pad">
            <span className="eyebrow-text">SmartSupport Promise</span>
            <h2>Making support discovery clearer, faster, and more accessible.</h2>
            <p>
              SmartSupport helps people discover support opportunities faster through technology.
              Our platform simplifies the journey from eligibility checking to application tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
