"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a12", color: "#e8e8ec", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#8888a0", marginBottom: "1.5rem" }}>An unexpected error occurred.</p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              background: "rgba(0,200,224,0.1)",
              color: "#00c8e0",
              border: "1px solid rgba(0,200,224,0.2)",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
