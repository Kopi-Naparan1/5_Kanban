import formatDate from "../utils/formatDate";
import { useEffect, useRef, useState } from "react";
import "./editPopover.css";

import FloatingDatePicker from "./FloatingDatePicker";
import FloatingError from "../components/FloatingError";

const EMPTY_RECURRENCE = {
  type: "none",
  interval: 1,
  unit: "weeks",
  daysOfWeek: [],
};

const WEEK_DAYS = [
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
  { label: "S", value: 0 },
];

export default function EditPopover({ task, onClose, onSave, onDelete }) {
  const popoverRef = useRef(null);
  const textAreaRef = useRef(null);
  const startButtonRef = useRef(null);
  const dueButtonRef = useRef(null);
  const recurringButtonRef = useRef(null);

  const [activePanel, setActivePanel] = useState(null);
  const [dateError, setDateError] = useState("");

  const [text, setText] = useState(task.text);
  const [startButtonEl, setStartButtonEl] = useState(null);
  const [dueButtonEl, setDueButtonEl] = useState(null);
  const [recurringButtonEl, setRecurringButtonEl] = useState(null);

  const [startDate, setStartDate] = useState(task.startDate || null);
  const [dueDate, setDueDate] = useState(task.dueDate || null);

  const [recurrence, setRecurrence] = useState(
    task.recurrence ?? EMPTY_RECURRENCE,
  );

  useEffect(() => {
    if (!dateError) return;

    const timer = setTimeout(() => {
      setDateError("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [dateError]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

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

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleDueDateChange(nextDue) {
    setDueDate(nextDue);

    // If start date exists and is after new due date → fix it
    if (startDate && nextDue && new Date(startDate) > new Date(nextDue)) {
      setStartDate(nextDue);
    }
  }

  function handleStartDateChange(nextStart) {
    setStartDate(nextStart);

    if (dueDate && nextStart && new Date(dueDate) < new Date(nextStart)) {
      setDueDate(nextStart);
    }
  }

  function formatRecurrenceLabel(value) {
    if (!value || value.type === "none") return "Not recurring";

    if (value.type === "daily") return "Every day";

    if (value.type === "weekly") {
      if (!value.daysOfWeek?.length) return "Every week";

      const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const days = value.daysOfWeek
        .sort()
        .map((d) => map[d])
        .join(", ");

      return `Every week on ${days}`;
    }

    if (value.type === "monthly") return "Every month";
    if (value.type === "yearly") return "Every year";
    if (value.type === "weekdays") return "Weekdays";

    if (value.type === "custom") {
      return `Every ${value.interval} ${value.unit}`;
    }

    return "Recurring";
  }

  function applyRecurrence(next) {
    setRecurrence(next);
  }

  return (
    <div className="edit-overlay">
      <div ref={popoverRef} className="edit-popover">
        <textarea
          ref={textAreaRef}
          className="edit-input"
          value={text}
          onChange={handleChange}
          autoFocus
        />

        <div className="actions-container">
          <div className="is-save-container">
            <button
              className="save"
              onClick={() => {
                const trimmedText =
                  text.trim() === "" ? task.text : text.trim();

                onSave({
                  ...task,
                  text: trimmedText,
                  startDate,
                  dueDate,
                  recurrence: {
                    ...EMPTY_RECURRENCE,
                    ...recurrence,
                  },
                });
              }}
            >
              Save
            </button>
            <button className="close" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="other-options">
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
                {startDate && (
                  <span className="button-date">{formatDate(startDate)}</span>
                )}
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
                  ✕
                </span>
              )}
            </button>
            {activePanel === "start" && (
              <FloatingDatePicker
                anchorEl={startButtonEl}
                date={startDate}
                onChange={handleStartDateChange}
                onClose={() => setActivePanel(false)}
              />
            )}

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
                {dueDate && (
                  <span className="button-date">{formatDate(dueDate)}</span>
                )}
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
                  ✕
                </span>
              )}
            </button>

            {activePanel === "due" && (
              <FloatingDatePicker
                anchorEl={dueButtonEl}
                date={dueDate}
                onChange={handleDueDateChange}
                onClose={() => setActivePanel(null)}
                variant="due"
              />
            )}

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

                setDateError(""); // clear error if valid

                setActivePanel((prev) =>
                  prev === "recurring" ? null : "recurring",
                );
              }}
            >
              <div className="button-label">
                <span>Recurring</span>
                <span className="button-date">
                  {formatRecurrenceLabel(recurrence)}
                </span>
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
                  ✕
                </span>
              )}
            </button>
            {dateError && (
              <FloatingError
                anchorEl={recurringButtonEl}
                message={dateError}
                onClose={() => setDateError("")}
              />
            )}

            <button onClick={onDelete}>Delete</button>
          </div>
        </div>

        {activePanel === "recurring" && (
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
            {(recurrence.type === "weekly" ||
              recurrence.type === "weekdays") && (
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
        )}
      </div>
    </div>
  );
}
