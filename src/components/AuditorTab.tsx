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
  Binary
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
  const [subTab, setSubTab] = useState<'pr-diff' | 'ast-pipeline'>('pr-diff');
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

  const activePR = pullRequests.find(pr => pr.id === activePRId) || pullRequests[0];

  const handleApplyClick = (prId: string) => {
    setIsApplying(true);
    setTimeout(() => {
      onApplyPatch(prId);
      setIsApplying(false);
      setAppliedSuccess(prId);
      
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#06B6D4', '#EC4899', '#10B981']
        });
      } catch (e) {
        console.log('Confetti effect');
      }

      setTimeout(() => setAppliedSuccess(null), 4000);
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
            'Concurrency vulnerability: unguarded read-then-write on wallet balance.',
            'Uncaught DB pool connection leak detected in non-guaranteed branch.',
            'Remediation: Wrap with DistributedLock.acquire() and pgPool.release() in finally-block.'
          ],
          riskScore: 92
        });
      } else if (astPreset === 'jwt') {
        setAstOutput({
          latencyMs: 184,
          tokens: 1220,
          astNodes: 860,
          findings: [
            'OWASP A03: ReDoS catastrophic backtracking in regex quantifier.',
            'Algorithm spoofing vulnerability: jwt.decode accepts algorithm "none".',
            'Remediation: Enforce RS256 algorithm whitelist with clockTolerance: 10.'
          ],
          riskScore: 84
        });
      } else if (astPreset === 'leak') {
        setAstOutput({
          latencyMs: 165,
          tokens: 950,
          astNodes: 520,
          findings: [
            'Memory leak: Unbounded event listener on shared telemetryBus.',
            'Heap growth rate: ~14MB per 1k disconnected sockets.',
            'Remediation: Attach ws.once("close") teardown handler with bus.off().'
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
            'Untrusted user input payload passed to raw SQL template.',
            'Remediation: Use parameterized queries with array params [userId].'
          ],
          riskScore: 96
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Pillar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-indigo">Pillar 1</span>
            <span className="badge badge-cyan font-mono text-[11px]">Gemini 3.8 AST Engine</span>
            <span className="badge badge-emerald text-[11px]">Real-time Webhook Hooked</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2 text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#6366F1]" />
            Automated AI Code & Performance Auditor
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Deep semantic analysis beyond basic linting: parses Abstract Syntax Trees (AST) to detect logic flaws, race conditions, OWASP Top 10 vulnerabilities, and generate one-click verified refactorings.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 self-start md:self-center">
          <button
            onClick={() => setSubTab('pr-diff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'pr-diff'
                ? 'bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>PR Review & 1-Click Fix</span>
          </button>
          <button
            onClick={() => setSubTab('ast-pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'ast-pipeline'
                ? 'bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AST & Prompt Playground</span>
          </button>
        </div>
      </div>

      {subTab === 'pr-diff' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PR Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-1">
              <span>ACTIVE PULL REQUESTS ({pullRequests.length})</span>
              <span className="text-[#06B6D4] font-mono">AST Monitored</span>
            </div>

            <div className="space-y-2.5">
              {pullRequests.map(pr => {
                const isSelected = pr.id === activePR.id;
                const isRefactored = pr.status === 'refactored';

                return (
                  <div
                    key={pr.id}
                    onClick={() => setActivePRId(pr.id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-slate-800/90 border-[#6366F1] shadow-[0_0_18px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#06B6D4]">
                          #{pr.number}
                        </span>
                        {isRefactored ? (
                          <span className="badge badge-emerald text-[10px] py-0">
                            <CheckCircle2 className="w-3 h-3" /> Verified & Refactored
                          </span>
                        ) : (
                          <span className={`badge text-[10px] py-0 ${
                            pr.severity === 'critical' ? 'badge-rose' : pr.severity === 'high' ? 'badge-amber' : 'badge-cyan'
                          }`}>
                            {pr.severity.toUpperCase()} RISK
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{pr.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mt-1.5 line-clamp-2 leading-snug">
                      {pr.title}
                    </h4>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src={pr.authorAvatar} 
                          alt={pr.author} 
                          className="w-4 h-4 rounded-full object-cover" 
                        />
                        <span>{pr.author}</span>
                      </div>
                      <div className="font-mono">
                        Complexity: <span className="text-rose-400">{pr.cyclomaticComplexityBefore}</span> → <span className="text-emerald-400">{pr.cyclomaticComplexityAfter}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Metrics Callout */}
            <div className="glass-panel p-4 mt-4 bg-gradient-to-br from-indigo-950/30 to-slate-900/60 border-indigo-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A5B4FC]">
                <Zap className="w-4 h-4 text-[#6366F1]" />
                <span>DevPulse AST Analysis Engine</span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                AST parsing operates before PR merge, scanning control-flow graphs (CFG) for concurrency hazards and OWASP Top 10 vulnerabilities.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Avg Scan Time</div>
                  <div className="text-sm font-bold text-[#06B6D4] font-mono">180ms</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Fix Confidence</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">99.4%</div>
                </div>
              </div>
            </div>
          </div>

          {/* PR Details & Diff Viewer (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* PR Header & 1-Click Action */}
            <div className="glass-panel p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#06B6D4]">
                      PR #{activePR.number}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {activePR.branch} → {activePR.targetBranch}
                    </span>
                    <span className="badge badge-indigo text-[10px]">{activePR.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {activePR.title}
                  </h3>
                </div>

                {/* 1-Click Fix Button */}
                {activePR.status === 'refactored' ? (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Patch Applied & Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyClick(activePR.id)}
                    disabled={isApplying}
                    className="btn-primary self-start sm:self-center !py-2.5 !px-4 text-xs font-bold"
                  >
                    {isApplying ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin text-white" />
                        <span>Applying AST Patch...</span>
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

              {appliedSuccess === activePR.id && (
                <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      <strong>Patch Applied!</strong> Distributed lock integrated, connection pool leak resolved, and test suite rerun successfully.
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-200">Commit: #8a3f91</span>
                </div>
              )}

              {/* Semantic Findings Callout */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Deep Semantic Analysis & Vulnerability Vectors
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    AST Nodes: {activePR.astDetails.nodesInspected} | Depth: {activePR.astDetails.depth}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activePR.summary}
                </p>
                <div className="space-y-1.5 pt-1">
                  {activePR.semanticAnalysis.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-[#6366F1] font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 mt-2 text-[11px] text-slate-300 font-mono">
                  <div className="text-cyan-400 font-bold mb-1">AST Fix Rule:</div>
                  {activePR.astDetails.astFixRule}
                </div>
              </div>
            </div>

            {/* Interactive Code Diff Viewer */}
            <div className="glass-panel overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <FileDiff className="w-4 h-4 text-[#6366F1]" />
                  <span>{activePR.fileChanged}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-emerald-400">
                    +{activePR.diffLines.filter(l => l.type === 'add').length} lines
                  </span>
                  <span className="text-rose-400">
                    -{activePR.diffLines.filter(l => l.type === 'del').length} lines
                  </span>
                </div>
              </div>

              {/* Code lines */}
              <div className="overflow-x-auto p-2 bg-[#0A0F1D] text-xs font-mono max-h-[460px] overflow-y-auto">
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
                        <td className="w-8 py-0.5 px-2 text-right text-slate-600 select-none text-[11px]">
                          {line.oldLine || ''}
                        </td>
                        <td className="w-8 py-0.5 px-2 text-right text-slate-600 select-none text-[11px]">
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
          </div>
        </div>
      ) : (
        /* SubTab 2: AST Inspector & Prompt Orchestrator Playground */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Preset Selector (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#06B6D4]" />
                AST Prompt Pipeline Config
              </h3>
              <p className="text-xs text-slate-300">
                DevPulse AI extracts Abstract Syntax Tree representation from raw source files and injects structured AST node context into Gemini LLM prompt orchestration pipelines.
              </p>

              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Select Vulnerability Test Preset:</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setAstPreset('race')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                      astPreset === 'race'
                        ? 'bg-[#6366F1]/20 border-[#6366F1] text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-[#A5B4FC]">1. Concurrency Race Condition</div>
                    <div className="text-[11px] text-slate-400">Detached await with balance mutation</div>
                  </button>

                  <button
                    onClick={() => setAstPreset('jwt')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                      astPreset === 'jwt'
                        ? 'bg-[#6366F1]/20 border-[#6366F1] text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-[#67E8F9]">2. OWASP A03: ReDoS & Algorithm Spoofing</div>
                    <div className="text-[11px] text-slate-400">Catastrophic regex backtracking</div>
                  </button>

                  <button
                    onClick={() => setAstPreset('leak')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                      astPreset === 'leak'
                        ? 'bg-[#6366F1]/20 border-[#6366F1] text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-[#F472B6]">3. Memory Leak: Event Listener Accumulation</div>
                    <div className="text-[11px] text-slate-400">Unbounded EventEmitter on connection</div>
                  </button>

                  <button
                    onClick={() => setAstPreset('sqli')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                      astPreset === 'sqli'
                        ? 'bg-[#6366F1]/20 border-[#6366F1] text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-amber-400">4. OWASP A03: SQL Injection</div>
                    <div className="text-[11px] text-slate-400">Unescaped string interpolation in query</div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleRunASTPipeline}
                disabled={isSimulatingAST}
                className="w-full btn-primary justify-center !py-2.5 text-xs font-bold"
              >
                {isSimulatingAST ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Parsing AST & Orchestrating LLM...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>Execute AST Pipeline & Gemini Model</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AST Tree Visualizer & Prompt Stream (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Binary className="w-4 h-4 text-[#6366F1]" />
                  <span className="text-sm font-bold text-white">AST Syntax Tree & Context Pipeline</span>
                </div>
                <span className="badge badge-cyan font-mono text-[10px]">
                  Babel / SWC Parser Active
                </span>
              </div>

              {/* AST Tree snippet */}
              <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto">
                <div className="text-slate-500 mb-1">// Parsed AST Nodes (Control Flow Graph)</div>
                <div className="text-purple-400">Program</div>
                <div className="pl-4 text-blue-400">└─ FunctionDeclaration (id: "processSettlement", async: true)</div>
                <div className="pl-8 text-emerald-400">├─ VariableDeclaration (kind: "const", id: "client")</div>
                <div className="pl-8 text-rose-400">├─ AwaitExpression (callee: "pgPool.connect") ⚠️ [Acquired without RAII lease]</div>
                <div className="pl-8 text-yellow-400">├─ IfStatement (test: BinaryExpression "&gt;=")</div>
                <div className="pl-12 text-rose-400">├─ AwaitExpression (callee: "sleep") ⚠️ [Race window gap: 40ms]</div>
                <div className="pl-12 text-blue-400">└─ CallExpression (callee: "client.query", method: "UPDATE")</div>
                <div className="pl-8 text-rose-400">└─ ReturnStatement (missing client.release() in error branch)</div>
              </div>

              {/* Gemini Prompt Template preview */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>ORCHESTRATED LLM PROMPT (Gemini 3.8 Flash)</span>
                  <span className="text-[#06B6D4] font-mono text-[10px]">Strict JSON Schema Output</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-slate-500">// System Role:</span> Senior Distributed Systems & Security Architect<br />
                  <span className="text-slate-500">// Context Injection:</span> AST nodes inspected: 1,420; cyclomatic depth: 9; concurrency hazards: detected.<br />
                  <span className="text-slate-500">// Task:</span> Provide minimal, guaranteed-safe refactoring with distributed lock & connection pooling cleanup.
                </div>
              </div>

              {/* Pipeline Output */}
              {astOutput && (
                <div className="p-4 rounded-xl bg-slate-900 border border-[#6366F1]/50 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Gemini 3.8 Analysis Results</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>Latency: <strong className="text-[#06B6D4]">{astOutput.latencyMs}ms</strong></span>
                      <span>Tokens: <strong className="text-purple-400">{astOutput.tokens}</strong></span>
                      <span>Risk: <strong className="text-rose-400">{astOutput.riskScore}/100</strong></span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {astOutput.findings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
