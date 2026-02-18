import "./floating-date-picker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FloatingDatePicker({
  anchorEl,
  date,
  onChange,
  onClose,
  variant = "start",
}) {
  if (!anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  return (
    <div
      className={`floating-datepicker-wrapper ${
        variant === "due" ? "is-due" : ""
      }`}
      style={{
        position: "absolute",
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        zIndex: 2000,
      }}
    >
      <DatePicker
        selected={date}
        onChange={(d) => {
          onChange(d);
        }}
        inline
        showTimeInput
        timeInputLabel="Time"
        timeFormat="HH:mm"
        dateFormat="MMM d, yyyy HH:mm"
        showMonthDropdown
        showYearDropdown
        dropdownMode="scroll"
        calendarClassName="floating-datepicker"
        popperProps={{
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport", // ensures the dropdown stays inside the screen
              },
            },
          ],
        }}
      />
      <div className="datepicker-footer">
        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
