import { Check, X, Info } from "lucide-react";
import { Button } from "../ui/Button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For students exploring their options",
    features: [
      { text: "20 AI messages per week", included: true },
      { text: "Profile building", included: true },
      { text: "School discovery", included: true },
      { text: "Up to 3 schools on your list", included: true },
      { text: "Basic chances (Reach/Target/Safety)", included: true },
      { text: "Basic roadmap & tasks", included: true },
      { text: "Voice chat", included: false },
      { text: "Essay review", included: false },
      { text: "Shared access", included: false },
    ],
    cta: "Join Waitlist",
    ctaVariant: "secondary" as const,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    description: "For serious applicants ready to go all-in",
    badge: "Most Popular",
    featured: true,
    features: [
      { text: "Unlimited AI messages", included: true, bold: true },
      { text: "Profile building", included: true },
      { text: "School discovery", included: true },
      { text: "Unlimited schools on your list", included: true, bold: true },
      { text: "Detailed chances with % breakdown", included: true, bold: true },
      { text: "Smart roadmap with AI suggestions", included: true, bold: true },
      { text: "Voice chat", included: true },
      { text: "Essay review & feedback", included: true },
      { text: "Share with parents & counselors", included: true },
    ],
    cta: "Join Waitlist",
    ctaVariant: "primary" as const,
    annual: "Or $149/year (save 2 months)",
  },
  {
    name: "Senior Year Pass",
    price: "$99",
    period: "one-time",
    description: "For 12th graders in crunch mode",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Full access for senior year", included: true },
      { text: "No monthly payments", included: true },
      { text: "Application season covered", included: true },
    ],
    cta: "Join Waitlist",
    ctaVariant: "secondary" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-[var(--border)]">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-4">
            Planned Pricing
          </p>
          <h2 className="font-['Satoshi'] text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-[var(--text-muted)]">
            Here&apos;s what we&apos;re planning. Early waitlist members may get special perks.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 flex flex-col relative ${
                plan.featured
                  ? "bg-[var(--text-main)] text-white scale-105 shadow-xl"
                  : "bg-[var(--bg-secondary)]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent-primary)] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-center pb-6 border-b border-black/10 mb-6">
                {plan.featured && <div className="border-white/20" />}
                <h3 className="font-['Satoshi'] text-xl font-bold mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="font-['Satoshi'] text-5xl font-black">
                    {plan.price}
                  </span>
                  <span className={plan.featured ? "text-white/70" : "text-[var(--text-muted)]"}>
                    {plan.period}
                  </span>
                </div>
                <p className={plan.featured ? "text-white/70 text-sm" : "text-[var(--text-muted)] text-sm"}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className={`flex items-start gap-3 text-sm ${
                      !feature.included ? (plan.featured ? "text-white/40" : "text-[var(--text-light)]") : ""
                    }`}
                  >
                    {feature.included ? (
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.featured ? "text-green-400" : "text-[var(--accent-primary)]"}`} />
                    ) : (
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--text-light)]" />
                    )}
                    <span className={"bold" in feature && feature.bold ? "font-semibold" : ""}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.featured ? "white" : plan.ctaVariant}
                href="#waitlist"
                className="w-full"
              >
                {plan.cta}
              </Button>

              {plan.annual && (
                <p className="text-center text-xs text-white/60 mt-3">
                  {plan.annual}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-sm">
          <Info className="w-4 h-4 text-[var(--accent-primary)]" />
          <p>Join the waitlist to be notified when we launch. Early members may get exclusive perks.</p>
        </div>
      </div>
    </section>
  );
}
