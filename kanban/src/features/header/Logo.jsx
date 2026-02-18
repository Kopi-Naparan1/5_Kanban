export default function Logo() {
  return (
    <div className="logo">
      <svg
        width="22"
        height="22"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="12" fill="#293241" />

        <rect
          x="12"
          y="14"
          width="10"
          height="36"
          rx="3"
          fill="#ffffff"
          opacity="0.85"
        />
        <rect x="12" y="18" width="10" height="6" rx="2" fill="#2563eb" />

        <rect
          x="27"
          y="14"
          width="10"
          height="36"
          rx="3"
          fill="#ffffff"
          opacity="0.9"
        />
        <rect x="27" y="26" width="10" height="6" rx="2" fill="#22c55e" />

        <rect
          x="42"
          y="14"
          width="10"
          height="36"
          rx="3"
          fill="#ffffff"
          opacity="1"
        />
        <rect x="42" y="34" width="10" height="6" rx="2" fill="#f97316" />
      </svg>
    </div>
  );
}
