import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  GitPullRequest, 
  Radio, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Trash2, 
  Filter,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { TelemetryEvent, EngineeringMetrics } from '../types';

interface InsightsTabProps {
  metrics: EngineeringMetrics;
  telemetryEvents: TelemetryEvent[];
  onTriggerMockWebhook: (type: 'pr' | 'push' | 'scan') => void;
  onClearEvents: () => void;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  metrics,
  telemetryEvents,
  onTriggerMockWebhook,
  onClearEvents
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = telemetryEvents.filter(evt => {
    if (filterType === 'all') return true;
    return evt.type === filterType;
  });

  const getSeverityBadge = (severity: TelemetryEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'badge-rose';
      case 'warning': return 'badge-amber';
      case 'success': return 'badge-emerald';
      default: return 'badge-cyan';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Pillar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-emerald">Pillar 4</span>
            <span className="badge badge-cyan text-[11px] font-mono">Real-Time Telemetry Stream</span>
            <span className="badge badge-indigo text-[11px]">CI/CD Variance Analytics</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2 text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#10B981]" />
            Real-Time Health & Build Insights
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Unified engineering telemetry: streams real-time data capturing unit test coverage trends, build duration variances, PR review velocity, and continuous Git webhook activities.
          </p>
        </div>

        {/* Live WS Status Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 self-start md:self-center">
          <span className="live-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-medium">Telemetry Stream: Connected</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Build Duration */}
        <div className="glass-card-interactive p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Build Duration
            </span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white font-mono">1m 48s</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <TrendingDown className="w-3.5 h-3.5" /> -34%
            </span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-10 pt-2 border-t border-slate-800/80">
            {metrics.buildDurationTrend.map((val, i) => (
              <div 
                key={i} 
                className="flex-1 bg-[#6366F1]/50 hover:bg-[#6366F1] rounded-t transition-all"
                style={{ height: `${(val / 180) * 100}%` }}
                title={`Run ${i + 1}: ${val}s`}
              />
            ))}
          </div>
        </div>

        {/* Card 2: Test Coverage */}
        <div className="glass-card-interactive p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Test Coverage
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.testCoveragePercent}%</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" /> +6.6%
            </span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-10 pt-2 border-t border-slate-800/80">
            {metrics.testCoverageTrend.map((val, i) => (
              <div 
                key={i} 
                className="flex-1 bg-emerald-500/50 hover:bg-emerald-400 rounded-t transition-all"
                style={{ height: `${((val - 80) / 20) * 100}%` }}
                title={`Run ${i + 1}: ${val}%`}
              />
            ))}
          </div>
        </div>

        {/* Card 3: PR Review Time */}
        <div className="glass-card-interactive p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              PR Review Velocity
            </span>
            <GitPullRequest className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white font-mono">1.8 hrs</span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <TrendingDown className="w-3.5 h-3.5" /> -60% cycle
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Automated AST refactorings eliminate 40% of manual code review turnaround delays.
          </p>
        </div>

        {/* Card 4: AST Complexity Index */}
        <div className="glass-card-interactive p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AST Complexity
            </span>
            <Activity className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.astAverageComplexity}</span>
            <span className="badge badge-emerald text-[10px]">Optimal (&lt; 5.0)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Zero active OWASP Top 10 critical security patterns in production branch.
          </p>
        </div>
      </div>

      {/* Live Webhook & Telemetry Stream Section */}
      <div className="glass-panel p-5 space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#06B6D4] animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white">Live Git Webhook & Telemetry Stream</h3>
              <p className="text-xs text-slate-400 font-mono">ws://telemetry.devpulse.live/v1/stream</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {['all', 'ast_scan', 'pull_request', 'push', 'spec_synced'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-all ${
                    filterType === type ? 'bg-[#6366F1] text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={onClearEvents}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear event stream"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Stream Log Items */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-mono">
              No events found matching selected filter.
            </div>
          ) : (
            filteredEvents.map(evt => (
              <div 
                key={evt.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all font-mono text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className={`badge ${getSeverityBadge(evt.severity)} text-[10px] shrink-0 mt-0.5`}>
                    {evt.type.toUpperCase()}
                  </span>
                  <div>
                    <div className="font-semibold text-white font-sans">{evt.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 font-sans leading-relaxed">
                      {evt.details}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[11px] text-slate-500">
                  <div>{evt.timestamp}</div>
                  <div className="text-[#6366F1]">{evt.actor}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Webhook Trigger Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 bg-slate-900/60 p-3 rounded-xl">
          <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Simulate Real-Time Git Webhooks:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerMockWebhook('pr')}
              className="btn-secondary !py-1.5 text-xs text-rose-300 hover:text-rose-200"
            >
              + Mock PR Event (#145)
            </button>
            <button
              onClick={() => onTriggerMockWebhook('push')}
              className="btn-secondary !py-1.5 text-xs text-emerald-300 hover:text-emerald-200"
            >
              + Mock Push to main
            </button>
            <button
              onClick={() => onTriggerMockWebhook('scan')}
              className="btn-primary !py-1.5 text-xs font-semibold"
            >
              + Run Global AST Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
