export default function RecurringPanel({
  applyRecurrence,
  recurrence,
  setRecurrence,
  WEEK_DAYS,
}) {
  function toggleDay(day) {
    setRecurrence((prev) => {
      const days = prev.daysOfWeek || [];
      const exists = days.includes(day);

      return {
        ...prev,
        type: "weekly",
        daysOfWeek: exists ? days.filter((d) => d !== day) : [...days, day],
      };
    });
  }

  return (
    <div className="recurring-panel">
      <div className="recurring-title">Repeat</div>

      {/* Standard recurrence options */}
      <div className="recurring-options">
        <button
          className="recurring-option"
          onClick={() => applyRecurrence({ type: "none" })}
        >
          None
        </button>
        <button
          className="recurring-option"
          onClick={() => applyRecurrence({ type: "daily" })}
        >
          Daily
        </button>
        <button
          className="recurring-option"
          onClick={() =>
            applyRecurrence({
              type: "weekly",
              interval: recurrence.interval || 1,
              unit: "weeks",
              daysOfWeek: recurrence.daysOfWeek?.length
                ? recurrence.daysOfWeek
                : [], // default empty, user picks days
            })
          }
        >
          Weekly
        </button>
        <button
          className="recurring-option"
          onClick={() =>
            applyRecurrence({
              type: "weekdays",
              daysOfWeek: [1, 2, 3, 4, 5],
            })
          }
        >
          Weekdays
        </button>
        <button
          className="recurring-option"
          onClick={() => applyRecurrence({ type: "monthly" })}
        >
          Monthly
        </button>
        <button
          className="recurring-option"
          onClick={() => applyRecurrence({ type: "yearly" })}
        >
          Yearly
        </button>
      </div>

      {/* Weekday picker (for weekly or weekdays) */}
      {(recurrence.type === "weekly" || recurrence.type === "weekdays") && (
        <div className="weekly-picker">
          <div className="weekly-label">On</div>
          <div className="weekday-row">
            {WEEK_DAYS.map((day) => (
              <button
                key={day.value}
                className={
                  recurrence.daysOfWeek.includes(day.value)
                    ? "weekday active"
                    : "weekday"
                }
                onClick={() => toggleDay(day.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom interval/unit */}
      <div className="recurring-custom">
        <span>Every</span>
        <input
          className="recurring-interval"
          type="number"
          min="1"
          value={recurrence.interval || 1}
          onChange={(e) =>
            applyRecurrence({
              type: "custom",
              interval: Math.max(1, Number(e.target.value) || 1),
              unit: recurrence.unit || "weeks",
            })
          }
        />
        <select
          className="recurring-unit"
          value={recurrence.unit || "weeks"}
          onChange={(e) =>
            applyRecurrence({
              type: "custom",
              interval: recurrence.interval || 1,
              unit: e.target.value,
            })
          }
        >
          <option value="days">days</option>
          <option value="weeks">weeks</option>
          <option value="months">months</option>
          <option value="years">years</option>
        </select>
      </div>
    </div>
  );
}
