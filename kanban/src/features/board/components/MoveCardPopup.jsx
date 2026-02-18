export default function MoveCardPopup({ onClose, onMove }) {
  return (
    <div className="move-card-popup-container">
      <button type="button" onClick={onMove}>
        Move
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}
