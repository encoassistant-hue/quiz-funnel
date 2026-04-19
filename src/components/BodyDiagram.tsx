interface BodyDiagramProps {
  area: string;
  selected?: boolean;
}

export default function BodyDiagram({ area, selected }: BodyDiagramProps) {
  const fill = selected ? '#fef3c7' : '#fdf6ee';
  const stroke = selected ? '#d97706' : '#d4b896';
  const red = '#ef4444';

  return (
    <svg viewBox="0 0 100 200" className="w-full h-full" style={{ maxHeight: 140 }}>
      {/* Head */}
      <circle cx="50" cy="17" r="13" fill={fill} stroke={stroke} strokeWidth="1.5" />

      {/* Neck */}
      <rect x="44" y="29" width="12" height="9" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" />

      {/* Torso */}
      <path
        d="M26 38 Q22 37 20 44 L18 88 Q18 96 26 97 L74 97 Q82 96 82 88 L80 44 Q78 37 74 38 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />

      {/* Spine line (subtle) */}
      <line x1="50" y1="40" x2="50" y2="90" stroke={stroke} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.5" />

      {/* Left arm */}
      <rect x="7" y="38" width="12" height="52" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Right arm */}
      <rect x="81" y="38" width="12" height="52" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />

      {/* Left leg */}
      <rect x="27" y="99" width="17" height="74" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Right leg */}
      <rect x="56" y="99" width="17" height="74" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />

      {/* ── Pain highlights ── */}

      {area === 'lower-back' && (
        <>
          <ellipse cx="50" cy="83" rx="22" ry="11" fill={red} opacity="0.45" />
          <ellipse cx="50" cy="83" rx="10" ry="5" fill={red} opacity="0.3" />
          {/* SI joint dots */}
          <circle cx="43" cy="87" r="3" fill={red} opacity="0.7" />
          <circle cx="57" cy="87" r="3" fill={red} opacity="0.7" />
        </>
      )}

      {area === 'hip-buttock' && (
        <>
          <ellipse cx="27" cy="99" rx="13" ry="10" fill={red} opacity="0.45" />
          <ellipse cx="73" cy="99" rx="13" ry="10" fill={red} opacity="0.45" />
        </>
      )}

      {area === 'sciatica' && (
        <>
          {/* Left hip + full left leg */}
          <ellipse cx="27" cy="99" rx="13" ry="10" fill={red} opacity="0.45" />
          <rect x="26" y="107" width="19" height="66" rx="8" fill={red} opacity="0.35" />
          {/* Lightning bolt */}
          <path
            d="M38 115 L34 135 L38 135 L34 158"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        </>
      )}

      {area === 'everything' && (
        <>
          <rect x="5" y="3" width="90" height="172" rx="12" fill={red} opacity="0.18" />
          <ellipse cx="50" cy="83" rx="22" ry="11" fill={red} opacity="0.25" />
          <ellipse cx="27" cy="99" rx="12" ry="9" fill={red} opacity="0.25" />
          <ellipse cx="73" cy="99" rx="12" ry="9" fill={red} opacity="0.25" />
        </>
      )}

      {area === 'not-sure' && (
        <>
          <text
            x="50"
            y="75"
            textAnchor="middle"
            fontSize="32"
            fill="#f59e0b"
            opacity="0.85"
            fontWeight="bold"
          >
            ?
          </text>
        </>
      )}
    </svg>
  );
}
