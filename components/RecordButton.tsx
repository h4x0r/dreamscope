"use client";

interface RecordButtonProps {
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  onTranscript: (transcript: string) => void;
}

export default function RecordButton({
  isRecording,
  onRecordingChange,
}: RecordButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onRecordingChange(!isRecording)}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? "bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            : "bg-dream-primary shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-105"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <div className="w-8 h-8 bg-white rounded-sm" />
        ) : (
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
      <p className="mt-4 text-dream-muted text-sm">
        {isRecording ? "Recording... tap to stop" : "Tap to speak your dream"}
      </p>
      {isRecording && (
        <div className="mt-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-dream-primary rounded-full animate-pulse"
              style={{
                height: `${12 + Math.random() * 20}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
