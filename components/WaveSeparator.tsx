export default function WaveSeparator({ flip = false }: { flip?: boolean }) {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 320"
        className={`w-full h-24 ${flip ? "rotate-180" : ""}`}
        preserveAspectRatio="none"
      >
        <path
          fill="#0a0a0a"
          fillOpacity="1"
          d="M0,160L60,149.3C120,139,240,117,360,117.3C480,117,600,139,720,154.7C840,171,960,181,1080,176C1200,171,1320,149,1380,138.7L1440,128V0H1380C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0H0Z"
        />
      </svg>
    </div>
  );
}
