export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '28px 24px', marginTop: 60 }}>
      <div className="container flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} SmartSupport. Demo project — all schemes shown are sample data.
        </span>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Built for educational/demo purposes.</span>
      </div>
    </footer>
  );
}
