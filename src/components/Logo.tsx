import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const LOGO_SRC = "/logo/logo_klimaguardkids.jpeg";

/** KlimaGuard Kids brand mark from logo/logo_klimaguardkids.jpeg */
export function Logo({ size = 40, showText = false, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={LOGO_SRC}
        alt={showText ? "" : "KlimaGuard Kids"}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        priority
      />
      {showText && (
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-ocean">Klima</span>
          <span className="text-leaf">Guard</span>
          <span className="text-ink"> Kids</span>
        </span>
      )}
    </span>
  );
}
