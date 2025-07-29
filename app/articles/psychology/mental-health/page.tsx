'use client'
import Image from 'next/image'

export default function MentalHealthPage() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-20">
      <h1 className="text-4xl font-bold text-gray-300 mb-6">
        Mental Health Trends in 2025: A European & Global Perspective
      </h1>

      <div className="flex items-center text-sm text-gray-100 mb-10">
        <p className="mr-4">By <span className="font-semibold">Nima Saraian</span></p>
        <p>July 29, 2025</p>
      </div>

      {/* Cover Image */}
      <div className="mb-10">
        <Image
          src="/image/mentalhealth.jpg"
          alt="Mental Health 2025"
          width={400}
          height={200}
          className="rounded-2xl shadow-lg"
        />
      </div>

      <article className="prose prose-lg lg:prose-xl prose-gray leading-relaxed">
        <p>
          In 2025, mental health has moved from the margins of public discourse into a central pillar of global
          health and social policy. Nearly half of Europeans (46%) reported experiencing an emotional or psychosocial
          problem such as anxiety, depression, or stress-related conditions over the past year. These figures represent
          not just individual struggles but a systemic challenge that affects workplaces, education systems, healthcare delivery,
          and even economic productivity on a continental scale.
        </p>

        <p>
          The global recognition of mental health as a strategic priority reflects an urgent need to address not only
          clinical symptoms but also the broader social and digital contexts that shape mental wellbeing. Across Europe,
          governments, universities, NGOs, and tech companies are converging on the idea that mental health should no
          longer be seen merely as a matter for psychiatrists and psychologists but as a shared responsibility involving
          families, schools, workplaces, and digital platforms.
        </p>

        <h2>Integrating Mental Health into Everyday Care</h2>
        <p>
          One of the most transformative changes unfolding in 2025 is the integration of mental healthcare into
          primary health services. The World Health Organization (WHO) Regional Office for Europe published a groundbreaking
          policy paper in April 2025, highlighting the urgent need to move beyond the fragmented model of specialist-only care.
          The paper outlines practical steps such as training general practitioners to recognize early signs of depression
          and anxiety, embedding psychologists and counselors directly within community clinics, and establishing referral systems
          that ensure patients receive timely, comprehensive support rather than languishing on waiting lists for months.
        </p>

        <p>
          The European Psychiatric Association (EPA) launched its <em>Action Plan 2025–2027: Leaving No One Behind</em>.
          The plan emphasizes five pillars: personalized care tailored to individual needs; strict adherence to ethical standards;
          community-based delivery systems; expansion of the mental health workforce; and preventive strategies aimed at early intervention.
          Together, these approaches mark a paradigm shift from crisis-driven treatment toward holistic prevention and long-term support.
        </p>

        <h2>Workplace Wellness Goes Digital & Proactive</h2>
        <p>
          The modern workplace is another crucial front in the battle for mental health. By 2025, mental wellbeing is no
          longer treated as a fringe employee benefit but as a strategic investment in organizational sustainability and productivity.
          Employers across Europe and North America are significantly increasing their budgets for mental health programs, focusing not only
          on providing access to therapy but on building cultures of psychological safety where employees feel comfortable voicing struggles
          without fear of stigma.
        </p>

        <p>
          According to the <em>Workplace Mental Health Trends Report 2025</em>, organizations are implementing multi-layered strategies,
          including intensive manager training programs to recognize early signs of burnout, AI-driven platforms for personalized
          wellbeing support, and structural reforms such as flexible scheduling and hybrid work accommodations. Despite these innovations,
          66% of adults still report difficulty accessing appropriate mental health support through their employers, often citing
          confusion about available services, long waiting times, or limited coverage.
        </p>

        <blockquote className="text-white border-l-4 border-gray-400 pl-4 italic bg-gray-800 rounded-lg p-4 shadow">
  “Companies that prioritize mental health are seeing measurable returns: 
   lower turnover rates, increased employee engagement,
   and improved productivity across industries.”
</blockquote>

        <p>
          The business case for such investments is compelling. In industries with traditionally high stress levels, such as healthcare,
          education, and technology, these interventions are not just beneficial but essential for long-term resilience and success.
        </p>
      </article>
    </main>
  )
}
