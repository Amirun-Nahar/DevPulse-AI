import { Repository, PullRequest, ArchNode, ArchEdge, OpenApiEndpoint, TelemetryEvent, EngineeringMetrics } from '../types';

export const REPOSITORIES: Repository[] = [
  {
    id: 'fintech-payment-engine',
    name: 'devpulse/fintech-payment-engine',
    branch: 'main',
    commitHash: '7f9a2e1',
    lastAnalyzed: '2 minutes ago',
    totalServices: 9,
    healthScore: 96,
    openPRs: 3
  },
  {
    id: 'cloud-telemetry-core',
    name: 'devpulse/cloud-telemetry-core',
    branch: 'release/v2.4',
    commitHash: '3d8c11b',
    lastAnalyzed: '14 minutes ago',
    totalServices: 6,
    healthScore: 92,
    openPRs: 1
  },
  {
    id: 'ecommerce-api',
    name: 'devpulse/ecommerce-api',
    branch: 'develop',
    commitHash: '9a44fc0',
    lastAnalyzed: '1 hour ago',
    totalServices: 7,
    healthScore: 89,
    openPRs: 2
  }
];

export const INITIAL_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr-142',
    number: 142,
    title: 'Fix concurrent settlement race condition & unhandled connection pool leak',
    author: 'alex-developer',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    branch: 'fix/settlement-race',
    targetBranch: 'main',
    timestamp: 'Just now',
    status: 'pending_review',
    severity: 'critical',
    cyclomaticComplexityBefore: 18,
    cyclomaticComplexityAfter: 5,
    riskScore: 92,
    category: 'Concurrency / Race Condition',
    fileChanged: 'src/services/SettlementProcessor.ts',
    summary: 'DevPulse AST engine detected concurrent state mutation without distributed mutex lock and an unhandled DB connection leak under high throughput.',
    semanticAnalysis: [
      'AST Node "AsyncFunctionDeclaration" contains unguarded state reads between balance verification and debit execution.',
      'Potential double-spending vulnerability under concurrent burst requests (> 450 req/s).',
      'Database connection client from pgPool is acquired inside try-block but lacks guaranteed release in finally-block.',
      'High cyclomatic complexity (18) with nested callback pyramids and unhandled Promise rejections.'
    ],
    astDetails: {
      nodesInspected: 1420,
      depth: 9,
      vulnerablePattern: 'Identifier("walletBalance") referenced across detached await boundaries without distributed Redis lease.',
      astFixRule: 'Enforce Mutex.acquireLock() with RAII async disposal pattern & guaranteed finally { client.release(); }.'
    },
    originalCode: `async function processSettlement(userId: string, amount: number) {
  const client = await pgPool.connect();
  const user = await client.query('SELECT balance FROM accounts WHERE id = $1', [userId]);
  
  // VULNERABILITY: Race condition between read and update
  if (user.rows[0].balance >= amount) {
    await sleep(40); // Simulates network I/O lag
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, userId]);
    await ledger.recordTransaction(userId, amount, 'DEBIT');
    return { success: true };
  }
  // BUG: client is not released on insufficient funds path!
  return { success: false, error: 'INSUFFICIENT_FUNDS' };
}`,
    suggestedPatch: `async function processSettlement(userId: string, amount: number) {
  // REFACTORED: Acquire distributed Redis lock with automatic TTL
  const lock = await distributedLock.acquire(\`settlement:\${userId}\`, 5000);
  const client = await pgPool.connect();
  
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
    const { rows } = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', 
      [userId]
    );

    if (!rows.length || rows[0].balance < amount) {
      await client.query('ROLLBACK');
      return { success: false, error: 'INSUFFICIENT_FUNDS' };
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2', 
      [amount, userId]
    );
    await ledger.recordTransaction(userId, amount, 'DEBIT');
    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw new SettlementError('Transaction aborted due to contention', { cause: error });
  } finally {
    client.release(); // Guaranteed connection release
    await lock.release();
  }
}`,
    diffLines: [
      { type: 'normal', oldLine: 1, newLine: 1, text: ' async function processSettlement(userId: string, amount: number) {' },
      { type: 'add', newLine: 2, text: '+   // REFACTORED: Acquire distributed Redis lock with automatic TTL' },
      { type: 'add', newLine: 3, text: '+   const lock = await distributedLock.acquire(`settlement:${userId}`, 5000);' },
      { type: 'normal', oldLine: 2, newLine: 4, text: '   const client = await pgPool.connect();' },
      { type: 'add', newLine: 5, text: '+   try {' },
      { type: 'add', newLine: 6, text: '+     await client.query(\'BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE\');' },
      { type: 'del', oldLine: 3, text: '-   const user = await client.query(\'SELECT balance FROM accounts WHERE id = $1\', [userId]);' },
      { type: 'add', newLine: 7, text: '+     const { rows } = await client.query(\'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE\', [userId]);' },
      { type: 'del', oldLine: 4, text: '-   // VULNERABILITY: Race condition between read and update' },
      { type: 'del', oldLine: 5, text: '-   if (user.rows[0].balance >= amount) {' },
      { type: 'add', newLine: 8, text: '+     if (!rows.length || rows[0].balance < amount) {' },
      { type: 'add', newLine: 9, text: '+       await client.query(\'ROLLBACK\');' },
      { type: 'add', newLine: 10, text: '+       return { success: false, error: \'INSUFFICIENT_FUNDS\' };' },
      { type: 'add', newLine: 11, text: '+     }' },
      { type: 'del', oldLine: 6, text: '-     await sleep(40); // Simulates network I/O lag' },
      { type: 'normal', oldLine: 7, newLine: 12, text: '     await client.query(\'UPDATE accounts SET balance = balance - $1 WHERE id = $2\', [amount, userId]);' },
      { type: 'normal', oldLine: 8, newLine: 13, text: '     await ledger.recordTransaction(userId, amount, \'DEBIT\');' },
      { type: 'add', newLine: 14, text: '+     await client.query(\'COMMIT\');' },
      { type: 'normal', oldLine: 9, newLine: 15, text: '     return { success: true };' },
      { type: 'add', newLine: 16, text: '+   } catch (error) {' },
      { type: 'add', newLine: 17, text: '+     await client.query(\'ROLLBACK\');' },
      { type: 'add', newLine: 18, text: '+     throw new SettlementError(\'Transaction aborted\', { cause: error });' },
      { type: 'add', newLine: 19, text: '+   } finally {' },
      { type: 'add', newLine: 20, text: '+     client.release(); // Guaranteed connection release' },
      { type: 'add', newLine: 21, text: '+     await lock.release();' },
      { type: 'add', newLine: 22, text: '+   }' },
      { type: 'del', oldLine: 11, text: '-   return { success: false, error: \'INSUFFICIENT_FUNDS\' };' },
      { type: 'normal', oldLine: 12, newLine: 23, text: ' }' }
    ]
  },
  {
    id: 'pr-143',
    number: 143,
    title: 'Mitigate OWASP A03: JWT header injection & ReDoS in AuthMiddleware.ts',
    author: 'sarah-security',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    branch: 'security/jwt-eval-fix',
    targetBranch: 'main',
    timestamp: '28 minutes ago',
    status: 'pending_review',
    severity: 'high',
    cyclomaticComplexityBefore: 12,
    cyclomaticComplexityAfter: 3,
    riskScore: 84,
    category: 'OWASP Security',
    fileChanged: 'src/middleware/AuthGuard.ts',
    summary: 'AST scan identified unsafe regular expression parsing unescaped tokens vulnerable to catastrophic backtracking (ReDoS) and unverified algorithm headers.',
    semanticAnalysis: [
      'Regex /^Bearer\\s+([a-zA-Z0-9_\\-\\.]+)+$/ is vulnerable to catastrophic backtracking on crafted headers.',
      'JWT verification does not enforce explicit algorithm whitelist ("HS256" / "RS256"), enabling "none" algorithm exploit.',
      'Missing token expiration leeway and rate-limiting hook.'
    ],
    astDetails: {
      nodesInspected: 860,
      depth: 6,
      vulnerablePattern: 'RegExpLiteral with nested quantifiers in token extraction AST node.',
      astFixRule: 'Replace nested RegExp with constant-time string split and strict algorithm verification options.'
    },
    originalCode: `export function verifyAuthHeader(req: Request) {
  const authHeader = req.headers['authorization'] || '';
  // VULNERABLE: Catastrophic backtracking ReDoS
  const match = authHeader.match(/^Bearer\\s+([a-zA-Z0-9_\\-\\.]+)+$/);
  if (!match) throw new UnauthorizedError();
  
  // VULNERABLE: Accepts algorithm 'none'
  return jwt.decode(match[1]);
}`,
    suggestedPatch: `export function verifyAuthHeader(req: Request) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Malformed Authorization header');
  }
  
  const token = authHeader.slice(7).trim();
  if (token.length > 2048) {
    throw new UnauthorizedError('Token exceeds maximum allowable size');
  }
  
  // STRICT: Cryptographically verified with mandatory RS256 algorithm enforcement
  return jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
    algorithms: ['RS256'],
    clockTolerance: 10
  });
}`,
    diffLines: [
      { type: 'normal', oldLine: 1, newLine: 1, text: ' export function verifyAuthHeader(req: Request) {' },
      { type: 'del', oldLine: 2, text: '-   const authHeader = req.headers[\'authorization\'] || \'\';' },
      { type: 'add', newLine: 2, text: '+   const authHeader = req.headers[\'authorization\'];' },
      { type: 'add', newLine: 3, text: '+   if (!authHeader || !authHeader.startsWith(\'Bearer \')) {' },
      { type: 'add', newLine: 4, text: '+     throw new UnauthorizedError(\'Malformed Authorization header\');' },
      { type: 'add', newLine: 5, text: '+   }' },
      { type: 'del', oldLine: 3, text: '-   const match = authHeader.match(/^Bearer\\s+([a-zA-Z0-9_\\-\\.]+)+$/);' },
      { type: 'del', oldLine: 4, text: '-   if (!match) throw new UnauthorizedError();' },
      { type: 'add', newLine: 6, text: '+   const token = authHeader.slice(7).trim();' },
      { type: 'add', newLine: 7, text: '+   if (token.length > 2048) throw new UnauthorizedError(\'Token too long\');' },
      { type: 'del', oldLine: 6, text: '-   return jwt.decode(match[1]);' },
      { type: 'add', newLine: 8, text: '+   return jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {' },
      { type: 'add', newLine: 9, text: '+     algorithms: [\'RS256\'],' },
      { type: 'add', newLine: 10, text: '+     clockTolerance: 10' },
      { type: 'add', newLine: 11, text: '+   });' },
      { type: 'normal', oldLine: 7, newLine: 12, text: ' }' }
    ]
  },
  {
    id: 'pr-144',
    number: 144,
    title: 'Eliminate unbounded event listener memory leak in WebSocket stream router',
    author: 'marcus-devops',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    branch: 'perf/ws-leak',
    targetBranch: 'main',
    timestamp: '1 hour ago',
    status: 'pending_review',
    severity: 'medium',
    cyclomaticComplexityBefore: 9,
    cyclomaticComplexityAfter: 4,
    riskScore: 68,
    category: 'Memory / Resource Leak',
    fileChanged: 'src/telemetry/StreamHub.ts',
    summary: 'AST listener analysis found addEventListener subscriptions registered inside onConnection handler without matching removeEventListener on socket disconnect.',
    semanticAnalysis: [
      'EventEmitter registers message handler per client socket without cleanup on close event.',
      'Node.js process heap memory steadily increases by ~14MB per 1,000 disconnected WebSocket clients.',
      'Can cause process OOM termination in production under high reconnection frequency.'
    ],
    astDetails: {
      nodesInspected: 520,
      depth: 5,
      vulnerablePattern: 'CallExpression "bus.on" missing corresponding "bus.off" in sibling "close" handler.',
      astFixRule: 'Use AbortController signal or explicit teardown handler in ws.once("close").'
    },
    originalCode: `export function registerTelemetryStream(ws: WebSocket) {
  // BUG: Memory leak - listener accumulates on shared bus
  telemetryBus.on('metric_broadcast', (data) => {
    ws.send(JSON.stringify(data));
  });
}`,
    suggestedPatch: `export function registerTelemetryStream(ws: WebSocket) {
  const handler = (data: MetricPayload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  telemetryBus.on('metric_broadcast', handler);

  // GUARANTEED CLEANUP on socket close or error
  ws.once('close', () => {
    telemetryBus.off('metric_broadcast', handler);
  });
  ws.once('error', () => {
    telemetryBus.off('metric_broadcast', handler);
  });
}`,
    diffLines: [
      { type: 'normal', oldLine: 1, newLine: 1, text: ' export function registerTelemetryStream(ws: WebSocket) {' },
      { type: 'del', oldLine: 2, text: '-   telemetryBus.on(\'metric_broadcast\', (data) => {' },
      { type: 'del', oldLine: 3, text: '-     ws.send(JSON.stringify(data));' },
      { type: 'del', oldLine: 4, text: '-   });' },
      { type: 'add', newLine: 2, text: '+   const handler = (data: MetricPayload) => {' },
      { type: 'add', newLine: 3, text: '+     if (ws.readyState === WebSocket.OPEN) {' },
      { type: 'add', newLine: 4, text: '+       ws.send(JSON.stringify(data));' },
      { type: 'add', newLine: 5, text: '+     }' },
      { type: 'add', newLine: 6, text: '+   };' },
      { type: 'add', newLine: 7, text: '+   telemetryBus.on(\'metric_broadcast\', handler);' },
      { type: 'add', newLine: 8, text: '+   ws.once(\'close\', () => telemetryBus.off(\'metric_broadcast\', handler));' },
      { type: 'add', newLine: 9, text: '+   ws.once(\'error\', () => telemetryBus.off(\'metric_broadcast\', handler));' },
      { type: 'normal', oldLine: 5, newLine: 10, text: ' }' }
    ]
  }
];

export const ARCHITECTURE_NODES: ArchNode[] = [
  {
    id: 'node-client',
    name: 'Edge Next.js Client',
    layer: 'frontend',
    status: 'healthy',
    x: 80,
    y: 180,
    rps: 1250,
    latencyP99: 34,
    errorRate: 0.02,
    memoryMb: 128,
    astScore: 98,
    technologies: ['Next.js 14', 'React', 'Tailwind'],
    endpointsCount: 14,
    dependencies: ['node-gateway']
  },
  {
    id: 'node-gateway',
    name: 'Cloudflare API Gateway',
    layer: 'gateway',
    status: 'healthy',
    x: 290,
    y: 180,
    rps: 1250,
    latencyP99: 18,
    errorRate: 0.04,
    memoryMb: 64,
    astScore: 99,
    technologies: ['Cloudflare Workers', 'Wasm', 'RateLimiter'],
    endpointsCount: 22,
    dependencies: ['node-auth', 'node-payment', 'node-telemetry']
  },
  {
    id: 'node-auth',
    name: 'Auth & IAM Service',
    layer: 'auth',
    status: 'healthy',
    x: 520,
    y: 70,
    rps: 380,
    latencyP99: 42,
    errorRate: 0.01,
    memoryMb: 240,
    astScore: 94,
    technologies: ['Node.js', 'JWT RS256', 'OAuth2'],
    endpointsCount: 8,
    dependencies: ['node-redis', 'node-postgres']
  },
  {
    id: 'node-payment',
    name: 'Payment Settlement Core',
    layer: 'microservice',
    status: 'warning',
    x: 520,
    y: 190,
    rps: 820,
    latencyP99: 185,
    errorRate: 1.15,
    memoryMb: 680,
    astScore: 82, // flagged before PR 142 fix
    technologies: ['Node.js', 'Express', 'Prisma ORM'],
    endpointsCount: 16,
    dependencies: ['node-postgres', 'node-redis', 'node-kafka']
  },
  {
    id: 'node-telemetry',
    name: 'Live Telemetry Streamer',
    layer: 'microservice',
    status: 'healthy',
    x: 520,
    y: 310,
    rps: 450,
    latencyP99: 15,
    errorRate: 0.00,
    memoryMb: 310,
    astScore: 91,
    technologies: ['FastAPI', 'WebSockets', 'AsyncIO'],
    endpointsCount: 6,
    dependencies: ['node-kafka', 'node-ai']
  },
  {
    id: 'node-ai',
    name: 'Gemini AST Inference Engine',
    layer: 'ai',
    status: 'healthy',
    x: 770,
    y: 330,
    rps: 95,
    latencyP99: 210,
    errorRate: 0.01,
    memoryMb: 512,
    astScore: 99,
    technologies: ['Gemini 3.8 Flash', 'Babel AST', 'PromptEngine'],
    endpointsCount: 4,
    dependencies: ['node-redis']
  },
  {
    id: 'node-kafka',
    name: 'Kafka Message Bus',
    layer: 'queue',
    status: 'healthy',
    x: 770,
    y: 200,
    rps: 2400,
    latencyP99: 8,
    errorRate: 0.00,
    memoryMb: 1024,
    astScore: 99,
    technologies: ['Apache Kafka', 'Avro Schema Registry'],
    endpointsCount: 12,
    dependencies: ['node-postgres']
  },
  {
    id: 'node-postgres',
    name: 'PostgreSQL Primary Cluster',
    layer: 'datastore',
    status: 'healthy',
    x: 1000,
    y: 90,
    rps: 1650,
    latencyP99: 24,
    errorRate: 0.02,
    memoryMb: 4096,
    astScore: 97,
    technologies: ['PostgreSQL 16', 'TimescaleDB', 'ConnectionPool'],
    endpointsCount: 0,
    dependencies: []
  },
  {
    id: 'node-redis',
    name: 'Redis Distributed Cache',
    layer: 'datastore',
    status: 'healthy',
    x: 1000,
    y: 250,
    rps: 4800,
    latencyP99: 3,
    errorRate: 0.00,
    memoryMb: 2048,
    astScore: 100,
    technologies: ['Redis 7.2 Cluster', 'Redlock Mutex'],
    endpointsCount: 0,
    dependencies: []
  }
];

export const ARCHITECTURE_EDGES: ArchEdge[] = [
  { id: 'e1', source: 'node-client', target: 'node-gateway', protocol: 'REST / HTTPS', activeRps: 1250, latencyAvg: 18, isPulsing: true },
  { id: 'e2', source: 'node-gateway', target: 'node-auth', protocol: 'gRPC', activeRps: 380, latencyAvg: 6, isPulsing: true },
  { id: 'e3', source: 'node-gateway', target: 'node-payment', protocol: 'gRPC', activeRps: 820, latencyAvg: 14, isPulsing: true },
  { id: 'e4', source: 'node-gateway', target: 'node-telemetry', protocol: 'WebSocket', activeRps: 450, latencyAvg: 4, isPulsing: true },
  { id: 'e5', source: 'node-auth', target: 'node-redis', protocol: 'gRPC', activeRps: 380, latencyAvg: 2, isPulsing: true },
  { id: 'e6', source: 'node-auth', target: 'node-postgres', protocol: 'SQL Pool', activeRps: 120, latencyAvg: 8, isPulsing: false },
  { id: 'e7', source: 'node-payment', target: 'node-redis', protocol: 'gRPC', activeRps: 820, latencyAvg: 3, isPulsing: true },
  { id: 'e8', source: 'node-payment', target: 'node-postgres', protocol: 'SQL Pool', activeRps: 820, latencyAvg: 19, isPulsing: true },
  { id: 'e9', source: 'node-payment', target: 'node-kafka', protocol: 'Kafka Stream', activeRps: 820, latencyAvg: 5, isPulsing: true },
  { id: 'e10', source: 'node-telemetry', target: 'node-kafka', protocol: 'Kafka Stream', activeRps: 450, latencyAvg: 5, isPulsing: true },
  { id: 'e11', source: 'node-telemetry', target: 'node-ai', protocol: 'gRPC', activeRps: 95, latencyAvg: 180, isPulsing: true },
  { id: 'e12', source: 'node-ai', target: 'node-redis', protocol: 'gRPC', activeRps: 95, latencyAvg: 2, isPulsing: true }
];

export const OPENAPI_ENDPOINTS: OpenApiEndpoint[] = [
  {
    path: '/api/v1/settlements/execute',
    method: 'POST',
    summary: 'Execute atomic balance settlement with distributed mutex',
    description: 'Processes financial settlement across user ledgers with serializable transaction isolation and distributed Redis lock protection.',
    tags: ['Settlement', 'Core Financial'],
    parameters: [
      { name: 'X-Idempotency-Key', in: 'header', required: true, type: 'uuid', description: 'Unique idempotency token to prevent double-billing', defaultValue: 'e9b20b22-8d77-4b71-b0db-6e60b13cf14a' }
    ],
    requestBody: {
      contentType: 'application/json',
      samplePayload: JSON.stringify({
        userId: 'usr_88319f2a',
        amount: 249.50,
        currency: 'USD',
        referenceId: 'order_ref_9921'
      }, null, 2)
    },
    responseSchema: {
      status: 200,
      description: 'Settlement confirmed successfully',
      sampleResponse: JSON.stringify({
        status: 'SUCCESS',
        transactionId: 'txn_01HZ89K2P37X',
        remainingBalance: 1892.25,
        executionDurationMs: 14.8,
        lockAcquired: true,
        timestamp: '2026-10-01T15:20:00.000Z'
      }, null, 2)
    }
  },
  {
    path: '/api/v1/auth/tokens/validate',
    method: 'POST',
    summary: 'Validate and decode cryptographic bearer token',
    description: 'AST-audited JWT verification endpoint with strict RS256 algorithm enforcement and constant-time signature evaluation.',
    tags: ['Authentication', 'IAM'],
    parameters: [
      { name: 'Authorization', in: 'header', required: true, type: 'string', description: 'Bearer JWT token', defaultValue: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' }
    ],
    requestBody: {
      contentType: 'application/json',
      samplePayload: JSON.stringify({
        requiredScope: 'settlements:write',
        auditClientId: 'client_edge_gateway_01'
      }, null, 2)
    },
    responseSchema: {
      status: 200,
      description: 'Token verified with claims',
      sampleResponse: JSON.stringify({
        valid: true,
        subject: 'usr_88319f2a',
        role: 'SERVICE_ADMIN',
        scopes: ['settlements:write', 'telemetry:read'],
        expiresInSec: 3540
      }, null, 2)
    }
  },
  {
    path: '/api/v1/telemetry/ast-health',
    method: 'GET',
    summary: 'Retrieve repository live AST health & complexity score',
    description: 'Returns real-time AST complexity metrics, cyclomatic depth indicators, and vulnerability scanning flags.',
    tags: ['Telemetry', 'DevPulse AI'],
    parameters: [
      { name: 'branch', in: 'query', required: false, type: 'string', description: 'Branch to query (default main)', defaultValue: 'main' }
    ],
    responseSchema: {
      status: 200,
      description: 'Repository AST health telemetry',
      sampleResponse: JSON.stringify({
        repository: 'devpulse/fintech-payment-engine',
        healthScore: 96,
        astComplexityAverage: 3.2,
        activeCriticalRisks: 0,
        nodesIndexed: 14820,
        lastWebhookCommit: '7f9a2e1'
      }, null, 2)
    }
  },
  {
    path: '/api/v1/webhooks/git-event',
    method: 'POST',
    summary: 'Receive Git provider webhook (GitHub / GitLab / Bitbucket)',
    description: 'Ingests push and pull_request events, triggers AST semantic analyzer, and streams updates via WebSocket.',
    tags: ['Webhooks', 'Integration'],
    parameters: [
      { name: 'X-GitHub-Event', in: 'header', required: true, type: 'string', description: 'Git event type (push, pull_request)', defaultValue: 'pull_request' }
    ],
    requestBody: {
      contentType: 'application/json',
      samplePayload: JSON.stringify({
        action: 'opened',
        number: 145,
        pull_request: {
          title: 'Optimize Redis connection pooling and serialization',
          head: { ref: 'perf/redis-pool' },
          base: { ref: 'main' }
        }
      }, null, 2)
    },
    responseSchema: {
      status: 202,
      description: 'Webhook queued and AST pipeline started',
      sampleResponse: JSON.stringify({
        jobId: 'ast_job_99a81c2',
        status: 'ANALYZING',
        estimatedDurationMs: 420,
        wsChannel: 'ws://devpulse.live/telemetry/ast_job_99a81c2'
      }, null, 2)
    }
  }
];

export const INITIAL_TELEMETRY_EVENTS: TelemetryEvent[] = [
  {
    id: 'evt-1',
    timestamp: '15:18:42',
    type: 'ast_scan',
    title: 'AST Semantic Scan Complete',
    details: 'Scanned 14,820 AST nodes across 42 files in 380ms. Detected 1 critical race condition in SettlementProcessor.ts.',
    severity: 'warning',
    actor: 'DevPulse AST Engine'
  },
  {
    id: 'evt-2',
    timestamp: '15:17:10',
    type: 'pull_request',
    title: 'PR #142 Received from alex-developer',
    details: 'Branch "fix/settlement-race" opened against "main". Webhook triggered automated code auditor.',
    severity: 'info',
    actor: 'GitHub Webhook'
  },
  {
    id: 'evt-3',
    timestamp: '15:14:02',
    type: 'spec_synced',
    title: 'OpenAPI 3.0 Spec Auto-Generated',
    details: 'Parsed 4 route files and inline docstrings. Generated OpenAPI 3.0 specification with 4 verified endpoints.',
    severity: 'success',
    actor: 'DocSpec Generator'
  },
  {
    id: 'evt-4',
    timestamp: '15:10:55',
    type: 'push',
    title: 'Commit 7f9a2e1 Pushed to main',
    details: 'Build passing (1m 48s). Unit tests 142/142 passed. Coverage at 94.8%.',
    severity: 'success',
    actor: 'CI/CD Pipeline'
  }
];

export const INITIAL_METRICS: EngineeringMetrics = {
  buildDurationSec: 108, // 1m 48s
  buildDurationTrend: [168, 154, 142, 130, 122, 115, 108],
  testCoveragePercent: 94.8,
  testCoverageTrend: [88.2, 89.5, 91.0, 92.4, 93.1, 94.2, 94.8],
  prReviewTimeHours: 1.8,
  activeVulnerabilities: 3,
  astAverageComplexity: 3.4,
  deploymentFrequency: '6.4 / day'
};

export const SAMPLE_GENERATED_README = `# ⚡ DevPulse AI — Fintech Payment Engine

[![Build Status](https://img.shields.io/badge/build-passing-10B981?style=flat-square&logo=githubactions)](https://github.com)
[![Test Coverage](https://img.shields.io/badge/coverage-94.8%25-6366F1?style=flat-square)](https://github.com)
[![OWASP Security](https://img.shields.io/badge/OWASP-clean-06B6D4?style=flat-square)](https://owasp.org)
[![AST Complexity](https://img.shields.io/badge/AST%20complexity-3.2%20(Optimal)-EC4899?style=flat-square)](https://github.com)
[![API Spec](https://img.shields.io/badge/OpenAPI-3.0.3-6366F1?style=flat-square)](https://swagger.io)

> **Auto-maintained by DevPulse AI** — Last AST synchronized on commit \`7f9a2e1\`

---

## 🏛️ System Architecture Overview

\`\`\`
[Edge Next.js Client] ──(HTTPS)──> [Cloudflare API Gateway]
                                          │
                  ┌───────────────────────┼──────────────────────┐
                  ▼ (gRPC)                ▼ (gRPC)               ▼ (WebSocket)
          [Auth & IAM Service]    [Payment Settlement]   [Live Telemetry]
                  │                       │                      │
                  ▼                       ▼                      ▼
         [Redis Redlock Mutex]     [PostgreSQL Primary]   [Apache Kafka]
\`\`\`

## 📦 Core Services & Dependencies

| Service | Protocol | p99 Latency | AST Health | Primary Tech |
|---|---|---|---|---|
| **Edge Gateway** | HTTPS / Wasm | 18ms | 99% | Cloudflare Workers |
| **Auth & IAM** | gRPC / JWT | 42ms | 94% | Node.js, RS256 |
| **Payment Core** | gRPC / SQL | 185ms | 82% ⚠️ | Node.js, Prisma, Redlock |
| **Telemetry Streamer**| WebSocket | 15ms | 91% | Python FastAPI, AsyncIO |
| **Gemini Inference** | gRPC | 210ms | 99% | Gemini 3.8 Flash Engine |

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- Node.js >= 20.x
- Docker Compose (PostgreSQL 16 & Redis 7.2)

### 2. Environment Setup
\`\`\`bash
# Clone repository
git clone https://github.com/devpulse/fintech-payment-engine.git
cd fintech-payment-engine

# Install dependencies
npm install

# Start local infrastructure
docker-compose up -d postgres redis kafka

# Start dev server with DevPulse live AST watcher
npm run dev
\`\`\`

---

## 🛡️ Automated Quality & Security Policies
- **Static AST Scans**: Automatically runs on every git push via DevPulse AI webhooks.
- **Race Condition Guard**: Distributed Redis lock required for stateful mutations.
- **OpenAPI Synchronization**: Automatically regenerated on route changes.
`;
