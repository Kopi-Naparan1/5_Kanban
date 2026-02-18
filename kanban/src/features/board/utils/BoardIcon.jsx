export default function BoardIcon({ size = 18, strokeWidth = 1.8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="board-icon"
    >
      {/* Outer board */}
      <rect x="3" y="4" width="18" height="16" rx="2" />

      {/* Column dividers */}
      <line x1="9" y1="4" x2="9" y2="20" />
      <line x1="15" y1="4" x2="15" y2="20" />

      {/* Cards (minimal, asymmetric for uniqueness) */}
      <line x1="5" y1="8" x2="7" y2="8" />
      <line x1="11" y1="10" x2="13" y2="10" />
      <line x1="17" y1="7" x2="19" y2="7" />

      <line x1="5" y1="12" x2="7" y2="12" />
      <line x1="11" y1="14" x2="13" y2="14" />
      <line x1="17" y1="11" x2="19" y2="11" />
    </svg>
  );
}
