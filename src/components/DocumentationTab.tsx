import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Send, 
  Play, 
  Sparkles, 
  Layers, 
  Code, 
  Braces, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { OpenApiEndpoint } from '../types';
import { OPENAPI_ENDPOINTS, SAMPLE_GENERATED_README } from '../data/mockData';

export const DocumentationTab: React.FC = () => {
  const [docView, setDocView] = useState<'openapi' | 'readme'>('openapi');
  const [selectedEndpointPath, setSelectedEndpointPath] = useState<string>(OPENAPI_ENDPOINTS[0].path);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Try it out state
  const selectedEndpoint = OPENAPI_ENDPOINTS.find(e => e.path === selectedEndpointPath) || OPENAPI_ENDPOINTS[0];
  const [requestBodyText, setRequestBodyText] = useState<string>(
    selectedEndpoint.requestBody?.samplePayload || '{}'
  );
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    headers: Record<string, string>;
    body: string;
  } | null>(null);

  // When endpoint changes, reset body text
  const handleSelectEndpoint = (endpoint: OpenApiEndpoint) => {
    setSelectedEndpointPath(endpoint.path);
    setRequestBodyText(endpoint.requestBody?.samplePayload || '{}');
    setTestResult(null);
  };

  const handleExecuteRequest = () => {
    setIsSendingRequest(true);
    setTimeout(() => {
      setIsSendingRequest(false);
      setTestResult({
        status: 200,
        statusText: 'OK',
        durationMs: 14.8,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-devpulse-ast-verified': 'true',
          'x-idempotency-status': 'ACQUIRED_AND_COMMITTED',
          'trace-id': '7f9a2e1-ast-span-88'
        },
        body: selectedEndpoint.responseSchema.sampleResponse
      });
    }, 450);
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([SAMPLE_GENERATED_README], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getMethodBadge = (method: OpenApiEndpoint['method']) => {
    switch (method) {
      case 'GET': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'POST': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PUT': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DELETE': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Pillar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-indigo">Pillar 3</span>
            <span className="badge badge-cyan text-[11px] font-mono">OpenAPI 3.0 Compliant</span>
            <span className="badge badge-emerald text-[11px]">Dynamic Markdown Sync</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2 text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-[#6366F1]" />
            Smart Documentation & API Spec Generator
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Zero-overhead continuous documentation: parses code routes, inline JSDoc comments, and TypeScript interfaces on every commit to assemble up-to-date OpenAPI 3.0 specs and rich README.md repository artifacts.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 self-start md:self-center">
          <button
            onClick={() => setDocView('openapi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              docView === 'openapi'
                ? 'bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Braces className="w-3.5 h-3.5" />
            <span>Interactive OpenAPI Spec</span>
          </button>
          <button
            onClick={() => setDocView('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              docView === 'readme'
                ? 'bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dynamic README Artifact</span>
          </button>
        </div>
      </div>

      {docView === 'openapi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoints Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-1">
              <span>AUTO-EXTRACTED ENDPOINTS ({OPENAPI_ENDPOINTS.length})</span>
              <span className="text-[#06B6D4] font-mono">AST Parsed</span>
            </div>

            <div className="space-y-2">
              {OPENAPI_ENDPOINTS.map(endpoint => {
                const isSelected = endpoint.path === selectedEndpoint.path;

                return (
                  <button
                    key={endpoint.path}
                    onClick={() => handleSelectEndpoint(endpoint)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getMethodBadge(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-white truncate">
                        {endpoint.path}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {endpoint.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Spec Export Card */}
            <div className="glass-panel p-4 bg-slate-900/70 space-y-2.5">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Export OpenAPI 3.0</span>
                <span className="text-emerald-400 font-mono text-[10px]">v3.0.3 Validated</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ready for Swagger UI, Redoc, Postman, or API Gateway import.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleCopyText(JSON.stringify(OPENAPI_ENDPOINTS, null, 2), 'spec')}
                  className="btn-secondary !py-1.5 text-xs flex-1 justify-center"
                >
                  {copiedType === 'spec' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Spec</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Endpoint Explorer & Tester (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-5 space-y-4">
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getMethodBadge(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {selectedEndpoint.tags.map(t => (
                    <span key={t} className="badge badge-indigo text-[10px]">{t}</span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedEndpoint.description}
              </p>

              {/* Request Parameters */}
              {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Parameters & Headers:
                  </div>
                  <div className="space-y-1.5">
                    {selectedEndpoint.parameters.map(param => (
                      <div key={param.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                        <div>
                          <span className="text-cyan-400 font-bold">{param.name}</span>
                          <span className="text-slate-500 ml-2">({param.in}, {param.type})</span>
                          {param.required && <span className="text-rose-400 ml-2 font-bold">*required</span>}
                        </div>
                        <input
                          type="text"
                          defaultValue={param.defaultValue}
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono w-48 text-right focus:outline-none focus:border-[#6366F1]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body Payload Editor (if POST/PUT) */}
              {selectedEndpoint.requestBody && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 uppercase tracking-wider">
                      Request Body (application/json):
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Interactive Payload</span>
                  </div>
                  <textarea
                    rows={6}
                    value={requestBodyText}
                    onChange={(e) => setRequestBodyText(e.target.value)}
                    className="w-full bg-[#0A0F1D] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-[#6366F1] resize-none"
                  />
                </div>
              )}

              {/* Execute / Try it out CTA */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="live-pulse" /> Mocking active on devpulse-cluster.internal
                </div>
                <button
                  onClick={handleExecuteRequest}
                  disabled={isSendingRequest}
                  className="btn-cyan !py-2 !px-4 text-xs font-bold"
                >
                  {isSendingRequest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send API Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Execution Result */}
              {testResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-emerald text-xs font-mono font-bold">
                        {testResult.status} {testResult.statusText}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Latency: <strong className="text-emerald-400">{testResult.durationMs}ms</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">AST Verified Spec</span>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Response Headers:</div>
                    <div className="p-2 rounded bg-[#0A0F1D] text-[10px] font-mono text-slate-400 space-y-0.5">
                      {Object.entries(testResult.headers).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-cyan-400">{k}:</span> {v}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Response JSON Body:</div>
                    <pre className="p-3 rounded-lg bg-[#0A0F1D] text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                      {testResult.body}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* SubTab 2: Dynamic README.md Generator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Metadata & Actions (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#06B6D4]" />
                Continuous README Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                DevPulse AI keeps your repository README.md continuously synchronized with active production realities: live build badges, test coverage meters, ASCII topology diagrams, and current microservice dependencies.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target File:</span>
                  <span className="font-mono text-white font-medium">README.md</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sync Frequency:</span>
                  <span className="font-mono text-emerald-400">Every Commit (Git hook)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Badges Embedded:</span>
                  <span className="font-mono text-cyan-400">5 Live SVG Badges</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => handleCopyText(SAMPLE_GENERATED_README, 'readme')}
                  className="w-full btn-primary justify-center !py-2 text-xs font-semibold"
                >
                  {copiedType === 'readme' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadReadme}
                  className="w-full btn-secondary justify-center !py-2 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download README.md</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Markdown Preview (8 Cols) */}
          <div className="lg:col-span-8 glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#6366F1]" />
                <span className="text-xs font-mono text-slate-300">Live Markdown Preview (Auto-Generated)</span>
              </div>
              <span className="badge badge-emerald text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Up to Date (Commit 7f9a2e1)
              </span>
            </div>

            {/* Formatted Markdown Display */}
            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 font-sans">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  ⚡ DevPulse AI — Fintech Payment Engine
                </h1>
              </div>

              {/* Dynamic Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="badge badge-emerald text-[10px]">build: passing</span>
                <span className="badge badge-indigo text-[10px]">coverage: 94.8%</span>
                <span className="badge badge-cyan text-[10px]">OWASP: clean</span>
                <span className="badge badge-pink text-[10px]">AST complexity: 3.2 (Optimal)</span>
                <span className="badge badge-indigo text-[10px]">OpenAPI: 3.0.3</span>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs">
                <strong>Auto-maintained by DevPulse AI</strong> — Last AST synchronized on commit <code className="text-cyan-300">7f9a2e1</code>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">🏛️ System Architecture Overview</h3>
                <pre className="p-3 rounded-lg bg-[#0A0F1D] text-[11px] font-mono text-cyan-300 border border-slate-800 overflow-x-auto">
{`[Edge Next.js Client] ──(HTTPS)──> [Cloudflare API Gateway]
                                          │
                  ┌───────────────────────┼──────────────────────┐
                  ▼ (gRPC)                ▼ (gRPC)               ▼ (WebSocket)
          [Auth & IAM Service]    [Payment Settlement]   [Live Telemetry]
                  │                       │                      │
                  ▼                       ▼                      ▼
         [Redis Redlock Mutex]     [PostgreSQL Primary]   [Apache Kafka]`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">📦 Core Services & Dependencies</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-left">
                        <th className="py-1.5 px-2">Service</th>
                        <th className="py-1.5 px-2">Protocol</th>
                        <th className="py-1.5 px-2">p99 Latency</th>
                        <th className="py-1.5 px-2">AST Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/60">
                        <td className="py-1.5 px-2 font-bold text-white">Edge Gateway</td>
                        <td className="py-1.5 px-2 text-cyan-400">HTTPS / Wasm</td>
                        <td className="py-1.5 px-2">18ms</td>
                        <td className="py-1.5 px-2 text-emerald-400">99%</td>
                      </tr>
                      <tr className="border-b border-slate-800/60">
                        <td className="py-1.5 px-2 font-bold text-white">Auth & IAM</td>
                        <td className="py-1.5 px-2 text-indigo-400">gRPC / JWT</td>
                        <td className="py-1.5 px-2">42ms</td>
                        <td className="py-1.5 px-2 text-emerald-400">94%</td>
                      </tr>
                      <tr className="border-b border-slate-800/60">
                        <td className="py-1.5 px-2 font-bold text-white">Payment Core</td>
                        <td className="py-1.5 px-2 text-pink-400">gRPC / SQL</td>
                        <td className="py-1.5 px-2">185ms</td>
                        <td className="py-1.5 px-2 text-amber-400">82% ⚠️</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
