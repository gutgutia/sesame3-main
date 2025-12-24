import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="py-16 border-t border-[var(--border)]">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <a href="/">
          <Logo size="sm" />
        </a>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <a href="/about" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            About
          </a>
          <a href="/privacy" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            Privacy
          </a>
          <a href="/terms" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            Terms
          </a>
          <a href="mailto:hello@sesame3.com" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            Contact
          </a>
        </div>

        <p className="text-sm text-[var(--text-light)]">
          © 2025 Sesame3
        </p>
      </div>
    </footer>
  );
}
