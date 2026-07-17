/* Imagery from the live ORA site when available, with a warm duotone
   gradient fallback for items without a crawled asset. */

export function Thumb({
  palette,
  image,
  alt = "",
  label,
  className = "",
}: {
  palette: [string, string];
  image?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`grain relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,0.28) 0%, transparent 55%)",
          }}
        />
      )}
      {label ? (
        <span className="absolute bottom-2 start-2.5 font-display text-[0.65rem] tracking-[0.18em] uppercase text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
