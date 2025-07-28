export default function ResumePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Resume</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>PhD (in progress)</strong> – Focus: Digital Psychology & AI
            </li>
            <li>
              <strong>M.Sc in E-Commerce</strong> – University of Azarbaijan
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <ul className="list-disc list-inside">
            <li>Founder of Selphlyze – AI-powered psychological profiling platform</li>
            <li>12+ years in Marketing, Branding, and Sales Management</li>
            <li>Former Sales Manager at Golnab Company (PVC Film)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <ul className="list-disc list-inside">
            <li>AI & NLP for Psychology</li>
            <li>Data Analysis & Statistics</li>
            <li>WordPress, Photoshop, UX/UI, PowerPoint</li>
            <li>Public Speaking, Writing, and Research</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Publications</h2>
          <p>
            <em>
              SELPHLYZE-Enabled Deep Trace: Unveiling the Jungian Shadow through AI to Predict Consumer Behavior
            </em>{" "}
            – 2025, Submitted to *Frontiers in Psychology*
          </p>
        </section>
      </div>
    </main>
  );
}
