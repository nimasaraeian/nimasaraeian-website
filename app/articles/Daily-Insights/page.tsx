import Link from "next/link";

export default function DailyArticlesPage() {
  const topics = [
    { slug: "developmental", label: "Developmental Psychology" },
    { slug: "social", label: "Social Psychology" },
    { slug: "cognitive", label: "Cognitive Psychology" },
    { slug: "emotional", label: "Emotional Psychology" },
    { slug: "personality", label: "Personality Psychology" },
    { slug: "behavioral", label: "Behavioral Psychology" },
    { slug: "neuro", label: "Neuropsychology" },
    { slug: "positive", label: "Positive Psychology" },
    { slug: "existential", label: "Existential Psychology" },
    { slug: "consumer", label: "Consumer Psychology" },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Daily Psychology Insights</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {topics.map(({ slug, label }) => (
          <Link
            key={slug}
            href={`/articles/daily/${slug}`}
            className="block border border-gray-700 hover:bg-gray-800 rounded-lg p-5 transition"
          >
            <span className="text-lg font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
