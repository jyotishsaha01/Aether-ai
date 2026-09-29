import React, { useState, useEffect, useRef } from "react";
import { Message, ChatSession, Artifact, AgentMode, ChatAttachment, AnimatedTheme } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MessageItem } from "./components/MessageItem";
import { ChatInput } from "./components/ChatInput";
import { WelcomeHero } from "./components/WelcomeHero";
import { ArtifactWorkspace } from "./components/ArtifactWorkspace";
import { DeepResearchModal } from "./components/DeepResearchModal";
import { SettingsModal } from "./components/SettingsModal";
import { AudioTranscribeModal } from "./components/AudioTranscribeModal";
import { CreativeStudioModal } from "./components/CreativeStudioModal";
import { AdminProfileModal } from "./components/AdminProfileModal";
import { Theme3DBackground } from "./components/Theme3DBackground";
import { extractArtifactsFromContent } from "./utils/artifactDetector";
import { AGENT_PERSONAS } from "./constants/agentPersonas";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const STORAGE_KEY_SESSIONS = "aether_ai_sessions_v1";
const STORAGE_KEY_ACTIVE_ID = "aether_ai_active_id_v1";

function createNewSession(mode: AgentMode = "general", model = "gemini-3.1-flash-lite"): ChatSession {
  const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    title: "New Session",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
    agentMode: mode,
    model: model,
    enableSearch: false,
    enableMaps: false,
    enableRag: true,
    thinkingLevel: "LOW",
  };
}

function MainStudio() {
  const { currentUser } = useAuth();

  // Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [createNewSession("general")];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return sessions[0]?.id || "";
  });

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isDeepResearchOpen, setIsDeepResearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAudioTranscribeOpen, setIsAudioTranscribeOpen] = useState(false);
  const [isCreativeStudioOpen, setIsCreativeStudioOpen] = useState(false);
  const [isAdminInfoOpen, setIsAdminInfoOpen] = useState(false);

  // Active settings
  const [model, setModel] = useState<string>("gemini-3.1-flash-lite");
  const [theme, setTheme] = useState<AnimatedTheme>(() => {
    const saved = localStorage.getItem("aether_theme");
    return (saved as AnimatedTheme) || "space";
  });

  const handleSelectTheme = (newTheme: AnimatedTheme) => {
    setTheme(newTheme);
    localStorage.setItem("aether_theme", newTheme);
  };
  const [enableSearch, setEnableSearch] = useState<boolean>(false);
  const [enableMaps, setEnableMaps] = useState<boolean>(false);
  const [thinkingLevel, setThinkingLevel] = useState<"MINIMAL" | "LOW" | "HIGH">("LOW");
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    // Listen to sessions from Firestore
    const sessionsCol = collection(db, "users", currentUser.uid, "sessions");
    const unsub = onSnapshot(sessionsCol, (snapshot) => {
      if (!snapshot.empty) {
        const remoteSessions: ChatSession[] = [];
        snapshot.forEach((docSnap) => {
          remoteSessions.push(docSnap.data() as ChatSession);
        });
        remoteSessions.sort((a, b) => b.updatedAt - a.updatedAt);
        setSessions(remoteSessions);
      }
    });

    return () => unsub();
  }, [currentUser]);

  // Save sessions to localStorage & Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSessionId);
    } catch {
      // storage error
    }

    if (currentUser && activeSession) {
      const sessionDocRef = doc(db, "users", currentUser.uid, "sessions", activeSession.id);
      setDoc(sessionDocRef, activeSession).catch((err) =>
        console.warn("Could not sync session to Firestore:", err)
      );
    }
  }, [sessions, activeSessionId, currentUser]);

  // Extract artifacts whenever messages in active session change
  useEffect(() => {
    if (!activeSession) return;
    let accumulatedArtifacts: Artifact[] = [];
    for (const msg of activeSession.messages) {
      if (msg.role === "assistant" && msg.content) {
        accumulatedArtifacts = extractArtifactsFromContent(msg.content, accumulatedArtifacts);
      }
    }
    setArtifacts(accumulatedArtifacts);
    if (accumulatedArtifacts.length > 0 && !activeArtifactId) {
      setActiveArtifactId(accumulatedArtifacts[0].id);
    }
  }, [activeSession?.messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isLoading]);

  // Create New Chat
  const handleNewChat = (mode: AgentMode = "general") => {
    const newSess = createNewSession(mode, model);
    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
    setIsCanvasOpen(false);
    setActiveArtifactId(null);
  };

  // Delete Chat
  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "sessions", id));
      } catch (err) {
        console.warn("Could not delete from Firestore:", err);
      }
    }

    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Switch Persona Mode
  const handleSelectMode = (mode: AgentMode) => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, agentMode: mode } : s))
    );
  };

  // Send Message Handler
  const handleSendMessage = async (content: string, attachments: ChatAttachment[]) => {
    if (!content.trim() && attachments.length === 0) return;
    if (!activeSession) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: "user",
      content,
      timestamp: Date.now(),
      attachments,
    };

    const assistantMessageId = `msg-${Date.now() + 1}-${Math.random().toString(36).slice(2, 6)}`;
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now() + 1,
      isStreaming: true,
    };

    const updatedTitle =
      activeSession.messages.length === 0
        ? content.slice(0, 36) + (content.length > 36 ? "..." : "")
        : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMessage, assistantPlaceholder];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: updatedTitle,
              updatedAt: Date.now(),
              messages: updatedMessages,
            }
          : s
      )
    );

    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let streamedText = "";
    let capturedGrounding: any = null;

    try {
      const historyPayload = updatedMessages
        .slice(0, -1)
        .map((m) => ({
          role: m.role,
          content: m.content,
          attachments: m.attachments,
        }));

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          model,
          agentMode: activeSession.agentMode,
          customSystemPrompt: customSystemPrompt || activeSession.customSystemPrompt,
          enableSearch,
          enableMaps,
          thinkingLevel,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body available from server stream.");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") break;

          try {
            const data = JSON.parse(jsonStr);

            if (data.error) {
              let cleanErr = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
              if (cleanErr.includes("quota") || cleanErr.includes("429") || cleanErr.includes("RESOURCE_EXHAUSTED")) {
                cleanErr = "The neural engine is currently handling high demand. Please try again in a few moments.";
              }
              streamedText = cleanErr;
            }

            if (data.text) {
              streamedText += data.text;
            }

            if (data.groundingMetadata) {
              capturedGrounding = data.groundingMetadata;
            }

            setSessions((prev) =>
              prev.map((s) => {
                if (s.id !== activeSessionId) return s;
                return {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMessageId
                      ? {
                          ...m,
                          content: streamedText,
                          groundingMetadata: capturedGrounding || m.groundingMetadata,
                          isStreaming: true,
                        }
                      : m
                  ),
                };
              })
            );
          } catch {
            // ignore partial JSON parse
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Stream error:", err);
        streamedText += `\n\n*(Inference interrupted: ${err.message || "Network error"})*`;
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: streamedText || "I have processed your request.",
                    groundingMetadata: capturedGrounding,
                    isStreaming: false,
                  }
                : m
            ),
          };
        })
      );

      const detected = extractArtifactsFromContent(streamedText);
      if (detected.length > 0) {
        setActiveArtifactId(detected[0].id);
        // Kept closed by default to avoid cluttering screen with code blocks
      }
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const handleOpenArtifact = (artifact: Artifact) => {
    setActiveArtifactId(artifact.id);
    setIsCanvasOpen(true);
  };

  const handleInsertReportToChat = (topic: string, reportContent: string) => {
    if (!activeSession) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: `Conduct deep research on: "${topic}"`,
      timestamp: Date.now(),
    };

    const assistantMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: reportContent,
      timestamp: Date.now() + 1,
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: `Research: ${topic.slice(0, 24)}...`,
              updatedAt: Date.now(),
              messages: [...s.messages, userMessage, assistantMessage],
            }
          : s
      )
    );
  };

  const currentPersona = AGENT_PERSONAS[activeSession?.agentMode || "general"];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewChat={() => handleNewChat(activeSession?.agentMode || "general")}
        onDeleteSession={handleDeleteSession}
        onSelectPromptTemplate={(prompt, mode) => {
          handleSelectMode(mode);
          handleSendMessage(prompt, []);
        }}
        onOpenCreativeStudio={() => setIsCreativeStudioOpen(true)}
        onOpenDeepResearch={() => setIsDeepResearchOpen(true)}
        onOpenTranscribe={() => setIsAudioTranscribeOpen(true)}
        onOpenAdminInfo={() => setIsAdminInfoOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          currentMode={activeSession?.agentMode || "general"}
          onSelectMode={handleSelectMode}
          model={model}
          onSelectModel={setModel}
          hasArtifacts={artifacts.length > 0}
          artifactCount={artifacts.length}
          isCanvasOpen={isCanvasOpen}
          onToggleCanvas={() => setIsCanvasOpen(!isCanvasOpen)}
          onNewChat={() => handleNewChat(activeSession?.agentMode || "general")}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDeepResearch={() => setIsDeepResearchOpen(true)}
          onOpenTranscribe={() => setIsAudioTranscribeOpen(true)}
          onOpenCreativeStudio={() => setIsCreativeStudioOpen(true)}
          enableSearch={enableSearch}
          onOpenAdminInfo={() => setIsAdminInfoOpen(true)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />

        {/* Middle Split: Chat Thread + Artifact Canvas */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Chat Messages Feed */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-zinc-950 relative">
            <Theme3DBackground theme={theme} />

            <div className="flex-1 overflow-y-auto relative z-10">
              {activeSession?.messages.length === 0 ? (
                <WelcomeHero
                  currentMode={activeSession?.agentMode || "general"}
                  onSelectPrompt={(prompt, mode) => {
                    handleSelectMode(mode);
                    handleSendMessage(prompt, []);
                  }}
                  onOpenDeepResearch={() => setIsDeepResearchOpen(true)}
                  onSelectMode={handleSelectMode}
                />
              ) : (
                <div className="divide-y divide-zinc-850/50">
                  {activeSession?.messages.map((message) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      artifacts={artifacts}
                      onOpenArtifact={handleOpenArtifact}
                      agentModeName={currentPersona.name}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onStopGeneration={handleStopGeneration}
              enableSearch={enableSearch}
              onToggleSearch={() => setEnableSearch(!enableSearch)}
            />
          </div>

          {/* Right Artifact Canvas / Sandbox */}
          {isCanvasOpen && (
            <ArtifactWorkspace
              artifacts={artifacts}
              activeArtifactId={activeArtifactId}
              onSelectArtifact={(id) => setActiveArtifactId(id)}
              onClose={() => setIsCanvasOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Autonomous Deep Research Modal */}
      <DeepResearchModal
        isOpen={isDeepResearchOpen}
        onClose={() => setIsDeepResearchOpen(false)}
        onSaveReportToChat={handleInsertReportToChat}
      />

      {/* Audio Transcribe Modal */}
      <AudioTranscribeModal
        isOpen={isAudioTranscribeOpen}
        onClose={() => setIsAudioTranscribeOpen(false)}
        onInsertToChat={(text) => {
          handleSendMessage(`Audio Transcription:\n\n"${text}"\n\nPlease analyze and extract key takeaways from this audio.`, []);
        }}
      />

      {/* Creative Media Studio Modal */}
      <CreativeStudioModal
        isOpen={isCreativeStudioOpen}
        onClose={() => setIsCreativeStudioOpen(false)}
        onSendToChat={(text, attachmentUrl) => {
          const attachments: ChatAttachment[] = [];
          if (attachmentUrl) {
            attachments.push({
              id: `att-${Date.now()}`,
              name: "creative_output.png",
              type: "image/png",
              size: 1024,
              dataUrl: attachmentUrl,
            });
          }
          handleSendMessage(text, attachments);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        model={model}
        setModel={setModel}
        theme={theme}
        setTheme={handleSelectTheme}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
        enableMaps={enableMaps}
        setEnableMaps={setEnableMaps}
        thinkingLevel={thinkingLevel}
        setThinkingLevel={setThinkingLevel}
        customSystemPrompt={customSystemPrompt}
        setCustomSystemPrompt={setCustomSystemPrompt}
        onOpenAdminInfo={() => setIsAdminInfoOpen(true)}
      />

      {/* System Architect & Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isAdminInfoOpen}
        onClose={() => setIsAdminInfoOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStudio />
    </AuthProvider>
  );
}
