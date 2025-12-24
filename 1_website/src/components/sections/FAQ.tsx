const faqs = [
  {
    question: "Is this replacing my school counselor?",
    answer: "No — think of us as an always-available supplement. Your school counselor knows your school context; we know the broader admissions landscape and can give you unlimited personalized attention.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer: "ChatGPT doesn't know you. Sesame3 builds a complete profile of your academics, activities, goals, and preferences — and every answer is tailored to YOUR situation, not generic advice.",
  },
  {
    question: "What grade should I start?",
    answer: "The earlier the better — 9th and 10th graders can build a strong foundation. But even if you're a junior or senior, we'll help you make the most of the time you have.",
  },
  {
    question: "Is my data safe?",
    answer: "Absolutely. We never share or sell your information. Your essays, conversations, and profile are private and encrypted. We're here to help you, not monetize your data.",
  },
  {
    question: "How accurate are the chance estimates?",
    answer: "Our estimates are based on publicly available admission data and common admit profiles. They're directional guidance — not guarantees — designed to help you build a realistic, balanced school list.",
  },
  {
    question: "When is Sesame3 launching?",
    answer: "We're launching soon! Join the waitlist to be the first to know. Early waitlist members may get exclusive perks and early access.",
  },
  {
    question: "Will there be a free option?",
    answer: "Yes, we're planning a generous free tier. The core experience — advisor, chances, school list, roadmap — will be free. Premium features will be available for those who want more.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-[var(--bg-secondary)]">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-4">
            Questions
          </p>
          <h2 className="font-['Satoshi'] text-4xl font-bold">
            Frequently asked
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-7">
              <h3 className="font-['Satoshi'] text-lg font-bold mb-3">
                {faq.question}
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
