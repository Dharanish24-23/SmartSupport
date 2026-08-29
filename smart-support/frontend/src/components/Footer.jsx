import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '28px 24px', marginTop: 0 }}>
      <div className="container site-footer-inner" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: '0 0 10px', color: 'var(--color-primary-dark)', fontSize: '1.2rem' }}>SmartSupport</h3>
          <p className="text-muted" style={{ margin: 0, lineHeight: 1.7, maxWidth: 360 }}>
            Your digital gateway to discovering support schemes.
          </p>
        </div>

        <div>
          <div className="site-footer-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', marginBottom: 12 }}>
            <Link to="/">Home</Link>
            <Link to="/eligibility-checker">Check Eligibility</Link>
            <Link to="/schemes">Schemes</Link>
            <Link to="/about">About</Link>
            <a href="mailto:hello@smartsupport.demo">Contact</a>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.7 }}>
            SmartSupport is a demo educational project. All schemes and information shown are sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
