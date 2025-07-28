'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function SeminarsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedImage(null);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [selectedImage]);

  // تولید خودکار لیست عکس‌ها
  const seminars = Array.from({ length: 29 }, (_, i) => ({
    id: i + 2,
    src: `/image/nimasaraeian${i + 2}.jpg`,
    title: `Seminar #${i + 2}`,
    date: 2025 - Math.floor(i / 3), // تاریخ نسبی فقط نمونه‌ای
    location: `Istanbul ${i + 2}`,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* بک‌گراند مدرن */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,transparent_70%)]"></div>

      {/* ذرات معلق */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        {/* هدر */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-snug drop-shadow-lg">
            International Seminars & Talks
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
            Presentations on <span className="font-semibold text-white">AI</span>, 
            <span className="font-semibold text-white"> Digital Psychology</span>, and 
            <span className="font-semibold text-white"> Innovation</span> across global conferences.
          </p>
        </div>

        {/* گالری */}
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
            {seminars.map((seminar, index) => (
              <div
                key={seminar.id}
                className="break-inside-avoid group cursor-pointer transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30"
                onClick={() => setSelectedImage(seminar.src)}
                style={{
                  animationDelay: `${index * 80}ms`,
                  opacity: 0,
                  animation: `fadeInUp 0.8s ease-out ${index * 80}ms forwards`
                }}
              >
                <div className="relative bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-2xl border border-white/10 backdrop-blur-lg overflow-hidden hover:border-white/30 transition-all duration-700">
                  <Image
                    src={seminar.src}
                    alt={seminar.title}
                    width={800}
                    height={600}
                    placeholder="blur"
                    blurDataURL="/seminars/placeholder.jpg"
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                    quality={85}
                  />
                  {/* اطلاعات روی عکس */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end">
                    <div className="p-5 text-white">
                      <h3 className="text-lg font-bold mb-2">{seminar.title}</h3>
                      <p className="text-sm text-gray-300">📅 {seminar.date} | 📍 {seminar.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* مودال */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl max-h-full">
              <Image
                src={selectedImage}
                alt="Seminar Image"
                width={1400}
                height={1000}
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/20"
                quality={95}
              />
              <button
                className="absolute top-6 right-6 w-12 h-12 bg-black/60 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 border border-white/20 text-xl font-bold"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
