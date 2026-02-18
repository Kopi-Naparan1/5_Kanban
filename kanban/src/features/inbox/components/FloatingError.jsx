import "./floating-error.css";

export default function FloatingError({ anchorEl, message, onClose }) {
  if (!anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  return (
    <div
      className="floating-error"
      style={{
        position: "absolute",
        top: rect.bottom + window.scrollY + 14,
        left: rect.left + window.scrollX - 90,
        zIndex: 3000,
      }}
    >
      ⚠ {message}
      <button className="floating-error-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
