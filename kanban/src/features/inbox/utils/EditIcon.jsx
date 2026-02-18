export default function EditIcon({ size = 16, strokeWidth = 1.8 }) {
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
      className="edit-icon"
    >
      {/* Pencil body */}
      <path d="M3 21l3.5-1 11-11-2.5-2.5-11 11L3 21z" />

      {/* Pencil tip */}
      <path d="M14.5 5.5l2.5 2.5" />
    </svg>
  );
}
