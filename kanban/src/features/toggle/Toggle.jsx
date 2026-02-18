import "./toggle.css";

export default function Toggle({ views, setView }) {
  function toggleView(view) {
    setView((prev) => {
      const isCurrentlyOn = prev[view];

      // Count how many are currently true
      const activeCount = Object.values(prev).filter(Boolean).length;

      // If this is the last active view and user tries to turn it off → block
      if (isCurrentlyOn && activeCount === 1) {
        return prev;
      }

      return {
        ...prev,
        [view]: !prev[view],
      };
    });
  }

  return (
    <div className="toggle-container">
      <button
        className={`inbox ${views.inbox ? "active" : ""}`}
        onClick={() => toggleView("inbox")}
      >
        <span className="toggle-label">Inbox</span>
      </button>
      <button
        className={`board ${views.board ? "active" : ""}`}
        onClick={() => toggleView("board")}
      >
        <span className="toggle-label">Board</span>
      </button>
    </div>
  );
}
