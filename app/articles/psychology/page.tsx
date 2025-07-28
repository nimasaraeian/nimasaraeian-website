// /app/articles/academic/page.tsx

import Link from "next/link";

export default function AcademicArticlesPage() {
  const sections = [
    { slug: "A", label: "A – Artificial Intelligence & Psychology" },
    { slug: "B", label: "B – Behavioral Data Analysis" },
    { slug: "C", label: "C – Cognitive Science & Models" },
    { slug: "D", label: "D – Deep Learning in Mental Health" },
    { slug: "E", label: "E – Emotional and Sentiment Mining" },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Academic Articles</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {sections.map(({ slug, label }) => (
          <Link
            key={slug}
            href={`/articles/academic/${slug.toLowerCase()}`}
            className="block border border-gray-700 hover:bg-gray-800 rounded-lg p-5 transition"
          >
            <span className="text-xl font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
