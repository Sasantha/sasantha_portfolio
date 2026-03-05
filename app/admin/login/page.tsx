"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Login failed");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-md space-y-6 border border-slate-200 bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p className="text-sm text-slate-600">Enter your admin password to continue.</p>
      </header>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-900"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
