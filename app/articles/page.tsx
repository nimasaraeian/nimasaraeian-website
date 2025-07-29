"use client";

import WaveSeparator from "@/components/WaveSeparator";
import Link from "next/link";
import { title } from "process";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Articles</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Exploring the intersection of AI, psychology, and human behavior through research and insights.
          </p>
        </div>

        {/* بخش اول: AI Articles */}
        <Section
          title="AI Articles"
          description="Explore insights and deep dives in artificial intelligence."
          cards={[
            { title: "Emotion AI", image: "/image/emotionai.JPG", href: "/articles/ai/emotion-ai" },
            { title: "Personality Models", image: "/image/personalitymodules.JPG", href: "/articles/ai/personality-models" },
            { title: "Psychometrics", image: "/image/psychometrics.JPG", href: "/articles/ai/psychometrics" },
            { title: "Neural Feedback", image: "/image/Neuralfeedback.jpg", href: "/articles/ai/neural-feedback" },
            { title: "Ethics", image: "/image/Ethics.jpg", href: "/articles/ai/ethics" },
            { title: "EmoConnect", image: "/image/emoconnectjpg.jpg", href: "/articles/ai/emoconnect" },
            { title: "SelfCode", image: "/image/selfCode.jpg", href: "/articles/ai/selfCode" },
            { title: "Aesthlyzer", image: "/image/aesthlyzerjpg.jpg", href: "/articles/ai/aesthlyzer" },
            { title: "Chrono Forecast", image: "/image/ChronoForecast.jpg", href: "/articles/ai/chrono-forecast" },
            { title: "AI-Powered Content Specialist", image: "/image/AI-Powered Content Specialist.jpg", href: "/articles/ai/ai-powered-content-specialist" },
          ]}
          bgColor="from-gray-900 to-gray-800"
          borderColor="border-blue-500/30"
        />

        <WaveSeparator flip />

        {/* بخش دوم: Psychology Articles */}
        <Section
          title="Psychology Articles"
          description="Explore insights and deep dives in psychology."
          cards={[
            { title: "Mental Health", image: "/image/mentalhealth.jpg", href: "/articles/psychology/mental-health" },
            { title: "Personality", image: "/image/personality.JPG", href: "/articles/psychology/personality" },
            { title: "Emotional Intelligence", image: "/image/EmotionalIntelligence.JPG", href: "/articles/psychology/emotional-intelligence" },
            { title: "Therapy", image: "/image/therapy.jpg", href: "/articles/psychology/therapy" },
            { title: "Biases", image: "/image/biases.jpg", href: "/articles/psychology/biases" },
            { title: "EmoConnect", image: "/image/emoconnectjpg.jpg", href: "/articles/psychology/emoconnect" },
            { title: "Selflyzer Trace", image: "/image/Who am I_.jpg", href: "/articles/psychology/selflyzer-trace" },
            { title: "Aesthlyzer", image: "/image/aesthlyzerjpg.jpg", href: "/articles/psychology/aesthlyzer" },
            { title: "Chrono Forecast", image: "/image/ChronoForecast.jpg", href: "/articles/ai/chrono-forecast" },
            { title: "Shadow Trace", image: "/image/ShadowTrace.jpg", href: "/articles/psychology/shadow-trace" },
          ]}
          bgColor="from-purple-900/20 to-gray-900"
          borderColor="border-purple-500/30"
        />

        <WaveSeparator />

        {/* بخش سوم: Marketing Articles */}
        <Section
          title="Marketing Articles"
          description="Explore insights and deep dives in marketing."
          cards={[
            { title: "Consumer Behavior", image: "/image/ConsumerBehavior.jpg", href: "/articles/marketing/consumer-behavior" },
            { title: "Brand Identity", image: "/image/brandidentity.JPG", href: "/articles/marketing/brand-identity" },
            { title: "Emotional Marketing", image: "/image/emotionalmarketing.jpg", href: "/articles/marketing/emotional-marketing" },
            { title: "Neuromarketing", image: "/image/neuromarketing.jpg", href: "/articles/marketing/neuromarketing" },
            { title: "UX & Psychology", image: "/image/UXPsychology.jpg", href: "/articles/marketing/ux-psychology" },
          ]}
          bgColor="from-green-900/20 to-gray-900"
          borderColor="border-green-500/30"
        />

        <WaveSeparator flip />

        {/* بخش چهارم: Daily Articles */}
        <Section
          title="Daily Articles"
          description="Explore insights and deep dives in daily life."
          cards={[
            { title: "Mood", image: "/image/mood.JPG", href: "/articles/daily/mood" },
            { title: "Habits", image: "/image/habits.JPG", href: "/articles/daily/habits" },
            { title: "Journals", image: "/image/journals.jpg", href: "/articles/daily/journals" },
            { title: "Social", image: "/image/social.jpg", href: "/articles/daily/social" },
            { title: "Triggers", image: "/image/triggers.jpg", href: "/articles/daily/triggers" },
          ]}
          bgColor="from-yellow-900/20 to-gray-900"
          borderColor="border-yellow-500/30"
        />
      </div>
    </main>
  );
}

function Section({ title, description, cards, bgColor, borderColor }: {
  title: string;
  description: string;
  cards: { title: string; image: string; href: string }[];
  bgColor: string;
  borderColor: string;
}) {
  return (
    <section className={`mb-20 p-6 sm:p-8 bg-gradient-to-br ${bgColor} rounded-2xl border ${borderColor} shadow-lg`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white uppercase tracking-wide">
        {title}
      </h2>
      <p className="text-center text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.href}>
            <div className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-700 hover:border-gray-500">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  Read more about {card.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
