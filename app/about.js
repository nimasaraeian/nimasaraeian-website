import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row gap-8">
        
        {/* تصویر */}
        <div className="flex justify-center lg:justify-start">
          <img
            src="/images/about-nima.jpg"
            alt="Nima Saraeian"
            className="rounded-xl w-80 h-auto object-cover shadow-lg"
          />
        </div>

        {/* متن */}
        <div className="text-left space-y-4">
          <h2 className="text-3xl font-bold text-white">About Me</h2>
          <p className="text-gray-300">
            I’m <strong>Nima Saraeian</strong>, a researcher, entrepreneur, and visionary in the intersection of
            <em> digital psychology, artificial intelligence, and consumer behavior science</em>. Over the past decade, I have
            dedicated my life to understanding how minds operate in the digital age — how emotions, thoughts, and
            decisions unfold within people as they engage with technology.
          </p>
          <p className="text-gray-300">
            I am the founder of <strong>Selphlyze</strong>, an AI-powered psychological ecosystem that maps human emotions,
            cognitive traits, and behavioral patterns to generate a unique <em>SelfCode</em> for each user. This platform is
            built upon advanced psychological models (including Jungian Shadow Theory, Big Five, Emotional Intelligence,
            Cognitive Tempo, and more), and integrates them with data science and predictive analytics to offer
            practical applications in mental health, HR, education, and digital well-being.
          </p>
          <p className="text-gray-300">
            With a Master’s degree in E-Commerce and over 12 years of executive and research experience in branding,
            marketing, and human-centric design, my work now focuses on merging business psychology with AI. I’ve
            authored multiple academic papers and designed innovative psychometric tools using multimodal AI, including
            <em> ShadowTrace, FutureTrace, PsyClock, and Joblyzer</em>.
          </p>
          <p className="text-gray-300">
            My mission is to bridge the gap between the inner world of the human mind and the outer world of intelligent
            systems — not just to predict behavior, but to understand it deeply, ethically, and insightfully. This website
            showcases not only who I am, but also the vision I’m building through <strong>Selphlyze</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
