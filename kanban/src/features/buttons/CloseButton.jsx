export default function CloseButton({ onClose }) {
  return (
    <button type="button" className="close" onClick={onClose}>
      Close
    </button>
  );
}
