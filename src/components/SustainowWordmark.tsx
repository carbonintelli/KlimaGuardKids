import Image from "next/image";

interface SustainowWordmarkProps {
  /** Rendered height of the wordmark in px */
  height?: number;
  className?: string;
}

/** Official Sustainow wordmark (sust + green ai + now). Transparent asset — no white patch. */
export function SustainowWordmark({
  height = 14,
  className = "",
}: SustainowWordmarkProps) {
  const width = Math.round((height * 458) / 96);
  return (
    <Image
      src="/logo/sustainow.png"
      alt="sustainow"
      width={width}
      height={height}
      className={`inline-block w-auto ${className}`}
      style={{ height, width: "auto" }}
      priority
    />
  );
}

interface PoweredBySustainowProps {
  className?: string;
  logoHeight?: number;
}

/** "Powered by" line with Sustainow logo in place of the sustainow keyword. */
export function PoweredBySustainow({
  className = "",
  logoHeight = 13,
}: PoweredBySustainowProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-ink/55 sm:text-[11px] ${className}`}
    >
      <span>Powered by</span>
      <a
        href="https://sustainow.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center hover:opacity-80"
        aria-label="sustainow"
      >
        <SustainowWordmark height={logoHeight} />
      </a>
    </span>
  );
}
