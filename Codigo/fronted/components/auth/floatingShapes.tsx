const SHAPES = [
  { size: 280, left: -5, top: -10, duration: 35, delay: 0 },
  { size: 200, left: 85, top: 5, duration: 40, delay: -8 },
  { size: 150, left: 70, top: 70, duration: 30, delay: -15 },
  { size: 220, left: -8, top: 75, duration: 38, delay: -5 },
  { size: 120, left: 45, top: -5, duration: 32, delay: -12 },
  { size: 100, left: 90, top: 45, duration: 28, delay: -20 },
];

export default function FloatingShapes() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SHAPES.map((shape, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-primary/5 border border-primary/10 animate-float-shape"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              animationDuration: `${shape.duration}s`,
              animationDelay: `${shape.delay}s`,
            }}
          />
        ))}
      </div>{' '}
      {/* Subtle gradient accents */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/3 via-transparent to-transparent pointer-events-none" />
    </>
  );
}
