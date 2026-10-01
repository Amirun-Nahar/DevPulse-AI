import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  Target, 
  Cpu, 
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTab?: (tab: 'auditor' | 'visualizer' | 'docs' | 'insights') => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({
  isOpen,
  onClose,
  onSwitchTab
}) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentSection = 
    timerSeconds < 30 ? 0 :
    timerSeconds < 90 ? 1 :
    timerSeconds < 150 ? 2 : 3;

  const pitchSections = [
    {
      range: '0:00 - 0:30',
      title: 'The Hook & Problem',
      accentColor: 'text-[#EC4899]',
      bgAccent: 'bg-[#EC4899]/10 border-[#EC4899]/30',
      script: '"Modern software teams spend up to 40% of their time reviewing complex code, writing documentation, and untangling architectural spaghetti. Traditional tools are fragmented, static, and fall out of date the moment code is pushed to production."'
    },
    {
      range: '0:30 - 1:30',
      title: 'The Solution & Live Demo',
      accentColor: 'text-[#06B6D4]',
      bgAccent: 'bg-[#06B6D4]/10 border-[#06B6D4]/30',
      script: '"Meet DevPulse AI. With zero setup overhead, DevPulse connects directly to your repository and acts as an instant engineering copilot.\n\nWatch as I open a pull request: DevPulse instantly flags a memory leak in our pipeline, offers a verified one-click refactor, automatically updates our interactive system dependency map in real time, and publishes a fully updated OpenAPI spec without manual intervention."'
    },
    {
      range: '1:30 - 2:30',
      title: 'Technical Innovation & Impact',
      accentColor: 'text-[#6366F1]',
      bgAccent: 'bg-[#6366F1]/10 border-[#6366F1]/30',
      script: '"Under the hood, DevPulse combines AST-level static parsing with real-time WebSocket streaming and advanced LLM reasoning. By moving from static analysis to intelligent context-aware feedback, DevPulse reduces code review cycle times by 60% while entirely eliminating stale documentation across engineering teams."'
    },
    {
      range: '2:30 - 3:00',
      title: 'Roadmap & Call to Action',
      accentColor: 'text-[#10B981]',
      bgAccent: 'bg-[#10B981]/10 border-[#10B981]/30',
      script: '"DevPulse AI turns repository noise into actionable, real-time engineering intelligence—allowing developers to focus on building, not overhead. Thank you!"'
    }
  ];

  const fullPitchText = pitchSections.map(s => `${s.range} | ${s.title}\n${s.script}`).join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0F172A] border-slate-700 shadow-2xl overflow-hidden rounded-2xl">
        
        {/* Header with Teleprompter Controls */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EC4899] to-[#6366F1] flex items-center justify-center shadow-lg">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                3-Minute Hackathon Pitch Script & Judging Alignment
              </h2>
              <p className="text-xs text-slate-400">
                Global Innovation Build Challenge (GIBC V2 2026) Official Showcase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Teleprompter Clock Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs text-slate-400 font-mono">PITCH TELEPROMPTER TIMER</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatTime(timerSeconds)} <span className="text-sm font-normal text-slate-500">/ 3:00</span>
                </div>
              </div>
            </div>

            {/* Play/Pause controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`btn-primary !py-2 !px-3.5 text-xs font-bold ${
                  isPlaying ? '!bg-amber-600' : ''
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Start Pitch Timer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setTimerSeconds(0);
                }}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopy}
                className="btn-secondary !py-2 !px-3 text-xs"
                title="Copy Full Script"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Synchronized Script Sections */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synchronized Script Segments:
            </div>

            {pitchSections.map((sec, idx) => {
              const isActive = currentSection === idx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? `${sec.bgAccent} border-2 shadow-[0_0_20px_rgba(99,102,241,0.25)]`
                      : 'bg-slate-900/50 border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 ${sec.accentColor}`}>
                        {sec.range}
                      </span>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {sec.title}
                      </h4>
                    </div>
                    {isActive && (
                      <span className="badge badge-emerald text-[10px] animate-pulse">
                        Speaking Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    {sec.script}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Devpost Submission & Judging Criteria Alignment */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FDE047]" />
              <h3 className="text-base font-bold text-white font-heading">
                Devpost Submission & Judging Criteria Alignment
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                  <Target className="w-4 h-4" />
                  Problem-Solution Fit
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Directly targets primary engineering bottlenecks: developer burnout, delayed code reviews, architectural opacity, and technical debt accumulation in scaling repositories.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                  <Cpu className="w-4 h-4" />
                  Technical Complexity
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Combines real-time dynamic graph layout rendering, continuous AST static analysis, custom LLM prompt orchestration pipelines, and live telemetry webhooks within a low-latency architecture.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  Completeness & Polish
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Delivers an end-to-end working software prototype, complete with live GitHub webhook hooks, responsive high-contrast cyberpunk visual design, interactive graph canvases, and structured API specification output.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            DevPulse AI • GIBC 2026 Hackathon Ready
          </span>
          <button
            onClick={onClose}
            className="btn-primary !py-1.5 !px-4 text-xs font-semibold"
          >
            Close Teleprompter
          </button>
        </div>
      </div>
    </div>
  );
};
