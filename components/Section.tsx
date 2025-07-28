// components/Section.tsx

import Link from "next/link";

type Card = {
  title: string;
  image: string;
  href: string;
};

type SectionProps = {
  title: string;
  description: string;
  background: string;
  cards: Card[];
};

export default function Section({ title, description, background, cards }: SectionProps) {
  return (
    <section className={`bg-gradient-to-b ${background} px-6 py-16`}>
      <div className="flex items-center justify-center mb-10">
        <div className="border-t border-gray-700 w-1/5" />
        <h2 className="mx-4 text-3xl font-bold text-white whitespace-nowrap">{title}</h2>
        <div className="border-t border-gray-700 w-1/5" />
      </div>
      <p className="text-center text-lg text-gray-400 mb-12">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <Link key={index} href={card.href}>
            <div className="bg-zinc-900 rounded-lg overflow-hidden shadow hover:shadow-xl transition">
              <img src={card.image} alt={card.title} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="text-sm text-gray-300 mt-2">Read more about {card.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
