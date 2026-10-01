export type TabType = 'auditor' | 'visualizer' | 'docs' | 'insights';

export type RepositoryId = 'fintech-payment-engine' | 'cloud-telemetry-core' | 'ecommerce-api';

export interface Repository {
  id: RepositoryId;
  name: string;
  branch: string;
  commitHash: string;
  lastAnalyzed: string;
  totalServices: number;
  healthScore: number;
  openPRs: number;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  author: string;
  authorAvatar: string;
  branch: string;
  targetBranch: string;
  timestamp: string;
  status: 'pending_review' | 'refactored' | 'merged';
  severity: 'critical' | 'high' | 'medium' | 'low';
  cyclomaticComplexityBefore: number;
  cyclomaticComplexityAfter: number;
  riskScore: number; // 0-100
  category: 'Concurrency / Race Condition' | 'OWASP Security' | 'Memory / Resource Leak' | 'Performance Anti-Pattern';
  fileChanged: string;
  summary: string;
  semanticAnalysis: string[];
  astDetails: {
    nodesInspected: number;
    depth: number;
    vulnerablePattern: string;
    astFixRule: string;
  };
  originalCode: string;
  suggestedPatch: string;
  diffLines: {
    type: 'add' | 'del' | 'normal';
    oldLine?: number;
    newLine?: number;
    text: string;
  }[];
}

export interface ArchNode {
  id: string;
  name: string;
  layer: 'frontend' | 'gateway' | 'microservice' | 'auth' | 'datastore' | 'queue' | 'ai';
  status: 'healthy' | 'degraded' | 'warning';
  x: number;
  y: number;
  rps: number;
  latencyP99: number; // ms
  errorRate: number; // %
  memoryMb: number;
  astScore: number; // 0 - 100
  technologies: string[];
  endpointsCount: number;
  dependencies: string[];
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  protocol: 'gRPC' | 'REST / HTTPS' | 'WebSocket' | 'Kafka Stream' | 'SQL Pool';
  activeRps: number;
  latencyAvg: number;
  isPulsing: boolean;
}

export interface OpenApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description: string;
  tags: string[];
  parameters?: {
    name: string;
    in: 'query' | 'path' | 'header';
    required: boolean;
    type: string;
    description: string;
    defaultValue?: string;
  }[];
  requestBody?: {
    contentType: string;
    samplePayload: string;
  };
  responseSchema: {
    status: number;
    description: string;
    sampleResponse: string;
  };
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type: 'push' | 'pull_request' | 'ast_scan' | 'vulnerability' | 'patch_applied' | 'spec_synced';
  title: string;
  details: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  actor: string;
}

export interface EngineeringMetrics {
  buildDurationSec: number;
  buildDurationTrend: number[]; // last 7 runs
  testCoveragePercent: number;
  testCoverageTrend: number[]; // last 7 runs
  prReviewTimeHours: number;
  activeVulnerabilities: number;
  astAverageComplexity: number;
  deploymentFrequency: string;
}
