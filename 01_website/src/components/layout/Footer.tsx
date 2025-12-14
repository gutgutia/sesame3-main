export function Footer() {
  return (
    <footer className="py-16 border-t border-[var(--border)]">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-['Satoshi'] font-bold text-lg text-[var(--text-main)]">
          <div className="w-6 h-6 bg-[var(--accent-primary)] text-white rounded-md flex items-center justify-center text-[10px] font-bold">
            S3
          </div>
          Sesame3
        </div>
        
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
