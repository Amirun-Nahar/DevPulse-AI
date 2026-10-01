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
  RefreshCw,
  Search,
  Eye,
  Terminal
} from 'lucide-react';
import { OpenApiEndpoint } from '../types';
import { OPENAPI_ENDPOINTS, SAMPLE_GENERATED_README } from '../data/mockData';

export const DocumentationTab: React.FC = () => {
  const [docView, setDocView] = useState<'openapi' | 'readme'>('openapi');
  const [selectedEndpointPath, setSelectedEndpointPath] = useState<string>(OPENAPI_ENDPOINTS[0].path);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [readmeMode, setReadmeMode] = useState<'preview' | 'raw'>('preview');

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

  const filteredEndpoints = OPENAPI_ENDPOINTS.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return e.path.toLowerCase().includes(q) || 
           e.summary.toLowerCase().includes(q) || 
           e.tags.some(t => t.toLowerCase().includes(q));
  });

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
    <div className="space-y-5">
      {/* Executive Header Banner */}
      <div className="glass-panel p-5 border border-slate-800 bg-gradient-to-r from-slate-900/95 via-indigo-950/20 to-slate-900/95 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-indigo text-xs">Pillar 3</span>
              <span className="badge badge-cyan text-xs font-mono">OpenAPI 3.0.3 Compliant</span>
              <span className="badge badge-emerald text-xs font-mono">Auto-Synced on Commit</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mt-2 text-white flex items-center gap-2.5 font-heading">
              <FileCode className="w-6 h-6 text-[#6366F1]" />
              Smart Documentation & API Spec Generator
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Zero-overhead continuous documentation: parses route definitions, inline docstrings, and TypeScript schemas to generate interactive OpenAPI 3.0 specs and auto-maintained README.md artifacts.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 self-start lg:self-center shrink-0">
            <button
              onClick={() => setDocView('openapi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                docView === 'openapi'
                  ? 'bg-[#6366F1] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Braces className="w-3.5 h-3.5" />
              <span>Interactive OpenAPI Spec</span>
            </button>
            <button
              onClick={() => setDocView('readme')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                docView === 'readme'
                  ? 'bg-[#6366F1] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dynamic README Artifact</span>
            </button>
          </div>
        </div>
      </div>

      {docView === 'openapi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Endpoints Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search endpoints or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
              <span>ENDPOINTS ({filteredEndpoints.length})</span>
              <span className="text-[#06B6D4]">AST Parsed</span>
            </div>

            {/* Endpoints List */}
            <div className="space-y-2">
              {filteredEndpoints.map(endpoint => {
                const isSelected = endpoint.path === selectedEndpoint.path;

                return (
                  <button
                    key={endpoint.path}
                    onClick={() => handleSelectEndpoint(endpoint)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800/95 border-[#6366F1] shadow-[0_4px_20px_rgba(99,102,241,0.2)] ring-1 ring-[#6366F1]/50'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
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
            <div className="glass-panel p-4 bg-slate-900/70 space-y-2.5 border border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Export OpenAPI 3.0</span>
                <span className="text-emerald-400 font-mono text-[10px]">v3.0.3 Validated</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ready for Swagger UI, Redoc, Postman, or API Gateway import.
              </p>
              <button
                onClick={() => handleCopyText(JSON.stringify(OPENAPI_ENDPOINTS, null, 2), 'spec')}
                className="w-full btn-secondary !py-1.5 text-xs justify-center"
              >
                {copiedType === 'spec' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Spec Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy OpenAPI JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Endpoint Explorer & Tester (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-5 space-y-4 border border-slate-800 rounded-2xl">
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
                  <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono">
                    Parameters & Headers:
                  </div>
                  <div className="space-y-1.5">
                    {selectedEndpoint.parameters.map(param => (
                      <div key={param.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
                        <div>
                          <span className="text-cyan-400 font-bold">{param.name}</span>
                          <span className="text-slate-500 ml-2">({param.in}, {param.type})</span>
                          {param.required && <span className="text-rose-400 ml-2 font-bold">*required</span>}
                        </div>
                        <input
                          type="text"
                          defaultValue={param.defaultValue}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono w-52 text-right focus:outline-none focus:border-[#6366F1]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body Payload Editor */}
              {selectedEndpoint.requestBody && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-300 uppercase tracking-wider">
                      Request Body (application/json):
                    </span>
                    <span className="text-slate-400 text-[11px]">Interactive Payload</span>
                  </div>
                  <textarea
                    rows={6}
                    value={requestBodyText}
                    onChange={(e) => setRequestBodyText(e.target.value)}
                    className="w-full bg-[#070D1B] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-[#6366F1] resize-none"
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
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1 font-mono">Response Headers:</div>
                    <div className="p-2 rounded-lg bg-[#070D1B] text-[10px] font-mono text-slate-400 space-y-0.5">
                      {Object.entries(testResult.headers).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-cyan-400">{k}:</span> {v}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1 font-mono">Response JSON Body:</div>
                    <pre className="p-3 rounded-lg bg-[#070D1B] text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Metadata & Actions (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-5 space-y-4 border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
                <FileText className="w-4 h-4 text-[#06B6D4]" />
                Continuous README Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                DevPulse AI keeps repository README.md continuously synchronized with active production realities: live build badges, test coverage meters, ASCII topology diagrams, and microservice dependencies.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target File:</span>
                  <span className="text-white font-medium">README.md</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sync Trigger:</span>
                  <span className="text-emerald-400">On Every Git Push</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Badges Embedded:</span>
                  <span className="text-cyan-400">5 Live SVG Badges</span>
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setReadmeMode('preview')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-all ${
                    readmeMode === 'preview' ? 'bg-[#6366F1] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Rendered
                </button>
                <button
                  onClick={() => setReadmeMode('raw')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-all ${
                    readmeMode === 'raw' ? 'bg-[#6366F1] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 inline mr-1" /> Raw Markdown
                </button>
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
          <div className="lg:col-span-8 glass-panel p-6 border border-slate-800 space-y-4 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#6366F1]" />
                <span className="text-xs font-mono text-slate-300">
                  {readmeMode === 'preview' ? 'Live Markdown Preview' : 'Raw README.md Source'}
                </span>
              </div>
              <span className="badge badge-emerald text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> In Sync (Commit 7f9a2e1)
              </span>
            </div>

            {readmeMode === 'preview' ? (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                <h1 className="text-xl font-bold text-white tracking-tight font-heading">
                  ⚡ DevPulse AI — Fintech Payment Engine
                </h1>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="badge badge-emerald text-[10px]">build: passing</span>
                  <span className="badge badge-indigo text-[10px]">coverage: 94.8%</span>
                  <span className="badge badge-cyan text-[10px]">OWASP: clean</span>
                  <span className="badge badge-pink text-[10px]">AST complexity: 3.2 (Optimal)</span>
                  <span className="badge badge-indigo text-[10px]">OpenAPI: 3.0.3</span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-mono">
                  <strong>Auto-maintained by DevPulse AI</strong> — Last AST synchronized on commit <code className="text-cyan-300">7f9a2e1</code>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-2 font-heading">🏛️ System Architecture Overview</h3>
                  <pre className="p-3.5 rounded-xl bg-[#070D1B] text-[11px] font-mono text-cyan-300 border border-slate-800 overflow-x-auto">
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
                  <h3 className="text-sm font-bold text-white mb-2 font-heading">📦 Core Services & Dependencies</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-[11px] font-mono text-slate-300 border-collapse bg-slate-900/60">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-left bg-slate-900">
                          <th className="py-2 px-3">Service</th>
                          <th className="py-2 px-3">Protocol</th>
                          <th className="py-2 px-3">p99 Latency</th>
                          <th className="py-2 px-3">AST Health</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-800/60">
                          <td className="py-2 px-3 font-bold text-white">Edge Gateway</td>
                          <td className="py-2 px-3 text-cyan-400">HTTPS / Wasm</td>
                          <td className="py-2 px-3">18ms</td>
                          <td className="py-2 px-3 text-emerald-400">99%</td>
                        </tr>
                        <tr className="border-b border-slate-800/60">
                          <td className="py-2 px-3 font-bold text-white">Auth & IAM</td>
                          <td className="py-2 px-3 text-indigo-400">gRPC / JWT</td>
                          <td className="py-2 px-3">42ms</td>
                          <td className="py-2 px-3 text-emerald-400">94%</td>
                        </tr>
                        <tr className="border-b border-slate-800/60">
                          <td className="py-2 px-3 font-bold text-white">Payment Core</td>
                          <td className="py-2 px-3 text-pink-400">gRPC / SQL</td>
                          <td className="py-2 px-3">185ms</td>
                          <td className="py-2 px-3 text-amber-400">82% ⚠️</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <pre className="p-4 rounded-xl bg-[#070D1B] border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
                {SAMPLE_GENERATED_README}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
