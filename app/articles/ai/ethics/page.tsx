export default function EthicsPage() {
  return (
    <main className="prose main" style={{ 
      maxWidth: '64rem', 
      margin: '0 auto', 
      padding: '2.5rem 1.5rem',
      paddingTop: '120px',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2.25rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem',
        marginTop: '1cm',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        AI Ethics: Navigating the Moral Landscape of Artificial Intelligence
      </h1>

      <p>
        As artificial intelligence becomes increasingly integrated into our daily lives, the question of <strong>AI ethics</strong> has moved from philosophical debate to urgent practical necessity. From autonomous vehicles making life-or-death decisions to algorithms determining loan approvals, AI systems now wield significant power over human welfare and society.
      </p>

      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: '600', 
        marginTop: '2.5rem', 
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        Core Principles of AI Ethics
      </h2>
      <p>
        Ethical AI development rests on several fundamental principles that guide responsible innovation:
      </p>

      <ul>
        <li><strong>Fairness:</strong> AI systems should treat all individuals and groups equitably, avoiding discrimination based on race, gender, age, or other protected characteristics.</li>
        <li><strong>Transparency:</strong> The decision-making processes of AI systems should be explainable and auditable, allowing users to understand how conclusions are reached.</li>
        <li><strong>Privacy:</strong> Personal data used to train and operate AI systems must be protected and used only with appropriate consent and safeguards.</li>
        <li><strong>Accountability:</strong> Clear lines of responsibility must exist for AI system outcomes, with mechanisms for redress when things go wrong.</li>
        <li><strong>Human Agency:</strong> AI should augment rather than replace human decision-making in critical areas, preserving human autonomy and control.</li>
      </ul>

      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: '600', 
        marginTop: '2.5rem', 
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        Current Ethical Challenges
      </h2>
      <p>
        The rapid advancement of AI technology has outpaced the development of comprehensive ethical frameworks, creating several pressing challenges:
      </p>

      <ul>
        <li><strong>Algorithmic Bias:</strong> Training data often reflects historical prejudices, leading AI systems to perpetuate or amplify existing inequalities.</li>
        <li><strong>Job Displacement:</strong> Automation threatens to eliminate entire categories of employment, raising questions about economic justice and social stability.</li>
        <li><strong>Surveillance and Privacy:</strong> AI-powered surveillance systems can enable unprecedented monitoring of citizens, potentially threatening civil liberties.</li>
        <li><strong>Autonomous Weapons:</strong> The development of lethal autonomous weapons systems raises profound questions about the ethics of delegating life-and-death decisions to machines.</li>
        <li><strong>Manipulation and Misinformation:</strong> AI-generated content, including deepfakes and sophisticated propaganda, can be used to deceive and manipulate public opinion.</li>
      </ul>

      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: '600', 
        marginTop: '2.5rem', 
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        Building Ethical AI Systems
      </h2>
      <p>
        Creating truly ethical AI requires a multi-faceted approach that addresses technical, social, and governance challenges:
      </p>

      <ul>
        <li><strong>Diverse Development Teams:</strong> Including people from different backgrounds and perspectives in AI development helps identify potential biases and ethical issues.</li>
        <li><strong>Ethical Impact Assessments:</strong> Regular evaluation of AI systems' potential societal effects should be conducted throughout the development lifecycle.</li>
        <li><strong>Stakeholder Engagement:</strong> Involving affected communities and domain experts in AI system design ensures that diverse perspectives are considered.</li>
        <li><strong>Regulatory Frameworks:</strong> Governments and international organizations must develop comprehensive policies that balance innovation with protection of human rights.</li>
        <li><strong>Technical Solutions:</strong> Researchers are developing new methods for bias detection, algorithmic auditing, and explainable AI to make systems more fair and transparent.</li>
      </ul>

      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: '600', 
        marginTop: '2.5rem', 
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        The Role of Psychology in AI Ethics
      </h2>
      <p>
        Psychology plays a crucial role in understanding how humans interact with AI systems and how these interactions affect behavior, decision-making, and well-being. Key psychological considerations include:
      </p>

      <ul>
        <li><strong>Trust and Acceptance:</strong> Understanding what makes people trust AI systems and how to build appropriate levels of reliance.</li>
        <li><strong>Cognitive Bias:</strong> Recognizing how human cognitive limitations can lead to over-reliance on or inappropriate use of AI systems.</li>
        <li><strong>Mental Health Impact:</strong> Assessing how AI systems affect psychological well-being, particularly in sensitive applications like mental health care.</li>
        <li><strong>Human-AI Collaboration:</strong> Designing interfaces and interactions that optimize the complementary strengths of humans and machines.</li>
      </ul>

      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: '600', 
        marginTop: '2.5rem', 
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        Looking Forward: The Future of AI Ethics
      </h2>
      <p>
        As AI continues to evolve, so too must our approach to ethics. The development of artificial general intelligence (AGI) and other advanced AI systems will likely present entirely new ethical challenges that we can barely imagine today. Success in navigating these challenges will require:
      </p>

      <ul>
        <li><strong>Global Cooperation:</strong> AI ethics is a global challenge requiring international coordination and shared standards.</li>
        <li><strong>Continuous Learning:</strong> Our understanding of AI ethics must evolve alongside technological capabilities.</li>
        <li><strong>Public Engagement:</strong> Democratic participation in AI governance ensures that technological development serves the public interest.</li>
        <li><strong>Interdisciplinary Collaboration:</strong> Combining insights from computer science, philosophy, psychology, law, and other fields is essential for comprehensive ethical frameworks.</li>
      </ul>

      <p>
        The choices we make today about AI ethics will shape the future of human-machine interaction for generations to come. By prioritizing ethical considerations alongside technological advancement, we can work toward an AI-enabled future that enhances human flourishing rather than undermining it.
      </p>

      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        marginTop: '2.5rem',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        🔍 Keywords: AI Ethics, Algorithmic Bias, Responsible AI, AI Governance, Human-AI Interaction, Technology Ethics, AI Policy
      </h2>
    </main>
  );
}
