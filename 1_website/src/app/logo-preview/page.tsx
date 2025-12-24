import { LogoMinimal } from "@/components/ui/Logo";

export default function LogoPreview() {
  // Font options to compare
  const fonts = [
    { name: "Inter", family: "'Inter', sans-serif", description: "Clean, neutral, highly legible. Already loaded on your site." },
    { name: "SF Pro (Apple)", family: "-apple-system, BlinkMacSystemFont, sans-serif", description: "Apple's system font. Elegant but only works on Apple devices." },
    { name: "Helvetica Neue", family: "'Helvetica Neue', Helvetica, sans-serif", description: "Classic, timeless. Available on most systems." },
    { name: "DM Sans", family: "'DM Sans', sans-serif", description: "Modern geometric with friendly curves. Would need to load." },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-20">
      {/* Load DM Sans for comparison */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap" rel="stylesheet" />
      
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="font-['Satoshi'] text-4xl font-bold mb-4 text-center">
          Logo Font Options
        </h1>
        <p className="text-center text-[var(--text-muted)] mb-4">
          Using 6px gap — comparing different fonts for the wordmark
        </p>
        <p className="text-center text-[var(--text-light)] text-sm mb-16">
          Note: You&apos;re viewing this on a Mac, so SF Pro will render. On other systems it falls back.
        </p>

        {/* Font comparison cards */}
        {fonts.map((font, i) => (
          <div key={i} className="bg-white rounded-3xl p-10 mb-6 border border-[var(--border)]">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-['Satoshi'] text-lg font-bold">{font.name}</h2>
              <span className="text-xs bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-[var(--text-muted)]">
                Option {String.fromCharCode(65 + i)}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm mb-8">{font.description}</p>
            
            {/* Large */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5">
                <LogoMinimal size={48} />
                <span 
                  className="font-bold text-3xl text-[var(--text-main)]" 
                  style={{ fontFamily: font.family }}
                >
                  Sesame3
                </span>
              </div>
            </div>
            
            {/* Medium & Small */}
            <div className="flex gap-12">
              <div className="flex items-center gap-1.5">
                <LogoMinimal size={32} />
                <span 
                  className="font-bold text-2xl text-[var(--text-main)]" 
                  style={{ fontFamily: font.family }}
                >
                  Sesame3
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <LogoMinimal size={24} />
                <span 
                  className="font-bold text-lg text-[var(--text-main)]" 
                  style={{ fontFamily: font.family }}
                >
                  Sesame3
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Dark background comparison */}
        <div className="bg-[var(--text-main)] rounded-3xl p-10 mb-8">
          <h2 className="font-['Satoshi'] text-lg font-bold mb-8 text-white">On Dark Background</h2>
          
          <div className="grid grid-cols-2 gap-8">
            {fonts.map((font, i) => (
              <div key={i}>
                <p className="text-white/50 text-xs mb-3">{font.name}</p>
                <div className="flex items-center gap-1.5">
                  <LogoMinimal size={32} />
                  <span 
                    className="font-bold text-2xl text-white" 
                    style={{ fontFamily: font.family }}
                  >
                    Sesame3
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--accent-surface)] border border-[var(--accent-border)] rounded-2xl p-8 text-center">
          <p className="text-[var(--text-main)]">
            Pick a font (A: Inter, B: SF Pro, C: Helvetica Neue, D: DM Sans) and I&apos;ll update all logos.
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Recommendation: <strong>Inter</strong> — it&apos;s already loaded, works everywhere, and looks great.
          </p>
        </div>
      </div>
    </div>
  );
}
