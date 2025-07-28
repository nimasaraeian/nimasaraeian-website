'use client'

import Link from 'next/link'

const featuredArticles = [
  {
    id: 1,
    title: 'SELFLYZER and the Future of Digital Psychology',
    summary: 'An AI-powered framework for decoding the emotional and cognitive patterns.',
    image: '/article1.jpg',
    link: '/articles/selflyzer'
  },
  {
    id: 2,
    title: 'Jungian Shadow in Consumer Behavior',
    summary: 'Exploring how unconscious patterns affect decision-making.',
    image: '/article2.jpg',
    link: '/articles/shadow'
  }
]

const shortNotes = [
  {
    id: 1,
    date: 'June 29, 2025',
    content: 'Today I explored the correlation between digital habits and anxiety. Will analyze it deeper soon...'
  },
  {
    id: 2,
    date: 'June 28, 2025',
    content: 'Sketching a new module for PsyClock++ about emotional peaks during weekdays.'
  }
]

export default function HeroLanding() {
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto text-white">
      {/* معرفی اصلی */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to My Research World</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Dive into my curated collection of psychological-AI articles and personal reflections as a digital psychology researcher.
        </p>
      </section>

      {/* مقالات برجسته */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-6">Featured Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredArticles.map(article => (
            <Link key={article.id} href={article.link}>
              <div className="bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-400">{article.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* یادداشت‌های کوتاه روزانه */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Personal Research Notes</h2>
        <div className="space-y-4">
          {shortNotes.map(note => (
            <div key={note.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">{note.date}</p>
              <p className="text-gray-300 mt-1">{note.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
