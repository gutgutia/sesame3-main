"use client";

import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-5 bg-[var(--bg-page)]/85 backdrop-blur-md border-b border-black/5">
      <div className="container flex justify-between items-center">
        <a href="#" className="flex items-center gap-2.5 font-['Satoshi'] font-extrabold text-2xl text-[var(--text-main)]">
          <div className="w-8 h-8 bg-[var(--accent-primary)] text-white rounded-lg flex items-center justify-center text-sm font-bold">
            S3
          </div>
          Sesame3
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="/#how" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            How It Works
          </a>
          <a href="/#features" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            Features
          </a>
          <a href="/#pricing" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            Pricing
          </a>
          <a href="/about" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" href="#">Log in</Button>
          <Button variant="primary" size="sm" href="#">Get Started Free</Button>
        </div>
      </div>
    </nav>
  );
}
