export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]"
        style={{ 
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 70%, transparent 100%)', 
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 70%, transparent 100%)' 
        }}
      />
    </div>
  );
}
