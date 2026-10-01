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
  Shield,
  Copy,
  GitBranch,
  ExternalLink
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
  const [copiedPatch, setCopiedPatch] = useState(false);

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

  const handleCopyPatch = () => {
    navigator.clipboard.writeText(activePR.suggestedPatch);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
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
      {/* Top Banner: Title & Key Stats */}
      <div className="glass-panel p-5 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-indigo text-[11px]">Pillar 1</span>
              <span className="badge badge-cyan text-[11px] font-mono">Gemini 3.8 Flash AST Engine</span>
              <span className="badge badge-emerald text-[11px] font-mono">Git Webhooks Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-heading">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-[#6366F1]" />
              Automated AI Code & Performance Auditor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Deep semantic code inspection on incoming pull requests: scans Abstract Syntax Trees (AST) for concurrency race conditions, OWASP Top 10 vulnerabilities, and generates verified 1-click refactoring patches.
            </p>
          </div>

          {/* 3 Executive Stat Cards */}
          <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[90px]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Pending</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">
                {pullRequests.length - verifiedCount}
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[90px]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Critical</div>
              <div className={`text-lg font-bold font-mono ${criticalCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {criticalCount}
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[90px]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Verified</div>
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
          
          {/* Segmented Filter Control */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>CATEGORY FILTER:</span>
            </span>
            <span className="text-cyan-400">{filteredPRs.length} PRs</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'concurrency', label: 'Race' },
              { id: 'owasp', label: 'OWASP' },
              { id: 'memory', label: 'Leak' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`py-1.5 text-center rounded-lg text-[11px] font-medium transition-all ${
                  filterCategory === tab.id
                    ? 'bg-[#6366F1] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PR Cards */}
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
                  {/* Row 1: Badges & Timestamp */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#06B6D4]">
                        #{pr.number}
                      </span>
                      {isRefactored ? (
                        <span className="badge badge-emerald text-[10px] py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Refactored
                        </span>
                      ) : (
                        <span className={`badge text-[10px] py-0.5 font-bold ${
                          pr.severity === 'critical' ? 'badge-rose' : pr.severity === 'high' ? 'badge-amber' : 'badge-cyan'
                        }`}>
                          {pr.severity.toUpperCase()} RISK
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{pr.timestamp}</span>
                  </div>

                  {/* Row 2: Title */}
                  <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {pr.title}
                  </h4>

                  {/* Row 3: File Changed */}
                  <div className="text-[11px] text-slate-400 font-mono mt-2 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{pr.fileChanged}</span>
                  </div>

                  {/* Row 4: Author & Complexity */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={pr.authorAvatar} 
                        alt={pr.author} 
                        className="w-4 h-4 rounded-full object-cover shrink-0" 
                      />
                      <span className="truncate max-w-[90px]">{pr.author}</span>
                    </div>
                    <div className="font-mono text-[10px] bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60">
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
          
          {/* Workspace Top Card */}
          <div className="glass-panel p-5 border border-slate-800 space-y-4">
            
            {/* PR Header & Action CTA */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                    PR #{activePR.number}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-slate-500" />
                    {activePR.branch} → {activePR.targetBranch}
                  </span>
                  <span className="badge badge-indigo text-[10px]">{activePR.category}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-tight">
                  {activePR.title}
                </h3>
              </div>

              {/* 1-Click Action Button */}
              {activePR.status === 'refactored' ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 text-xs font-semibold shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Patch Verified & Applied</span>
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
                      <span>Applying AST Transform...</span>
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
                    <strong>Patch Successfully Applied!</strong> Distributed lock acquired, database connection pool release verified, cyclomatic complexity reduced from {activePR.cyclomaticComplexityBefore} to {activePR.cyclomaticComplexityAfter}, and unit tests passing.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-200 shrink-0 bg-emerald-900/60 px-2 py-0.5 rounded">
                  Commit #8a3f91
                </span>
              </div>
            )}

            {/* Segmented Workspace Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono">
              <button
                onClick={() => setActiveWorkspaceTab('diff')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                  activeWorkspaceTab === 'diff'
                    ? 'bg-[#6366F1] text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileDiff className="w-3.5 h-3.5" />
                <span>Code Diff & Patch</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('ast-details')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                  activeWorkspaceTab === 'ast-details'
                    ? 'bg-[#6366F1] text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Semantic & OWASP Analysis</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceTab('prompt-playground')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                  activeWorkspaceTab === 'prompt-playground'
                    ? 'bg-[#6366F1] text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Gemini AST Playground</span>
              </button>
            </div>

            {/* Sub-View 1: Professional Code Diff Viewer */}
            {activeWorkspaceTab === 'diff' && (
              <div className="space-y-2">
                {/* Code Window Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-t-xl text-xs font-mono">
                  {/* macOS window dots & file info */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{activePR.fileChanged}</span>
                    </div>
                  </div>

                  {/* Additions / Deletions count & Copy */}
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">
                      +{activePR.diffLines.filter(l => l.type === 'add').length} additions
                    </span>
                    <span className="text-rose-400 font-bold">
                      -{activePR.diffLines.filter(l => l.type === 'del').length} deletions
                    </span>
                    <button
                      onClick={handleCopyPatch}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copy Patch to Clipboard"
                    >
                      {copiedPatch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Diff Code Table with Clear Gutters */}
                <div className="overflow-x-auto rounded-b-xl bg-[#070D1B] border-x border-b border-slate-800 text-xs font-mono max-h-[460px] overflow-y-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {activePR.diffLines.map((line, idx) => {
                        const isAdd = line.type === 'add';
                        const isDel = line.type === 'del';
                        // Clean line content so leading + or - doesn't double up
                        let cleanedText = line.text;
                        let symbol = ' ';
                        if (isAdd) {
                          symbol = '+';
                          cleanedText = line.text.startsWith('+') ? line.text.substring(1) : line.text;
                        } else if (isDel) {
                          symbol = '-';
                          cleanedText = line.text.startsWith('-') ? line.text.substring(1) : line.text;
                        }

                        return (
                          <tr 
                            key={idx} 
                            className={`transition-colors ${
                              isAdd 
                                ? 'bg-emerald-950/25 text-emerald-300' 
                                : isDel 
                                ? 'bg-rose-950/25 text-rose-300' 
                                : 'text-slate-300 hover:bg-slate-800/20'
                            }`}
                          >
                            {/* Gutter: Old Line */}
                            <td className="w-10 py-0.5 px-1 text-right text-slate-600 select-none text-[11px] border-r border-slate-800/60 font-mono">
                              {line.oldLine || ''}
                            </td>
                            {/* Gutter: New Line */}
                            <td className="w-10 py-0.5 px-1 text-right text-slate-600 select-none text-[11px] border-r border-slate-800/60 font-mono">
                              {line.newLine || ''}
                            </td>
                            {/* Diff Symbol Column */}
                            <td className={`w-6 py-0.5 text-center select-none font-bold text-[12px] ${
                              isAdd ? 'text-emerald-400' : isDel ? 'text-rose-400' : 'text-slate-700'
                            }`}>
                              {symbol}
                            </td>
                            {/* Code Text Content */}
                            <td className="py-0.5 px-3 whitespace-pre font-mono leading-relaxed">
                              {cleanedText}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-View 2: Semantic & OWASP Analysis */}
            {activeWorkspaceTab === 'ast-details' && (
              <div className="space-y-4">
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 font-mono">
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

            {/* Sub-View 3: Gemini AST Playground */}
            {activeWorkspaceTab === 'prompt-playground' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-mono font-medium">Select Test Preset:</label>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setAstPreset('race')}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                          astPreset === 'race'
                            ? 'bg-[#6366F1]/20 border-[#6366F1] text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        1. Concurrency Race Condition
                      </button>
                      <button
                        onClick={() => setAstPreset('jwt')}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                          astPreset === 'jwt'
                            ? 'bg-[#6366F1]/20 border-[#6366F1] text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        2. OWASP A03: ReDoS & Algorithm Spoofing
                      </button>
                      <button
                        onClick={() => setAstPreset('leak')}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
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
                    <label className="text-xs text-slate-400 block mb-1.5 font-mono font-medium">Pipeline Orchestration:</label>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
                      <div>Engine: <span className="text-cyan-400 font-bold">Gemini 3.8 Flash</span></div>
                      <div>Parser: <span className="text-indigo-400 font-bold">Babel / TypeScript AST</span></div>
                      <div>Output: <span className="text-emerald-400 font-bold">Strict JSON Schema</span></div>
                    </div>
                    <button
                      onClick={handleRunASTPipeline}
                      disabled={isSimulatingAST}
                      className="w-full btn-cyan justify-center !py-2.5 text-xs font-bold mt-2.5"
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
