export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-12" style={{ padding: 32, justifyContent: 'center' }}>
      <div className="spinner" />
      <span className="text-muted">{label}</span>
    </div>
  );
}
