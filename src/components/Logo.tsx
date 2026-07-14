import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

/** KlimaGuard Kids mark: Climate (sun + leaves) + Protection (shield) + Kids (child). */
export function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.svg"
        alt={showText ? "" : "KlimaGuard Kids"}
        width={size}
        height={size}
        className="shrink-0"
        priority
        unoptimized
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
