'use client';

interface Project {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  technologies: string[];
  status: 'In Development' | 'Prototype' | 'Research' | 'Planning' | 'Concept';
}

interface Stat {
  number: string;
  label: string;
  icon: string;
}

interface ResearchArea {
  title: string;
  description: string;
  icon: string;
}

export default function ProjectsPage() {
  const projects: Project[] = [
    {
      id: 1,
      icon: '🧠',
      title: 'Selphlyze',
      subtitle: 'AI-Powered Psychometric Platform',
      description:
        'Selphlyze is an AI-powered psychometric platform developed to analyze personality, emotion, and cognitive patterns.',
      features: ['ShadowTrace', 'EmoConnect', 'PsyClock'],
      technologies: ['AI/ML', 'Psychology', 'UX Design'],
      status: 'In Development',
    },
    {
      id: 2,
      icon: '🌐',
      title: 'PsyBridge',
      subtitle: 'Communication Analysis Tool',
      description:
        'A communication analysis tool for couples and teams. Leverages emotional tone analysis to detect patterns.',
      features: ['Tone Analysis', 'Dialogue Segmentation', 'Real-time Suggestions'],
      technologies: ['NLP', 'Emotion AI', 'Communication'],
      status: 'Prototype',
    },
  ];

  const stats: Stat[] = [
    { number: '6+', label: 'Active Projects', icon: '🚀' },
    { number: '12+', label: 'Years Experience', icon: '⏰' },
    { number: '4', label: 'Research Areas', icon: '🔬' },
    { number: '∞', label: 'Innovation Potential', icon: '💡' },
  ];

  const researchAreas: ResearchArea[] = [
    {
      title: 'AI-Enhanced Psychometrics',
      description: 'Advanced algorithms for psychological profiling.',
      icon: '🧮',
    },
    {
      title: 'Consumer Behavior Analytics',
      description: 'Analyzing digital consumer patterns.',
      icon: '📈',
    },
    {
      title: 'Cross-Cultural UX Research',
      description: 'Cultural influences on UI/UX design.',
      icon: '🌐',
    },
    {
      title: 'Ethical AI Development',
      description: 'Responsible AI that prioritizes human well-being.',
      icon: '⚖️',
    },
  ];

  const getStatusColor = (status: Project['status']): string => {
    switch (status) {
      case 'In Development':
        return 'bg-green-500';
      case 'Prototype':
        return 'bg-blue-500';
      case 'Research':
        return 'bg-yellow-500';
      case 'Planning':
        return 'bg-red-500';
      case 'Concept':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Projects & Innovations</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Exploring the intersection of AI, psychology, and human behavior through innovative digital solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-8 text-center">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-gray-500 transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-3xl">{project.icon}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 italic mb-4">{project.subtitle}</p>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="mb-3">
                    <strong>Features:</strong>
                    <ul className="list-disc list-inside text-gray-400">
                      {project.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Technologies:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-8 text-center">Research Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {researchAreas.map((area, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700"
                >
                  <div className="text-3xl mb-3">{area.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{area.title}</h4>
                  <p className="text-gray-400 text-sm">{area.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
  );
}