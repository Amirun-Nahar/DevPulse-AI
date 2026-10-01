import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  GitPullRequest, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Code2, 
  FileDiff, 
  Terminal, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Play, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  Check,
  Flame,
  Binary,
  Filter,
  ArrowDownRight,
  FileCode,
  Shield
} from 'lucide-react';
import { PullRequest } from '../types';

interface AuditorTabProps {
  pullRequests: PullRequest[];
  onApplyPatch: (prId: string) => void;
  activePRId: string;
  setActivePRId: (id: string) => void;
}

export const AuditorTab: React.FC<AuditorTabProps> = ({
  pullRequests,
  onApplyPatch,
  activePRId,
  setActivePRId
}) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'diff' | 'ast-details' | 'prompt-playground'>('diff');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  // AST Playground state
  const [astPreset, setAstPreset] = useState<'race' | 'jwt' | 'leak' | 'sqli'>('race');
  const [isSimulatingAST, setIsSimulatingAST] = useState(false);
  const [astOutput, setAstOutput] = useState<{
    latencyMs: number;
    tokens: number;
    astNodes: number;
    findings: string[];
    riskScore: number;
  } | null>(null);

  const filteredPRs = pullRequests.filter(pr => {
    if (filterCategory === 'all') return true;
    return pr.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const activePR = pullRequests.find(pr => pr.id === activePRId) || filteredPRs[0] || pullRequests[0];

  const handleApplyClick = (prId: string) => {
    setIsApplying(true);
    setTimeout(() => {
      onApplyPatch(prId);
      setIsApplying(false);
      setAppliedSuccess(prId);
      
      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#06B6D4', '#EC4899', '#10B981']
        });
      } catch (e) {
        console.log('Confetti effect triggered');
      }

      setTimeout(() => setAppliedSuccess(null), 4500);
    }, 700);
  };

  const handleRunASTPipeline = () => {
    setIsSimulatingAST(true);
    setAstOutput(null);
    setTimeout(() => {
      setIsSimulatingAST(false);
      if (astPreset === 'race') {
        setAstOutput({
          latencyMs: 218,
          tokens: 1840,
          astNodes: 1420,
          findings: [
            'Concurrency hazard: unguarded balance mutation across async await boundaries.',
            'Uncaught database connection pool leak detected in error return branch.',
            'Remediation: Enforce Mutex.acquireLock() with RAII async disposal and client.release() in finally.'
          ],
          riskScore: 92
        });
      } else if (astPreset === 'jwt') {
        setAstOutput({
          latencyMs: 184,
          tokens: 1220,
          astNodes: 860,
          findings: [
            'OWASP A03: ReDoS catastrophic backtracking in regex quantifier pattern.',
            'Algorithm spoofing hazard: jwt.decode accepts insecure "none" algorithm.',
            'Remediation: Whitelist explicit RS256 algorithm and apply strict clock tolerance.'
          ],
          riskScore: 84
        });
      } else if (astPreset === 'leak') {
        setAstOutput({
          latencyMs: 165,
          tokens: 950,
          astNodes: 520,
          findings: [
            'Memory leak: Unbounded event listener accumulation on shared telemetryBus.',
            'Heap consumption grows by ~14MB per 1k disconnected client sockets.',
            'Remediation: Attach teardown handler in ws.once("close") with bus.off().'
          ],
          riskScore: 68
        });
      } else {
        setAstOutput({
          latencyMs: 195,
          tokens: 1450,
          astNodes: 980,
          findings: [
            'OWASP A03 SQL Injection: Direct string interpolation in client.query().',
            'Untrusted user payload passed unescaped to database engine.',
            'Remediation: Enforce parameterized query arrays.'
          ],
          riskScore: 96
        });
      }
    }, 550);
  };

  const criticalCount = pullRequests.filter(p => p.severity === 'critical' && p.status !== 'refactored').length;
  const verifiedCount = pullRequests.filter(p => p.status === 'refactored').length;

  return (
    <div className="space-y-5">
      {/* Executive Header Banner */}
      <div className="glass-panel p-5 border border-slate-800 bg-gradient-to-r from-slate-900/95 via-indigo-950/20 to-slate-900/95 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-indigo text-xs">Pillar 1</span>
              <span className="badge badge-cyan text-xs font-mono">Gemini 3.8 Flash AST Pipeline</span>
              <span className="badge badge-emerald text-xs font-mono">Git Webhooks Hooked</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mt-2 text-white flex items-center gap-2.5 font-heading">
              <ShieldAlert className="w-6 h-6 text-[#6366F1]" />
              Automated AI Code & Performance Auditor
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Deep semantic code analysis on incoming pull requests: parses Abstract Syntax Trees (AST) to detect concurrency race conditions, OWASP Top 10 vulnerabilities, and generates verified 1-click refactoring patches.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Pending Review</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">
                {pullRequests.length - verifiedCount}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Critical Risks</div>
              <div className={`text-lg font-bold font-mono ${criticalCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {criticalCount}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Verified Fixes</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {verifiedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Master/Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: PR Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Filter Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Filter className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>CATEGORY FILTER:</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              {filteredPRs.length} PRs Found
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'concurrency', 'owasp', 'memory'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize font-mono text-[11px] transition-all ${
                  filterCategory === cat
                    ? 'bg-[#6366F1] text-white font-bold shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PR Card List */}
          <div className="space-y-2.5">
            {filteredPRs.map(pr => {
              const isSelected = pr.id === activePR.id;
              const isRefactored = pr.status === 'refactored';

              return (
                <div
                  key={pr.id}
                  onClick={() => setActivePRId(pr.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-800/95 border-[#6366F1] shadow-[0_4px_20px_rgba(99,102,241,0.25)] ring-1 ring-[#6366F1]/50'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#06B6D4]">
                        PR #{pr.number}
                      </span>
                      {isRefactored ? (
                        <span className="badge badge-emerald text-[10px] py-0 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Refactored
                        </span>
                      ) : (
                        <span className={`badge text-[10px] py-0 font-semibold ${
                          pr.severity === 'critical' ? 'badge-rose' : pr.severity === 'high' ? 'badge-amber' : 'badge-cyan'
                        }`}>
                          {pr.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{pr.timestamp}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-white mt-2 leading-snug">
                    {pr.title}
                  </h4>

                  <div className="text-[11px] text-slate-400 font-mono mt-1.5 flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{pr.fileChanged}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={pr.authorAvatar} 
                        alt={pr.author} 
                        className="w-4 h-4 rounded-full object-cover" 
                      />
                      <span>{pr.author}</span>
                    </div>
                    <div className="font-mono">
                      Complexity: <span className="text-rose-400 font-bold">{pr.cyclomaticComplexityBefore}</span> → <span className="text-emerald-400 font-bold">{pr.cyclomaticComplexityAfter}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Workspace Action Bar */}
          <div className="glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                    PR #{activePR.number}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activePR.branch} → {activePR.targetBranch}
                  </span>
                  <span className="badge badge-indigo text-[10px]">{activePR.category}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5 font-heading">
                  {activePR.title}
                </h3>
              </div>

              {/* 1-Click Action Button */}
              {activePR.status === 'refactored' ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-semibold shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Patch Applied & Verified</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplyClick(activePR.id)}
                  disabled={isApplying}
                  className="btn-primary shrink-0 !py-2.5 !px-4 text-xs font-bold"
                >
                  {isApplying ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying & Applying Patch...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#FDE047] animate-pulse" />
                      <span>Apply Verified 1-Click Patch</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Success Notification Alert */}
            {appliedSuccess === activePR.id && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Patch Successfully Applied!</strong> Mutex locks committed, database connection leak eliminated, cyclomatic complexity reduced from {activePR.cyclomaticComplexityBefore} to {activePR.cyclomaticComplexityAfter}, and tests passed.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-200 shrink-0 bg-emerald-900/60 px-2 py-0.5 rounded">
                  Commit #8a3f91
                </span>
              </div>
            )}

            {/* Workspace View Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pt-2 text-xs font-medium">
              <button
                onClick={() => setActiveWorkspaceTab('diff')}
                className={`flex items-center gap-1.5 pb-2.5 border-b-2 font-mono transition-all ${
                  activeWorkspaceTab === 'diff'
                    ? 'border-[#6366F1] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileDiff className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Code Diff & Refactoring</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('ast-details')}
                className={`flex items-center gap-1.5 pb-2.5 border-b-2 font-mono transition-all ${
                  activeWorkspaceTab === 'ast-details'
                    ? 'border-[#6366F1] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Semantic & OWASP Analysis</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('prompt-playground')}
                className={`flex items-center gap-1.5 pb-2.5 border-b-2 font-mono transition-all ${
                  activeWorkspaceTab === 'prompt-playground'
                    ? 'border-[#6366F1] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Gemini AST Playground</span>
              </button>
            </div>

            {/* Tab 1: Interactive Code Diff */}
            {activeWorkspaceTab === 'diff' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activePR.fileChanged}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400">
                      +{activePR.diffLines.filter(l => l.type === 'add').length} additions
                    </span>
                    <span className="text-rose-400">
                      -{activePR.diffLines.filter(l => l.type === 'del').length} deletions
                    </span>
                  </div>
                </div>

                {/* Diff Viewer */}
                <div className="overflow-x-auto rounded-xl bg-[#070D1B] border border-slate-800 text-xs font-mono max-h-[460px] overflow-y-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {activePR.diffLines.map((line, idx) => (
                        <tr 
                          key={idx} 
                          className={`transition-colors ${
                            line.type === 'add' 
                              ? 'diff-line-add' 
                              : line.type === 'del' 
                              ? 'diff-line-del' 
                              : 'diff-line-normal'
                          }`}
                        >
                          <td className="w-10 py-0.5 px-2 text-right text-slate-600 select-none text-[11px]">
                            {line.oldLine || ''}
                          </td>
                          <td className="w-10 py-0.5 px-2 text-right text-slate-600 select-none text-[11px]">
                            {line.newLine || ''}
                          </td>
                          <td className="py-0.5 px-3 whitespace-pre font-mono">
                            {line.text}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Semantic & OWASP Analysis */}
            {activeWorkspaceTab === 'ast-details' && (
              <div className="space-y-4">
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Vulnerability & Anti-Pattern Vectors
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      AST Nodes: {activePR.astDetails.nodesInspected} | Depth: {activePR.astDetails.depth}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activePR.summary}
                  </p>

                  <div className="space-y-2 pt-1">
                    {activePR.semanticAnalysis.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-[#6366F1] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 mt-3 text-xs font-mono">
                    <div className="text-cyan-400 font-bold mb-1">AST Fix Pattern Rule:</div>
                    <div className="text-slate-300">{activePR.astDetails.astFixRule}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Gemini Prompt Playground */}
            {activeWorkspaceTab === 'prompt-playground' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-medium">Select Test Preset:</label>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setAstPreset('race')}
                        className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all border ${
                          astPreset === 'race'
                            ? 'bg-[#6366F1]/20 border-[#6366F1] text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        1. Concurrency Race Condition
                      </button>
                      <button
                        onClick={() => setAstPreset('jwt')}
                        className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all border ${
                          astPreset === 'jwt'
                            ? 'bg-[#6366F1]/20 border-[#6366F1] text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        2. OWASP A03: ReDoS & Algorithm Spoofing
                      </button>
                      <button
                        onClick={() => setAstPreset('leak')}
                        className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all border ${
                          astPreset === 'leak'
                            ? 'bg-[#6366F1]/20 border-[#6366F1] text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        3. Memory Leak: Event Listener Accumulation
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-medium">AST Pipeline Orchestration:</label>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                      <div>Engine: <span className="text-cyan-400 font-bold">Gemini 3.8 Flash</span></div>
                      <div>Parser: <span className="text-indigo-400 font-bold">Babel / TypeScript AST</span></div>
                      <div>Output: <span className="text-emerald-400 font-bold">Strict JSON Schema</span></div>
                    </div>
                    <button
                      onClick={handleRunASTPipeline}
                      disabled={isSimulatingAST}
                      className="w-full btn-cyan justify-center !py-2 text-xs font-bold mt-2"
                    >
                      {isSimulatingAST ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing Pipeline...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Run Gemini AST Pipeline</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Pipeline Output */}
                {astOutput && (
                  <div className="p-4 rounded-xl bg-[#070D1B] border border-[#6366F1]/50 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Analysis Results
                      </span>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                        <span>Latency: <strong className="text-cyan-400">{astOutput.latencyMs}ms</strong></span>
                        <span>Tokens: <strong className="text-purple-400">{astOutput.tokens}</strong></span>
                        <span>Risk: <strong className="text-rose-400">{astOutput.riskScore}/100</strong></span>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {astOutput.findings.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
