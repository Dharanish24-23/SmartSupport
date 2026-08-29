export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container">
          <span className="about-eyebrow">About the platform</span>
          <h1>About SmartSupport</h1>
          <p>Making financial-support scheme discovery clearer, more accessible, and easier to understand.</p>
        </div>
      </section>

      <div className="container about-content">
        <section className="about-card-grid">
          <article className="card about-card">
            <div className="about-icon" aria-hidden="true">◎</div>
            <div>
              <h2>What is SmartSupport?</h2>
              <p>SmartSupport is a financial-support scheme eligibility platform that helps individuals discover government and NGO assistance programs based on income, age, location, medical condition, and available documents.</p>
            </div>
          </article>
          <article className="card about-card">
            <div className="about-icon" aria-hidden="true">⌁</div>
            <div>
              <h2>Our Purpose</h2>
              <p>Technology can simplify the process of discovering and understanding support schemes. SmartSupport presents eligibility information in a clear, structured way so people can explore relevant options with confidence.</p>
            </div>
          </article>
        </section>

        <section className="about-section">
          <div className="about-section-heading">
            <span className="about-eyebrow">A simple journey</span>
            <h2>How It Works</h2>
            <p className="text-muted">A clear path from personal details to application tracking.</p>
          </div>
          <div className="about-steps">
            {['Answer questions', 'Check eligibility', 'Discover matching schemes', 'Apply and track applications'].map((step, index) => (
              <div className="about-step" key={step}>
                <div className="about-step-number">{index + 1}</div>
                <h3>{step}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="about-disclaimer">
          <div className="about-icon about-icon-light" aria-hidden="true">!</div>
          <div>
            <h2>Important Disclaimer</h2>
            <p>This project is for educational and demonstration purposes. All schemes, organizations, and amounts shown are sample/demo data and do not represent real government or NGO programs.</p>
          </div>
        </section>

        <section className="about-section about-technology">
          <div className="about-section-heading">
            <span className="about-eyebrow">Built as a full-stack reference</span>
            <h2>Technology</h2>
          </div>
          <div className="about-tech-grid">
            {[
              ['◈', 'React', 'Responsive frontend experience'],
              ['▣', 'Spring Boot', 'Secure backend services'],
              ['▤', 'PostgreSQL', 'Reliable data persistence'],
            ].map(([icon, name, description]) => (
              <article className="card about-tech-card" key={name}>
                <div className="about-tech-icon" aria-hidden="true">{icon}</div>
                <div><h3>{name}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
