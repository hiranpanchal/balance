export function GoldRule({
  className = "",
  width = "w-12",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block h-px bg-gold ${width} ${className}`}
    />
  );
}
