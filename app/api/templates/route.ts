import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { usageCount: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        thumbnail: true,
        mapData: true,
        usageCount: true,
      },
    });
    // If DB has templates, merge with built-in; otherwise just return built-in
    if (templates.length > 0) {
      return NextResponse.json([...BUILTIN_TEMPLATES, ...templates]);
    }
    return NextResponse.json(BUILTIN_TEMPLATES);
  } catch {
    // Return built-in templates as fallback
    return NextResponse.json(BUILTIN_TEMPLATES);
  }
}

/* ─── helper to build a template ─── */
const tpl = (id: string, name: string, description: string, category: string, nodes: any[], edges: any[]) => ({
  id, name, description, category, thumbnail: null, usageCount: 0,
  mapData: JSON.stringify({ nodes, edges, notes: [] }),
});
const n = (id: string, kind: string, kindLabel: string, title: string, tags: string[], color: string, x: number, y: number) =>
  ({ id, kind, kindLabel, title, tags, noteId: "", color, position: { x, y } });
const e = (id: string, src: string, tgt: string, label: string) =>
  ({ id, sourceId: src, targetId: tgt, sourceHandle: null, targetHandle: null, label });

const BUILTIN_TEMPLATES = [
  // ═══════════════════════════════════════
  // ARCHITECTURE (5)
  // ═══════════════════════════════════════
  tpl("tpl-microservice", "Microservice Architecture",
    "Map your services, databases, APIs, and message queues. See blast radius before deploying.", "architecture",
    [
      n("n1","system","API Gateway","API Gateway",["entry-point","routing"],"#0ea5e9",400,60),
      n("n2","system","Service","User Service",["auth","users"],"#22c55e",200,200),
      n("n3","system","Service","Order Service",["orders","payments"],"#22c55e",400,200),
      n("n4","system","Service","Notification Service",["email","sms"],"#22c55e",600,200),
      n("n5","database","Database","Users DB (PostgreSQL)",["database","pii"],"#6366f1",150,380),
      n("n6","database","Database","Orders DB (PostgreSQL)",["database"],"#6366f1",400,380),
      n("n7","queue","Queue","RabbitMQ",["async","queue"],"#f59e0b",600,380),
      n("n8","cache","Cache","Redis Cache",["cache","sessions"],"#ef4444",250,380),
    ],
    [
      e("e1","n1","n2","REST"), e("e2","n1","n3","REST"), e("e3","n1","n4","REST"),
      e("e4","n2","n5","reads/writes"), e("e5","n3","n6","reads/writes"),
      e("e6","n3","n7","publishes"), e("e7","n7","n4","consumes"), e("e8","n2","n8","cache"),
    ]),

  tpl("tpl-aws-3tier", "AWS 3-Tier Architecture",
    "Classic web architecture with load balancer, app servers, and database tier on AWS.", "architecture",
    [
      n("n1","cloud","AWS","AWS Cloud",["cloud"],"#f59e0b",400,30),
      n("n2","system","ALB","Application Load Balancer",["networking","entry"],"#0ea5e9",400,140),
      n("n3","system","EC2","App Server 1",["compute"],"#22c55e",250,270),
      n("n4","system","EC2","App Server 2",["compute"],"#22c55e",550,270),
      n("n5","cache","ElastiCache","Redis (ElastiCache)",["cache","sessions"],"#ef4444",400,270),
      n("n6","database","RDS","PostgreSQL (RDS Primary)",["database","primary"],"#6366f1",300,420),
      n("n7","database","RDS","PostgreSQL (RDS Replica)",["database","replica"],"#8b5cf6",500,420),
      n("n8","cloud","S3","S3 Static Assets",["storage","cdn"],"#f97316",150,420),
      n("n9","cloud","CloudFront","CloudFront CDN",["cdn","edge"],"#0ea5e9",150,140),
    ],
    [
      e("e1","n1","n2","routes to"), e("e2","n2","n3","round-robin"), e("e3","n2","n4","round-robin"),
      e("e4","n3","n5","sessions"), e("e5","n4","n5","sessions"),
      e("e6","n3","n6","reads/writes"), e("e7","n4","n7","reads"),
      e("e8","n6","n7","replicates"), e("e9","n9","n8","serves"),
    ]),

  tpl("tpl-event-driven", "Event-Driven Architecture",
    "Producers, event bus, and consumers with dead-letter queues. For async microservices.", "architecture",
    [
      n("n1","api","API","Order API",["producer"],"#0ea5e9",100,150),
      n("n2","api","API","Payment API",["producer"],"#0ea5e9",100,300),
      n("n3","queue","Event Bus","Kafka / EventBridge",["events","backbone"],"#f59e0b",350,225),
      n("n4","system","Consumer","Inventory Service",["consumer"],"#22c55e",600,100),
      n("n5","system","Consumer","Shipping Service",["consumer"],"#22c55e",600,225),
      n("n6","system","Consumer","Analytics Service",["consumer"],"#22c55e",600,350),
      n("n7","queue","DLQ","Dead Letter Queue",["errors","retry"],"#ef4444",350,400),
      n("n8","system","Alerting","PagerDuty",["monitoring"],"#ef4444",550,400),
    ],
    [
      e("e1","n1","n3","publishes OrderCreated"), e("e2","n2","n3","publishes PaymentProcessed"),
      e("e3","n3","n4","subscribes"), e("e4","n3","n5","subscribes"), e("e5","n3","n6","subscribes"),
      e("e6","n3","n7","failed events"), e("e7","n7","n8","alerts on"),
    ]),

  tpl("tpl-serverless", "Serverless Architecture",
    "API Gateway + Lambda + DynamoDB. Map your serverless functions and triggers.", "architecture",
    [
      n("n1","person","User","Client App",["frontend"],"#38bdf8",100,200),
      n("n2","api","API GW","API Gateway",["entry","rest"],"#0ea5e9",300,200),
      n("n3","cloud","Lambda","Auth Function",["serverless","auth"],"#f59e0b",500,100),
      n("n4","cloud","Lambda","CRUD Function",["serverless","data"],"#f59e0b",500,200),
      n("n5","cloud","Lambda","Webhook Handler",["serverless","events"],"#f59e0b",500,300),
      n("n6","database","DynamoDB","DynamoDB Table",["nosql"],"#6366f1",700,150),
      n("n7","queue","SQS","SQS Queue",["async"],"#f59e0b",700,300),
      n("n8","cloud","S3","S3 Bucket",["storage"],"#22c55e",500,400),
    ],
    [
      e("e1","n1","n2","HTTPS"), e("e2","n2","n3","/auth/*"), e("e3","n2","n4","/api/*"),
      e("e4","n2","n5","/webhooks"), e("e5","n3","n6","reads/writes"),
      e("e6","n4","n6","reads/writes"), e("e7","n5","n7","enqueues"),
      e("e8","n4","n8","uploads"),
    ]),

  tpl("tpl-kubernetes", "Kubernetes Cluster",
    "Map pods, services, ingress, and persistent volumes in your K8s cluster.", "architecture",
    [
      n("n1","cloud","Ingress","Ingress Controller (nginx)",["networking","entry"],"#0ea5e9",400,50),
      n("n2","system","Service","Frontend Service",["clusterIP"],"#22c55e",200,180),
      n("n3","system","Service","Backend Service",["clusterIP"],"#22c55e",400,180),
      n("n4","system","Service","Worker Service",["clusterIP"],"#22c55e",600,180),
      n("n5","process","Pod","Frontend Pods (x3)",["deployment","replicas"],"#38bdf8",200,320),
      n("n6","process","Pod","Backend Pods (x3)",["deployment","replicas"],"#38bdf8",400,320),
      n("n7","process","Pod","Worker Pods (x2)",["deployment","replicas"],"#38bdf8",600,320),
      n("n8","database","PV","PostgreSQL (StatefulSet)",["persistent-volume"],"#6366f1",400,460),
      n("n9","cache","PV","Redis (StatefulSet)",["persistent-volume"],"#ef4444",600,460),
    ],
    [
      e("e1","n1","n2","routes /"), e("e2","n1","n3","routes /api"),
      e("e3","n2","n5","load-balances"), e("e4","n3","n6","load-balances"),
      e("e5","n4","n7","load-balances"), e("e6","n6","n8","reads/writes"),
      e("e7","n6","n9","cache"), e("e8","n7","n8","reads"), e("e9","n3","n4","gRPC"),
    ]),

  // ═══════════════════════════════════════
  // DEVOPS (4)
  // ═══════════════════════════════════════
  tpl("tpl-cicd", "CI/CD Pipeline",
    "Map your build, test, and deployment pipeline from commit to production.", "devops",
    [
      n("n1","process","Trigger","Git Push / PR",["trigger"],"#f59e0b",100,200),
      n("n2","process","CI","Run Tests",["ci","testing"],"#22c55e",300,200),
      n("n3","process","CI","Build & Lint",["ci","build"],"#22c55e",500,200),
      n("n4","process","CD","Deploy to Staging",["staging","deploy"],"#0ea5e9",700,200),
      n("n5","process","Gate","Manual Approval",["gate","review"],"#ef4444",700,340),
      n("n6","process","CD","Deploy to Production",["production","deploy"],"#6366f1",500,340),
      n("n7","system","Monitoring","Health Checks & Alerts",["monitoring","observability"],"#94a3b8",300,340),
    ],
    [
      e("e1","n1","n2","triggers"), e("e2","n2","n3","on pass"), e("e3","n3","n4","on pass"),
      e("e4","n4","n5","needs approval"), e("e5","n5","n6","approved"), e("e6","n6","n7","monitors"),
    ]),

  tpl("tpl-gitflow", "Git Branching Strategy",
    "Visualize your gitflow with main, develop, feature, release, and hotfix branches.", "devops",
    [
      n("n1","process","Branch","main",["production","protected"],"#ef4444",400,50),
      n("n2","process","Branch","develop",["integration"],"#0ea5e9",400,170),
      n("n3","process","Branch","feature/auth",["feature"],"#22c55e",150,300),
      n("n4","process","Branch","feature/payments",["feature"],"#22c55e",350,300),
      n("n5","process","Branch","release/v2.1",["release"],"#f59e0b",550,300),
      n("n6","process","Branch","hotfix/fix-login",["hotfix"],"#ef4444",700,170),
    ],
    [
      e("e1","n2","n3","branch off"), e("e2","n2","n4","branch off"),
      e("e3","n3","n2","merge PR"), e("e4","n4","n2","merge PR"),
      e("e5","n2","n5","cut release"), e("e6","n5","n1","merge to main"),
      e("e7","n1","n6","hotfix from"), e("e8","n6","n1","merge hotfix"),
    ]),

  tpl("tpl-monitoring", "Monitoring & Alerting Stack",
    "Map your observability pipeline: metrics, logs, traces, and alerting.", "devops",
    [
      n("n1","system","App","Application Servers",["source"],"#22c55e",100,200),
      n("n2","system","Collector","OpenTelemetry Collector",["telemetry"],"#0ea5e9",350,200),
      n("n3","system","Metrics","Prometheus / Datadog",["metrics","timeseries"],"#f59e0b",550,100),
      n("n4","system","Logs","Elasticsearch / Loki",["logs","search"],"#6366f1",550,200),
      n("n5","system","Traces","Jaeger / Tempo",["tracing","distributed"],"#8b5cf6",550,300),
      n("n6","system","Dashboard","Grafana",["visualization"],"#f97316",750,200),
      n("n7","system","Alerting","PagerDuty / OpsGenie",["on-call","incidents"],"#ef4444",750,350),
    ],
    [
      e("e1","n1","n2","emits telemetry"), e("e2","n2","n3","metrics"),
      e("e3","n2","n4","logs"), e("e4","n2","n5","traces"),
      e("e5","n3","n6","visualizes"), e("e6","n4","n6","visualizes"),
      e("e7","n5","n6","visualizes"), e("e8","n3","n7","threshold alerts"),
    ]),

  tpl("tpl-incident", "Incident Response Chain",
    "Map your on-call escalation path from alert to resolution.", "devops",
    [
      n("n1","system","Alert","Monitoring Alert",["trigger"],"#ef4444",100,200),
      n("n2","system","Pager","PagerDuty",["on-call"],"#f59e0b",300,200),
      n("n3","person","On-Call","Primary On-Call",["responder"],"#38bdf8",500,120),
      n("n4","person","Backup","Secondary On-Call",["responder","backup"],"#38bdf8",500,280),
      n("n5","team","Team","Engineering Manager",["escalation"],"#14b8a6",700,120),
      n("n6","process","Incident","Incident Channel (Slack)",["communication"],"#22c55e",700,280),
      n("n7","process","Postmortem","Post-Incident Review",["learning"],"#8b5cf6",500,420),
    ],
    [
      e("e1","n1","n2","triggers page"), e("e2","n2","n3","pages primary"),
      e("e3","n2","n4","escalates after 5min"), e("e4","n3","n5","escalates to EM"),
      e("e5","n3","n6","opens channel"), e("e6","n4","n6","joins"),
      e("e7","n6","n7","after resolution"),
    ]),

  // ═══════════════════════════════════════
  // DATA & ANALYTICS (3)
  // ═══════════════════════════════════════
  tpl("tpl-etl", "Data Pipeline (ETL)",
    "Map your extract, transform, load pipeline from source systems to data warehouse.", "data",
    [
      n("n1","database","Source","Production DB",["source","postgres"],"#22c55e",100,100),
      n("n2","api","Source","REST API (3rd Party)",["source","external"],"#22c55e",100,250),
      n("n3","system","Source","Event Stream (Kafka)",["source","streaming"],"#22c55e",100,400),
      n("n4","process","Extract","Fivetran / Airbyte",["ingestion"],"#0ea5e9",350,180),
      n("n5","process","Transform","dbt / Spark",["transformation"],"#f59e0b",550,180),
      n("n6","database","Load","Snowflake / BigQuery",["warehouse"],"#6366f1",750,180),
      n("n7","system","Serve","Looker / Metabase",["bi","dashboards"],"#8b5cf6",750,350),
      n("n8","system","Orchestrator","Airflow / Dagster",["scheduling"],"#f97316",450,380),
    ],
    [
      e("e1","n1","n4","CDC / batch"), e("e2","n2","n4","API polling"),
      e("e3","n3","n4","streaming"), e("e4","n4","n5","raw data"),
      e("e5","n5","n6","modeled data"), e("e6","n6","n7","serves queries"),
      e("e7","n8","n4","orchestrates"), e("e8","n8","n5","orchestrates"),
    ]),

  tpl("tpl-ml-pipeline", "ML Pipeline",
    "From data collection to model serving: training, evaluation, and deployment.", "data",
    [
      n("n1","database","Data","Feature Store",["data","features"],"#6366f1",100,200),
      n("n2","process","Train","Model Training (GPU)",["compute","training"],"#f59e0b",300,120),
      n("n3","process","Eval","Model Evaluation",["metrics","validation"],"#0ea5e9",500,120),
      n("n4","process","Registry","Model Registry (MLflow)",["versioning"],"#8b5cf6",500,280),
      n("n5","system","Serve","Model Serving (FastAPI)",["inference","api"],"#22c55e",700,200),
      n("n6","system","Monitor","Model Monitor",["drift","performance"],"#ef4444",700,350),
      n("n7","process","Retrain","Auto-Retrain Trigger",["automation"],"#f97316",300,350),
    ],
    [
      e("e1","n1","n2","feature vectors"), e("e2","n2","n3","trained model"),
      e("e3","n3","n4","if metrics pass"), e("e4","n4","n5","deploy latest"),
      e("e5","n5","n6","prediction logs"), e("e6","n6","n7","drift detected"),
      e("e7","n7","n2","re-train"),
    ]),

  tpl("tpl-analytics", "Analytics Architecture",
    "Map your analytics stack from event collection to dashboards and experiments.", "data",
    [
      n("n1","system","Web","Web App",["frontend"],"#22c55e",100,150),
      n("n2","system","Mobile","Mobile App",["frontend"],"#22c55e",100,300),
      n("n3","system","CDP","Segment / RudderStack",["collection"],"#0ea5e9",350,225),
      n("n4","system","Warehouse","BigQuery / Snowflake",["storage"],"#6366f1",550,150),
      n("n5","system","Product","Mixpanel / Amplitude",["product-analytics"],"#f59e0b",550,300),
      n("n6","system","BI","Looker / Metabase",["dashboards"],"#8b5cf6",750,150),
      n("n7","system","A/B Test","LaunchDarkly / Statsig",["experiments"],"#ef4444",750,300),
    ],
    [
      e("e1","n1","n3","track events"), e("e2","n2","n3","track events"),
      e("e3","n3","n4","warehouse sync"), e("e4","n3","n5","real-time"),
      e("e5","n4","n6","SQL queries"), e("e6","n5","n7","experiment data"),
    ]),

  // ═══════════════════════════════════════
  // COMPLIANCE & SECURITY (3)
  // ═══════════════════════════════════════
  tpl("tpl-dataflow", "Data Flow Diagram (GDPR/SOC2)",
    "Track where PII and sensitive data flows. Essential for SOC2, GDPR, and HIPAA compliance.", "compliance",
    [
      n("n1","person","User","End User",["pii-source"],"#38bdf8",100,200),
      n("n2","system","Frontend","Web App",["frontend"],"#22c55e",300,200),
      n("n3","api","API","Backend API",["pii-processor"],"#22c55e",500,200),
      n("n4","database","Database","Primary DB",["pii-store","encrypted"],"#6366f1",500,380),
      n("n5","vendor","Vendor","Stripe (Payments)",["pci","external"],"#f59e0b",700,200),
      n("n6","vendor","Vendor","SendGrid (Email)",["pii-processor","external"],"#f59e0b",700,380),
      n("n7","system","Analytics","Analytics (anonymized)",["analytics"],"#94a3b8",300,380),
    ],
    [
      e("e1","n1","n2","PII input"), e("e2","n2","n3","HTTPS (encrypted)"),
      e("e3","n3","n4","stores PII"), e("e4","n3","n5","payment data"),
      e("e5","n3","n6","email + name"), e("e6","n2","n7","anonymized events"),
    ]),

  tpl("tpl-zero-trust", "Zero Trust Network Architecture",
    "Map your zero-trust security layers: identity, device, network, application.", "compliance",
    [
      n("n1","person","User","Remote Employee",["identity"],"#38bdf8",100,200),
      n("n2","system","IdP","Identity Provider (Okta)",["authentication","sso"],"#0ea5e9",300,120),
      n("n3","system","MDM","Device Management",["device-trust"],"#f59e0b",300,300),
      n("n4","system","ZTNA","Zero Trust Gateway (Zscaler)",["network","policy"],"#ef4444",500,200),
      n("n5","system","WAF","Web Application Firewall",["protection"],"#ef4444",700,120),
      n("n6","system","App","Internal Applications",["resources"],"#22c55e",700,280),
      n("n7","system","SIEM","SIEM (Splunk)",["logging","monitoring"],"#8b5cf6",500,380),
    ],
    [
      e("e1","n1","n2","authenticates"), e("e2","n1","n3","device check"),
      e("e3","n2","n4","token verified"), e("e4","n3","n4","device compliant"),
      e("e5","n4","n5","policy check"), e("e6","n5","n6","allowed traffic"),
      e("e7","n4","n7","access logs"), e("e8","n6","n7","app logs"),
    ]),

  tpl("tpl-disaster-recovery", "Disaster Recovery Plan",
    "Map primary and failover systems with RPO/RTO targets.", "compliance",
    [
      n("n1","cloud","Primary","Primary Region (us-east-1)",["active"],"#22c55e",200,100),
      n("n2","cloud","DR","DR Region (us-west-2)",["standby"],"#f59e0b",600,100),
      n("n3","database","DB","Primary Database",["rds","active"],"#6366f1",150,260),
      n("n4","database","DB","Replica Database",["rds","standby"],"#8b5cf6",650,260),
      n("n5","system","App","Application Servers",["compute"],"#22c55e",200,400),
      n("n6","system","App","Standby Servers",["compute","standby"],"#f59e0b",600,400),
      n("n7","system","DNS","Route 53 (Health Check)",["failover","dns"],"#0ea5e9",400,50),
      n("n8","system","Backup","S3 Cross-Region Backup",["storage","backup"],"#f97316",400,330),
    ],
    [
      e("e1","n7","n1","active traffic"), e("e2","n7","n2","failover traffic"),
      e("e3","n3","n4","async replication"), e("e4","n1","n3","reads/writes"),
      e("e5","n2","n4","reads/writes"), e("e6","n3","n8","daily backups"),
      e("e7","n8","n4","restore point"), e("e8","n1","n5","runs"), e("e9","n2","n6","standby"),
    ]),

  // ═══════════════════════════════════════
  // ORGANIZATION (3)
  // ═══════════════════════════════════════
  tpl("tpl-orgchart", "Team Org Chart",
    "Map team ownership, responsibilities, and reporting lines. Great for onboarding.", "org",
    [
      n("n1","person","CTO","CTO",["leadership"],"#0ea5e9",400,60),
      n("n2","person","VP Eng","VP Engineering",["leadership"],"#38bdf8",200,200),
      n("n3","person","VP Product","VP Product",["leadership"],"#38bdf8",600,200),
      n("n4","person","EM","Platform Team Lead",["platform","infra"],"#22c55e",100,360),
      n("n5","person","EM","Product Team Lead",["product","frontend"],"#22c55e",300,360),
      n("n6","person","PM","Senior PM",["product"],"#f59e0b",500,360),
      n("n7","person","Designer","Lead Designer",["design","ux"],"#f59e0b",700,360),
    ],
    [
      e("e1","n1","n2","reports to"), e("e2","n1","n3","reports to"),
      e("e3","n2","n4","manages"), e("e4","n2","n5","manages"),
      e("e5","n3","n6","manages"), e("e6","n3","n7","manages"),
    ]),

  tpl("tpl-raci", "RACI Matrix (Visual)",
    "Map who is Responsible, Accountable, Consulted, Informed for key processes.", "org",
    [
      n("n1","process","Process","Feature Launch",["milestone"],"#f59e0b",400,50),
      n("n2","person","R","Product Manager",["responsible"],"#22c55e",200,200),
      n("n3","person","A","VP Product",["accountable"],"#ef4444",400,200),
      n("n4","team","C","Engineering Team",["consulted"],"#0ea5e9",600,200),
      n("n5","person","C","Design Lead",["consulted"],"#0ea5e9",200,360),
      n("n6","team","I","Sales Team",["informed"],"#8b5cf6",400,360),
      n("n7","team","I","Support Team",["informed"],"#8b5cf6",600,360),
    ],
    [
      e("e1","n1","n2","Responsible"), e("e2","n1","n3","Accountable"),
      e("e3","n1","n4","Consulted"), e("e4","n1","n5","Consulted"),
      e("e5","n1","n6","Informed"), e("e6","n1","n7","Informed"),
    ]),

  tpl("tpl-service-ownership", "Service Ownership Map",
    "Map which team owns which service. Find orphaned services and single points of failure.", "org",
    [
      n("n1","team","Team","Platform Team",["ownership"],"#14b8a6",150,100),
      n("n2","team","Team","Product Team",["ownership"],"#14b8a6",500,100),
      n("n3","system","Service","Auth Service",[],"#22c55e",100,260),
      n("n4","system","Service","API Gateway",[],"#22c55e",250,260),
      n("n5","database","DB","Shared Database",["risk"],"#ef4444",350,400),
      n("n6","system","Service","Billing Service",[],"#22c55e",450,260),
      n("n7","system","Service","User Dashboard",[],"#22c55e",600,260),
      n("n8","system","Orphan","Legacy Cron Job",["no-owner","risk"],"#94a3b8",750,260),
    ],
    [
      e("e1","n1","n3","owns"), e("e2","n1","n4","owns"), e("e3","n2","n6","owns"),
      e("e4","n2","n7","owns"), e("e5","n3","n5","reads"), e("e6","n4","n5","reads"),
      e("e7","n6","n5","writes"), e("e8","n8","n5","writes (unknown owner)"),
    ]),

  // ═══════════════════════════════════════
  // RISK & VENDOR (3)
  // ═══════════════════════════════════════
  tpl("tpl-vendor", "Vendor Dependency Map",
    "Map your third-party vendor dependencies and assess risk exposure.", "risk",
    [
      n("n1","system","Your Product","Your Application",["core"],"#0ea5e9",400,60),
      n("n2","vendor","Vendor","AWS",["cloud","critical"],"#f59e0b",150,220),
      n("n3","vendor","Vendor","Stripe",["payments","critical"],"#6366f1",350,220),
      n("n4","vendor","Vendor","Auth0",["auth","critical"],"#ef4444",550,220),
      n("n5","vendor","Vendor","SendGrid",["email","medium"],"#22c55e",200,380),
      n("n6","vendor","Vendor","Datadog",["monitoring","medium"],"#22c55e",400,380),
      n("n7","vendor","Vendor","GitHub",["source-code","critical"],"#ef4444",600,380),
    ],
    [
      e("e1","n1","n2","hosted on"), e("e2","n1","n3","payments"),
      e("e3","n1","n4","authentication"), e("e4","n1","n5","transactional email"),
      e("e5","n1","n6","monitoring"), e("e6","n1","n7","source code"),
    ]),

  tpl("tpl-blast-radius", "Blast Radius Analysis",
    "What breaks when Service X goes down? Map the cascade of failures.", "risk",
    [
      n("n1","system","Failing","Payment Service (DOWN)",["critical","failing"],"#ef4444",400,50),
      n("n2","system","Affected","Checkout Flow",["impacted"],"#f59e0b",200,200),
      n("n3","system","Affected","Subscription Billing",["impacted"],"#f59e0b",400,200),
      n("n4","system","Affected","Invoice Generator",["impacted"],"#f59e0b",600,200),
      n("n5","system","Cascade","Mobile App",["secondary"],"#f97316",100,360),
      n("n6","system","Cascade","Partner API",["secondary","external"],"#f97316",300,360),
      n("n7","system","Cascade","Finance Dashboard",["secondary"],"#f97316",500,360),
      n("n8","system","Safe","Auth Service",["unaffected"],"#22c55e",700,360),
    ],
    [
      e("e1","n1","n2","breaks"), e("e2","n1","n3","breaks"), e("e3","n1","n4","breaks"),
      e("e4","n2","n5","cascades to"), e("e5","n3","n6","cascades to"),
      e("e6","n4","n7","cascades to"),
    ]),

  tpl("tpl-api-dependency", "API Dependency Map",
    "Map internal and external API dependencies with protocols and latency.", "risk",
    [
      n("n1","api","API","Public API (v2)",["external-facing"],"#0ea5e9",400,50),
      n("n2","api","API","Auth API",["internal"],"#22c55e",200,200),
      n("n3","api","API","Users API",["internal"],"#22c55e",400,200),
      n("n4","api","API","Search API",["internal"],"#22c55e",600,200),
      n("n5","vendor","External","Google Maps API",["external","paid"],"#f59e0b",200,380),
      n("n6","vendor","External","Twilio API",["external","paid"],"#f59e0b",400,380),
      n("n7","database","Store","Elasticsearch",["search-index"],"#6366f1",600,380),
    ],
    [
      e("e1","n1","n2","REST < 50ms"), e("e2","n1","n3","REST < 100ms"),
      e("e3","n1","n4","REST < 200ms"), e("e4","n3","n5","REST 100-300ms"),
      e("e5","n3","n6","REST 200-500ms"), e("e6","n4","n7","native < 10ms"),
    ]),

  // ═══════════════════════════════════════
  // PRODUCT & PROCESS (4)
  // ═══════════════════════════════════════
  tpl("tpl-user-journey", "User Journey Map",
    "Map the user experience from signup to activation to retention.", "product",
    [
      n("n1","person","User","New Visitor",["acquisition"],"#38bdf8",100,200),
      n("n2","process","Step","Landing Page",["awareness"],"#22c55e",280,200),
      n("n3","process","Step","Sign Up",["conversion"],"#22c55e",440,200),
      n("n4","process","Step","Onboarding Wizard",["activation"],"#f59e0b",600,200),
      n("n5","process","Step","First Map Created",["aha-moment"],"#8b5cf6",760,200),
      n("n6","process","Step","Invite Team",["expansion"],"#14b8a6",600,350),
      n("n7","process","Step","Upgrade to Pro",["monetization"],"#ef4444",760,350),
    ],
    [
      e("e1","n1","n2","visits"), e("e2","n2","n3","clicks CTA"),
      e("e3","n3","n4","email verified"), e("e4","n4","n5","completes setup"),
      e("e5","n5","n6","sees value"), e("e6","n6","n7","needs more"),
    ]),

  tpl("tpl-saas-stack", "SaaS Tech Stack",
    "Map your entire SaaS technology stack from frontend to infrastructure.", "product",
    [
      n("n1","system","Frontend","React + Next.js",["web"],"#0ea5e9",400,50),
      n("n2","system","Mobile","React Native",["mobile"],"#0ea5e9",150,50),
      n("n3","api","API","REST + GraphQL API",["backend"],"#22c55e",400,180),
      n("n4","database","DB","PostgreSQL",["primary-store"],"#6366f1",250,320),
      n("n5","cache","Cache","Redis",["sessions","cache"],"#ef4444",400,320),
      n("n6","queue","Queue","RabbitMQ / SQS",["async"],"#f59e0b",550,320),
      n("n7","cloud","Infra","AWS / GCP",["hosting"],"#f97316",400,460),
      n("n8","vendor","Service","Stripe",["billing"],"#8b5cf6",650,180),
      n("n9","vendor","Service","Auth0 / Clerk",["auth"],"#8b5cf6",150,180),
    ],
    [
      e("e1","n1","n3","API calls"), e("e2","n2","n3","API calls"),
      e("e3","n3","n4","reads/writes"), e("e4","n3","n5","cache"),
      e("e5","n3","n6","enqueues"), e("e6","n7","n4","hosts"),
      e("e7","n7","n5","hosts"), e("e8","n3","n8","billing API"),
      e("e9","n3","n9","auth"),
    ]),

  tpl("tpl-migration", "System Migration Plan",
    "Map old system to new system migration with status tracking.", "product",
    [
      n("n1","system","Legacy","Monolith (Rails)",["deprecated"],"#94a3b8",150,150),
      n("n2","system","New","User Microservice",["target","active"],"#22c55e",500,80),
      n("n3","system","New","Order Microservice",["target","in-progress"],"#f59e0b",500,220),
      n("n4","system","New","Payment Microservice",["target","planned"],"#0ea5e9",500,360),
      n("n5","database","Legacy","MySQL (Legacy)",["deprecated"],"#94a3b8",150,350),
      n("n6","database","New","PostgreSQL (New)",["target"],"#6366f1",700,220),
      n("n7","process","Bridge","API Facade (Strangler Pattern)",["migration"],"#f97316",350,220),
    ],
    [
      e("e1","n1","n7","old traffic"), e("e2","n7","n2","migrated ✓"),
      e("e3","n7","n3","in progress"), e("e4","n7","n4","planned"),
      e("e5","n1","n5","legacy data"), e("e6","n5","n6","data migration"),
      e("e7","n2","n6","reads/writes"), e("e8","n3","n6","reads/writes"),
    ]),

  tpl("tpl-onboarding", "Employee Onboarding Flow",
    "Map the new hire onboarding process from offer acceptance to first sprint.", "product",
    [
      n("n1","process","Start","Offer Accepted",["trigger"],"#22c55e",100,200),
      n("n2","process","Step","IT Setup (Laptop + Accounts)",["day-1"],"#0ea5e9",300,120),
      n("n3","process","Step","HR Orientation",["day-1"],"#0ea5e9",300,280),
      n("n4","process","Step","Team Introduction",["week-1"],"#f59e0b",500,120),
      n("n5","process","Step","Codebase Tour",["week-1"],"#f59e0b",500,280),
      n("n6","process","Step","First Task Assigned",["week-2"],"#8b5cf6",700,200),
      n("n7","process","End","First PR Merged",["milestone"],"#22c55e",900,200),
    ],
    [
      e("e1","n1","n2","triggers"), e("e2","n1","n3","triggers"),
      e("e3","n2","n4","unlocks"), e("e4","n3","n5","after HR"),
      e("e5","n4","n6","with context"), e("e6","n5","n6","with context"),
      e("e7","n6","n7","ships"),
    ]),
];
