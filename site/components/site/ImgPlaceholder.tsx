import Image from "next/image";

type Tone = "cream" | "dark";

export function ImgPlaceholder({
  src,
  alt,
  label,
  ratio = "16 / 10",
  tone = "cream",
  className = "",
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  label?: string;
  ratio?: string;
  tone?: Tone;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(178,139,93,0.04)" }}
        />
      </div>
    );
  }

  const bg = tone === "dark" ? "var(--teal-deep)" : "var(--cream-light)";
  const line =
    tone === "dark" ? "rgba(234,226,210,0.08)" : "rgba(62,79,86,0.08)";
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden rounded-lg flex items-end ${className}`}
      style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(135deg, ${bg} 0 22px, ${line} 22px 23px)`,
      }}
    >
      {label && (
        <div className="p-4 font-mono text-[10px] tracking-widest uppercase text-stone">
          [ {label} ]
        </div>
      )}
    </div>
  );
}
