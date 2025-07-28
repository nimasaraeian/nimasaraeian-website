// app/seminars/SeminarsClient.tsx
"use client";

import Image from "next/image";

const images = [
  { src: "/image/nimasaraeian2.jpg", alt: "Seminar 2" },
  { src: "/image/nimasaraeian3.jpg", alt: "Seminar 3" },
  { src: "/image/nimasaraeian4.jpg", alt: "Seminar 4" },
  { src: "/image/nimasaraeian5.jpg", alt: "Seminar 5" },
  { src: "/image/nimasaraeian6.jpg", alt: "Seminar 6" },
  { src: "/image/nimasaraeian7.jpg", alt: "Seminar 7" },
  { src: "/image/nimasaraeian8.jpg", alt: "Seminar 8" },
  { src: "/image/nimasaraeian9.jpg", alt: "Seminar 9" }
];

export default function SeminarsClient() {
  return (
    <div className="main" style={{ paddingTop: '120px' }}>
      <div>
        <h1 style={{ color: '#ffffff', fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          Seminars & Speaking Events
        </h1>
        
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div key={index} className="gallery-item">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                loading="lazy"
                quality={75}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}