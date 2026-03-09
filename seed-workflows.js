const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

function uid() {
  return "s" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * Helper: builds a full map with nodes, edges, and notes via Prisma
 */
async function createMap(ownerId, workspaceId, { name, description, nodes, edges }) {
  const map = await p.decodeMap.create({
    data: { name, description, ownerId, workspaceId },
  });

  // Create notes + nodes
  for (const n of nodes) {
    const noteId = uid();
    await p.note.create({
      data: {
        id: noteId,
        mapId: map.id,
        title: n.title,
        tags: (n.tags || []).join(", "),
        content: n.content || "",
      },
    });
    await p.mapNode.create({
      data: {
        id: n.id,
        mapId: map.id,
        kind: n.kind,
        kindLabel: n.kindLabel || n.kind.charAt(0).toUpperCase() + n.kind.slice(1),
        title: n.title,
        tags: (n.tags || []).join(", "),
        color: n.color || "#6366f1",
        noteId,
        posX: n.x,
        posY: n.y,
      },
    });
  }

  // Create edges (with optional notes)
  for (const e of edges) {
    let noteId = null;
    if (e.label) {
      noteId = uid();
      await p.note.create({
        data: {
          id: noteId,
          mapId: map.id,
          title: e.label,
          tags: "",
          content: e.content || "",
        },
      });
    }
    await p.mapEdge.create({
      data: {
        id: e.id || uid(),
        mapId: map.id,
        sourceNodeId: e.from,
        targetNodeId: e.to,
        sourceHandle: e.sourceHandle || null,
        targetHandle: e.targetHandle || null,
        label: e.label || null,
        noteId,
      },
    });
  }

  console.log(`  Created: "${name}" (${nodes.length} nodes, ${edges.length} edges)`);
  return map;
}

/* ═══════════════════════════════════════════════
   MAP DEFINITIONS — 12 Real-World Complex Flows
   ═══════════════════════════════════════════════ */

const maps = [
  // ── 1. E-Commerce Microservices Architecture ──
  {
    name: "E-Commerce Microservices",
    description: "Production microservices architecture for an e-commerce platform with 12 services",
    nodes: [
      { id: "ec-gw", kind: "api", kindLabel: "API Gateway", title: "API Gateway", color: "#0ea5e9", x: 500, y: 0, tags: ["production", "critical"], content: "Kong API Gateway v3.4\nHandles 50k req/s peak\nRate limiting: 1000 req/min per user" },
      { id: "ec-web", kind: "system", kindLabel: "Web App", title: "Storefront Web", color: "#22c55e", x: 0, y: 0, tags: ["frontend"], content: "Next.js 14 SSR app\nVercel deployment\nCDN: Cloudflare" },
      { id: "ec-mobile", kind: "system", kindLabel: "Mobile BFF", title: "Mobile BFF", color: "#22c55e", x: 1000, y: 0, tags: ["frontend"], content: "GraphQL BFF for iOS/Android apps" },
      { id: "ec-auth", kind: "system", kindLabel: "Auth Service", title: "Auth Service", color: "#22c55e", x: 0, y: 280, tags: ["security", "critical"], content: "OAuth2 + JWT\nKeycloak-based\nMFA support" },
      { id: "ec-catalog", kind: "system", kindLabel: "Catalog", title: "Product Catalog", color: "#22c55e", x: 500, y: 280, tags: ["core"], content: "Product search, categories, pricing\nElasticsearch powered" },
      { id: "ec-cart", kind: "system", kindLabel: "Cart", title: "Cart Service", color: "#22c55e", x: 1000, y: 280, tags: ["core"], content: "Shopping cart management\nRedis-backed sessions" },
      { id: "ec-order", kind: "process", kindLabel: "Order Engine", title: "Order Processing", color: "#fbbf24", x: 500, y: 560, tags: ["critical", "core"], content: "Order lifecycle management\nSaga pattern for distributed transactions" },
      { id: "ec-pay", kind: "vendor", kindLabel: "Payments", title: "Payment Gateway", color: "#f97316", x: 1000, y: 560, tags: ["critical", "pci"], content: "Stripe + PayPal integration\nPCI DSS Level 1 compliant" },
      { id: "ec-inv", kind: "system", kindLabel: "Inventory", title: "Inventory Service", color: "#22c55e", x: 0, y: 560, tags: ["core"], content: "Real-time stock tracking\nWarehouse integration" },
      { id: "ec-ship", kind: "vendor", kindLabel: "Shipping", title: "Shipping Service", color: "#f97316", x: 1500, y: 560, tags: ["logistics"], content: "FedEx, UPS, USPS integration\nReal-time tracking" },
      { id: "ec-notify", kind: "queue", kindLabel: "Notifications", title: "Notification Hub", color: "#f59e0b", x: 500, y: 840, tags: ["messaging"], content: "Email, SMS, Push notifications\nSES + Twilio + Firebase" },
      { id: "ec-db", kind: "database", kindLabel: "PostgreSQL", title: "Orders DB", color: "#6366f1", x: 0, y: 840, tags: ["primary-db"], content: "PostgreSQL 16\nRead replicas: 3\nBackup: Hourly to S3" },
      { id: "ec-cache", kind: "cache", kindLabel: "Redis", title: "Redis Cluster", color: "#ef4444", x: 1500, y: 840, tags: ["cache"], content: "Redis 7 Cluster\n3 masters, 3 replicas\nSession store + cache" },
      { id: "ec-search", kind: "database", kindLabel: "Elasticsearch", title: "Search Engine", color: "#6366f1", x: 1000, y: 840, tags: ["search"], content: "Elasticsearch 8.x\nProduct search index\n< 100ms p99 latency" },
    ],
    edges: [
      { id: uid(), from: "ec-web", to: "ec-gw", label: "REST/HTTPS" },
      { id: uid(), from: "ec-mobile", to: "ec-gw", label: "GraphQL" },
      { id: uid(), from: "ec-gw", to: "ec-auth", label: "authenticate" },
      { id: uid(), from: "ec-gw", to: "ec-catalog", label: "product queries" },
      { id: uid(), from: "ec-gw", to: "ec-cart", label: "cart ops" },
      { id: uid(), from: "ec-cart", to: "ec-order", label: "checkout" },
      { id: uid(), from: "ec-order", to: "ec-pay", label: "process payment" },
      { id: uid(), from: "ec-order", to: "ec-inv", label: "reserve stock" },
      { id: uid(), from: "ec-order", to: "ec-ship", label: "create shipment" },
      { id: uid(), from: "ec-order", to: "ec-notify", label: "order events" },
      { id: uid(), from: "ec-order", to: "ec-db", label: "persist" },
      { id: uid(), from: "ec-catalog", to: "ec-search", label: "search" },
      { id: uid(), from: "ec-cart", to: "ec-cache", label: "session" },
      { id: uid(), from: "ec-catalog", to: "ec-cache", label: "cache reads" },
    ],
  },

  // ── 2. Data Pipeline / ETL ──
  {
    name: "Real-Time Data Pipeline",
    description: "Streaming ETL pipeline processing 10M events/day from mobile apps to data warehouse",
    nodes: [
      { id: "dp-mob", kind: "system", kindLabel: "Mobile SDK", title: "Mobile Events SDK", color: "#22c55e", x: 0, y: 0, tags: ["source"], content: "iOS + Android event tracking\nBatch upload every 30s" },
      { id: "dp-web", kind: "system", kindLabel: "Web Tracker", title: "Web Analytics", color: "#22c55e", x: 0, y: 300, tags: ["source"], content: "JavaScript snippet\nPage views, clicks, conversions" },
      { id: "dp-api", kind: "api", kindLabel: "Ingest API", title: "Event Ingestion API", color: "#0ea5e9", x: 500, y: 150, tags: ["ingestion"], content: "Go service\n50k events/sec throughput\nSchema validation" },
      { id: "dp-kafka", kind: "queue", kindLabel: "Kafka", title: "Kafka Cluster", color: "#f59e0b", x: 1000, y: 150, tags: ["streaming", "critical"], content: "Apache Kafka 3.6\n12 brokers\nRetention: 7 days\n3x replication" },
      { id: "dp-flink", kind: "process", kindLabel: "Flink", title: "Stream Processing", color: "#fbbf24", x: 1500, y: 0, tags: ["processing"], content: "Apache Flink\nReal-time aggregations\nSessionization, dedup" },
      { id: "dp-spark", kind: "process", kindLabel: "Spark", title: "Batch ETL", color: "#fbbf24", x: 1500, y: 300, tags: ["processing"], content: "Apache Spark 3.5\nDaily batch jobs\nData quality checks" },
      { id: "dp-s3", kind: "cloud", kindLabel: "S3 Data Lake", title: "Data Lake (S3)", color: "#8b5cf6", x: 2000, y: 150, tags: ["storage"], content: "S3 bucket with Iceberg tables\nParquet format\nPartitioned by date" },
      { id: "dp-redshift", kind: "database", kindLabel: "Redshift", title: "Data Warehouse", color: "#6366f1", x: 2500, y: 0, tags: ["warehouse", "analytics"], content: "Amazon Redshift Serverless\nBI tool source of truth\nMaterialized views" },
      { id: "dp-redis", kind: "cache", kindLabel: "Redis", title: "Real-Time Cache", color: "#ef4444", x: 2000, y: -150, tags: ["real-time"], content: "Live dashboards\nReal-time counters\nLeaderboards" },
      { id: "dp-airflow", kind: "process", kindLabel: "Airflow", title: "Orchestrator", color: "#fbbf24", x: 1500, y: 600, tags: ["orchestration"], content: "Apache Airflow 2.8\n200+ DAGs\nScheduled ETL jobs" },
      { id: "dp-bi", kind: "system", kindLabel: "Looker", title: "BI Dashboard", color: "#22c55e", x: 2500, y: 600, tags: ["analytics"], content: "Looker dashboards\n50+ reports\nSelf-service analytics" },
      { id: "dp-ml", kind: "process", kindLabel: "ML Pipeline", title: "ML Feature Store", color: "#fbbf24", x: 2500, y: 300, tags: ["ml"], content: "Feature engineering\nModel training data\nSageMaker integration" },
    ],
    edges: [
      { id: uid(), from: "dp-mob", to: "dp-api", label: "events (JSON)" },
      { id: uid(), from: "dp-web", to: "dp-api", label: "events (JSON)" },
      { id: uid(), from: "dp-api", to: "dp-kafka", label: "publish" },
      { id: uid(), from: "dp-kafka", to: "dp-flink", label: "consume (real-time)" },
      { id: uid(), from: "dp-kafka", to: "dp-spark", label: "consume (batch)" },
      { id: uid(), from: "dp-flink", to: "dp-redis", label: "live metrics" },
      { id: uid(), from: "dp-flink", to: "dp-s3", label: "processed events" },
      { id: uid(), from: "dp-spark", to: "dp-s3", label: "enriched data" },
      { id: uid(), from: "dp-s3", to: "dp-redshift", label: "COPY INTO" },
      { id: uid(), from: "dp-s3", to: "dp-ml", label: "training data" },
      { id: uid(), from: "dp-redshift", to: "dp-bi", label: "SQL queries" },
      { id: uid(), from: "dp-airflow", to: "dp-spark", label: "trigger" },
      { id: uid(), from: "dp-airflow", to: "dp-redshift", label: "refresh views" },
    ],
  },

  // ── 3. CI/CD Pipeline ──
  {
    name: "CI/CD Pipeline",
    description: "Full CI/CD pipeline from code commit to production deployment with approval gates",
    nodes: [
      { id: "ci-gh", kind: "vendor", kindLabel: "GitHub", title: "GitHub Repository", color: "#f97316", x: 0, y: 200, tags: ["source"], content: "Monorepo with Nx\n50+ packages\nProtected main branch" },
      { id: "ci-pr", kind: "process", kindLabel: "PR Checks", title: "PR Validation", color: "#fbbf24", x: 500, y: 0, tags: ["ci"], content: "Lint, type-check, unit tests\nCodecov coverage check\nSnyk security scan" },
      { id: "ci-build", kind: "process", kindLabel: "Build", title: "Build & Package", color: "#fbbf24", x: 500, y: 400, tags: ["ci"], content: "Docker multi-stage build\nARM64 + AMD64\nPush to ECR" },
      { id: "ci-test", kind: "process", kindLabel: "Integration", title: "Integration Tests", color: "#fbbf24", x: 1000, y: 200, tags: ["ci", "quality"], content: "Playwright E2E\nAPI contract tests\nLoad tests (k6)" },
      { id: "ci-staging", kind: "cloud", kindLabel: "Staging", title: "Staging Environment", color: "#8b5cf6", x: 1500, y: 0, tags: ["staging"], content: "EKS cluster (us-east-1)\nMirrored prod config\nSynthetic data" },
      { id: "ci-qa", kind: "person", kindLabel: "QA", title: "QA Approval", color: "#38bdf8", x: 1500, y: 400, tags: ["approval"], content: "Manual QA sign-off\nRegression testing\nAccessibility check" },
      { id: "ci-canary", kind: "process", kindLabel: "Canary", title: "Canary Deploy", color: "#fbbf24", x: 2000, y: 200, tags: ["deploy"], content: "5% traffic for 30 min\nError rate monitoring\nAuto-rollback on >1% errors" },
      { id: "ci-prod", kind: "cloud", kindLabel: "Production", title: "Production", color: "#8b5cf6", x: 2500, y: 200, tags: ["production", "critical"], content: "EKS cluster (multi-region)\nus-east-1, eu-west-1\nBlue/green deployment" },
      { id: "ci-monitor", kind: "system", kindLabel: "Datadog", title: "Monitoring", color: "#22c55e", x: 2500, y: 500, tags: ["observability"], content: "Datadog APM\nCustom dashboards\nPagerDuty integration" },
      { id: "ci-ecr", kind: "cloud", kindLabel: "ECR", title: "Container Registry", color: "#8b5cf6", x: 1000, y: 500, tags: ["registry"], content: "AWS ECR\nImage scanning\nLifecycle policies" },
    ],
    edges: [
      { id: uid(), from: "ci-gh", to: "ci-pr", label: "pull request" },
      { id: uid(), from: "ci-gh", to: "ci-build", label: "merge to main" },
      { id: uid(), from: "ci-pr", to: "ci-test", label: "PR tests pass" },
      { id: uid(), from: "ci-build", to: "ci-ecr", label: "push image" },
      { id: uid(), from: "ci-build", to: "ci-test", label: "run tests" },
      { id: uid(), from: "ci-test", to: "ci-staging", label: "deploy to staging" },
      { id: uid(), from: "ci-staging", to: "ci-qa", label: "QA review" },
      { id: uid(), from: "ci-qa", to: "ci-canary", label: "approved" },
      { id: uid(), from: "ci-canary", to: "ci-prod", label: "promote (100%)" },
      { id: uid(), from: "ci-prod", to: "ci-monitor", label: "metrics + traces" },
    ],
  },

  // ── 4. Incident Response Map ──
  {
    name: "Incident Response Playbook",
    description: "System dependency map for P0 incident response showing blast radius and escalation paths",
    nodes: [
      { id: "ir-lb", kind: "cloud", kindLabel: "Load Balancer", title: "ALB (Public)", color: "#8b5cf6", x: 500, y: 0, tags: ["entry-point"], content: "AWS ALB\nSSL termination\nWAF enabled\nHealth check: /healthz" },
      { id: "ir-api", kind: "api", kindLabel: "API Cluster", title: "API Service (EKS)", color: "#0ea5e9", x: 500, y: 280, tags: ["critical", "tier-1"], content: "12 pods, HPA enabled\nCPU limit: 80%\nMemory: 512Mi\nOn-call: Platform Team" },
      { id: "ir-db-primary", kind: "database", kindLabel: "Primary DB", title: "PostgreSQL Primary", color: "#6366f1", x: 0, y: 560, tags: ["critical", "tier-1"], content: "RDS r6g.2xlarge\nMulti-AZ\nConnection pool: 200\nSLA: 99.99%" },
      { id: "ir-db-replica", kind: "database", kindLabel: "Read Replica", title: "PostgreSQL Replica", color: "#6366f1", x: 0, y: 840, tags: ["tier-2"], content: "3 read replicas\nReplication lag alert: >5s\nUsed for analytics queries" },
      { id: "ir-redis", kind: "cache", kindLabel: "Redis", title: "ElastiCache Redis", color: "#ef4444", x: 500, y: 560, tags: ["critical"], content: "r6g.xlarge cluster mode\nSession store\nFail-open on outage" },
      { id: "ir-s3", kind: "cloud", kindLabel: "S3", title: "Asset Storage", color: "#8b5cf6", x: 1000, y: 280, tags: ["tier-2"], content: "User uploads, static assets\nCloudFront CDN in front\nCross-region replication" },
      { id: "ir-stripe", kind: "vendor", kindLabel: "Stripe", title: "Stripe Payments", color: "#f97316", x: 0, y: 280, tags: ["vendor", "critical"], content: "Payment processing\nWebhook reliability: 99.99%\nFallback: queue + retry" },
      { id: "ir-oncall", kind: "person", kindLabel: "On-Call", title: "On-Call Engineer", color: "#38bdf8", x: 1200, y: 840, tags: ["escalation"], content: "Primary: Platform Team\nSecondary: Backend Team\nEscalation: VP Eng (>30 min P0)" },
      { id: "ir-pd", kind: "vendor", kindLabel: "PagerDuty", title: "PagerDuty", color: "#f97316", x: 1200, y: 560, tags: ["alerting"], content: "P0: Page + SMS + Call\nP1: Page only\nEscalation: 15 min timeout" },
      { id: "ir-dd", kind: "system", kindLabel: "Datadog", title: "Datadog Monitoring", color: "#22c55e", x: 1200, y: 0, tags: ["observability"], content: "APM traces, custom metrics\nDashboard: swaymaps-prod\nAnomaly detection enabled" },
    ],
    edges: [
      { id: uid(), from: "ir-lb", to: "ir-api", label: "routes traffic" },
      { id: uid(), from: "ir-api", to: "ir-db-primary", label: "reads/writes" },
      { id: uid(), from: "ir-db-primary", to: "ir-db-replica", label: "replication" },
      { id: uid(), from: "ir-api", to: "ir-redis", label: "sessions + cache" },
      { id: uid(), from: "ir-api", to: "ir-s3", label: "file storage" },
      { id: uid(), from: "ir-api", to: "ir-stripe", label: "payments" },
      { id: uid(), from: "ir-dd", to: "ir-pd", label: "alert trigger" },
      { id: uid(), from: "ir-pd", to: "ir-oncall", label: "page engineer" },
      { id: uid(), from: "ir-dd", to: "ir-api", label: "monitors" },
      { id: uid(), from: "ir-dd", to: "ir-db-primary", label: "monitors" },
    ],
  },

  // ── 5. AWS Cloud Infrastructure ──
  {
    name: "AWS Production Infrastructure",
    description: "Multi-region AWS architecture with VPC, EKS, RDS, and supporting services",
    nodes: [
      { id: "aws-r53", kind: "cloud", kindLabel: "Route 53", title: "DNS (Route 53)", color: "#8b5cf6", x: 500, y: 0, tags: ["dns", "global"], content: "Latency-based routing\nHealth checks\nFailover between regions" },
      { id: "aws-cf", kind: "cloud", kindLabel: "CloudFront", title: "CloudFront CDN", color: "#8b5cf6", x: 500, y: 280, tags: ["cdn"], content: "Global edge locations\nHTTPS only\nCache TTL: 24h for assets" },
      { id: "aws-alb", kind: "cloud", kindLabel: "ALB", title: "Application LB", color: "#8b5cf6", x: 500, y: 560, tags: ["networking"], content: "SSL termination\nPath-based routing\nWAF rules attached" },
      { id: "aws-eks", kind: "cloud", kindLabel: "EKS", title: "EKS Cluster", color: "#8b5cf6", x: 500, y: 840, tags: ["compute", "critical"], content: "Kubernetes 1.29\n3 node groups\nKarpenter autoscaling\nIstio service mesh" },
      { id: "aws-rds", kind: "database", kindLabel: "RDS", title: "RDS PostgreSQL", color: "#6366f1", x: 0, y: 1120, tags: ["database", "critical"], content: "db.r6g.2xlarge\nMulti-AZ\nEncrypted at rest\nAutomated backups" },
      { id: "aws-elastic", kind: "cache", kindLabel: "ElastiCache", title: "ElastiCache Redis", color: "#ef4444", x: 500, y: 1120, tags: ["cache"], content: "r6g.xlarge\nCluster mode enabled\n6 shards" },
      { id: "aws-s3", kind: "cloud", kindLabel: "S3", title: "S3 Buckets", color: "#8b5cf6", x: 0, y: 280, tags: ["storage"], content: "assets-prod: Static files\nuploads-prod: User content\nlogs-prod: Access logs" },
      { id: "aws-sqs", kind: "queue", kindLabel: "SQS", title: "SQS Queues", color: "#f59e0b", x: 1000, y: 840, tags: ["messaging"], content: "order-events\nnotification-queue\nemail-queue\nDLQ for each" },
      { id: "aws-secrets", kind: "system", kindLabel: "Secrets Mgr", title: "Secrets Manager", color: "#22c55e", x: 0, y: 840, tags: ["security"], content: "API keys, DB creds\nAuto-rotation: 30 days\nIAM-based access" },
      { id: "aws-cw", kind: "system", kindLabel: "CloudWatch", title: "CloudWatch", color: "#22c55e", x: 1000, y: 1120, tags: ["monitoring"], content: "Log groups for all services\nCustom metrics\nAlarms → SNS → PagerDuty" },
      { id: "aws-waf", kind: "system", kindLabel: "WAF", title: "AWS WAF", color: "#22c55e", x: 1000, y: 280, tags: ["security"], content: "OWASP Top 10 rules\nRate limiting\nGeo-blocking\nBot control" },
    ],
    edges: [
      { id: uid(), from: "aws-r53", to: "aws-cf", label: "DNS resolution" },
      { id: uid(), from: "aws-cf", to: "aws-alb", label: "origin" },
      { id: uid(), from: "aws-cf", to: "aws-s3", label: "static assets" },
      { id: uid(), from: "aws-alb", to: "aws-eks", label: "routes to pods" },
      { id: uid(), from: "aws-eks", to: "aws-rds", label: "database queries" },
      { id: uid(), from: "aws-eks", to: "aws-elastic", label: "cache ops" },
      { id: uid(), from: "aws-eks", to: "aws-sqs", label: "enqueue jobs" },
      { id: uid(), from: "aws-eks", to: "aws-s3", label: "file uploads" },
      { id: uid(), from: "aws-eks", to: "aws-secrets", label: "fetch secrets" },
      { id: uid(), from: "aws-eks", to: "aws-cw", label: "logs + metrics" },
      { id: uid(), from: "aws-waf", to: "aws-alb", label: "protects" },
    ],
  },

  // ── 6. Organization / Team Dependencies ──
  {
    name: "Engineering Team Dependencies",
    description: "Cross-team dependencies and communication patterns across engineering org",
    nodes: [
      { id: "tm-cto", kind: "person", kindLabel: "CTO", title: "CTO — Sarah Chen", color: "#38bdf8", x: 500, y: 0, tags: ["leadership"], content: "Reports to CEO\nOKR: 99.9% uptime, 2x eng velocity" },
      { id: "tm-plat", kind: "team", kindLabel: "Platform", title: "Platform Team", color: "#14b8a6", x: 0, y: 300, tags: ["infra"], content: "8 engineers\nOwns: CI/CD, K8s, Observability\nLead: James Park\nOn-call rotation" },
      { id: "tm-back", kind: "team", kindLabel: "Backend", title: "Backend Team", color: "#14b8a6", x: 500, y: 300, tags: ["core"], content: "12 engineers\nOwns: API, Business Logic, Data\nLead: Priya Sharma\nRust + Go" },
      { id: "tm-front", kind: "team", kindLabel: "Frontend", title: "Frontend Team", color: "#14b8a6", x: 1000, y: 300, tags: ["product"], content: "6 engineers\nOwns: Web, Mobile, Design System\nLead: Marcus Johnson\nReact + RN" },
      { id: "tm-data", kind: "team", kindLabel: "Data", title: "Data Team", color: "#14b8a6", x: 0, y: 600, tags: ["analytics"], content: "4 engineers\nOwns: Data Pipeline, ML, BI\nLead: Ana Rodriguez" },
      { id: "tm-sec", kind: "team", kindLabel: "Security", title: "Security Team", color: "#14b8a6", x: 500, y: 600, tags: ["security"], content: "3 engineers\nOwns: AppSec, Compliance, Pen Testing\nLead: Wei Zhang" },
      { id: "tm-sre", kind: "team", kindLabel: "SRE", title: "SRE Team", color: "#14b8a6", x: 1000, y: 600, tags: ["reliability"], content: "5 engineers\nOwns: Incident Response, SLOs, Chaos\nLead: David Kim" },
      { id: "tm-pm", kind: "person", kindLabel: "Product", title: "Product Managers", color: "#38bdf8", x: 500, y: 900, tags: ["product"], content: "3 PMs covering:\n- Growth\n- Core Product\n- Enterprise" },
    ],
    edges: [
      { id: uid(), from: "tm-cto", to: "tm-plat", label: "manages" },
      { id: uid(), from: "tm-cto", to: "tm-back", label: "manages" },
      { id: uid(), from: "tm-cto", to: "tm-front", label: "manages" },
      { id: uid(), from: "tm-back", to: "tm-plat", label: "depends on (infra)" },
      { id: uid(), from: "tm-front", to: "tm-back", label: "depends on (APIs)" },
      { id: uid(), from: "tm-data", to: "tm-back", label: "data access" },
      { id: uid(), from: "tm-sec", to: "tm-plat", label: "security reviews" },
      { id: uid(), from: "tm-sec", to: "tm-back", label: "code audits" },
      { id: uid(), from: "tm-sre", to: "tm-plat", label: "incident collab" },
      { id: uid(), from: "tm-sre", to: "tm-back", label: "SLO targets" },
      { id: uid(), from: "tm-pm", to: "tm-back", label: "requirements" },
      { id: uid(), from: "tm-pm", to: "tm-front", label: "requirements" },
    ],
  },

  // ── 7. API Gateway & Consumer Map ──
  {
    name: "API Gateway Architecture",
    description: "API gateway routing to internal services with consumer authentication and rate limiting",
    nodes: [
      { id: "ag-ios", kind: "system", kindLabel: "iOS App", title: "iOS App v4.2", color: "#22c55e", x: 0, y: 0, tags: ["consumer"], content: "Swift/SwiftUI\n2M monthly active users\nRate limit: 100 req/min" },
      { id: "ag-android", kind: "system", kindLabel: "Android", title: "Android App v4.1", color: "#22c55e", x: 0, y: 300, tags: ["consumer"], content: "Kotlin\n3M monthly active users\nRate limit: 100 req/min" },
      { id: "ag-web", kind: "system", kindLabel: "Web SPA", title: "Web Application", color: "#22c55e", x: 0, y: 600, tags: ["consumer"], content: "React SPA\n5M monthly sessions\nRate limit: 200 req/min" },
      { id: "ag-partner", kind: "vendor", kindLabel: "Partner", title: "Partner APIs", color: "#f97316", x: 0, y: 900, tags: ["consumer", "external"], content: "15 partner integrations\nOAuth2 client credentials\nRate limit: 1000 req/min" },
      { id: "ag-gw", kind: "api", kindLabel: "Gateway", title: "Kong API Gateway", color: "#0ea5e9", x: 600, y: 400, tags: ["critical", "gateway"], content: "Kong Enterprise 3.4\nPlugins: rate-limit, auth, cors, logging\n50k req/s capacity" },
      { id: "ag-auth", kind: "system", kindLabel: "Auth", title: "Auth Service", color: "#22c55e", x: 1200, y: 0, tags: ["security"], content: "JWT validation\nOAuth2 server\nScope-based access" },
      { id: "ag-user", kind: "api", kindLabel: "Users API", title: "/api/v2/users", color: "#0ea5e9", x: 1200, y: 300, tags: ["internal"], content: "User CRUD\nProfile management\nGo + gRPC internal" },
      { id: "ag-product", kind: "api", kindLabel: "Products API", title: "/api/v2/products", color: "#0ea5e9", x: 1200, y: 600, tags: ["internal"], content: "Product catalog\nSearch & filter\nRust service" },
      { id: "ag-order", kind: "api", kindLabel: "Orders API", title: "/api/v2/orders", color: "#0ea5e9", x: 1200, y: 900, tags: ["internal", "critical"], content: "Order processing\nPayment integration\nNode.js service" },
      { id: "ag-docs", kind: "system", kindLabel: "API Docs", title: "Developer Portal", color: "#22c55e", x: 600, y: 800, tags: ["docs"], content: "Swagger/OpenAPI 3.1\nInteractive playground\nSDK downloads" },
    ],
    edges: [
      { id: uid(), from: "ag-ios", to: "ag-gw", label: "REST + JWT" },
      { id: uid(), from: "ag-android", to: "ag-gw", label: "REST + JWT" },
      { id: uid(), from: "ag-web", to: "ag-gw", label: "REST + JWT" },
      { id: uid(), from: "ag-partner", to: "ag-gw", label: "OAuth2" },
      { id: uid(), from: "ag-gw", to: "ag-auth", label: "validate token" },
      { id: uid(), from: "ag-gw", to: "ag-user", label: "/users/*" },
      { id: uid(), from: "ag-gw", to: "ag-product", label: "/products/*" },
      { id: uid(), from: "ag-gw", to: "ag-order", label: "/orders/*" },
      { id: uid(), from: "ag-order", to: "ag-user", label: "lookup user" },
      { id: uid(), from: "ag-order", to: "ag-product", label: "verify product" },
    ],
  },

  // ── 8. Database Schema & Replication ──
  {
    name: "Database Architecture",
    description: "Multi-database architecture with replication, caching layers, and data synchronization",
    nodes: [
      { id: "db-app", kind: "system", kindLabel: "App Layer", title: "Application Servers", color: "#22c55e", x: 500, y: 0, tags: ["compute"], content: "12 app server instances\nConnection pooling: PgBouncer\nMax connections: 200" },
      { id: "db-pgpool", kind: "process", kindLabel: "PgBouncer", title: "Connection Pool", color: "#fbbf24", x: 500, y: 280, tags: ["proxy"], content: "PgBouncer 1.21\nTransaction pooling mode\nMax client connections: 10000" },
      { id: "db-primary", kind: "database", kindLabel: "Primary", title: "PostgreSQL Primary", color: "#6366f1", x: 500, y: 560, tags: ["primary", "critical"], content: "PostgreSQL 16.1\ndb.r6g.4xlarge\n2TB storage\nWrite throughput: 5000 TPS" },
      { id: "db-replica1", kind: "database", kindLabel: "Replica", title: "Read Replica (US-East)", color: "#6366f1", x: 0, y: 840, tags: ["replica"], content: "Streaming replication\nLag < 100ms typical\nUsed for: API reads" },
      { id: "db-replica2", kind: "database", kindLabel: "Replica", title: "Read Replica (EU-West)", color: "#6366f1", x: 500, y: 840, tags: ["replica", "eu"], content: "Cross-region replica\nLag < 500ms\nUsed for: EU customers" },
      { id: "db-analytics", kind: "database", kindLabel: "Analytics", title: "Analytics Replica", color: "#6366f1", x: 1000, y: 840, tags: ["analytics"], content: "Dedicated for BI queries\nNo impact on production\n24h materialized views" },
      { id: "db-redis", kind: "cache", kindLabel: "Redis", title: "Redis Cache Layer", color: "#ef4444", x: 1100, y: 0, tags: ["cache"], content: "Redis 7 Cluster\nCache-aside pattern\nTTL: 5min (hot data)\nHit ratio: 94%" },
      { id: "db-mongo", kind: "database", kindLabel: "MongoDB", title: "MongoDB (Events)", color: "#6366f1", x: 1100, y: 280, tags: ["document-store"], content: "MongoDB 7.0\nSharded cluster\nEvent sourcing store\nTTL index: 90 days" },
      { id: "db-elastic", kind: "database", kindLabel: "Elasticsearch", title: "Elasticsearch", color: "#6366f1", x: 1100, y: 1120, tags: ["search"], content: "ES 8.12\n3 data nodes\nFull-text search index\nSynced via Debezium" },
      { id: "db-debezium", kind: "process", kindLabel: "CDC", title: "Debezium CDC", color: "#fbbf24", x: 500, y: 1120, tags: ["sync"], content: "Change Data Capture\nPostgreSQL → Kafka → ES\nReal-time sync" },
    ],
    edges: [
      { id: uid(), from: "db-app", to: "db-pgpool", label: "all queries" },
      { id: uid(), from: "db-app", to: "db-redis", label: "cache reads" },
      { id: uid(), from: "db-pgpool", to: "db-primary", label: "writes" },
      { id: uid(), from: "db-pgpool", to: "db-replica1", label: "reads (US)" },
      { id: uid(), from: "db-pgpool", to: "db-replica2", label: "reads (EU)" },
      { id: uid(), from: "db-primary", to: "db-replica1", label: "streaming repl" },
      { id: uid(), from: "db-primary", to: "db-replica2", label: "streaming repl" },
      { id: uid(), from: "db-primary", to: "db-analytics", label: "logical repl" },
      { id: uid(), from: "db-app", to: "db-mongo", label: "events" },
      { id: uid(), from: "db-primary", to: "db-debezium", label: "WAL stream" },
      { id: uid(), from: "db-debezium", to: "db-elastic", label: "sync index" },
    ],
  },

  // ── 9. Vendor Risk & Third-Party Dependencies ──
  {
    name: "Vendor & Third-Party Risk Map",
    description: "Third-party service dependencies with risk assessment, SLAs, and fallback strategies",
    nodes: [
      { id: "vr-app", kind: "system", kindLabel: "Our Platform", title: "SwayMaps Platform", color: "#22c55e", x: 600, y: 0, tags: ["internal"], content: "Core product\nAll vendor dependencies flow through here" },
      { id: "vr-stripe", kind: "vendor", kindLabel: "Stripe", title: "Stripe (Payments)", color: "#f97316", x: 0, y: 300, tags: ["critical", "payments"], content: "SLA: 99.99%\nContract: Enterprise\nCost: 2.9% + $0.30\nFallback: Adyen (cold standby)" },
      { id: "vr-aws", kind: "vendor", kindLabel: "AWS", title: "Amazon Web Services", color: "#f97316", x: 450, y: 300, tags: ["critical", "infra"], content: "SLA: 99.99% (compute)\nSpend: $45k/mo\nContract: Enterprise Support\nMulti-region" },
      { id: "vr-auth0", kind: "vendor", kindLabel: "Auth0", title: "Auth0 (Identity)", color: "#f97316", x: 900, y: 300, tags: ["critical", "auth"], content: "SLA: 99.99%\nContract: Enterprise\nCost: $3k/mo\nFallback: Keycloak self-hosted" },
      { id: "vr-dd", kind: "vendor", kindLabel: "Datadog", title: "Datadog (Monitoring)", color: "#f97316", x: 0, y: 600, tags: ["high", "observability"], content: "SLA: 99.9%\nCost: $8k/mo\nAPM + Logs + Infra\nFallback: Grafana self-hosted" },
      { id: "vr-twilio", kind: "vendor", kindLabel: "Twilio", title: "Twilio (SMS/Voice)", color: "#f97316", x: 450, y: 600, tags: ["medium", "comms"], content: "SLA: 99.95%\nCost: $2k/mo\nSMS + Voice + Verify\nFallback: AWS SNS" },
      { id: "vr-sendgrid", kind: "vendor", kindLabel: "SendGrid", title: "SendGrid (Email)", color: "#f97316", x: 900, y: 600, tags: ["medium", "email"], content: "SLA: 99.95%\nCost: $1.5k/mo\n500k emails/mo\nFallback: AWS SES" },
      { id: "vr-gh", kind: "vendor", kindLabel: "GitHub", title: "GitHub (Code)", color: "#f97316", x: 0, y: 900, tags: ["critical", "dev-tools"], content: "SLA: 99.95%\nEnterprise Cloud\nActions: 50k min/mo\nSAML SSO" },
      { id: "vr-vercel", kind: "vendor", kindLabel: "Vercel", title: "Vercel (Frontend)", color: "#f97316", x: 450, y: 900, tags: ["high", "hosting"], content: "SLA: 99.99%\nPro plan\nEdge functions\nFallback: CloudFront + S3" },
      { id: "vr-openai", kind: "vendor", kindLabel: "OpenAI", title: "OpenAI (AI/ML)", color: "#f97316", x: 900, y: 900, tags: ["medium", "ai"], content: "SLA: 99.0% (API)\nGPT-4o, Embeddings\nCost: $5k/mo\nFallback: Claude API" },
    ],
    edges: [
      { id: uid(), from: "vr-app", to: "vr-stripe", label: "payments" },
      { id: uid(), from: "vr-app", to: "vr-aws", label: "hosting" },
      { id: uid(), from: "vr-app", to: "vr-auth0", label: "authentication" },
      { id: uid(), from: "vr-app", to: "vr-dd", label: "monitoring" },
      { id: uid(), from: "vr-app", to: "vr-twilio", label: "notifications" },
      { id: uid(), from: "vr-app", to: "vr-sendgrid", label: "transactional email" },
      { id: uid(), from: "vr-app", to: "vr-gh", label: "source code" },
      { id: uid(), from: "vr-app", to: "vr-vercel", label: "frontend hosting" },
      { id: uid(), from: "vr-app", to: "vr-openai", label: "AI features" },
      { id: uid(), from: "vr-gh", to: "vr-vercel", label: "auto-deploy" },
    ],
  },

  // ── 10. Security Threat Model ──
  {
    name: "Security Threat Model",
    description: "STRIDE-based threat model showing trust boundaries, data flows, and security controls",
    nodes: [
      { id: "st-user", kind: "person", kindLabel: "End User", title: "End User (Browser)", color: "#38bdf8", x: 0, y: 300, tags: ["external", "untrusted"], content: "STRIDE: Spoofing, Tampering\nMitigation: MFA, CSRF tokens\nTrust level: NONE" },
      { id: "st-cdn", kind: "cloud", kindLabel: "CDN", title: "CloudFront CDN", color: "#8b5cf6", x: 500, y: 0, tags: ["edge"], content: "TLS 1.3 only\nDDoS protection\nGeo-restriction enabled" },
      { id: "st-waf", kind: "system", kindLabel: "WAF", title: "Web Application Firewall", color: "#22c55e", x: 500, y: 600, tags: ["security-control"], content: "AWS WAF\nOWASP Core Rule Set\nSQL injection protection\nBot management" },
      { id: "st-lb", kind: "cloud", kindLabel: "ALB", title: "Load Balancer", color: "#8b5cf6", x: 1000, y: 300, tags: ["trust-boundary"], content: "TRUST BOUNDARY: External → Internal\nSSL termination\nSecurity group: 443 only" },
      { id: "st-api", kind: "api", kindLabel: "API", title: "API Application", color: "#0ea5e9", x: 1500, y: 300, tags: ["internal", "critical"], content: "STRIDE: Elevation of Privilege\nInput validation\nJWT verification\nRate limiting" },
      { id: "st-auth", kind: "system", kindLabel: "Auth", title: "Identity Provider", color: "#22c55e", x: 1500, y: 0, tags: ["security-control"], content: "OAuth2 / OIDC\nMFA enforcement\nSession timeout: 30min\nBrute force protection" },
      { id: "st-db", kind: "database", kindLabel: "Database", title: "Primary Database", color: "#6366f1", x: 2000, y: 300, tags: ["critical", "pii"], content: "DATA CLASSIFICATION: PII, PHI\nEncrypted at rest (AES-256)\nEncrypted in transit (TLS)\nColumn-level encryption for SSN" },
      { id: "st-secrets", kind: "system", kindLabel: "Vault", title: "HashiCorp Vault", color: "#22c55e", x: 2000, y: 600, tags: ["security-control"], content: "Secret management\nDynamic DB credentials\nAuto-rotation: 24h\nAudit logging" },
      { id: "st-logs", kind: "database", kindLabel: "SIEM", title: "Security Logs (SIEM)", color: "#6366f1", x: 1500, y: 600, tags: ["audit"], content: "Splunk SIEM\nAll auth events\nAPI access logs\nAnomaly detection\n1 year retention" },
    ],
    edges: [
      { id: uid(), from: "st-user", to: "st-cdn", label: "HTTPS (TLS 1.3)" },
      { id: uid(), from: "st-user", to: "st-waf", label: "filtered traffic" },
      { id: uid(), from: "st-cdn", to: "st-lb", label: "origin fetch" },
      { id: uid(), from: "st-waf", to: "st-lb", label: "allowed traffic" },
      { id: uid(), from: "st-lb", to: "st-api", label: "TRUST BOUNDARY" },
      { id: uid(), from: "st-api", to: "st-auth", label: "verify identity" },
      { id: uid(), from: "st-api", to: "st-db", label: "encrypted queries" },
      { id: uid(), from: "st-api", to: "st-secrets", label: "fetch credentials" },
      { id: uid(), from: "st-api", to: "st-logs", label: "audit trail" },
      { id: uid(), from: "st-db", to: "st-secrets", label: "rotate creds" },
    ],
  },

  // ── 11. Event-Driven Architecture ──
  {
    name: "Event-Driven Architecture",
    description: "CQRS + Event Sourcing architecture with domain events flowing through message broker",
    nodes: [
      { id: "ev-client", kind: "system", kindLabel: "Client", title: "Client Applications", color: "#22c55e", x: 0, y: 350, tags: ["frontend"], content: "Web + Mobile clients\nOptimistic UI updates\nWebSocket for real-time" },
      { id: "ev-cmd", kind: "api", kindLabel: "Command API", title: "Command Service", color: "#0ea5e9", x: 550, y: 0, tags: ["write-side"], content: "Handles writes/mutations\nCommand validation\nDomain event emission\nIdempotency keys" },
      { id: "ev-query", kind: "api", kindLabel: "Query API", title: "Query Service", color: "#0ea5e9", x: 550, y: 700, tags: ["read-side"], content: "Handles reads/queries\nPre-computed views\nGraphQL endpoint\nCached responses" },
      { id: "ev-eventstore", kind: "database", kindLabel: "Event Store", title: "Event Store", color: "#6366f1", x: 1100, y: 0, tags: ["source-of-truth", "critical"], content: "EventStoreDB\nAppend-only log\nEvent versioning\nSource of truth" },
      { id: "ev-kafka", kind: "queue", kindLabel: "Kafka", title: "Event Bus (Kafka)", color: "#f59e0b", x: 1100, y: 350, tags: ["messaging", "critical"], content: "Apache Kafka\nDomain events\nTopics: orders, payments, notifications\nAt-least-once delivery" },
      { id: "ev-proj1", kind: "process", kindLabel: "Projector", title: "Order Projector", color: "#fbbf24", x: 1650, y: 0, tags: ["projector"], content: "Builds order read model\nConsumes: OrderCreated, OrderUpdated\nUpdates: orders_view table" },
      { id: "ev-proj2", kind: "process", kindLabel: "Projector", title: "Analytics Projector", color: "#fbbf24", x: 1650, y: 350, tags: ["projector"], content: "Builds analytics read model\nConsumes: all domain events\nUpdates: analytics_view table" },
      { id: "ev-proj3", kind: "process", kindLabel: "Reactor", title: "Notification Reactor", color: "#fbbf24", x: 1650, y: 700, tags: ["reactor"], content: "Side effects from events\nSend emails, push notifications\nConsumes: OrderCompleted, PaymentFailed" },
      { id: "ev-readdb", kind: "database", kindLabel: "Read DB", title: "Read Model DB", color: "#6366f1", x: 2200, y: 150, tags: ["read-model"], content: "PostgreSQL\nDenormalized views\nOptimized for queries\nEventually consistent" },
      { id: "ev-ws", kind: "system", kindLabel: "WebSocket", title: "Real-Time Gateway", color: "#22c55e", x: 2200, y: 550, tags: ["real-time"], content: "WebSocket server\nPushes events to clients\nRoom-based subscriptions" },
    ],
    edges: [
      { id: uid(), from: "ev-client", to: "ev-cmd", label: "commands (POST)" },
      { id: uid(), from: "ev-client", to: "ev-query", label: "queries (GET)" },
      { id: uid(), from: "ev-cmd", to: "ev-eventstore", label: "persist events" },
      { id: uid(), from: "ev-cmd", to: "ev-kafka", label: "publish events" },
      { id: uid(), from: "ev-kafka", to: "ev-proj1", label: "order events" },
      { id: uid(), from: "ev-kafka", to: "ev-proj2", label: "all events" },
      { id: uid(), from: "ev-kafka", to: "ev-proj3", label: "notification events" },
      { id: uid(), from: "ev-proj1", to: "ev-readdb", label: "update view" },
      { id: uid(), from: "ev-proj2", to: "ev-readdb", label: "update view" },
      { id: uid(), from: "ev-query", to: "ev-readdb", label: "read queries" },
      { id: uid(), from: "ev-kafka", to: "ev-ws", label: "live events" },
      { id: uid(), from: "ev-ws", to: "ev-client", label: "push updates" },
    ],
  },

  // ── 12. SaaS Multi-Tenant Architecture ──
  {
    name: "Multi-Tenant SaaS Architecture",
    description: "B2B SaaS platform with tenant isolation, billing, and enterprise SSO",
    nodes: [
      { id: "mt-tenant", kind: "person", kindLabel: "Tenant", title: "Tenant Users", color: "#38bdf8", x: 0, y: 300, tags: ["external"], content: "Enterprise customers\nSSO via SAML/OIDC\nRole-based access" },
      { id: "mt-cf", kind: "cloud", kindLabel: "CloudFront", title: "CDN + Edge", color: "#8b5cf6", x: 500, y: 0, tags: ["edge"], content: "Tenant-aware caching\nCustom domains per tenant\nEdge functions for routing" },
      { id: "mt-app", kind: "system", kindLabel: "App", title: "Application Tier", color: "#22c55e", x: 500, y: 300, tags: ["compute", "critical"], content: "Next.js + Node.js\nTenant context middleware\nRequest-scoped isolation" },
      { id: "mt-auth", kind: "system", kindLabel: "Auth", title: "Multi-Tenant Auth", color: "#22c55e", x: 1000, y: 0, tags: ["security"], content: "Auth0 Organizations\nSAML for enterprise\nJIT provisioning\nSCIM directory sync" },
      { id: "mt-router", kind: "process", kindLabel: "Router", title: "Tenant Router", color: "#fbbf24", x: 1000, y: 300, tags: ["routing"], content: "Resolves tenant from:\n- Subdomain (acme.app.com)\n- JWT claims\n- API key header" },
      { id: "mt-billing", kind: "vendor", kindLabel: "Stripe", title: "Billing (Stripe)", color: "#f97316", x: 1000, y: 600, tags: ["billing"], content: "Per-seat pricing\nUsage-based metering\nInvoice generation\nDunning management" },
      { id: "mt-db", kind: "database", kindLabel: "PostgreSQL", title: "Shared DB (RLS)", color: "#6366f1", x: 1500, y: 300, tags: ["critical", "data"], content: "Row-Level Security per tenant\nTenant ID in every table\nConnection pool per tenant\nEncrypted PII columns" },
      { id: "mt-queue", kind: "queue", kindLabel: "Queue", title: "Job Queue", color: "#f59e0b", x: 1500, y: 0, tags: ["async"], content: "BullMQ + Redis\nTenant-scoped workers\nRate limiting per tenant\nPriority queues for enterprise" },
      { id: "mt-storage", kind: "cloud", kindLabel: "S3", title: "Tenant Storage", color: "#8b5cf6", x: 1500, y: 600, tags: ["storage"], content: "S3 with tenant prefix\nPre-signed URLs\nEncryption per tenant\nStorage quotas" },
      { id: "mt-admin", kind: "system", kindLabel: "Admin", title: "Admin Dashboard", color: "#22c55e", x: 500, y: 600, tags: ["internal"], content: "Internal admin panel\nTenant management\nUsage analytics\nSupport tools" },
    ],
    edges: [
      { id: uid(), from: "mt-tenant", to: "mt-cf", label: "acme.app.com" },
      { id: uid(), from: "mt-cf", to: "mt-app", label: "origin" },
      { id: uid(), from: "mt-app", to: "mt-auth", label: "SSO / JWT" },
      { id: uid(), from: "mt-app", to: "mt-router", label: "resolve tenant" },
      { id: uid(), from: "mt-router", to: "mt-db", label: "set RLS context" },
      { id: uid(), from: "mt-app", to: "mt-db", label: "queries (RLS)" },
      { id: uid(), from: "mt-app", to: "mt-queue", label: "async jobs" },
      { id: uid(), from: "mt-app", to: "mt-storage", label: "file ops" },
      { id: uid(), from: "mt-app", to: "mt-billing", label: "usage metering" },
      { id: uid(), from: "mt-admin", to: "mt-db", label: "admin queries" },
      { id: uid(), from: "mt-admin", to: "mt-billing", label: "billing mgmt" },
    ],
  },

  // ── 13. Enterprise Sales Pipeline ──
  {
    name: "Enterprise Sales Pipeline",
    description: "End-to-end B2B sales pipeline from lead generation to closed-won with handoffs, stakeholders, and tools",
    nodes: [
      { id: "sp-mkt", kind: "team", kindLabel: "Marketing", title: "Marketing Team", color: "#8b5cf6", x: 0, y: 300, tags: ["demand-gen", "team"], content: "Demand Generation\n- Content marketing (blog, whitepapers, webinars)\n- Paid ads (Google, LinkedIn)\n- SEO optimization\n- Event sponsorships\n\nTools: HubSpot, Google Ads, Webflow\nOwner: VP Marketing\nKPI: MQLs per quarter" },
      { id: "sp-sdr", kind: "person", kindLabel: "SDR Team", title: "Sales Development", color: "#38bdf8", x: 0, y: 0, tags: ["outbound", "prospecting"], content: "SDR Team (8 reps)\n- Cold outreach (email + LinkedIn)\n- Qualify inbound MQLs\n- Book discovery calls\n- BANT qualification\n\nTools: Outreach, LinkedIn Sales Nav, ZoomInfo\nQuota: 15 meetings/month per rep\nOwner: SDR Manager" },
      { id: "sp-ae", kind: "person", kindLabel: "Account Exec", title: "Account Executives", color: "#38bdf8", x: 1000, y: 300, tags: ["closing", "team"], content: "AE Team (5 reps)\n- Run discovery & demo calls\n- Build proposals & SOWs\n- Negotiate contracts\n- Manage complex deal cycles\n\nAvg deal size: $120K ARR\nAvg sales cycle: 90 days\nTools: Salesforce, Gong, DocuSign" },
      { id: "sp-se", kind: "person", kindLabel: "Solutions Eng", title: "Solutions Engineers", color: "#38bdf8", x: 1000, y: 600, tags: ["technical", "pre-sales"], content: "SE Team (3 engineers)\n- Technical discovery\n- Custom demos & POCs\n- RFP/RFI responses\n- Security questionnaires\n\nTools: Demo environment, Notion, Jira" },
      { id: "sp-crm", kind: "system", kindLabel: "Salesforce", title: "Salesforce CRM", color: "#22c55e", x: 500, y: 600, tags: ["crm", "tool"], content: "Salesforce Enterprise\n- Lead & Opportunity management\n- Pipeline forecasting\n- Activity tracking\n- Custom objects for product usage\n\nIntegrations: HubSpot, Outreach, Slack\nAdmin: Rev Ops team" },
      { id: "sp-legal", kind: "team", kindLabel: "Legal", title: "Legal & Compliance", color: "#f97316", x: 1500, y: 0, tags: ["contracts", "compliance"], content: "Legal Review Process\n- MSA review (5 business days)\n- DPA / GDPR compliance\n- Security addendum\n- Custom terms negotiation\n\nEscalation: deals > $200K need VP Legal\nTools: Ironclad, DocuSign" },
      { id: "sp-exec", kind: "person", kindLabel: "VP Sales", title: "Executive Sponsor", color: "#38bdf8", x: 1500, y: 300, tags: ["leadership", "approval"], content: "VP Sales\n- Approve discounts > 15%\n- Executive alignment calls\n- Board deal reviews\n- Quarterly business reviews\n\nApproval thresholds:\n- < $50K: AE only\n- $50-200K: Director\n- > $200K: VP Sales" },
      { id: "sp-cs", kind: "team", kindLabel: "Customer Success", title: "Customer Success", color: "#22c55e", x: 2000, y: 300, tags: ["onboarding", "retention"], content: "CS Team (4 CSMs)\n- Onboarding program (60-day)\n- Quarterly business reviews\n- Health score monitoring\n- Expansion opportunities\n\nTools: Gainsight, Slack, Loom\nKPI: Net Revenue Retention > 120%" },
      { id: "sp-finance", kind: "team", kindLabel: "Finance", title: "Finance / RevOps", color: "#f59e0b", x: 1500, y: 600, tags: ["billing", "operations"], content: "Revenue Operations\n- Deal desk support\n- Invoice generation\n- Revenue recognition (ASC 606)\n- Commission calculations\n\nTools: Stripe, NetSuite, CaptivateIQ" },
      { id: "sp-deal", kind: "process", kindLabel: "Deal Stages", title: "Deal Pipeline", color: "#fbbf24", x: 500, y: 300, tags: ["process", "pipeline"], content: "Pipeline Stages:\n1. Lead → MQL (marketing qualified)\n2. MQL → SQL (sales qualified)\n3. SQL → Discovery call\n4. Discovery → Demo/POC\n5. POC → Proposal sent\n6. Proposal → Negotiation\n7. Negotiation → Closed Won/Lost\n\nConversion rates tracked at each stage" },
    ],
    edges: [
      { id: uid(), from: "sp-mkt", to: "sp-deal", label: "MQLs", content: "Marketing generates MQLs via content, events, and paid channels. Target: 200 MQLs/month." },
      { id: uid(), from: "sp-sdr", to: "sp-deal", label: "SQLs", content: "SDRs qualify leads using BANT framework and book discovery calls for AEs." },
      { id: uid(), from: "sp-deal", to: "sp-ae", label: "qualified opps", content: "Qualified opportunities handed to Account Executives with full context in Salesforce." },
      { id: uid(), from: "sp-ae", to: "sp-se", label: "technical eval", content: "AEs engage Solutions Engineers for technical discovery, custom demos, and POC setup." },
      { id: uid(), from: "sp-ae", to: "sp-crm", label: "log activity", content: "All meetings, emails, and deal updates logged in Salesforce for pipeline visibility." },
      { id: uid(), from: "sp-ae", to: "sp-legal", label: "contract review", content: "Contracts sent to Legal for MSA, DPA, and security addendum review." },
      { id: uid(), from: "sp-ae", to: "sp-exec", label: "deal approval", content: "Deals requiring discount approval or executive sponsor involvement." },
      { id: uid(), from: "sp-exec", to: "sp-finance", label: "approve terms", content: "Finance reviews pricing, payment terms, and revenue recognition for approved deals." },
      { id: uid(), from: "sp-legal", to: "sp-finance", label: "signed contract", content: "Executed contracts trigger invoicing and revenue booking in NetSuite." },
      { id: uid(), from: "sp-finance", to: "sp-cs", label: "closed won", content: "Finance confirms booking → CS team begins 60-day onboarding program." },
      { id: uid(), from: "sp-mkt", to: "sp-sdr", label: "inbound leads", content: "Marketing passes scored leads to SDR team via HubSpot → Salesforce sync." },
    ],
  },

  // ── 14. HR Employee Onboarding ──
  {
    name: "Employee Onboarding Process",
    description: "Complete new hire onboarding workflow from offer acceptance to 90-day review for a 500+ employee company",
    nodes: [
      { id: "hr-recruit", kind: "person", kindLabel: "Recruiter", title: "Talent Acquisition", color: "#38bdf8", x: 0, y: 300, tags: ["hiring", "team"], content: "Recruiting Team\n- Post job on LinkedIn, Greenhouse\n- Screen candidates\n- Coordinate interviews\n- Extend offers\n\nTools: Greenhouse ATS, LinkedIn Recruiter\nAvg time-to-hire: 45 days" },
      { id: "hr-offer", kind: "process", kindLabel: "Offer", title: "Offer & Background", color: "#fbbf24", x: 500, y: 0, tags: ["process", "compliance"], content: "Offer Package:\n- Compensation letter\n- Benefits overview\n- Equity grant details\n- Start date confirmation\n\nBackground check via Checkr (3-5 days)\nOwner: Recruiting coordinator" },
      { id: "hr-it", kind: "team", kindLabel: "IT Setup", title: "IT Provisioning", color: "#22c55e", x: 1000, y: 600, tags: ["equipment", "access"], content: "IT Onboarding Checklist:\n- Laptop (MacBook Pro 14\")\n- Email account (Google Workspace)\n- Slack workspace access\n- VPN + SSO setup (Okta)\n- GitHub / Jira / Confluence access\n- Badge & building access\n\nSLA: Complete 2 days before start date\nTools: Okta, Jamf, ServiceNow" },
      { id: "hr-manager", kind: "person", kindLabel: "Manager", title: "Hiring Manager", color: "#38bdf8", x: 1000, y: 300, tags: ["team", "leadership"], content: "Hiring Manager Responsibilities:\n- Prepare 30/60/90 day plan\n- Assign onboarding buddy\n- Schedule team introductions\n- Set initial OKRs\n- Weekly 1:1s for first 90 days\n\nToolkit: Notion onboarding template" },
      { id: "hr-buddy", kind: "person", kindLabel: "Buddy", title: "Onboarding Buddy", color: "#38bdf8", x: 1500, y: 600, tags: ["support", "culture"], content: "Buddy Program:\n- Assigned peer mentor\n- Daily check-ins (week 1)\n- Weekly coffee chats (month 1-3)\n- Navigate company culture\n- Answer informal questions\n\nSelected from same team or adjacent team" },
      { id: "hr-orient", kind: "process", kindLabel: "Orientation", title: "Day 1 Orientation", color: "#fbbf24", x: 1000, y: 0, tags: ["day-1", "process"], content: "Day 1 Schedule:\n09:00 - Welcome & company overview\n10:00 - HR paperwork (I-9, W-4, benefits)\n11:00 - Office tour & team lunch\n13:00 - IT setup walkthrough\n14:00 - Company values & culture session\n15:00 - Meet hiring manager\n16:00 - Buddy introduction\n\nLocation: HQ or virtual (Zoom)" },
      { id: "hr-train", kind: "process", kindLabel: "Training", title: "Role Training", color: "#fbbf24", x: 1500, y: 0, tags: ["training", "learning"], content: "Training Program (Week 1-4):\n- Company products deep-dive\n- Team processes & workflows\n- Tool-specific training\n- Security awareness training\n- Compliance training (SOC 2)\n\nPlatform: Lessonly + internal wiki\nCompletion tracked in HRIS" },
      { id: "hr-review30", kind: "process", kindLabel: "30-Day", title: "30-Day Check-in", color: "#fbbf24", x: 1500, y: 300, tags: ["review", "milestone"], content: "30-Day Review:\n- Manager feedback conversation\n- Self-assessment form\n- Onboarding satisfaction survey\n- Address any concerns\n- Adjust OKRs if needed\n\nOwner: Hiring Manager + HR BP" },
      { id: "hr-review90", kind: "process", kindLabel: "90-Day", title: "90-Day Review", color: "#fbbf24", x: 2000, y: 300, tags: ["review", "milestone", "critical"], content: "90-Day Review (Probation End):\n- Performance evaluation\n- Cultural fit assessment\n- Confirm continued employment\n- Set annual OKRs\n- Benefits enrollment confirmation\n\nDecision: Pass / Extend probation / Exit\nOwner: Hiring Manager + HR Director" },
      { id: "hr-hris", kind: "system", kindLabel: "Workday", title: "Workday HRIS", color: "#22c55e", x: 500, y: 300, tags: ["system", "hr-tech"], content: "Workday HRIS\n- Employee records\n- Benefits administration\n- Payroll processing\n- Time & attendance\n- Org chart management\n\nIntegrations: Okta SSO, Greenhouse, NetSuite" },
      { id: "hr-payroll", kind: "team", kindLabel: "Payroll", title: "Payroll & Benefits", color: "#f59e0b", x: 500, y: 600, tags: ["compensation", "benefits"], content: "Payroll Setup:\n- Add to payroll (ADP/Gusto)\n- Benefits enrollment window (30 days)\n- 401k enrollment\n- HSA/FSA setup\n- Direct deposit configuration\n\nFirst paycheck verification required" },
    ],
    edges: [
      { id: uid(), from: "hr-recruit", to: "hr-offer", label: "extend offer", content: "Recruiter extends verbal then written offer. Compensation approved by hiring manager and comp team." },
      { id: uid(), from: "hr-offer", to: "hr-it", label: "trigger provisioning", content: "Upon offer acceptance, IT provisioning begins. Equipment ordered and accounts created." },
      { id: uid(), from: "hr-offer", to: "hr-hris", label: "create profile", content: "New hire profile created in Workday with compensation, start date, and org placement." },
      { id: uid(), from: "hr-hris", to: "hr-payroll", label: "payroll setup", content: "HRIS triggers payroll enrollment, benefits eligibility, and tax form collection." },
      { id: uid(), from: "hr-it", to: "hr-orient", label: "equipment ready", content: "IT confirms all equipment, accounts, and access are provisioned before Day 1." },
      { id: uid(), from: "hr-orient", to: "hr-manager", label: "team handoff", content: "After orientation, new hire transitions to hiring manager for team integration." },
      { id: uid(), from: "hr-manager", to: "hr-buddy", label: "assign buddy", content: "Manager assigns onboarding buddy from the team for peer support." },
      { id: uid(), from: "hr-orient", to: "hr-train", label: "begin training", content: "Training curriculum starts Day 2 with product knowledge and tool training." },
      { id: uid(), from: "hr-manager", to: "hr-review30", label: "30-day check", content: "Manager conducts 30-day review to assess early performance and cultural integration." },
      { id: uid(), from: "hr-review30", to: "hr-review90", label: "continue onboarding", content: "Positive 30-day review leads to continued onboarding. Concerns flagged to HR." },
      { id: uid(), from: "hr-train", to: "hr-review30", label: "training complete", content: "Core training should be completed by Day 30. Certification status tracked in Lessonly." },
    ],
  },

  // ── 15. Product Roadmap & Dependencies ──
  {
    name: "Product Roadmap Q2 2026",
    description: "Quarterly product roadmap showing feature streams, dependencies, team ownership, and milestone targets",
    nodes: [
      { id: "pr-theme1", kind: "generic", kindLabel: "Theme", title: "Growth & Acquisition", color: "#22c55e", x: 0, y: 0, tags: ["theme", "growth"], content: "Strategic Theme: Growth & Acquisition\n- Increase sign-up conversion by 25%\n- Launch self-serve enterprise trial\n- Expand to 3 new verticals\n\nBusiness goal: $2M ARR by Q2 end\nOwner: CPO + VP Growth" },
      { id: "pr-theme2", kind: "generic", kindLabel: "Theme", title: "Platform Reliability", color: "#ef4444", x: 0, y: 600, tags: ["theme", "reliability"], content: "Strategic Theme: Platform Reliability\n- Achieve 99.95% uptime SLA\n- Reduce p99 latency to < 200ms\n- Zero data loss incidents\n\nBusiness goal: Enterprise readiness\nOwner: CTO + VP Engineering" },
      { id: "pr-f1", kind: "process", kindLabel: "Feature", title: "SSO / SAML Integration", color: "#fbbf24", x: 550, y: 0, tags: ["enterprise", "security", "Q2-W1"], content: "SSO / SAML 2.0 Integration\n- Support Okta, Azure AD, OneLogin\n- SCIM user provisioning\n- JIT account creation\n\nPriority: P0 (enterprise blocker)\nEstimate: 6 weeks\nTeam: Platform (3 engineers)\nStatus: In Development\nDependency: Identity service refactor" },
      { id: "pr-f2", kind: "process", kindLabel: "Feature", title: "Advanced Analytics Dashboard", color: "#fbbf24", x: 550, y: 300, tags: ["analytics", "growth", "Q2-W3"], content: "Advanced Analytics Dashboard\n- Custom report builder\n- Scheduled email reports\n- Data export (CSV, PDF)\n- Embeddable charts\n\nPriority: P1\nEstimate: 4 weeks\nTeam: Product (2 FE + 1 BE)\nStatus: Design Review\nFigma: [link to designs]" },
      { id: "pr-f3", kind: "process", kindLabel: "Feature", title: "Real-Time Collaboration", color: "#fbbf24", x: 550, y: 600, tags: ["collaboration", "Q2-W2"], content: "Real-Time Collaboration (v2)\n- Live cursors & presence\n- Conflict-free editing (CRDT)\n- Comments on any element\n- @mentions with notifications\n\nPriority: P0\nEstimate: 8 weeks\nTeam: Core (4 engineers)\nStatus: Technical Spike\nRisk: CRDT complexity" },
      { id: "pr-f4", kind: "process", kindLabel: "Feature", title: "Multi-Region Deploy", color: "#fbbf24", x: 550, y: 900, tags: ["infrastructure", "reliability", "Q2-W4"], content: "Multi-Region Deployment\n- EU region (eu-west-1)\n- Data residency compliance\n- Geo-routing with latency-based DNS\n- Cross-region replication\n\nPriority: P0 (GDPR compliance)\nEstimate: 10 weeks\nTeam: Infrastructure (2 SREs)\nStatus: Architecture Review" },
      { id: "pr-design", kind: "team", kindLabel: "Design", title: "Design Team", color: "#8b5cf6", x: 1100, y: 0, tags: ["design", "ux"], content: "Design Team (3 designers)\n- UX research & user interviews\n- Figma design system\n- Prototype & usability testing\n- Accessibility compliance (WCAG 2.1 AA)\n\nCurrent sprint: Analytics dashboard mockups\nOwner: Head of Design" },
      { id: "pr-eng", kind: "team", kindLabel: "Engineering", title: "Engineering Teams", color: "#0ea5e9", x: 1100, y: 350, tags: ["engineering", "development"], content: "Engineering Organization:\n- Platform team (6 engineers)\n- Core product team (8 engineers)\n- Infrastructure team (3 SREs)\n- QA team (2 engineers)\n\nSprint cadence: 2-week sprints\nTools: Linear, GitHub, Datadog" },
      { id: "pr-qa", kind: "team", kindLabel: "QA", title: "QA & Testing", color: "#f97316", x: 1100, y: 700, tags: ["quality", "testing"], content: "QA Process:\n- Automated E2E (Playwright, 400+ tests)\n- Performance testing (k6)\n- Security scanning (Snyk)\n- Manual regression for major releases\n- Accessibility audits quarterly\n\nRelease criteria: Zero P0/P1 bugs" },
      { id: "pr-m1", kind: "generic", kindLabel: "Milestone", title: "Beta Launch (Apr 15)", color: "#10b981", x: 1650, y: 150, tags: ["milestone", "deadline"], content: "Beta Launch Milestone - April 15\n- SSO feature GA for beta partners\n- Analytics dashboard beta\n- 10 enterprise beta customers\n- Success criteria: < 5 critical bugs\n\nGo/No-Go meeting: Apr 12" },
      { id: "pr-m2", kind: "generic", kindLabel: "Milestone", title: "GA Release (Jun 30)", color: "#10b981", x: 1650, y: 600, tags: ["milestone", "deadline", "critical"], content: "General Availability - June 30\n- All Q2 features shipped\n- Multi-region live\n- Real-time collab v2 live\n- SOC 2 Type II report ready\n- Launch marketing campaign\n\nGo/No-Go meeting: Jun 25\nStakeholders: CEO, CTO, CPO, VP Sales" },
    ],
    edges: [
      { id: uid(), from: "pr-theme1", to: "pr-f1", label: "drives", content: "Enterprise SSO is the #1 blocker for enterprise deals. Required by 80% of prospects." },
      { id: uid(), from: "pr-theme1", to: "pr-f2", label: "drives", content: "Analytics dashboard drives retention and expansion. Key differentiator vs competitors." },
      { id: uid(), from: "pr-theme2", to: "pr-f3", label: "drives" },
      { id: uid(), from: "pr-theme2", to: "pr-f4", label: "drives" },
      { id: uid(), from: "pr-f1", to: "pr-design", label: "design review", content: "SSO setup wizard needs UX design for self-serve configuration." },
      { id: uid(), from: "pr-f2", to: "pr-design", label: "design needed", content: "Dashboard builder requires extensive UX research and Figma prototypes." },
      { id: uid(), from: "pr-design", to: "pr-eng", label: "hand off specs", content: "Figma specs, interaction patterns, and component library updates delivered to engineering." },
      { id: uid(), from: "pr-eng", to: "pr-qa", label: "ready for QA", content: "Feature branches deployed to staging for QA validation before release." },
      { id: uid(), from: "pr-f1", to: "pr-m1", label: "target: beta", content: "SSO must be beta-ready by April 15 for enterprise beta program." },
      { id: uid(), from: "pr-f2", to: "pr-m1", label: "target: beta" },
      { id: uid(), from: "pr-f3", to: "pr-m2", label: "target: GA", content: "Real-time collaboration v2 must ship for GA launch." },
      { id: uid(), from: "pr-f4", to: "pr-m2", label: "target: GA", content: "Multi-region required for GDPR compliance before GA announcement." },
      { id: uid(), from: "pr-qa", to: "pr-m1", label: "sign off" },
      { id: uid(), from: "pr-qa", to: "pr-m2", label: "sign off" },
      { id: uid(), from: "pr-f3", to: "pr-f1", label: "depends on", content: "Collaboration features need SSO for proper user identity management." },
    ],
  },

  // ── 16. Supply Chain & Logistics ──
  {
    name: "Supply Chain & Logistics",
    description: "Global supply chain map showing raw material sourcing, manufacturing, distribution, and retail for a consumer electronics company",
    nodes: [
      { id: "sc-supplier1", kind: "vendor", kindLabel: "Supplier", title: "TSMC (Chip Fab)", color: "#f97316", x: 0, y: 0, tags: ["tier-1", "semiconductor", "critical"], content: "TSMC (Taiwan)\n- 5nm chip fabrication\n- Lead time: 16-20 weeks\n- Contract: 3-year MSA\n- Risk: Single source, geopolitical\n- Annual spend: $45M\n\nContact: James Chen, VP Sales\nBackup supplier: Samsung Foundry (qualified)" },
      { id: "sc-supplier2", kind: "vendor", kindLabel: "Supplier", title: "LG Display", color: "#f97316", x: 0, y: 350, tags: ["tier-1", "displays"], content: "LG Display (South Korea)\n- OLED panel manufacturing\n- Lead time: 12 weeks\n- Quality yield: 92%\n- Annual spend: $28M\n\nContact: Min-Jun Park, Account Manager\nBackup: BOE Technology (qualifying)" },
      { id: "sc-supplier3", kind: "vendor", kindLabel: "Supplier", title: "Murata (Components)", color: "#f97316", x: 0, y: 700, tags: ["tier-2", "passive-components"], content: "Murata (Japan)\n- Capacitors, inductors, sensors\n- Lead time: 8-12 weeks\n- 200+ part numbers\n- Annual spend: $12M\n\nRisk: Moderate (multiple qualified suppliers)" },
      { id: "sc-assembly", kind: "process", kindLabel: "Assembly", title: "Foxconn Assembly", color: "#fbbf24", x: 550, y: 250, tags: ["manufacturing", "critical"], content: "Foxconn (Shenzhen, China)\n- PCB assembly (SMT + through-hole)\n- Final product assembly\n- Quality testing (100% functional test)\n- Capacity: 500K units/month\n\nLead time: 4-6 weeks\nQuality target: < 500 DPMO\nContact: Wei Zhang, Plant Manager" },
      { id: "sc-qc", kind: "process", kindLabel: "Quality", title: "Quality Control", color: "#fbbf24", x: 550, y: 600, tags: ["quality", "inspection"], content: "Quality Control Process:\n- Incoming material inspection (AQL 1.0)\n- In-process quality checks (every 2 hours)\n- Final quality audit (AQL 0.65)\n- Reliability testing (HALT/HASS)\n- Compliance testing (FCC, CE, UL)\n\nReject rate target: < 0.3%\nOwner: VP Quality" },
      { id: "sc-warehouse", kind: "system", kindLabel: "Warehouse", title: "Distribution Centers", color: "#22c55e", x: 1100, y: 0, tags: ["logistics", "storage"], content: "Distribution Centers:\n- US: Ontario, CA (250K sq ft)\n- EU: Rotterdam, NL (180K sq ft)\n- APAC: Singapore (100K sq ft)\n\nWMS: Manhattan Associates\nInventory turns: 8x/year\n3PL partner: DHL Supply Chain" },
      { id: "sc-logistics", kind: "vendor", kindLabel: "Logistics", title: "Freight & Shipping", color: "#f97316", x: 1100, y: 400, tags: ["shipping", "3PL"], content: "Logistics Partners:\n- Ocean freight: Maersk (China → US/EU)\n- Air freight: FedEx (urgent/high-value)\n- Last-mile: UPS, DHL, local carriers\n\nTransit times:\n- Sea (CN→US): 21-28 days\n- Sea (CN→EU): 28-35 days\n- Air (emergency): 3-5 days\n\nIncoterms: CIF for ocean, DAP for air" },
      { id: "sc-retail", kind: "system", kindLabel: "Retail", title: "Retail Channels", color: "#22c55e", x: 1650, y: 0, tags: ["sales", "distribution"], content: "Retail Channels:\n- Direct (ecommerce): 40% of revenue\n- Amazon: 25%\n- Best Buy: 15%\n- Carrier stores: 10%\n- International distributors: 10%\n\nChannel manager: VP Sales\nEDI integration with major retailers" },
      { id: "sc-ecom", kind: "system", kindLabel: "E-Commerce", title: "D2C Website", color: "#22c55e", x: 1650, y: 400, tags: ["direct", "digital"], content: "Direct-to-Consumer Channel:\n- Shopify Plus storefront\n- Custom product configurator\n- Subscription accessories program\n- Trade-in program\n\nAOV: $450\nConversion rate: 3.2%\nFulfillment: Ship from Ontario DC" },
      { id: "sc-plan", kind: "process", kindLabel: "Planning", title: "Demand Planning", color: "#fbbf24", x: 550, y: -150, tags: ["forecasting", "planning"], content: "Demand Planning Process:\n- 18-month rolling forecast\n- Monthly S&OP meetings\n- Statistical forecasting + market intelligence\n- Safety stock: 6 weeks for critical components\n\nTools: Anaplan, SAP IBP\nAccuracy target: MAPE < 15%\nOwner: VP Supply Chain" },
      { id: "sc-erp", kind: "system", kindLabel: "SAP", title: "SAP ERP", color: "#22c55e", x: 550, y: 900, tags: ["system", "erp"], content: "SAP S/4HANA\n- Material requirements planning (MRP)\n- Production scheduling\n- Financial accounting\n- Procurement management\n\nModules: MM, PP, FI, CO, SD\nIntegrations: EDI, WMS, CRM" },
    ],
    edges: [
      { id: uid(), from: "sc-supplier1", to: "sc-assembly", label: "chips", content: "TSMC ships processed wafers to Foxconn. 16-20 week lead time. Minimum order: 50K units." },
      { id: uid(), from: "sc-supplier2", to: "sc-assembly", label: "displays", content: "LG Display ships OLED panels. Monthly PO based on rolling forecast. Quality specs: IQC at receiving." },
      { id: uid(), from: "sc-supplier3", to: "sc-assembly", label: "components", content: "Murata components shipped via consolidated freight. VMI program for high-volume parts." },
      { id: uid(), from: "sc-assembly", to: "sc-qc", label: "inspection", content: "100% of assembled units go through automated test + random sampling for cosmetic inspection." },
      { id: uid(), from: "sc-qc", to: "sc-warehouse", label: "approved units", content: "QC-approved units palletized and shipped to regional distribution centers." },
      { id: uid(), from: "sc-warehouse", to: "sc-logistics", label: "ship orders", content: "Orders picked, packed, and handed to logistics partners based on destination and priority." },
      { id: uid(), from: "sc-logistics", to: "sc-retail", label: "deliver", content: "Retail fulfillment via EDI-triggered shipments. Compliance labeling per retailer specs." },
      { id: uid(), from: "sc-logistics", to: "sc-ecom", label: "deliver", content: "D2C orders fulfilled from Ontario DC. Same-day ship for orders before 2pm PT." },
      { id: uid(), from: "sc-plan", to: "sc-assembly", label: "production plan", content: "Monthly production plan based on demand forecast. Updated weekly with actual orders." },
      { id: uid(), from: "sc-plan", to: "sc-supplier1", label: "forecast", content: "Rolling 18-month forecast shared with TSMC for capacity planning. Binding at 16 weeks." },
      { id: uid(), from: "sc-erp", to: "sc-plan", label: "MRP data", content: "SAP MRP generates material requirements based on BOM, forecast, and current inventory." },
      { id: uid(), from: "sc-erp", to: "sc-warehouse", label: "inventory mgmt", content: "Real-time inventory visibility across all DCs. Automated reorder points for fast-movers." },
    ],
  },

  // ── 17. Customer Journey Map ──
  {
    name: "Customer Journey Map (B2B SaaS)",
    description: "End-to-end customer journey from awareness to advocacy with touchpoints, emotions, and improvement opportunities",
    nodes: [
      { id: "cj-aware", kind: "process", kindLabel: "Stage", title: "Awareness", color: "#8b5cf6", x: 0, y: 350, tags: ["top-funnel", "stage"], content: "Awareness Stage\n\nTouchpoints:\n- Google search (organic & paid)\n- LinkedIn thought leadership posts\n- Industry conference talks\n- G2/Capterra reviews\n- Peer referrals\n\nCustomer emotion: Curious, researching\n\nMetrics:\n- Website visits: 50K/month\n- Brand search volume: 8K/month\n- Content downloads: 2K/month\n\nPain point: Overwhelmed by options\nOpportunity: Better comparison content" },
      { id: "cj-consider", kind: "process", kindLabel: "Stage", title: "Consideration", color: "#0ea5e9", x: 500, y: 350, tags: ["mid-funnel", "stage"], content: "Consideration Stage\n\nTouchpoints:\n- Product website & feature pages\n- Case studies & ROI calculator\n- Free trial sign-up\n- Webinar attendance\n- Competitor comparison pages\n\nCustomer emotion: Evaluating, cautious\n\nMetrics:\n- Trial sign-ups: 500/month\n- Demo requests: 200/month\n- Avg time in stage: 21 days\n\nPain point: Hard to quantify ROI\nOpportunity: Interactive ROI calculator" },
      { id: "cj-decide", kind: "process", kindLabel: "Stage", title: "Decision", color: "#fbbf24", x: 1000, y: 350, tags: ["bottom-funnel", "stage"], content: "Decision Stage\n\nTouchpoints:\n- Sales demo (personalized)\n- Technical evaluation / POC\n- Security & compliance review\n- Pricing negotiation\n- Contract & legal review\n\nCustomer emotion: Anxious, seeking validation\n\nMetrics:\n- Demo-to-close rate: 35%\n- Avg deal cycle: 45 days\n- Win rate vs competitors: 42%\n\nPain point: Complex procurement process\nOpportunity: Self-serve checkout for < $10K" },
      { id: "cj-onboard", kind: "process", kindLabel: "Stage", title: "Onboarding", color: "#22c55e", x: 1500, y: 350, tags: ["post-sale", "stage"], content: "Onboarding Stage (Day 1-30)\n\nTouchpoints:\n- Welcome email sequence (7 emails)\n- Onboarding call with CSM\n- Product setup wizard\n- Training webinars\n- Knowledge base articles\n\nCustomer emotion: Excited but overwhelmed\n\nMetrics:\n- Time to first value: 4.5 days\n- Setup completion rate: 72%\n- Onboarding CSAT: 4.2/5\n\nPain point: Too many features at once\nOpportunity: Progressive disclosure, guided tours" },
      { id: "cj-adopt", kind: "process", kindLabel: "Stage", title: "Adoption", color: "#10b981", x: 2000, y: 350, tags: ["growth", "stage"], content: "Adoption Stage (Month 2-6)\n\nTouchpoints:\n- In-app tips & feature discovery\n- Monthly usage reports\n- Customer success check-ins\n- Community forum\n- Feature request portal\n\nCustomer emotion: Building confidence\n\nMetrics:\n- DAU/MAU ratio: 45%\n- Feature adoption: 60% of core features\n- Support tickets: 2/month avg\n\nPain point: Team rollout friction\nOpportunity: Admin tools for team management" },
      { id: "cj-renew", kind: "process", kindLabel: "Stage", title: "Renewal & Expand", color: "#f59e0b", x: 2500, y: 350, tags: ["retention", "stage"], content: "Renewal & Expansion Stage\n\nTouchpoints:\n- Quarterly business reviews (QBR)\n- Renewal notification (90 days out)\n- Expansion proposal\n- Executive sponsor meeting\n- Annual planning workshop\n\nCustomer emotion: Invested, evaluating ROI\n\nMetrics:\n- Net Revenue Retention: 118%\n- Gross retention: 92%\n- Expansion rate: 26%\n- Avg contract growth: 40%\n\nPain point: Proving ROI to CFO\nOpportunity: Automated ROI reports" },
      { id: "cj-advocate", kind: "process", kindLabel: "Stage", title: "Advocacy", color: "#ef4444", x: 3000, y: 350, tags: ["referral", "stage"], content: "Advocacy Stage\n\nTouchpoints:\n- NPS survey (score: 62)\n- Customer advisory board\n- Case study participation\n- G2/Capterra reviews\n- Referral program\n- Conference speaking\n\nCustomer emotion: Proud, evangelistic\n\nMetrics:\n- Referral rate: 15%\n- Review participation: 8%\n- Case studies published: 12/year\n\nPain point: No formal referral incentive\nOpportunity: Structured referral program" },
      { id: "cj-marketing", kind: "team", kindLabel: "Marketing", title: "Marketing Team", color: "#8b5cf6", x: 250, y: 0, tags: ["team", "owner"], content: "Marketing Owns:\n- Content creation\n- Website optimization\n- Event strategy\n- Brand awareness\n- Lead scoring\n\nHead of Marketing: Sarah Chen" },
      { id: "cj-sales", kind: "team", kindLabel: "Sales", title: "Sales Team", color: "#38bdf8", x: 1000, y: 0, tags: ["team", "owner"], content: "Sales Owns:\n- Demo & POC execution\n- Deal negotiation\n- Technical validation\n- Contract closure\n\nVP Sales: Michael Torres" },
      { id: "cj-cs", kind: "team", kindLabel: "CS", title: "Customer Success", color: "#22c55e", x: 2000, y: 0, tags: ["team", "owner"], content: "Customer Success Owns:\n- Onboarding program\n- Health score monitoring\n- QBRs & renewals\n- Expansion opportunities\n- Risk mitigation\n\nVP CS: Priya Sharma" },
      { id: "cj-product", kind: "team", kindLabel: "Product", title: "Product Team", color: "#f97316", x: 1500, y: 700, tags: ["team", "owner"], content: "Product Owns:\n- In-app experience\n- Feature discovery\n- Product-led growth\n- User research\n- Roadmap prioritization\n\nCPO: David Kim" },
    ],
    edges: [
      { id: uid(), from: "cj-aware", to: "cj-consider", label: "interest →", content: "Transition trigger: User visits pricing page, downloads content, or signs up for webinar." },
      { id: uid(), from: "cj-consider", to: "cj-decide", label: "intent →", content: "Transition trigger: User starts trial, requests demo, or engages with sales content." },
      { id: uid(), from: "cj-decide", to: "cj-onboard", label: "purchase →", content: "Transition trigger: Contract signed. CSM assigned within 24 hours." },
      { id: uid(), from: "cj-onboard", to: "cj-adopt", label: "activated →", content: "Transition trigger: User completes setup wizard and invites 3+ team members." },
      { id: uid(), from: "cj-adopt", to: "cj-renew", label: "value realized →", content: "Transition trigger: Consistent usage for 3+ months, health score > 70." },
      { id: uid(), from: "cj-renew", to: "cj-advocate", label: "loyalty →", content: "Transition trigger: Renewed and expanded. NPS score > 8." },
      { id: uid(), from: "cj-marketing", to: "cj-aware", label: "owns" },
      { id: uid(), from: "cj-marketing", to: "cj-consider", label: "owns" },
      { id: uid(), from: "cj-sales", to: "cj-decide", label: "owns" },
      { id: uid(), from: "cj-cs", to: "cj-onboard", label: "owns" },
      { id: uid(), from: "cj-cs", to: "cj-adopt", label: "owns" },
      { id: uid(), from: "cj-cs", to: "cj-renew", label: "owns" },
      { id: uid(), from: "cj-product", to: "cj-onboard", label: "in-app experience" },
      { id: uid(), from: "cj-product", to: "cj-adopt", label: "feature discovery" },
      { id: uid(), from: "cj-advocate", to: "cj-aware", label: "referrals loop", content: "Advocates drive new awareness through referrals, reviews, and word-of-mouth." },
    ],
  },
];

/* ═══════════════════════════════════════════════
   MAIN SEED FUNCTION
   ═══════════════════════════════════════════════ */

(async () => {
  try {
    // Find Maya Patel's workspace (the pro user)
    const maya = await p.user.findFirst({ where: { email: "maya@demo.com" } });
    if (!maya) {
      console.error("Maya Patel user not found. Run seed-demo-users.js first.");
      process.exit(1);
    }

    const workspace = await p.workspace.findFirst({ where: { ownerId: maya.id } });
    if (!workspace) {
      console.error("Workspace not found for Maya.");
      process.exit(1);
    }

    // Temporarily upgrade to team plan for unlimited maps
    await p.user.update({ where: { id: maya.id }, data: { plan: "team" } });

    console.log(`\nSeeding ${maps.length} workflow maps for ${maya.name} (${workspace.name})...\n`);

    for (const mapDef of maps) {
      await createMap(maya.id, workspace.id, mapDef);
    }

    // Restore to pro plan
    await p.user.update({ where: { id: maya.id }, data: { plan: "pro" } });

    console.log(`\nDone! Created ${maps.length} maps with complex real-world flows.\n`);
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await p.$disconnect();
  }
})();
