// Eight-pointed star (khatam), the classic Islamic geometric motif
export default function Khatam({ className = "" }) {
  const sq = "M-50 -50 H50 V50 H-50 Z";
  return (
    <svg viewBox="-80 -80 160 160" className={className} fill="none" aria-hidden>
      {[1, 0.72, 0.44].map((s, i) => (
        <g key={i} transform={`scale(${s})`} stroke="currentColor" strokeWidth={1.2 / s}>
          <path d={sq} />
          <path d={sq} transform="rotate(45)" />
        </g>
      ))}
      <circle r="71" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4" />
    </svg>
  );
}

export const KHATAM_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23157a6e' stroke-opacity='0.09' stroke-width='1'%3E%3Cpath d='M22 22h28v28H22z'/%3E%3Cpath d='M36 16.2L55.8 36 36 55.8 16.2 36z'/%3E%3C/g%3E%3C/svg%3E")`;
