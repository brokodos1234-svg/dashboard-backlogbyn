export default function CratesIllustration() {
  return (
    <svg viewBox="0 0 220 180" className="h-full w-full" fill="none" aria-hidden="true">
      <ellipse cx="110" cy="162" rx="86" ry="12" fill="#0f1115" opacity="0.05" />

      <g stroke="#0f1115" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <rect x="26" y="86" width="52" height="52" rx="4" fill="#eefdf6" />
        <path d="M26 102h52M52 86v52" stroke="#128c68" strokeWidth="1.6" />

        <rect x="84" y="60" width="60" height="78" rx="4" fill="#ffffff" />
        <path d="M84 84h60M114 60v78" stroke="#e0b32b" strokeWidth="1.6" />

        <rect x="150" y="94" width="46" height="44" rx="4" fill="#eefdf6" />
        <path d="M150 108h46M173 94v44" stroke="#128c68" strokeWidth="1.6" />

        <rect x="98" y="30" width="34" height="30" rx="3" fill="#ffffff" />
        <path d="M98 44h34" stroke="#db2777" strokeWidth="1.6" />
      </g>

      <g stroke="#0f1115" strokeWidth="2" strokeLinecap="round">
        <path d="M40 138v14M64 138v14M100 138v22M128 138v22M162 138v8M186 138v8" opacity="0.15" />
      </g>

      <g transform="translate(146,20)">
        <rect x="0" y="0" width="30" height="38" rx="4" fill="#0f1115" />
        <rect x="4" y="6" width="22" height="3" rx="1.5" fill="#eefdf6" />
        <rect x="4" y="13" width="22" height="3" rx="1.5" fill="#eefdf6" opacity="0.7" />
        <rect x="4" y="20" width="14" height="3" rx="1.5" fill="#eefdf6" opacity="0.5" />
        <circle cx="15" cy="30" r="3.5" fill="#1fae82" />
      </g>
    </svg>
  );
}
