export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="empty-state">
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="mt-16">{action}</div>}
    </div>
  );
}
