import React from "react";
import { X, Sliders, ShieldCheck, Cpu, Globe, Brain, MapPin, Orbit } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedTheme } from "../types";
import { THEME_OPTIONS } from "./ThemeSelector";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  setModel: (m: string) => void;
  theme?: AnimatedTheme;
  setTheme?: (t: AnimatedTheme) => void;
  enableSearch: boolean;
  setEnableSearch: (val: boolean) => void;
  enableMaps: boolean;
  setEnableMaps: (val: boolean) => void;
  thinkingLevel: "MINIMAL" | "LOW" | "HIGH";
  setThinkingLevel: (val: "MINIMAL" | "LOW" | "HIGH") => void;
  customSystemPrompt: string;
  setCustomSystemPrompt: (val: string) => void;
  onOpenAdminInfo?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  model,
  setModel,
  theme = "space",
  setTheme,
  enableSearch,
  setEnableSearch,
  enableMaps,
  setEnableMaps,
  thinkingLevel,
  setThinkingLevel,
  customSystemPrompt,
  setCustomSystemPrompt,
  onOpenAdminInfo,
}) => {
  const { currentUser } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Agent & Model Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* 3D Animated Environment Theme */}
          {setTheme && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-medium">
                <Orbit className="w-4 h-4 text-indigo-400" />
                <span>3D Animated Environment Theme</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {THEME_OPTIONS.map((opt) => {
                  const isSelected = theme === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-200 shadow-xs"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                        {opt.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200 text-xs">{opt.name}</span>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">{opt.badge}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                          {opt.tagline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Model Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 font-medium">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Foundation Neural Engine</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label
                onClick={() => setModel("gemini-3.1-flash-lite")}
                className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  model === "gemini-3.1-flash-lite"
                    ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-200"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <div>
                  <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                    <span>Aether Neural Engine Fast</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                      High Availability
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Instant token streaming, unlimited quota pool, low latency.
                  </div>
                </div>
                <input
                  type="radio"
                  name="model"
                  checked={model === "gemini-3.1-flash-lite"}
                  onChange={() => setModel("gemini-3.1-flash-lite")}
                  className="mt-1 text-indigo-500"
                />
              </label>

              <label
                onClick={() => setModel("gemini-3.8-flash")}
                className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  model === "gemini-3.8-flash"
                    ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-200"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                <div>
                  <div className="font-semibold text-zinc-100">Aether Neural Engine Ultra</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Deep multi-step reasoning, thinking budgets, and tool grounding.
                  </div>
                </div>
                <input
                  type="radio"
                  name="model"
                  checked={model === "gemini-3.8-flash"}
                  onChange={() => setModel("gemini-3.8-flash")}
                  className="mt-1 text-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Reasoning & Thinking Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 font-medium">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Thinking & Reasoning Level</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["MINIMAL", "LOW", "HIGH"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setThinkingLevel(lvl)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                    thinkingLevel === lvl
                      ? "bg-purple-500/10 border-purple-500/50 text-purple-300 font-semibold"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  <div className="text-xs">{lvl}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {lvl === "HIGH" ? "Deep Chain" : lvl === "LOW" ? "Balanced" : "Fastest"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Google Search Grounding */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-medium text-zinc-200">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Google Search Web Grounding</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Augment answers with live real-time web citations and sources.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableSearch}
                onChange={(e) => {
                  setEnableSearch(e.target.checked);
                  if (e.target.checked) setEnableMaps(false);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Google Maps Grounding */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-medium text-zinc-200">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Google Maps Grounding</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Ground locations, places, and spatial routing data.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableMaps}
                onChange={(e) => {
                  setEnableMaps(e.target.checked);
                  if (e.target.checked) setEnableSearch(false);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* Custom System Instruction */}
          <div className="space-y-1.5">
            <label className="block text-zinc-300 font-medium">Custom System Prompt Override</label>
            <textarea
              value={customSystemPrompt}
              onChange={(e) => setCustomSystemPrompt(e.target.value)}
              placeholder="Leave blank to use default Persona prompt instructions..."
              rows={3}
              className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Creator & Admin Attribution */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                JS
              </div>
              <div>
                <div className="font-semibold text-zinc-200">Jyotish Saha</div>
                <div className="text-zinc-500">System Architect & Creator of Aether</div>
              </div>
            </div>
            {onOpenAdminInfo && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminInfo();
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-indigo-300 hover:text-white transition-colors cursor-pointer text-xs font-medium"
              >
                Contact Admin
              </button>
            )}
          </div>

          {/* Auth & Database Status */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-300">Firebase & Firestore Integration:</span>
              <div className="mt-0.5">
                {currentUser
                  ? `Signed in as ${currentUser.email} (${currentUser.uid.slice(0, 8)}...). Sessions synced to Cloud Firestore.`
                  : "Running in local memory mode. Sign in with Google to sync sessions to your Firestore database."}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
