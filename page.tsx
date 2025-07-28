import Image from "next/image";

export default function Home() {
  return (
    <main className="page-container">
      <div className="content-box">
        
        {/* تصویر دایره‌ای بالا */}
        <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
          <Image
            src="/image/nima-pic.png"
            alt="Nima Saraeian"
            width={160}
            height={280}
            className="profile-image"
            priority
          />
        </div>

        {/* نام با فونت خاص */}
        <h1 className="name-title">
          Nima Saraeian
        </h1>

        {/* متن توضیحات */}
        <p className="description">
          I'm a researcher and innovator in the field of digital psychology, deeply passionate about artificial intelligence and cognitive science.  
          As the founder of <strong>Selflyzer</strong>, I specialize in designing AI-powered psychometric systems to uncover emotional, behavioral, and cognitive patterns.
          <br /><br />
          With over a decade of experience in marketing, branding, and executive leadership, I've led large-scale teams, managed high-level strategies, and spoken at numerous industry events.  
          My background combines scientific exploration with real-world impact — helping people and businesses make smarter, more human-centered decisions.
        </p>

        {/* امضای پایین */}
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <Image
            src="/image/signature-white.png"
            alt="Signature"
            width={200}
            height={70}
            className="signature"
          />
        </div>
      </div>
    </main>
  );
}