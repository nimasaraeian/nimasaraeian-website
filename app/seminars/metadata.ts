// app/seminars/metadata.ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seminars by Nima Saraeian | Gallery',
  description: 'Explore seminars and conferences attended by Nima Saraeian with full photo gallery.',
  openGraph: {
    title: 'Seminars Gallery - Nima Saraeian',
    description: 'Professional presentations and seminars of Nima Saraeian.',
    url: 'https://www.nimasaraeian.com/seminars',
    siteName: 'Nima Saraeian',
    images: [
      {
        url: '/image/nimasaraeian2.jpg',
        width: 1200,
        height: 630,
        alt: 'Nima Saraeian Seminar',
      },
    ],
    type: 'website',
  },
  robots: 'index, follow',
};
