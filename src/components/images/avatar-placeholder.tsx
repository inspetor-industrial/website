export function AvatarPlaceholder() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=""
    >
      <circle cx="48" cy="48" r="48" fill="#EEF2FF" />
      <mask
        id="mask0_1002_5002"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="96"
        height="96"
      >
        <circle cx="48" cy="48" r="48" fill="white" className="shadow" />
      </mask>
      <g mask="url(#mask0_1002_5002)">
        <ellipse cx="48" cy="100" rx="40" ry="44" fill="#C9DAFB" />
      </g>
      <circle cx="48" cy="36" r="16" fill="#C9DAFB" />
    </svg>
  )
}
