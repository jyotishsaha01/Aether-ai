import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Mail,
  Globe,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Sparkles,
  Send,
} from "lucide-react";

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const email = "jyotishsaha01@gmail.com";
  const portfolioUrl = "https://jyotishsaha.netlify.app";
  const linkedinUrl = "https://www.linkedin.com/in/jyotish-saha-9b9b28262";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="flex flex-col w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Subtle Top Glow Banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-zinc-900 border-b border-zinc-800/80 relative">
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer border border-zinc-800"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar Bubble */}
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <div className="relative">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-xl shadow-indigo-950/50">
                <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center font-bold text-xl text-white">
                  JS
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white shadow-md" title="Verified Creator & Admin">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lead Architect & Admin</span>
            </div>
          </div>

          {/* Name & Titles */}
          <div className="space-y-1 mb-4">
            <h3 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-1.5">
              <span>Jyotish Saha</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </h3>
            <p className="text-xs text-indigo-300/90 font-medium">
              Creator & Product Architect of Aether Agentic AI
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              Engineered Aether as a modern autonomous AI workspace with deep reasoning, multimodal creative generation, live code execution sandbox, and automated research workflows.
            </p>
          </div>

          {/* Contact & Links List */}
          <div className="space-y-2 mb-5">
            {/* Email Contact Card */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2.5 truncate min-w-0">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Email Address</div>
                  <div className="text-zinc-200 font-mono text-[11px] truncate">{email}</div>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Portfolio Website Link */}
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Personal Portfolio</div>
                  <div className="text-zinc-200 group-hover:text-emerald-300 transition-colors font-mono text-[11px] truncate">
                    jyotishsaha.netlify.app
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
            </a>

            {/* LinkedIn Profile Link */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">LinkedIn Profile</div>
                  <div className="text-zinc-200 group-hover:text-sky-300 transition-colors font-mono text-[11px] truncate">
                    in/jyotish-saha-9b9b28262
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
            </a>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
            <a
              href={`mailto:${email}?subject=Inquiry%20regarding%20Aether%20Agentic%20AI`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors text-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Admin / Send Message</span>
            </a>
            <button
              onClick={onClose}
              className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
