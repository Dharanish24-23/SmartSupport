export default function EligibilityBadge({ eligible }) {
  return (
    <span className={`badge ${eligible ? 'badge-eligible' : 'badge-not-eligible'}`}>
      {eligible ? '🟢 Eligible' : '🔴 Not Eligible'}
    </span>
  );
}
