export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-dream-primary/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-dream-primary/40 animate-ping [animation-delay:200ms]" />
        <div className="absolute inset-4 rounded-full border-2 border-dream-primary/60 animate-ping [animation-delay:400ms]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-dream-primary animate-pulse" />
        </div>
      </div>
      <p className="mt-8 text-dream-muted text-sm animate-pulse">
        Analyzing through 3 psychological frameworks...
      </p>
    </div>
  );
}
