"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch("https://formspree.io/f/mojazpwv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[var(--bg-page)]">
      <div className="container">
        <div className="relative bg-gradient-to-br from-[var(--text-main)] to-[#1a1a1a] rounded-[32px] px-10 py-20 text-center overflow-hidden">
          {/* Glow effects */}
          <div className="absolute w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-15 blur-3xl rounded-full -top-[200px] -left-[100px]" />
          <div className="absolute w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-15 blur-3xl rounded-full -bottom-[200px] -right-[100px]" />

          <h2 className="font-['Satoshi'] text-4xl md:text-5xl font-bold text-white mb-5 relative">
            Be the first to know
          </h2>
          <p className="text-lg text-white/70 max-w-md mx-auto mb-10 relative">
            We&apos;re launching soon. Join the waitlist to get early access and exclusive updates.
          </p>
          
          <div className="max-w-md mx-auto relative">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-light)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-full bg-white text-[var(--text-main)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-[var(--text-main)] font-semibold rounded-full hover:bg-[var(--bg-secondary)] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 text-white font-medium">
                🎉 You&apos;re on the list! We&apos;ll be in touch soon.
              </div>
            )}
          </div>

          <p className="text-sm text-white/50 mt-6 relative">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
