import formatDate from "../inbox/utils/formatDate";

export default function DueButton({
  dueButtonRef,
  dueDate,
  setDueDate,
  setActivePanel,
  setDueButtonEl,
}) {
  return (
    <button
      className="due-date-button"
      ref={dueButtonRef}
      onClick={() => {
        setActivePanel((prev) => (prev === "due" ? null : "due"));
        if (dueButtonRef.current) {
          setDueButtonEl(dueButtonRef.current);
        }
      }}
    >
      <div className="button-label">
        <span>Due date</span>
        {dueDate && <span className="button-date">{formatDate(dueDate)}</span>}
      </div>
      {dueDate && (
        <span
          className="inline-clear"
          onClick={(e) => {
            e.stopPropagation();
            setDueDate(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setDueDate(null);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Clear due date"
        >
          x
        </span>
      )}
    </button>
  );
}
