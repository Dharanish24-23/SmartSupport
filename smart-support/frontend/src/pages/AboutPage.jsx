export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 760 }}>
      <h1 className="mb-16">About SmartSupport</h1>
      <p className="text-muted mb-16">
        SmartSupport is a demo financial support scheme eligibility platform built to showcase how
        technology can help individuals discover government and NGO assistance programs they may
        qualify for, based on their income, age, location, medical condition and available documents.
      </p>
      <p className="text-muted mb-16">
        This project is intended for educational and demonstration purposes. All schemes, organizations
        and amounts shown in this application are sample/demo data and do not represent real government
        or NGO programs.
      </p>
      <p className="text-muted">
        Built with React, Spring Boot, and PostgreSQL as a full-stack reference implementation of an
        eligibility-matching system.
      </p>
    </div>
  );
}
