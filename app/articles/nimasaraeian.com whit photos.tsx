'use client';

import WaveSeparator from '../../components/WaveSeparator';
import Section from '@/components/Section';

export default function NimaSaraeianWithPhotos() {
  const cards = [
    {
      title: 'About Me',
      image: '/image/aboutme.jpg',
      href: '/about',
    },
    {
      title: 'Projects',
      image: '/image/projects.jpg',
      href: '/projects',
    },
    {
      title: 'Psychology',
      image: '/image/psychology.JPG',
      href: '/articles/psychology',
    },
    {
      title: 'Marketing',
      image: '/image/marketing.JPG',
      href: '/articles/marketing',
    },
    {
      title: 'AI & Digital Psychology',
      image: '/image/ai.JPG',
      href: '/articles/ai',
    },
    {
      title: 'Daily Insights',
      image: '/image/daily.JPG',
      href: '/articles/daily',
    },
  ];

  return (
    <>
      <WaveSeparator />
      <Section
        title="Nima Saraeian"
        description="Explore the world of psychology, AI, digital behavior and marketing with a visual journey through Nima Saraeian’s work and ideas."
        background="from-black to-zinc-900"
        cards={cards}
      />
    </>
  );
}
