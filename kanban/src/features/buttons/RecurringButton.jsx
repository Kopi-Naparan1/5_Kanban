export default function RecurringButton({
  recurringButtonRef,
  dueDate,
  setDateError,
  setRecurringButtonEl,
  setActivePanel,
  recurrence,
  setRecurrence,
  formatRecurrenceLabel,
  EMPTY_RECURRENCE,
}) {
  return (
    <button
      className="recurring-button"
      ref={recurringButtonRef}
      onClick={() => {
        if (!dueDate) {
          setDateError("Set a due date before making this recurring.");
          if (recurringButtonRef.current) {
            setRecurringButtonEl(recurringButtonRef.current);
          }
          return;
        }

        setDateError("");
        setActivePanel((prev) => (prev === "recurring" ? null : "recurring"));
      }}
    >
      <div className="button-label">
        <span>Recurring</span>
        <span className="button-date">{formatRecurrenceLabel(recurrence)}</span>
      </div>
      {recurrence?.type && recurrence.type !== "none" && (
        <span
          className="inline-clear"
          onClick={(e) => {
            e.stopPropagation();
            setRecurrence(EMPTY_RECURRENCE);
            setActivePanel(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setRecurrence(EMPTY_RECURRENCE);
              setActivePanel(null);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Clear recurrence"
        >
          x
        </span>
      )}
    </button>
  );
}
