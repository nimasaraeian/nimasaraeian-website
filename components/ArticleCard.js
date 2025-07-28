// components/ArticleCard.tsx

import React from 'react';

type ArticleCardProps = {
  title: string;
  summary: string;
  link: string;
  gradient: [string, string];
};

const ArticleCard: React.FC<ArticleCardProps> = ({ title, summary, link, gradient }) => {
  return (
    <a
      href={link}
      className="block rounded-xl p-6 text-white hover:scale-[1.02] transition"
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-white/90">{summary}</p>
    </a>
  );
};

export default ArticleCard;
