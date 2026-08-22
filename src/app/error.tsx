"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="text-2xl font-semibold mb-2" style={{ color: "#e8e8ec" }}>
        Something went wrong
      </h1>
      <p className="text-sm mb-6" style={{ color: "#8888a0" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
        style={{
          background: "rgba(0,200,224,0.1)",
          color: "#00c8e0",
          border: "1px solid rgba(0,200,224,0.2)",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
