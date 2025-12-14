import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Lightbulb, Shield, Users } from "lucide-react";

export const metadata = {
  title: "About Us — Sesame3",
  description: "Built by a student and his dad to solve a problem they were living through.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-4">
              Our Story
            </p>
            <h1 className="font-['Satoshi'] text-4xl md:text-5xl font-bold mb-6">
              Built by a student,<br />for students
            </h1>
            <p className="text-xl text-[var(--text-muted)] leading-relaxed">
              Sesame3 started with a simple question: why is getting good college advice so hard?
            </p>
          </div>

          {/* The Story */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="bg-[var(--bg-secondary)] rounded-3xl p-10 md:p-14">
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-[var(--text-main)]">
                  I&apos;m a high school student. When I started thinking seriously about college, 
                  I realized the options for guidance weren&apos;t great.
                </p>
                
                <p className="text-[var(--text-muted)]">
                  My school counselor is amazing — but she has hundreds of students. Private counselors? 
                  They cost more than a used car. And ChatGPT gives the same generic advice to everyone, 
                  because it doesn&apos;t actually know anything about me.
                </p>

                <p className="text-[var(--text-muted)]">
                  I wanted something that could actually understand my situation — my grades, my activities, 
                  what I care about — and give me real, honest guidance. Not generic tips I could find on 
                  Reddit. Not sugar-coated nonsense. Real talk about where I stand and what I should do.
                </p>

                <p className="text-[var(--text-main)] font-medium">
                  So my dad and I decided to build it.
                </p>

                <p className="text-[var(--text-muted)]">
                  He&apos;s spent his career building products and knows how to make things work. 
                  I&apos;m the one actually going through this process, so I know what students need. 
                  Together, we&apos;re creating the advisor I wish I had from the start.
                </p>

                <p className="text-[var(--text-muted)]">
                  And yes — I&apos;m using Sesame3 for my own college applications. If it&apos;s not 
                  good enough for me, it&apos;s not good enough for you.
                </p>
              </div>
            </div>
          </div>

          {/* The Team */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="font-['Satoshi'] text-2xl font-bold text-center mb-10">
              The Team
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Son */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-[var(--accent-surface)] rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">👨‍💻</span>
                </div>
                <h3 className="font-['Satoshi'] text-xl font-bold mb-1">
                  [Son&apos;s Name]
                </h3>
                <p className="text-[var(--accent-primary)] font-medium text-sm mb-4">
                  Co-founder & Chief User
                </p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  High school student. The one actually living through this process. 
                  Makes sure Sesame3 solves real problems, not imaginary ones. 
                  Currently using the product to build his own college list.
                </p>
              </div>

              {/* Dad */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-[var(--accent-surface)] rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">👨‍👦</span>
                </div>
                <h3 className="font-['Satoshi'] text-xl font-bold mb-1">
                  [Dad&apos;s Name]
                </h3>
                <p className="text-[var(--accent-primary)] font-medium text-sm mb-4">
                  Co-founder & Chief Worrier
                </p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  Parent of a high schooler. Has built products for millions of users. 
                  Brings the experience to make this work. 
                  Still figuring out how to not hover.
                </p>
              </div>
            </div>
          </div>

          {/* Why We're Different */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="font-['Satoshi'] text-2xl font-bold text-center mb-10">
              Why We&apos;re Different
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 bg-white border border-[var(--border)] rounded-xl">
                <div className="w-11 h-11 bg-[var(--accent-surface)] rounded-xl flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Satoshi'] font-bold mb-1">We have skin in the game</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    We&apos;re not a VC-funded startup chasing metrics. We&apos;re a family building something 
                    we actually need. Our success is tied to yours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white border border-[var(--border)] rounded-xl">
                <div className="w-11 h-11 bg-[var(--accent-surface)] rounded-xl flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Satoshi'] font-bold mb-1">Built by a student</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Most ed-tech is built by adults guessing what students want. 
                    We have an actual student making product decisions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white border border-[var(--border)] rounded-xl">
                <div className="w-11 h-11 bg-[var(--accent-surface)] rounded-xl flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Satoshi'] font-bold mb-1">Privacy-first</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    We&apos;re not selling your data. We&apos;re not showing you ads. 
                    We built this for our own kid — we take privacy seriously.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white border border-[var(--border)] rounded-xl">
                <div className="w-11 h-11 bg-[var(--accent-surface)] rounded-xl flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-['Satoshi'] font-bold mb-1">No gatekeeping</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Good guidance shouldn&apos;t cost $10,000 or require knowing the right people. 
                    We want to level the playing field.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Meta Note */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[var(--accent-surface)] to-[#F0FAF8] border border-[var(--accent-border)] rounded-2xl p-8 text-center">
              <p className="text-lg text-[var(--text-main)] leading-relaxed mb-4">
                &quot;Yes, I&apos;m using Sesame3 for my own college applications. 
                And yes, I&apos;ll probably write about building it in my essays. 
                Is that cheating? I prefer to call it <em>demonstrating product-market fit</em>.&quot;
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                — The student co-founder
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
