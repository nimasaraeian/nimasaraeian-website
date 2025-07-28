import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-gray-800/20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Profile Image with Glow Effect */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full blur-2xl opacity-30 scale-110"></div>
            <Image
              src="/image/nima-pic.png"
              alt="Nima Saraeian"
              width={200}
              height={200}
              className="relative z-10 rounded-full mx-auto shadow-2xl border-4 border-white/20 grayscale"
              priority
            />
          </div>

          {/* Name with Animated Text */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Nima Saraeian
          </h1>

          {/* Professional Title */}
          <div className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
            AI Researcher • Digital Psychologist • Founder of 
            <span className="text-gray-200 font-semibold"> Selflyzer</span>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Pioneering the intersection of artificial intelligence and human psychology to decode emotional, 
            behavioral, and cognitive patterns. With over a decade of experience in transformative leadership 
            and innovation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/projects" className="group px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full text-white font-semibold text-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
              Explore Projects
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link href="/articles" className="px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Read Articles
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gray-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">12+</div>
              <div className="text-gray-400 text-lg">Years Experience</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-gray-400 text-lg">Research Projects</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="text-gray-400 text-lg">Innovation Potential</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">1</div>
              <div className="text-gray-400 text-lg">Selflyzer Platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
            Featured Work
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Selflyzer Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">Selflyzer</h3>
              <p className="text-gray-300 mb-6">AI-powered psychometric platform for deep personality and behavioral analysis.</p>
              <Link href="/projects" className="text-gray-200 hover:text-white font-semibold group-hover:underline">
                Learn More →
              </Link>
            </div>

            {/* Research Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">Digital Psychology</h3>
              <p className="text-gray-300 mb-6">Groundbreaking research in AI applications for psychological assessment.</p>
              <Link href="/articles" className="text-gray-200 hover:text-white font-semibold group-hover:underline">
                Read Research →
              </Link>
            </div>

            {/* Speaking Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">Speaking</h3>
              <p className="text-gray-300 mb-6">International conferences on AI, psychology, and digital transformation.</p>
              <Link href="/seminars" className="text-gray-200 hover:text-white font-semibold group-hover:underline">
                View Seminars →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900/30 to-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Collaborate</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Interested in AI-driven psychology research, innovative projects, or speaking opportunities?
          </p>
          <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full text-white font-semibold text-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
            Get In Touch
            <span className="ml-2">✉️</span>
          </Link>
        </div>
      </section>

      {/* Signature */}
      <section className="py-12 text-center">
        <Image
          src="/image/signature-white.png"
          alt="Nima Saraeian Signature"
          width={250}
          height={80}
          className="mx-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
        />
      </section>
    </main>
  );
}