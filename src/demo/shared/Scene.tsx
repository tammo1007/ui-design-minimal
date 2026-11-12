// lg-audit-ignore-file: illustration backdrop (stands in for photography), not UI chrome
/**
 * Rich, colourful "wallpaper" scene drawn in CSS (no photos needed).
 * The only kind of backdrop where CLEAR glass is allowed (HIG: clear glass over visually rich media).
 */
export function Scene({ variant = "dusk", className = "" }: { variant?: "dusk" | "ocean" | "dawn"; className?: string }) {
  const palettes = {
    dusk: ["#1b2a6b", "#ff8d28", "#cb30e0", "#0088ff", "#0a0f2c"],
    ocean: ["#003c71", "#00c3d0", "#0088ff", "#6155f5", "#021226"],
    dawn: ["#ffd2b2", "#b0a4fa", "#ff8d28", "#0091ff", "#fff4ea"],
  }[variant];
  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={{ background: palettes[4] }} aria-hidden="true">
      <div className="absolute -left-[10%] -top-[20%] h-[80%] w-[60%] rounded-full opacity-90 blur-[60px]" style={{ background: palettes[0] }} />
      <div className="absolute right-[-10%] top-[10%] h-[70%] w-[55%] rounded-full opacity-80 blur-[70px]" style={{ background: palettes[1] }} />
      <div className="absolute bottom-[-25%] left-[20%] h-[70%] w-[60%] rounded-full opacity-80 blur-[80px]" style={{ background: palettes[2] }} />
      <div className="absolute bottom-[5%] right-[15%] h-[45%] w-[35%] rounded-full opacity-70 blur-[60px]" style={{ background: palettes[3] }} />
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}
