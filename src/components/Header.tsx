import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Sliders,
  PanelRight,
  Plus,
  Search,
  Code2,
  LineChart,
  Feather,
  ChevronDown,
  Brain,
  FileAudio,
  LogIn,
  LogOut,
  Palette,
  Layers,
  Check,
  ShieldCheck,
} from "lucide-react";
import { AgentMode, AnimatedTheme } from "../types";
import { AGENT_PERSONAS } from "../constants/agentPersonas";
import { useAuth } from "../contexts/AuthContext";
import { ThemeSelector } from "./ThemeSelector";

interface HeaderProps {
  currentMode: AgentMode;
  onSelectMode: (mode: AgentMode) => void;
  model: string;
  onSelectModel?: (model: string) => void;
  currentTheme?: AnimatedTheme;
  onSelectTheme?: (theme: AnimatedTheme) => void;
  hasArtifacts: boolean;
  artifactCount: number;
  isCanvasOpen: boolean;
  onToggleCanvas: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenDeepResearch: () => void;
  onOpenTranscribe: () => void;
  onOpenCreativeStudio: () => void;
  enableSearch: boolean;
  onOpenAdminInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  model,
  onSelectModel,
  currentTheme = "space",
  onSelectTheme,
  hasArtifacts,
  artifactCount,
  isCanvasOpen,
  onToggleCanvas,
  onNewChat,
  onOpenSettings,
  onOpenDeepResearch,
  onOpenTranscribe,
  onOpenCreativeStudio,
  onOpenAdminInfo,
}) => {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const personaRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setShowToolsMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPersona = AGENT_PERSONAS[currentMode] || AGENT_PERSONAS.general;

  const modeIcons: Record<string, React.ReactNode> = {
    general: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
    deep_research: <Search className="w-3.5 h-3.5 text-emerald-400" />,
    code_architect: <Code2 className="w-3.5 h-3.5 text-violet-400" />,
    analyst: <LineChart className="w-3.5 h-3.5 text-amber-400" />,
    creative: <Feather className="w-3.5 h-3.5 text-rose-400" />,
  };

  const modelLabel = model === "gemini-3.8-flash" ? "Ultra" : "Fast";

  return (
    <header className="h-13 px-3.5 md:px-5 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Left: Brand + Unified Persona/Model Selector */}
      <div className="flex items-center gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 tracking-tight">
          <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:inline font-semibold text-zinc-100">Aether</span>
        </div>

        {/* Separator */}
        <span className="hidden sm:inline text-zinc-700" aria-hidden="true">/</span>

        {/* Unified Mode & Model Selector Dropdown */}
        <div className="relative" ref={personaRef}>
          <button
            onClick={() => {
              setShowPersonaMenu(!showPersonaMenu);
              setShowToolsMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/90 text-xs text-zinc-200 transition-colors cursor-pointer"
            title="Configure intelligence mode and neural engine"
          >
            {modeIcons[currentMode]}
            <span className="font-medium text-zinc-200">{currentPersona.name}</span>
            <span className="text-[11px] font-mono text-zinc-400">· {modelLabel}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-150 ${showPersonaMenu ? "rotate-180" : ""}`} />
          </button>

          {/* Flyout Menu */}
          {showPersonaMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-72 p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              {/* Persona Options */}
              <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Agent Intelligence Persona
              </div>
              <div className="space-y-0.5 mb-2">
                {Object.values(AGENT_PERSONAS).map((persona) => {
                  const isSelected = currentMode === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        onSelectMode(persona.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-zinc-800 text-white font-medium"
                          : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="shrink-0">{modeIcons[persona.id]}</div>
                        <div className="truncate">
                          <div className="text-xs">{persona.name}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{persona.tagline}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Model Speed / Engine Selector */}
              {onSelectModel && (
                <>
                  <div className="border-t border-zinc-800/80 pt-2 px-2 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Neural Engine
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 px-1">
                    <button
                      onClick={() => {
                        onSelectModel("gemini-3.1-flash-lite");
                        setShowPersonaMenu(false);
                      }}
                      className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                        model === "gemini-3.1-flash-lite"
                          ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-200"
                          : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-semibold flex items-center gap-1">
                        <Brain className="w-3 h-3 text-indigo-400" />
                        <span>Fast Engine</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Instant low-latency</div>
                    </button>

                    <button
                      onClick={() => {
                        onSelectModel("gemini-3.8-flash");
                        setShowPersonaMenu(false);
                      }}
                      className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                        model === "gemini-3.8-flash"
                          ? "bg-purple-500/10 border-purple-500/40 text-purple-200"
                          : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-semibold flex items-center gap-1">
                        <Brain className="w-3 h-3 text-purple-400" />
                        <span>Ultra Engine</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Deep multi-step reasoning</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Quiet status indicator (No pill clutter) */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 font-normal">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Neural Runtime Online</span>
      </div>

      {/* Right Controls: Unified Capabilities Menu, Canvas, New Chat, Settings & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Unified Capabilities / Tools Menu */}
        <div className="relative" ref={toolsRef}>
          <button
            onClick={() => {
              setShowToolsMenu(!showToolsMenu);
              setShowPersonaMenu(false);
              setShowUserMenu(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showToolsMenu
                ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                : "bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 text-zinc-300 hover:text-zinc-100"
            }`}
            title="Access Creative Studio, Deep Research, and Audio tools"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">Tools</span>
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-150 ${showToolsMenu ? "rotate-180" : ""}`} />
          </button>

          {/* Tools Flyout Cards Dropdown */}
          {showToolsMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-76 p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Autonomous Capabilities
              </div>
              <div className="space-y-1">
                {/* 1. Creative Studio */}
                <button
                  onClick={() => {
                    onOpenCreativeStudio();
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-zinc-800/70 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-500/25">
                    <Palette className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                      Creative Studio
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      Generate visual artwork, soundscapes & media concepts
                    </div>
                  </div>
                </button>

                {/* 2. Deep Research */}
                <button
                  onClick={() => {
                    onOpenDeepResearch();
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-zinc-800/70 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/25">
                    <Search className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                      Deep Research Agent
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      Multi-step autonomous web research with comprehensive synthesis
                    </div>
                  </div>
                </button>

                {/* 3. Audio Transcription */}
                <button
                  onClick={() => {
                    onOpenTranscribe();
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-zinc-800/70 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500/25">
                    <FileAudio className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                      Audio Transcription
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      Transcribe speech recordings and voice memos into text
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3D Animated Theme Selector */}
        {onSelectTheme && (
          <ThemeSelector
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
          />
        )}

        {/* Artifacts Canvas Toggle */}
        <button
          onClick={onToggleCanvas}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
            isCanvasOpen
              ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-200"
              : hasArtifacts
              ? "bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-600"
              : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
          }`}
          title="Toggle interactive code canvas sandbox"
        >
          <PanelRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Canvas</span>
          {artifactCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-mono font-bold">
              {artifactCount}
            </span>
          )}
        </button>

        {/* New Chat Primary Action */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          title="Settings & System Configuration"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Admin & Creator Profile Button */}
        {onOpenAdminInfo && (
          <button
            onClick={onOpenAdminInfo}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-indigo-300 transition-colors cursor-pointer"
            title="System Architect & Admin Profile (Jyotish Saha)"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </button>
        )}

        {/* User Auth Profile */}
        <div className="relative" ref={userRef}>
          {currentUser ? (
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowToolsMenu(false);
                setShowPersonaMenu(false);
              }}
              className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 cursor-pointer transition-colors"
              title={currentUser.displayName || currentUser.email || "Account"}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-medium">
                  {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
              title="Sign in with Google to sync Firestore sessions"
            >
              <LogIn className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}

          {/* User Profile Dropdown */}
          {showUserMenu && currentUser && (
            <div className="absolute right-0 top-full mt-1.5 w-52 p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-2 py-1.5 border-b border-zinc-800 mb-1">
                <div className="font-semibold text-zinc-100 truncate">
                  {currentUser.displayName || "Authenticated User"}
                </div>
                <div className="text-[11px] text-zinc-400 truncate">{currentUser.email}</div>
              </div>
              {onOpenAdminInfo && (
                <button
                  onClick={() => {
                    onOpenAdminInfo();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 cursor-pointer transition-colors mb-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin & Creator Info</span>
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 p-1.5 rounded-lg text-rose-400 hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
