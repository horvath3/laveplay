// Animated ambient background: drifting green aurora blobs + subtle grid.
// Purely decorative, fixed behind all content.
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(oklch(0.73_0.19_129/0.5)_1px,transparent_1px),linear-gradient(90deg,oklch(0.73_0.19_129/0.5)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="animate-drift absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="animate-float-slow absolute right-[-10%] top-[20%] h-[440px] w-[440px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="animate-drift absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-[oklch(0.5_0.12_200/0.14)] blur-[140px]" />
    </div>
  );
}
