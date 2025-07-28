import Image from "next/image";

const IntroSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-zinc-900 to-black" id="about">
      <div className="max-w-3xl mx-auto text-center px-6">
        <Image
          src="/image/nima-pic.png"
          alt="Nima Saraeian"
          width={160}
          height={160}
          className="mx-auto rounded-full mb-6 border border-white filter grayscale"
        />

        <h2
          className="text-4xl sm:text-5xl font-bold text-white mb-6"
          style={{ fontFamily: 'Times New Roman', fontStyle: 'italic' }}
        >
          Nima Saraeian
        </h2>

        <p
          className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-8"
          style={{ fontFamily: 'Times New Roman', fontStyle: 'italic' }}
        >
          I'm a researcher and innovator in the field of digital psychology, deeply passionate about artificial intelligence and cognitive science.  
          As the founder of <span className="font-semibold text-white">Selphlyze</span>, I specialize in designing AI-powered psychometric systems to uncover emotional, behavioral, and cognitive patterns.  
          <br /><br />
          With over a decade of experience in marketing, branding, and executive leadership, I’ve led large-scale teams, managed high-level strategies, and spoken at numerous industry events.  
          My background combines scientific exploration with real-world impact — helping people and businesses make smarter, more human-centered decisions.
        </p>

        <Image
          src="/image/signature-white.png"
          alt="Nima Signature"
          width={200}
          height={80}
          className="mx-auto mt-8 drop-shadow-[0_1px_6px_rgba(255,255,255,0.5)]"
        />
      </div>
    </section>
  );
};

export default IntroSection;
