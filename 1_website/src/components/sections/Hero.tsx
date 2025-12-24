"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
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
    <header className="pt-40 pb-24 text-center">
      <div className="container">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-full text-sm font-semibold text-[var(--accent-primary)] mb-7">
          <Sparkles className="w-3.5 h-3.5" />
          Coming Soon
        </div>

        {/* Title */}
        <h1 className="font-['Satoshi'] text-5xl md:text-6xl font-black mb-6 max-w-3xl mx-auto">
          Your personal advisor for the{" "}
          <span className="text-[var(--accent-primary)]">college journey</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
          Expert guidance, honest chance assessments, and a clear roadmap — all through a conversation with an AI that knows you.
        </p>

        {/* Email Collection */}
        <div id="waitlist" className="max-w-md mx-auto mb-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 rounded-full border border-[var(--border)] bg-white text-[var(--text-main)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--text-main)] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? "Joining..." : "Join Waitlist"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <div className="bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-2xl px-6 py-4 text-[var(--accent-primary)] font-medium">
              🎉 You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-16">
          <p className="text-sm text-[var(--text-light)]">
            Be the first to know when we launch. No spam, ever.
          </p>
        </div>

        {/* Screenshot - Responsive container */}
        <div className="hero-screenshot-wrapper max-w-[1000px] mx-auto">
          <div 
            className="hero-screenshot-container rounded-2xl overflow-hidden bg-white"
            style={{
              boxShadow: "0 40px 100px -30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)"
            }}
          >
            <div className="hero-screenshot-inner w-[1000px] h-[620px] origin-top-left">
              <iframe 
                src="/screenshots/hero-screenshot.html" 
                className="w-[1000px] h-[620px] border-none pointer-events-none"
                loading="lazy"
                scrolling="no"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Responsive scaling */}
      <style jsx>{`
        .hero-screenshot-wrapper {
          position: relative;
        }
        .hero-screenshot-container {
          position: relative;
        }
        .hero-screenshot-inner {
          transform: scale(1);
        }
        @media (max-width: 1048px) {
          .hero-screenshot-wrapper {
            height: calc(620px * 0.85);
          }
          .hero-screenshot-inner {
            transform: scale(0.85);
          }
        }
        @media (max-width: 850px) {
          .hero-screenshot-wrapper {
            height: calc(620px * 0.72);
          }
          .hero-screenshot-inner {
            transform: scale(0.72);
          }
        }
        @media (max-width: 650px) {
          .hero-screenshot-wrapper {
            height: calc(620px * 0.55);
          }
          .hero-screenshot-inner {
            transform: scale(0.55);
          }
        }
        @media (max-width: 520px) {
          .hero-screenshot-wrapper {
            height: calc(620px * 0.42);
          }
          .hero-screenshot-inner {
            transform: scale(0.42);
          }
        }
      `}</style>
    </header>
  );
}
