import formatDate from "../inbox/utils/formatDate";

export default function StartButton({
  startButtonRef,
  setActivePanel,
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
  setStartButtonEl,
}) {
  return (
    <button
      className="start-date-button"
      ref={startButtonRef}
      onClick={() => {
        setActivePanel((prev) => (prev === "start" ? null : "start"));
        if (startButtonRef.current) {
          setStartButtonEl(startButtonRef.current);
        }
      }}
    >
      <div className="button-label">
        <span>Start date</span>
        {startDate && <span className="button-date">{formatDate(startDate)}</span>}
      </div>
      {startDate && (
        <span
          className="inline-clear"
          onClick={(e) => {
            e.stopPropagation();
            setStartDate(null);
            if (dueDate && new Date(dueDate) < new Date(startDate)) {
              setDueDate(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setStartDate(null);
              if (dueDate && new Date(dueDate) < new Date(startDate)) {
                setDueDate(null);
              }
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Clear start date"
        >
          x
        </span>
      )}
    </button>
  );
}
