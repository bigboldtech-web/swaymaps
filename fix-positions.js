const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

/**
 * Fix all seeded map node positions to be properly spaced.
 * Minimum gaps: 450px horizontal, 250px vertical between node centers.
 * Clear flow direction: top-to-bottom or left-to-right.
 */

const layouts = {
  // ── 1. E-Commerce Microservices ── (top-to-bottom, 4 tiers)
  "ec-web":     { x: 0,    y: 0 },
  "ec-gw":      { x: 500,  y: 0 },
  "ec-mobile":  { x: 1000, y: 0 },
  "ec-auth":    { x: 0,    y: 280 },
  "ec-catalog": { x: 500,  y: 280 },
  "ec-cart":    { x: 1000, y: 280 },
  "ec-inv":     { x: 0,    y: 560 },
  "ec-order":   { x: 500,  y: 560 },
  "ec-pay":     { x: 1000, y: 560 },
  "ec-ship":    { x: 1500, y: 560 },
  "ec-db":      { x: 0,    y: 840 },
  "ec-notify":  { x: 500,  y: 840 },
  "ec-search":  { x: 1000, y: 840 },
  "ec-cache":   { x: 1500, y: 840 },

  // ── 2. Real-Time Data Pipeline ── (left-to-right flow)
  "dp-mob":      { x: 0,    y: 0 },
  "dp-web":      { x: 0,    y: 300 },
  "dp-api":      { x: 500,  y: 150 },
  "dp-kafka":    { x: 1000, y: 150 },
  "dp-flink":    { x: 1500, y: 0 },
  "dp-spark":    { x: 1500, y: 300 },
  "dp-airflow":  { x: 1500, y: 600 },
  "dp-s3":       { x: 2000, y: 150 },
  "dp-redis":    { x: 2000, y: -150 },
  "dp-redshift": { x: 2500, y: 0 },
  "dp-ml":       { x: 2500, y: 300 },
  "dp-bi":       { x: 2500, y: 600 },

  // ── 3. CI/CD Pipeline ── (left-to-right pipeline)
  "ci-gh":      { x: 0,    y: 200 },
  "ci-pr":      { x: 500,  y: 0 },
  "ci-build":   { x: 500,  y: 400 },
  "ci-test":    { x: 1000, y: 200 },
  "ci-ecr":     { x: 1000, y: 500 },
  "ci-staging": { x: 1500, y: 0 },
  "ci-qa":      { x: 1500, y: 400 },
  "ci-canary":  { x: 2000, y: 200 },
  "ci-prod":    { x: 2500, y: 200 },
  "ci-monitor": { x: 2500, y: 500 },

  // ── 4. Incident Response ── (top-to-bottom with lateral)
  "ir-dd":          { x: 1200, y: 0 },
  "ir-lb":          { x: 500,  y: 0 },
  "ir-s3":          { x: 1000, y: 280 },
  "ir-api":         { x: 500,  y: 280 },
  "ir-stripe":      { x: 0,    y: 280 },
  "ir-db-primary":  { x: 0,    y: 560 },
  "ir-redis":       { x: 500,  y: 560 },
  "ir-db-replica":  { x: 0,    y: 840 },
  "ir-pd":          { x: 1200, y: 560 },
  "ir-oncall":      { x: 1200, y: 840 },

  // ── 5. AWS Infrastructure ── (top-to-bottom, layered)
  "aws-r53":     { x: 500,  y: 0 },
  "aws-cf":      { x: 500,  y: 280 },
  "aws-s3":      { x: 0,    y: 280 },
  "aws-waf":     { x: 1000, y: 280 },
  "aws-alb":     { x: 500,  y: 560 },
  "aws-eks":     { x: 500,  y: 840 },
  "aws-rds":     { x: 0,    y: 1120 },
  "aws-elastic": { x: 500,  y: 1120 },
  "aws-sqs":     { x: 1000, y: 840 },
  "aws-secrets": { x: 0,    y: 840 },
  "aws-cw":      { x: 1000, y: 1120 },

  // ── 6. Engineering Team Dependencies ── (org chart)
  "tm-cto":   { x: 500,  y: 0 },
  "tm-plat":  { x: 0,    y: 300 },
  "tm-back":  { x: 500,  y: 300 },
  "tm-front": { x: 1000, y: 300 },
  "tm-data":  { x: 0,    y: 600 },
  "tm-sec":   { x: 500,  y: 600 },
  "tm-sre":   { x: 1000, y: 600 },
  "tm-pm":    { x: 500,  y: 900 },

  // ── 7. API Gateway ── (left: consumers, center: gateway, right: services)
  "ag-ios":     { x: 0,    y: 0 },
  "ag-android": { x: 0,    y: 300 },
  "ag-web":     { x: 0,    y: 600 },
  "ag-partner": { x: 0,    y: 900 },
  "ag-gw":      { x: 600,  y: 400 },
  "ag-docs":    { x: 600,  y: 800 },
  "ag-auth":    { x: 1200, y: 0 },
  "ag-user":    { x: 1200, y: 300 },
  "ag-product": { x: 1200, y: 600 },
  "ag-order":   { x: 1200, y: 900 },

  // ── 8. Database Architecture ── (top: app, middle: primary, bottom: replicas)
  "db-app":      { x: 500,  y: 0 },
  "db-redis":    { x: 1100, y: 0 },
  "db-pgpool":   { x: 500,  y: 280 },
  "db-mongo":    { x: 1100, y: 280 },
  "db-primary":  { x: 500,  y: 560 },
  "db-replica1": { x: 0,    y: 840 },
  "db-replica2": { x: 500,  y: 840 },
  "db-analytics":{ x: 1000, y: 840 },
  "db-debezium": { x: 500,  y: 1120 },
  "db-elastic":  { x: 1100, y: 1120 },

  // ── 9. Vendor Risk Map ── (hub and spoke from center)
  "vr-app":      { x: 600,  y: 0 },
  "vr-stripe":   { x: 0,    y: 300 },
  "vr-aws":      { x: 450,  y: 300 },
  "vr-auth0":    { x: 900,  y: 300 },
  "vr-dd":       { x: 0,    y: 600 },
  "vr-twilio":   { x: 450,  y: 600 },
  "vr-sendgrid": { x: 900,  y: 600 },
  "vr-gh":       { x: 0,    y: 900 },
  "vr-vercel":   { x: 450,  y: 900 },
  "vr-openai":   { x: 900,  y: 900 },

  // ── 10. Security Threat Model ── (left-to-right through trust boundary)
  "st-user":    { x: 0,    y: 300 },
  "st-cdn":     { x: 500,  y: 0 },
  "st-waf":     { x: 500,  y: 600 },
  "st-lb":      { x: 1000, y: 300 },
  "st-api":     { x: 1500, y: 300 },
  "st-auth":    { x: 1500, y: 0 },
  "st-db":      { x: 2000, y: 300 },
  "st-secrets": { x: 2000, y: 600 },
  "st-logs":    { x: 1500, y: 600 },

  // ── 11. Event-Driven Architecture ── (left-to-right CQRS flow)
  "ev-client":     { x: 0,    y: 350 },
  "ev-cmd":        { x: 550,  y: 0 },
  "ev-query":      { x: 550,  y: 700 },
  "ev-eventstore": { x: 1100, y: 0 },
  "ev-kafka":      { x: 1100, y: 350 },
  "ev-proj1":      { x: 1650, y: 0 },
  "ev-proj2":      { x: 1650, y: 350 },
  "ev-proj3":      { x: 1650, y: 700 },
  "ev-readdb":     { x: 2200, y: 150 },
  "ev-ws":         { x: 2200, y: 550 },

  // ── 12. Multi-Tenant SaaS ── (left-to-right through layers)
  "mt-tenant":  { x: 0,    y: 300 },
  "mt-cf":      { x: 500,  y: 0 },
  "mt-app":     { x: 500,  y: 300 },
  "mt-admin":   { x: 500,  y: 600 },
  "mt-auth":    { x: 1000, y: 0 },
  "mt-router":  { x: 1000, y: 300 },
  "mt-billing": { x: 1000, y: 600 },
  "mt-db":      { x: 1500, y: 300 },
  "mt-queue":   { x: 1500, y: 0 },
  "mt-storage": { x: 1500, y: 600 },

  // ── 13. Enterprise Sales Pipeline ── (left-to-right funnel)
  "sp-mkt":     { x: 0,    y: 300 },
  "sp-sdr":     { x: 0,    y: 0 },
  "sp-deal":    { x: 500,  y: 300 },
  "sp-crm":     { x: 500,  y: 600 },
  "sp-ae":      { x: 1000, y: 300 },
  "sp-se":      { x: 1000, y: 600 },
  "sp-legal":   { x: 1500, y: 0 },
  "sp-exec":    { x: 1500, y: 300 },
  "sp-finance": { x: 1500, y: 600 },
  "sp-cs":      { x: 2000, y: 300 },

  // ── 14. Employee Onboarding ── (left-to-right timeline)
  "hr-recruit":  { x: 0,    y: 300 },
  "hr-offer":    { x: 500,  y: 0 },
  "hr-hris":     { x: 500,  y: 300 },
  "hr-payroll":  { x: 500,  y: 600 },
  "hr-it":       { x: 1000, y: 600 },
  "hr-orient":   { x: 1000, y: 0 },
  "hr-manager":  { x: 1000, y: 300 },
  "hr-buddy":    { x: 1500, y: 600 },
  "hr-train":    { x: 1500, y: 0 },
  "hr-review30": { x: 1500, y: 300 },
  "hr-review90": { x: 2000, y: 300 },

  // ── 15. Product Roadmap ── (themes left, features center, milestones right)
  "pr-theme1": { x: 0,    y: 0 },
  "pr-theme2": { x: 0,    y: 600 },
  "pr-f1":     { x: 550,  y: 0 },
  "pr-f2":     { x: 550,  y: 300 },
  "pr-f3":     { x: 550,  y: 600 },
  "pr-f4":     { x: 550,  y: 900 },
  "pr-design": { x: 1100, y: 0 },
  "pr-eng":    { x: 1100, y: 350 },
  "pr-qa":     { x: 1100, y: 700 },
  "pr-m1":     { x: 1650, y: 150 },
  "pr-m2":     { x: 1650, y: 600 },

  // ── 16. Supply Chain ── (left-to-right: suppliers → assembly → distribution → retail)
  "sc-supplier1": { x: 0,    y: 0 },
  "sc-supplier2": { x: 0,    y: 350 },
  "sc-supplier3": { x: 0,    y: 700 },
  "sc-plan":      { x: 550,  y: -150 },
  "sc-assembly":  { x: 550,  y: 250 },
  "sc-qc":        { x: 550,  y: 600 },
  "sc-erp":       { x: 550,  y: 900 },
  "sc-warehouse": { x: 1100, y: 0 },
  "sc-logistics": { x: 1100, y: 400 },
  "sc-retail":    { x: 1650, y: 0 },
  "sc-ecom":      { x: 1650, y: 400 },

  // ── 17. Customer Journey Map ── (left-to-right journey stages)
  "cj-aware":     { x: 0,    y: 350 },
  "cj-consider":  { x: 500,  y: 350 },
  "cj-decide":    { x: 1000, y: 350 },
  "cj-onboard":   { x: 1500, y: 350 },
  "cj-adopt":     { x: 2000, y: 350 },
  "cj-renew":     { x: 2500, y: 350 },
  "cj-advocate":  { x: 3000, y: 350 },
  "cj-marketing": { x: 250,  y: 0 },
  "cj-sales":     { x: 1000, y: 0 },
  "cj-cs":        { x: 2000, y: 0 },
  "cj-product":   { x: 1500, y: 700 },
};

(async () => {
  try {
    let updated = 0;
    let notFound = 0;
    for (const [nodeId, pos] of Object.entries(layouts)) {
      const result = await p.mapNode.updateMany({
        where: { id: nodeId },
        data: { posX: pos.x, posY: pos.y },
      });
      if (result.count > 0) updated++;
      else notFound++;
    }
    console.log(`Updated ${updated} node positions (${notFound} not found in DB).`);
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await p.$disconnect();
  }
})();
