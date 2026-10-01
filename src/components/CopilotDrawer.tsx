import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Code, 
  ShieldAlert, 
  Layers, 
  FileCode, 
  Zap,
  CornerDownLeft,
  CheckCircle2
} from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'auditor' | 'visualizer' | 'docs' | 'insights') => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  content: string;
  codeSnippet?: string;
  actionText?: string;
  actionTab?: 'auditor' | 'visualizer' | 'docs' | 'insights';
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'copilot',
      timestamp: '15:20',
      content: 'Hello! I am DevPulse Copilot, powered by continuous AST analysis and Gemini 3.8. I am monitoring devpulse/fintech-payment-engine. What would you like to inspect?',
      codeSnippet: undefined
    },
    {
      id: 'm2',
      sender: 'copilot',
      timestamp: '15:21',
      content: '🚨 Notice: PR #142 contains a high-risk concurrency race condition in SettlementProcessor.ts. Would you like to review the 1-click refactoring patch?',
      actionText: 'Review PR #142 in Auditor',
      actionTab: 'auditor'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    const userQuery = input.toLowerCase();
    setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let botResponse: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: ''
      };

      if (userQuery.includes('race') || userQuery.includes('142') || userQuery.includes('payment')) {
        botResponse.content = 'PR #142 has an unguarded balance check across async await boundaries. I generated a verified fix implementing Redis distributed locks (Redlock algorithm) and serializable transaction isolation.';
        botResponse.codeSnippet = 'const lock = await distributedLock.acquire(`settlement:${userId}`, 5000);\nawait client.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");';
        botResponse.actionText = 'View Diff in Auditor Tab';
        botResponse.actionTab = 'auditor';
      } else if (userQuery.includes('arch') || userQuery.includes('graph') || userQuery.includes('node') || userQuery.includes('service')) {
        botResponse.content = 'Our live architecture visualizer reveals 9 microservices interconnected via gRPC, HTTPS, and Kafka. The Payment Settlement Core is currently running at 185ms p99 latency.';
        botResponse.actionText = 'Open Topology Visualizer';
        botResponse.actionTab = 'visualizer';
      } else if (userQuery.includes('api') || userQuery.includes('doc') || userQuery.includes('openapi') || userQuery.includes('readme')) {
        botResponse.content = 'OpenAPI 3.0 specification has been automatically synced from AST route annotations. All 4 public endpoints have live interactive mock test runners enabled.';
        botResponse.actionText = 'Open Smart Docs Explorer';
        botResponse.actionTab = 'docs';
      } else {
        botResponse.content = `I analyzed your query: "${userMsg.content}". All repository AST nodes are passing automated health audits with test coverage currently at 94.8% and CI/CD build duration of 1m 48s.`;
        botResponse.actionText = 'View Health Telemetry Dashboard';
        botResponse.actionTab = 'insights';
      }

      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  const handleChipClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#0F172A] border-l border-slate-700 shadow-2xl flex flex-col backdrop-blur-xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#06B6D4] to-[#6366F1] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-heading">
              DevPulse AI Copilot
              <span className="badge badge-cyan text-[9px] py-0">Gemini 3.8</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Continuous Repository Intelligence
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-500 pl-1 shrink-0">Quick Prompts:</span>
        <button
          onClick={() => handleChipClick('Explain PR #142 race condition')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 whitespace-nowrap border border-slate-700"
        >
          PR #142 Race Condition
        </button>
        <button
          onClick={() => handleChipClick('Inspect Payment Core topology')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 whitespace-nowrap border border-slate-700"
        >
          Topology Architecture
        </button>
        <button
          onClick={() => handleChipClick('Show OpenAPI endpoints')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-pink-300 whitespace-nowrap border border-slate-700"
        >
          OpenAPI Spec
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mb-1">
              <span>{msg.sender === 'user' ? 'You' : 'DevPulse Copilot'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {msg.codeSnippet && (
                <pre className="mt-2.5 p-2.5 rounded-lg bg-[#0A0F1D] text-[11px] font-mono text-cyan-300 border border-slate-700/70 overflow-x-auto">
                  {msg.codeSnippet}
                </pre>
              )}

              {msg.actionText && msg.actionTab && (
                <button
                  onClick={() => {
                    onSelectTab(msg.actionTab!);
                    onClose();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4]/50 hover:bg-[#06B6D4]/30 text-cyan-300 text-xs font-semibold font-mono transition-all"
                >
                  <Zap className="w-3 h-3 text-[#06B6D4]" />
                  <span>{msg.actionText} →</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2 bg-[#0A0F1D] border border-slate-700 rounded-xl p-1.5 focus-within:border-[#6366F1]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot about code, AST, or topology..."
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-[#6366F1] text-white hover:bg-[#4F46E5] disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1 font-mono">
          <span>Context: Full AST & Webhook Telemetry</span>
          <span>Press Enter ↵</span>
        </div>
      </div>
    </div>
  );
};
