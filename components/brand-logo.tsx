type BrandLogoProps = {
  placement?: 'header' | 'footer' | 'admin';
};

/** Uses the exact supplied artwork. The viewBox hides only its outer blank space. */
export function BrandLogo({ placement = 'header' }: BrandLogoProps) {
  return (
    <a
      href="/"
      className={`brand-logo brand-logo--${placement}`}
      aria-label="Nöte — Crea tu propia esencia. Ir al inicio"
    >
      <svg
        viewBox="325 477 614 291"
        width="614"
        height="291"
        aria-hidden="true"
        focusable="false"
      >
        <image
          href="/brand/note-logo-original.jpeg"
          width="1254"
          height="1254"
        />
      </svg>
    </a>
  );
}
