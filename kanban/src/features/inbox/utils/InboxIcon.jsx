export default function InboxIcon({ size = 18, strokeWidth = 1.8 }) {
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
      className="inbox-icon"
    >
      {/* Tray */}
      <path d="M3 13.5V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7.5" />
      <path d="M3 13.5h5l2 3h4l2-3h5" />
      <path d="M3 13.5v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />

      {/* Arrow down */}
      <path d="M12 7v5" />
      <path d="M9.5 10.5L12 13l2.5-2.5" />
    </svg>
  );
}
