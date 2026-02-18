import { useState } from "react";

export default function CheckCircle({
  size = 16,
  strokeWidth = 2,
  checked: checkedProp,
  onToggle,
}) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = typeof checkedProp === "boolean";
  const checked = isControlled ? checkedProp : internalChecked;

  function handleClick() {
    if (onToggle) {
      onToggle(!checked);
      return;
    }

    setInternalChecked((prev) => !prev);
  }

  return (
    <svg
      className={`check-circle ${checked ? "checked" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {/* Outer circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />

      {/* Check mark */}
      {checked && (
        <path
          d="M6 12l4 4 8-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
