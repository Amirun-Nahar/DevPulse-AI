import React, { useState } from 'react';
import { TabType, RepositoryId, PullRequest, ArchNode, ArchEdge, TelemetryEvent, EngineeringMetrics } from './types';
import { 
  REPOSITORIES, 
  INITIAL_PULL_REQUESTS, 
  ARCHITECTURE_NODES, 
  ARCHITECTURE_EDGES, 
  INITIAL_TELEMETRY_EVENTS, 
  INITIAL_METRICS 
} from './data/mockData';
import { Header } from './components/Header';
import { AuditorTab } from './components/AuditorTab';
import { VisualizerTab } from './components/VisualizerTab';
import { DocumentationTab } from './components/DocumentationTab';
import { InsightsTab } from './components/InsightsTab';
import { PitchModal } from './components/PitchModal';
import { CopilotDrawer } from './components/CopilotDrawer';
import { CheckCircle2, AlertTriangle, Sparkles, Activity, ShieldCheck, Layers, GitPullRequest, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('auditor');
  const [selectedRepoId, setSelectedRepoId] = useState<RepositoryId>('fintech-payment-engine');
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(INITIAL_PULL_REQUESTS);
  const [activePRId, setActivePRId] = useState<string>(INITIAL_PULL_REQUESTS[0].id);
  const [nodes, setNodes] = useState<ArchNode[]>(ARCHITECTURE_NODES);
  const [edges] = useState<ArchEdge[]>(ARCHITECTURE_EDGES);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(INITIAL_TELEMETRY_EVENTS);
  const [metrics, setMetrics] = useState<EngineeringMetrics>(INITIAL_METRICS);

  // Modals & Drawers
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastNotification({ title, desc, type });
    setTimeout(() => setToastNotification(null), 4500);
  };

  // 1-Click Patch Application Handler
  const handleApplyPatch = (prId: string) => {
    // 1. Mark PR as refactored
    setPullRequests(prev => prev.map(pr => {
      if (pr.id === prId) {
        return {
          ...pr,
          status: 'refactored',
          riskScore: 4,
          cyclomaticComplexityBefore: pr.cyclomaticComplexityAfter
        };
      }
      return pr;
    }));

    // 2. Improve Architecture node health (Payment Settlement Core)
    setNodes(prev => prev.map(node => {
      if (node.id === 'node-payment') {
        return {
          ...node,
          status: 'healthy',
          latencyP99: 42,
          errorRate: 0.01,
          astScore: 98
        };
      }
      return node;
    }));

    // 3. Update Engineering Metrics
    setMetrics(prev => ({
      ...prev,
      activeVulnerabilities: Math.max(0, prev.activeVulnerabilities - 1),
      testCoveragePercent: Math.min(100, +(prev.testCoveragePercent + 0.8).toFixed(1)),
      astAverageComplexity: 3.1
    }));

    // 4. Add Telemetry Event
    const newEvent: TelemetryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'patch_applied',
      title: `1-Click Verified AST Patch Applied (#${prId.replace('pr-', '')})`,
      details: 'Distributed lock mutex and connection release verified. Node "Payment Settlement Core" returned to healthy state.',
      severity: 'success',
      actor: 'DevPulse Copilot'
    };

    setTelemetryEvents(prev => [newEvent, ...prev]);

    showToast(
      'Verified Patch Applied!',
      'PR refactored with distributed mutex lock, connection pool leak resolved, and node health restored.',
      'success'
    );
  };

  // Simulate Webhook Event Handler
  const handleSimulateWebhook = (type: 'pr' | 'push' | 'scan') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (type === 'pr') {
      const mockPR: PullRequest = {
        id: `pr-${145 + pullRequests.length}`,
        number: 145 + pullRequests.length,
        title: 'Optimize Redis cache cluster serialization & retry backoff',
        author: 'elena-cloud',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        branch: 'perf/redis-backoff',
        targetBranch: 'main',
        timestamp: 'Just now',
        status: 'pending_review',
        severity: 'low',
        cyclomaticComplexityBefore: 7,
        cyclomaticComplexityAfter: 3,
        riskScore: 35,
        category: 'Performance Anti-Pattern',
        fileChanged: 'src/cache/RedisCluster.ts',
        summary: 'Incoming PR parsed via AST. Detected uncompressed JSON serialization in high-frequency keys.',
        semanticAnalysis: [
          'AST identifies JSON.stringify() called on high-volume telemetry buffers.',
          'Missing exponential backoff in Redis reconnection retry loop.'
        ],
        astDetails: {
          nodesInspected: 490,
          depth: 4,
          vulnerablePattern: 'JSON.stringify in hot loop without messagepack or protobuf compression.',
          astFixRule: 'Use MsgPack serializer and JitterExponentialBackoff pattern.'
        },
        originalCode: `export async function cachePayload(key: string, data: any) {\n  return redis.set(key, JSON.stringify(data), 'EX', 3600);\n}`,
        suggestedPatch: `export async function cachePayload(key: string, data: any) {\n  const buffer = msgpack.encode(data);\n  return redis.set(key, buffer, 'EX', 3600);\n}`,
        diffLines: [
          { type: 'normal', oldLine: 1, newLine: 1, text: ' export async function cachePayload(key: string, data: any) {' },
          { type: 'del', oldLine: 2, text: '-   return redis.set(key, JSON.stringify(data), \'EX\', 3600);' },
          { type: 'add', newLine: 2, text: '+   const buffer = msgpack.encode(data);' },
          { type: 'add', newLine: 3, text: '+   return redis.set(key, buffer, \'EX\', 3600);' },
          { type: 'normal', oldLine: 3, newLine: 4, text: ' }' }
        ]
      };

      setPullRequests(prev => [mockPR, ...prev]);
      setActivePRId(mockPR.id);
      setActiveTab('auditor');

      setTelemetryEvents(prev => [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          type: 'pull_request',
          title: `GitHub Webhook: PR #${mockPR.number} Opened`,
          details: `Branch "${mockPR.branch}" opened by ${mockPR.author}. Automated AST review initiated.`,
          severity: 'info',
          actor: 'GitHub Webhook'
        },
        ...prev
      ]);

      showToast(
        `Webhook: PR #${mockPR.number} Received`,
        'DevPulse AST Engine immediately parsed incoming diff and surfaced performance optimizations.',
        'info'
      );
    } else if (type === 'push') {
      setTelemetryEvents(prev => [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          type: 'push',
          title: 'Git Push Event Received on main',
          details: 'Commit 8b21c44 merged. Re-extracting OpenAPI 3.0 specification and updating README badges.',
          severity: 'success',
          actor: 'Git Webhook'
        },
        ...prev
      ]);

      showToast(
        'Git Push to main Received',
        'OpenAPI 3.0 spec auto-synchronized & README live badges updated.',
        'success'
      );
    } else {
      setTelemetryEvents(prev => [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          type: 'ast_scan',
          title: 'Full Repository AST Scan Triggered',
          details: 'Scanned 16,240 AST nodes across 48 services. Zero critical unhandled vulnerabilities remaining.',
          severity: 'success',
          actor: 'DevPulse AST Daemon'
        },
        ...prev
      ]);

      showToast(
        'Global AST Audit Complete',
        '16,240 syntax nodes scanned across repository. All microservices verified.',
        'success'
      );
    }
  };

  const handleUpdateNodeStatus = (nodeId: string, status: 'healthy' | 'warning' | 'degraded', latency: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return { ...n, status, latencyP99: latency };
      }
      return n;
    }));

    if (status === 'warning') {
      showToast(
        'Synthetic Traffic Surge Simulated',
        `Node "${nodeId}" p99 latency spiked to ${latency}ms. Dependency edges reflecting load.`,
        'warning'
      );
    } else {
      showToast(
        'Node AST Optimization Applied',
        `Node "${nodeId}" p99 latency reduced to ${latency}ms (Healthy).`,
        'success'
      );
    }
  };

  const unresolvedCount = pullRequests.filter(pr => pr.status === 'pending_review').length;

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#6366F1] selection:text-white">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl glass-panel bg-[#0F172A]/95 border-2 border-[#06B6D4] shadow-[0_10px_35px_rgba(6,182,212,0.35)] flex items-start gap-3 animate-fadeIn">
          {toastNotification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toastNotification.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs">
            <div className="font-bold text-white text-sm">{toastNotification.title}</div>
            <div className="text-slate-300 mt-0.5 leading-relaxed">{toastNotification.desc}</div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRepoId={selectedRepoId}
        setSelectedRepoId={setSelectedRepoId}
        onSimulateWebhook={handleSimulateWebhook}
        onOpenPitch={() => setIsPitchOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
        unresolvedCount={unresolvedCount}
      />

      {/* Hero Quick Telemetry Ribbon */}
      <section className="border-b border-slate-800/80 bg-slate-950/60 px-4 lg:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-mono overflow-x-auto">
          <div className="flex items-center gap-4 shrink-0 text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-[#06B6D4]" />
              <strong>Repo Health:</strong> <span className="text-emerald-400">96/100</span>
            </span>
            <span>•</span>
            <span>AST Complexity: <strong className="text-cyan-300">3.2 (Optimal)</strong></span>
            <span>•</span>
            <span>Build Variance: <strong className="text-emerald-400">-34% faster</strong></span>
            <span>•</span>
            <span>Test Coverage: <strong className="text-[#A5B4FC]">94.8%</strong></span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPitchOpen(true)}
              className="text-[#EC4899] hover:underline font-semibold flex items-center gap-1"
            >
              <span>3-Min Hackathon Pitch Script</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'auditor' && (
          <AuditorTab
            pullRequests={pullRequests}
            onApplyPatch={handleApplyPatch}
            activePRId={activePRId}
            setActivePRId={setActivePRId}
          />
        )}

        {activeTab === 'visualizer' && (
          <VisualizerTab
            nodes={nodes}
            edges={edges}
            onUpdateNodeStatus={handleUpdateNodeStatus}
          />
        )}

        {activeTab === 'docs' && (
          <DocumentationTab />
        )}

        {activeTab === 'insights' && (
          <InsightsTab
            metrics={metrics}
            telemetryEvents={telemetryEvents}
            onTriggerMockWebhook={handleSimulateWebhook}
            onClearEvents={() => setTelemetryEvents([])}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0F172A]/70 px-4 lg:px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-heading font-bold text-white">DevPulse AI</span>
            <span>•</span>
            <span>Enterprise Developer Productivity Ecosystem</span>
            <span>•</span>
            <span className="text-[#06B6D4]">GIBC 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="live-pulse" /> WebSocket Mesh Active
            </span>
            <span>Gemini 3.8 Flash Engine</span>
            <span>OpenAPI 3.0.3</span>
          </div>
        </div>
      </footer>

      {/* 3-Minute Hackathon Pitch Script Modal */}
      <PitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          setIsPitchOpen(false);
        }}
      />

      {/* AI Copilot Side Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};

export default App;
