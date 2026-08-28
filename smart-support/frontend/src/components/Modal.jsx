export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="mb-16">{title}</h3>}
        {children}
        {footer && <div className="flex gap-12 mt-24" style={{ justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}
