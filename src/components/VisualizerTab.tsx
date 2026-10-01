import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  Server, 
  Database, 
  Network, 
  Cpu, 
  Shield, 
  Radio, 
  X, 
  Flame, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ArchNode, ArchEdge } from '../types';

interface VisualizerTabProps {
  nodes: ArchNode[];
  edges: ArchEdge[];
  onUpdateNodeStatus: (nodeId: string, status: 'healthy' | 'warning' | 'degraded', latency: number) => void;
}

export const VisualizerTab: React.FC<VisualizerTabProps> = ({
  nodes: initialNodes,
  edges,
  onUpdateNodeStatus
}) => {
  const [nodes, setNodes] = useState<ArchNode[]>(initialNodes);
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-payment');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState<boolean>(false);

  // Sync internal nodes if parent changes (e.g. after patch)
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Filtering
  const filteredNodes = nodes.filter(node => {
    if (selectedLayer === 'all') return true;
    return node.layer === selectedLayer;
  });

  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      dragOffsetRef.current = {
        x: e.clientX - node.x,
        y: e.clientY - node.y
      };
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const newX = Math.max(20, Math.min(1080, e.clientX - canvasRect.left));
    const newY = Math.max(20, Math.min(420, e.clientY - canvasRect.top));

    setNodes(prev => prev.map(n => {
      if (n.id === draggingNodeId) {
        return { ...n, x: newX, y: newY };
      }
      return n;
    }));
  };

  const handleMouseUpCanvas = () => {
    setDraggingNodeId(null);
  };

  const handleTriggerLoadSpike = () => {
    setIsSimulatingLoad(true);
    onUpdateNodeStatus('node-payment', 'warning', 345);
    setTimeout(() => {
      setIsSimulatingLoad(false);
    }, 4000);
  };

  const handleOptimizeService = () => {
    onUpdateNodeStatus('node-payment', 'healthy', 45);
  };

  const getNodeIcon = (layer: ArchNode['layer']) => {
    switch (layer) {
      case 'frontend': return <Share2 className="w-4 h-4 text-cyan-400" />;
      case 'gateway': return <Network className="w-4 h-4 text-indigo-400" />;
      case 'auth': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'microservice': return <Server className="w-4 h-4 text-pink-400" />;
      case 'datastore': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'queue': return <Radio className="w-4 h-4 text-amber-400" />;
      case 'ai': return <Cpu className="w-4 h-4 text-indigo-300" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Pillar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">Pillar 2</span>
            <span className="badge badge-indigo text-[11px]">Real-Time Topology Graph</span>
            <span className="badge badge-emerald text-[11px] font-mono">WebSocket Network Pulses Active</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2 text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#06B6D4]" />
            Interactive Architecture & Dependency Visualizer
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Dynamic canvas-based topological rendering: drag nodes to rearrange, inspect live latency & error rates, and monitor real-time network traffic flow across microservice boundaries.
          </p>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80 self-start md:self-center">
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-slate-700" />
          <span className="text-xs font-mono text-cyan-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Layer Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium pl-1">
          <Filter className="w-3.5 h-3.5" /> Filter Layer:
        </span>
        {['all', 'frontend', 'gateway', 'microservice', 'auth', 'datastore', 'queue', 'ai'].map(layer => (
          <button
            key={layer}
            onClick={() => setSelectedLayer(layer)}
            className={`px-3 py-1 rounded-lg capitalize font-mono transition-all ${
              selectedLayer === layer
                ? 'bg-[#06B6D4] text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Main Canvas & Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Canvas (8 Cols) */}
        <div className="lg:col-span-8 glass-panel overflow-hidden border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Activity className="w-4 h-4 text-[#06B6D4]" />
              <span className="font-mono">Topology Mesh ({filteredNodes.length} Nodes, {edges.length} Active Edges)</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Degraded / Warning
              </span>
              <span className="text-[#6366F1]">Click & drag nodes</span>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div 
            ref={canvasRef}
            onMouseMove={handleMouseMoveCanvas}
            onMouseUp={handleMouseUpCanvas}
            className="canvas-grid-bg relative w-full h-[480px] overflow-hidden select-none bg-[#070D1B]"
          >
            <div 
              style={{ 
                transform: `scale(${zoomLevel})`,
                transformOrigin: '0 0',
                transition: draggingNodeId ? 'none' : 'transform 0.15s ease-out',
                width: '1200px',
                height: '520px',
                position: 'relative'
              }}
            >
              {/* Connecting Edges (SVG overlay) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {edges.map(edge => {
                  const src = nodes.find(n => n.id === edge.source);
                  const tgt = nodes.find(n => n.id === edge.target);
                  if (!src || !tgt) return null;

                  // Center points of nodes (approx width 180, height 70)
                  const x1 = src.x + 90;
                  const y1 = src.y + 35;
                  const x2 = tgt.x + 90;
                  const y2 = tgt.y + 35;

                  // Curvature control
                  const dx = (x2 - x1) * 0.5;
                  const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                  return (
                    <g key={edge.id}>
                      {/* Base edge background line */}
                      <path
                        d={d}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.15)"
                        strokeWidth="2.5"
                      />
                      {/* Active WebSocket pulsing edge */}
                      {edge.isPulsing && (
                        <path
                          d={d}
                          fill="none"
                          stroke="url(#edgeGrad)"
                          strokeWidth="2"
                          className="edge-pulse-active"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes */}
              {filteredNodes.map(node => {
                const isSelected = node.id === selectedNodeId;
                const isWarning = node.status === 'warning';

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                    style={{
                      transform: `translate(${node.x}px, ${node.y}px)`,
                      cursor: draggingNodeId === node.id ? 'grabbing' : 'grab'
                    }}
                    className={`absolute z-20 w-[190px] rounded-xl p-3 select-none backdrop-blur-md transition-all ${
                      isSelected
                        ? 'bg-[#1E293B]/95 border-2 border-[#06B6D4] shadow-[0_0_25px_rgba(6,182,212,0.45)]'
                        : isWarning
                        ? 'bg-[#1E293B]/90 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'bg-[#0F172A]/90 border border-slate-700/80 hover:border-[#6366F1]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {getNodeIcon(node.layer)}
                        <span className="font-heading text-xs font-bold text-white truncate max-w-[110px]">
                          {node.name}
                        </span>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        node.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
                      }`} />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-slate-500">Latency: </span>
                        <span className={node.latencyP99 > 150 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {node.latencyP99}ms
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500">RPS: </span>
                        <span className="text-cyan-400">{node.rps}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1.5">
                      <span className="uppercase text-[#6366F1] font-semibold">{node.layer}</span>
                      <span>AST: {node.astScore}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Details & Telemetry Drawer (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-indigo text-[10px] uppercase font-bold">
                    {selectedNode.layer}
                  </span>
                  <span className={`badge text-[10px] ${
                    selectedNode.status === 'healthy' ? 'badge-emerald' : 'badge-amber'
                  }`}>
                    {selectedNode.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedNode.name}
                </h3>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">p99 Latency</div>
                <div className={`text-xl font-bold font-mono mt-0.5 ${
                  selectedNode.latencyP99 > 150 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {selectedNode.latencyP99} ms
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">SLO Target: &lt; 50ms</div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Throughput</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                  {selectedNode.rps} <span className="text-xs text-slate-400 font-normal">req/s</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Active WebSocket mesh</div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Error Rate</div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
                  {selectedNode.errorRate}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Zero unhandled 5xx</div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">AST Health Score</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {selectedNode.astScore} / 100
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Continuous AST check</div>
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <div className="text-xs text-slate-400 mb-1.5 font-medium">Underlying Technologies:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.technologies.map(tech => (
                  <span key={tech} className="badge badge-indigo text-[11px] font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Inter-service Dependencies */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400 mb-2 font-medium">Direct Inbound / Outbound Links:</div>
              <div className="space-y-1.5">
                {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(edge => {
                  const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                  const otherNode = nodes.find(n => n.id === otherNodeId);
                  const isOutbound = edge.source === selectedNode.id;

                  return (
                    <div key={edge.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 text-xs font-mono border border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <ArrowUpRight className={`w-3.5 h-3.5 ${isOutbound ? 'text-cyan-400' : 'text-purple-400 rotate-90'}`} />
                        <span>{otherNode?.name}</span>
                      </div>
                      <span className="badge badge-cyan text-[10px] py-0">{edge.protocol}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Dynamic Architectural State</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleTriggerLoadSpike}
                  disabled={isSimulatingLoad}
                  className="btn-secondary !py-2 justify-center text-xs text-amber-300 hover:text-amber-200"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Traffic Surge</span>
                </button>
                <button
                  onClick={handleOptimizeService}
                  className="btn-cyan !py-2 justify-center text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimize AST</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
