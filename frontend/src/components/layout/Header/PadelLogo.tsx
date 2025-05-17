export function PadelLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      style={{ display: 'inline', verticalAlign: 'middle' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pala de pádel con forma de lágrima */}
      <path d="M18 10 Q28 2 36 18 Q42 34 24 38 Q6 34 12 18 Q15 13 18 10 Z" fill="#fff" stroke="#111" strokeWidth="2.2" />
      {/* Agujeros grandes alineados */}
      <circle cx="24" cy="20" r="1.6" fill="#111" />
      <circle cx="22" cy="25" r="1.6" fill="#111" />
      <circle cx="26" cy="25" r="1.6" fill="#111" />
      {/* Mango corto y ancho */}
      <rect x="20.2" y="36.5" width="7.6" height="8" rx="2.5" fill="#111" stroke="#fff" strokeWidth="1" />
    </svg>
  );
} 