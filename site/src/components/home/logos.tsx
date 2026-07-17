/** Minimal single-color framework marks. */

export function ReactLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function TypeScriptLogo() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" opacity="0.18" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
      >
        TS
      </text>
    </svg>
  );
}

export function VueLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 4h4.4L12 13.6 17.6 4H22L12 21z" opacity="0.9" />
      <path d="M7.2 4h3.1L12 7 13.7 4h3.1L12 12.2z" opacity="0.5" />
    </svg>
  );
}

export function SvelteLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M15.5 4.5a4.6 4.6 0 0 0-6.4-1.2L5.6 5.7a4.4 4.4 0 0 0-1.9 4.3 4.6 4.6 0 0 0 .6 1.7" />
      <path d="M8.5 19.5a4.6 4.6 0 0 0 6.4 1.2l3.5-2.4a4.4 4.4 0 0 0 1.9-4.3 4.6 4.6 0 0 0-.6-1.7" />
      <path d="M14.8 8.2l-5.3 3.6" />
    </svg>
  );
}
