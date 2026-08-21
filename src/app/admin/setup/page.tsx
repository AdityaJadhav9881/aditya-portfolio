"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/setup")
      .then((r) => r.json())
      .then((data) => {
        if (data.adminExists) {
          router.push("/admin/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/admin/login");
      } else {
        const data = await res.json();
        setError(data.error || "Setup failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-sm" style={{ color: "#8888a0" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0f" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h1 className="text-xl font-semibold mb-2 text-center" style={{ color: "#e8e8ec" }}>
          Initial Setup
        </h1>
        <p className="text-xs text-center mb-6" style={{ color: "#8888a0" }}>
          Create your admin account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "#0c0c14",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#e8e8ec",
              }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "#0c0c14",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#e8e8ec",
              }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "#0c0c14",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#e8e8ec",
              }}
            />
          </div>

          {error && (
            <div className="text-xs py-2 px-3 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ background: "#00c8e0", color: "#0a0a0f" }}
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
