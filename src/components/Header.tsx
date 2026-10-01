import React, { useState } from 'react';
import { 
  Activity, 
  GitPullRequest, 
  GitBranch, 
  Radio, 
  Sparkles, 
  Mic, 
  Bot, 
  Zap, 
  ChevronDown,
  Layers,
  FileCode,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { TabType, RepositoryId } from '../types';
import { REPOSITORIES } from '../data/mockData';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedRepoId: RepositoryId;
  setSelectedRepoId: (id: RepositoryId) => void;
  onSimulateWebhook: (type: 'pr' | 'push' | 'scan') => void;
  onOpenPitch: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  unresolvedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedRepoId,
  setSelectedRepoId,
  onSimulateWebhook,
  onOpenPitch,
  onToggleCopilot,
  isCopilotOpen,
  unresolvedCount
}) => {
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [showWebhookMenu, setShowWebhookMenu] = useState(false);

  const selectedRepo = REPOSITORIES.find(r => r.id === selectedRepoId) || REPOSITORIES[0];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0F172A]/95 backdrop-blur-xl px-4 lg:px-6 py-2.5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand & Repository Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none" 
            onClick={() => setActiveTab('auditor')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366F1] via-[#06B6D4] to-[#EC4899] p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.35)] shrink-0">
              <div className="w-full h-full bg-[#0F172A] rounded-[6.5px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#06B6D4] animate-pulse" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-base tracking-tight text-white whitespace-nowrap">
                DevPulse <span className="text-[#06B6D4]">AI</span>
              </span>
              <span className="badge badge-indigo text-[10px] uppercase font-bold py-0.5 px-2 hidden sm:inline-flex">
                GIBC 2026
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden md:block" />

          {/* Repository Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowRepoDropdown(!showRepoDropdown)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-[#6366F1]/50 text-xs font-mono text-slate-200 transition-all"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
              <span className="font-medium truncate max-w-[180px]">{selectedRepo.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {showRepoDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-[#0F172A] border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 px-2 py-1">
                  Active Repositories
                </div>
                {REPOSITORIES.map(repo => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      setSelectedRepoId(repo.id);
                      setShowRepoDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-all ${
                      repo.id === selectedRepoId
                        ? 'bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/40'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-medium">{repo.name}</div>
                      <div className="text-[10px] text-slate-400">Branch: {repo.branch}</div>
                    </div>
                    {repo.id === selectedRepoId && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Tabs (4 Core Pillars) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('auditor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'auditor'
                ? 'bg-[#6366F1] text-white shadow-[0_0_14px_rgba(99,102,241,0.45)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>AI Code Auditor</span>
            {unresolvedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#EF4444] text-[10px] flex items-center justify-center text-white font-bold">
                {unresolvedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'visualizer'
                ? 'bg-[#6366F1] text-white shadow-[0_0_14px_rgba(99,102,241,0.45)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'docs'
                ? 'bg-[#6366F1] text-white shadow-[0_0_14px_rgba(99,102,241,0.45)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Smart Docs & OpenAPI</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'insights'
                ? 'bg-[#6366F1] text-white shadow-[0_0_14px_rgba(99,102,241,0.45)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Health & Telemetry</span>
          </button>
        </nav>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Simulate Webhook Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowWebhookMenu(!showWebhookMenu)}
              className="btn-secondary !py-1.5 !px-2.5 text-xs font-mono"
              title="Simulate Git Webhooks"
            >
              <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="hidden sm:inline">Simulate Webhook</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showWebhookMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-[#0F172A] border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 px-2 py-1">
                  Trigger Mock Git Events
                </div>
                <button
                  onClick={() => {
                    onSimulateWebhook('pr');
                    setShowWebhookMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-[#EF4444]" />
                  <div>
                    <div className="font-medium">New PR Opened (#145)</div>
                    <div className="text-[10px] text-slate-400">Triggers AST review</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onSimulateWebhook('push');
                    setShowWebhookMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-[#10B981]" />
                  <div>
                    <div className="font-medium">Git Push to main</div>
                    <div className="text-[10px] text-slate-400">Re-syncs OpenAPI & README</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onSimulateWebhook('scan');
                    setShowWebhookMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
                  <div>
                    <div className="font-medium">Global AST Scan</div>
                    <div className="text-[10px] text-slate-400">OWASP & race condition audit</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3-Minute Hackathon Pitch Script Button */}
          <button
            onClick={onOpenPitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#EC4899]/15 to-[#6366F1]/15 border border-[#EC4899]/40 hover:border-[#EC4899] text-xs font-semibold text-pink-300 transition-all shrink-0"
          >
            <Mic className="w-3.5 h-3.5 text-[#EC4899]" />
            <span className="hidden sm:inline">3-Min Pitch</span>
          </button>

          {/* AI Copilot Drawer Toggle */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              isCopilotOpen
                ? 'bg-[#06B6D4] text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'bg-slate-800 border border-slate-700 hover:border-[#06B6D4]/50 text-cyan-300'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="flex lg:hidden items-center justify-around gap-1 mt-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => setActiveTab('auditor')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg ${
            activeTab === 'auditor' ? 'bg-[#6366F1] text-white' : 'text-slate-400'
          }`}
        >
          <GitPullRequest className="w-3 h-3" />
          <span>Auditor</span>
        </button>
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg ${
            activeTab === 'visualizer' ? 'bg-[#6366F1] text-white' : 'text-slate-400'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Visualizer</span>
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg ${
            activeTab === 'docs' ? 'bg-[#6366F1] text-white' : 'text-slate-400'
          }`}
        >
          <FileCode className="w-3 h-3" />
          <span>Docs</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg ${
            activeTab === 'insights' ? 'bg-[#6366F1] text-white' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-3 h-3" />
          <span>Insights</span>
        </button>
      </nav>
    </header>
  );
};
