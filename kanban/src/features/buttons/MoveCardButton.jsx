export default function MoveCardButton({
  moveCardButtonRef,
  setActivePanel,
  setMoveCardMenuOpen,
  moveCardMenuOpen,
}) {
  return (
    <button
      className="move-card"
      ref={moveCardButtonRef}
      onClick={() => {
        setActivePanel((prev) => {
          const nextPanel = prev === "move" ? null : "move";
          setMoveCardMenuOpen(nextPanel === "move");
          return nextPanel;
        });
      }}
    >
      <div className="button-label-move">
        <span>Move</span>
        {moveCardMenuOpen && <span className="button-move-card"></span>}
        {moveCardMenuOpen && (
          <span
            className="inline-clear"
            onClick={(e) => {
              e.stopPropagation();
              setMoveCardMenuOpen(false);
              setActivePanel(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setMoveCardMenuOpen(false);
                setActivePanel(null);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Clear move card menu"
          >
            x
          </span>
        )}
      </div>
    </button>
  );
}
