import React from "react";
import {
  Sparkles,
  Search,
  Code2,
  LineChart,
  Feather,
  Globe,
  Layers,
  ArrowUpRight,
  Brain,
  Zap,
} from "lucide-react";
import { AgentMode } from "../types";
import { AGENT_PERSONAS, PROMPT_TEMPLATES } from "../constants/agentPersonas";

interface WelcomeHeroProps {
  currentMode: AgentMode;
  onSelectPrompt: (prompt: string, mode: AgentMode) => void;
  onOpenDeepResearch: () => void;
  onSelectMode?: (mode: AgentMode) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  currentMode,
  onSelectPrompt,
  onOpenDeepResearch,
  onSelectMode,
}) => {
  const persona = AGENT_PERSONAS[currentMode] || AGENT_PERSONAS.general;

  const modeIcons: Record<string, React.ReactNode> = {
    general: <Sparkles className="w-5 h-5 text-indigo-400" />,
    deep_research: <Search className="w-5 h-5 text-emerald-400" />,
    code_architect: <Code2 className="w-5 h-5 text-violet-400" />,
    analyst: <LineChart className="w-5 h-5 text-amber-400" />,
    creative: <Feather className="w-5 h-5 text-rose-400" />,
  };

  const modeColors: Record<string, { gradient: string; glow: string; border: string }> = {
    general: {
      gradient: "from-indigo-500 via-purple-500 to-cyan-400",
      glow: "rgba(99, 102, 241, 0.35)",
      border: "border-indigo-500/40",
    },
    deep_research: {
      gradient: "from-emerald-400 via-teal-500 to-cyan-400",
      glow: "rgba(16, 185, 129, 0.35)",
      border: "border-emerald-500/40",
    },
    code_architect: {
      gradient: "from-violet-500 via-purple-600 to-indigo-400",
      glow: "rgba(139, 92, 246, 0.35)",
      border: "border-violet-500/40",
    },
    analyst: {
      gradient: "from-amber-400 via-orange-500 to-rose-400",
      glow: "rgba(245, 158, 11, 0.35)",
      border: "border-amber-500/40",
    },
    creative: {
      gradient: "from-rose-500 via-pink-500 to-purple-400",
      glow: "rgba(244, 63, 94, 0.35)",
      border: "border-rose-500/40",
    },
  };

  const currentTheme = modeColors[currentMode] || modeColors.general;

  // Filter templates
  const filteredTemplates = PROMPT_TEMPLATES.filter((t) => t.agentMode === currentMode);
  const displayTemplates = filteredTemplates.length > 0 ? filteredTemplates : PROMPT_TEMPLATES.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center space-y-6 select-none relative z-10">
      {/* Living Neural Orb (Interactive Animated Core) */}
      <div className="relative group cursor-pointer" onClick={() => onOpenDeepResearch()}>
        {/* Deep Pulsing Ambient Halo */}
        <div
          className="absolute -inset-6 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 animate-pulse-slow pointer-events-none"
          style={{ background: currentTheme.glow }}
        />

        {/* Outer Orbiting Gyro Ring 1 */}
        <div className="absolute -inset-4 rounded-full border border-indigo-400/20 border-dashed animate-orbit pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-indigo-400 absolute -top-1 left-1/2 -translate-x-1/2 shadow-sm shadow-indigo-400" />
        </div>

        {/* Counter Orbiting Gyro Ring 2 */}
        <div className="absolute -inset-2 rounded-full border border-purple-400/25 animate-orbit-reverse pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-300 absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-xs shadow-purple-300" />
        </div>

        {/* Center Orb Nucleus */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-center shadow-2xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-300">
          {/* Inner Shimmer Core */}
          <div
            className={`absolute inset-1.5 rounded-xl bg-gradient-to-tr ${currentTheme.gradient} opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-300`}
          />
          <div className="relative z-10 group-hover:rotate-12 transition-transform duration-300">
            {modeIcons[currentMode]}
          </div>

          {/* Living Micro-Audio Wave Indicator */}
          <div className="absolute -bottom-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-xs">
            <span className="w-0.5 bg-indigo-400 rounded-full animate-sound-wave-1" />
            <span className="w-0.5 bg-purple-400 rounded-full animate-sound-wave-2" />
            <span className="w-0.5 bg-cyan-400 rounded-full animate-sound-wave-3" />
            <span className="w-0.5 bg-indigo-400 rounded-full animate-sound-wave-4" />
          </div>
        </div>
      </div>

      {/* Hero Headline & Subtitle */}
      <div className="space-y-2 max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight leading-tight">
          Where will your thinking take you?
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
          {persona.description}
        </p>
      </div>

      {/* Mode Switcher Animated Tabs */}
      {onSelectMode && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-inner max-w-full">
          {Object.values(AGENT_PERSONAS).map((p) => {
            const isActive = currentMode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectMode(p.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-white shadow-md font-semibold border border-zinc-700/80 scale-102"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400 animate-pulse" />
                )}
                {modeIcons[p.id]}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Architectural Capabilities Row (Zero-Pill Discipline) */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-zinc-400 pt-1">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Web Grounding</span>
        </div>
        <span aria-hidden="true" className="text-zinc-700">·</span>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Canvas Sandbox</span>
        </div>
        <span aria-hidden="true" className="text-zinc-700">·</span>
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>Chain-of-Thought Reasoning</span>
        </div>
        <span aria-hidden="true" className="text-zinc-700">·</span>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Autonomous Deep Research</span>
        </div>
      </div>

      {/* Starter Prompts Grid with Hover Shimmer */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
        {displayTemplates.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(tmpl.prompt, tmpl.agentMode)}
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Subtle card hover glow */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all duration-300" />

            <div className="relative z-10">
              <div className="text-[11px] font-semibold text-indigo-400 mb-1 flex items-center justify-between">
                <span>{tmpl.category}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-xs font-semibold text-zinc-200 group-hover:text-white mb-1 transition-colors">
                {tmpl.title}
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {tmpl.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
