# SwayMaps SaaS Launch Plan
## "The Visual Dependency Intelligence Platform"
## Model: Monthly Recurring Revenue (MRR) via Stripe

---

## 1. USE CASE & POSITIONING

### The Problem (Fortune 500 Pain Point)
Large enterprises have **thousands of interconnected systems, teams, and processes** but NO single visual source of truth for dependencies. This causes:
- **Blind deployments** - Teams ship changes without knowing what downstream systems break
- **Slow incident response** - When something fails, teams spend hours tracing dependencies
- **Painful onboarding** - New engineers take 3-6 months to understand system relationships
- **Risky migrations** - Cloud migrations, vendor changes, and reorgs happen without dependency visibility
- **Compliance gaps** - Auditors ask "what touches PII?" and nobody can answer quickly

### The Solution: SwayMaps
**SwayMaps is a real-time visual dependency mapping platform** that lets teams map, share, and analyze the relationships between their systems, people, and processes.

### Primary Use Cases (Ranked by Enterprise Value)

#### UC1: IT System & Microservice Dependency Mapping (PRIMARY)
**Buyer:** CTO, VP Engineering, Platform Teams
**Value:** Map every microservice, database, API, and queue. See blast radius before deploying. Trace failures in seconds.
**Why Fortune 500 cares:** A single outage at a Fortune 500 costs $100K-$1M/hour. SwayMaps prevents cascading failures.

#### UC2: Change Impact Analysis
**Buyer:** Engineering Managers, Release Managers
**Value:** Before any deployment, see exactly which systems and teams are affected. Color-code risk levels.
**Why Fortune 500 cares:** Reduces failed deployments by 60%+ and eliminates "we didn't know X depended on Y" incidents.

#### UC3: Organizational Knowledge & Onboarding Maps
**Buyer:** Engineering Managers, HR/People Ops, CTO
**Value:** Map team ownership, system ownership, and tribal knowledge visually. New hires explore maps instead of reading 200-page wikis.
**Why Fortune 500 cares:** Cuts onboarding time from 3 months to 2 weeks. Preserves institutional knowledge when people leave.

#### UC4: Compliance & Data Flow Mapping
**Buyer:** CISO, Compliance Officers, DPOs
**Value:** Map where PII flows, which systems touch sensitive data, and trace audit paths visually.
**Why Fortune 500 cares:** SOC2, GDPR, HIPAA all require knowing your data flows. SwayMaps makes audits visual and fast.

#### UC5: Vendor & Supply Chain Dependency Mapping
**Buyer:** Procurement, Risk Management, CTO
**Value:** Map all third-party dependencies. When a vendor has an outage or breach, instantly see your exposure.
**Why Fortune 500 cares:** SolarWinds, Log4j taught everyone they don't know their dependency graph.

### Tagline Options
- "Map every dependency. Ship safer changes."
- "See what depends on what. Before it breaks."
- "Your systems are connected. Your knowledge should be too."

### Competitive Positioning
| Competitor | Weakness | SwayMaps Advantage |
|---|---|---|
| Lucidchart/Draw.io | Generic diagramming, no dependency intelligence | Purpose-built for dependencies with AI |
| ServiceNow CMDB | Expensive, complex, table-based | Visual-first, 10x faster to adopt |
| Backstage (Spotify) | Developer-only, requires heavy setup | No-code, accessible to non-engineers |
| Miro/FigJam | Whiteboards, not structured data | Structured nodes with metadata & API |

---

## 2. FEATURE GAPS TO FILL (Priority Order)

### P0 - Launch Blockers (Must have for launch)

#### 2.1 Stripe Subscription Integration
- Checkout sessions for Pro ($29/mo) and Team ($79/mo)
- Annual billing option with discount (Pro $19/mo, Team $59/mo billed annually)
- Webhook handlers for full subscription lifecycle
- Stripe Customer Portal for self-service billing management
- Coupon/promo code system via Stripe (replace hardcoded "DECODE20")
- 14-day free trial on Pro and Team plans
- Dunning management (failed payment retries, grace period)
- Subscription upgrade/downgrade proration

#### 2.2 Onboarding Flow
- Welcome wizard after signup (3 steps)
- Template gallery: "Start from a template" with pre-built maps
  - Microservice Architecture Map
  - Team Org Chart
  - Data Flow Diagram
  - Vendor Dependency Map
  - CI/CD Pipeline Map
- Interactive tutorial overlay on first map

#### 2.3 Export & Import
- Export maps as PNG, SVG, PDF
- Export map data as JSON
- Import from JSON
- Future: Import from CSV, Lucidchart, Draw.io

#### 2.4 Production Database
- Migrate from SQLite to PostgreSQL (Supabase/Neon/Railway)
- Connection pooling
- Proper indexing

### P1 - Differentiation Features (Ship within 2 weeks of launch)

#### 2.5 Map Templates Library
- 10+ pre-built templates for common use cases
- Community template sharing (future)
- "Use this template" one-click clone

#### 2.6 Advanced Node Types
- Add node kinds: Database, API, Queue, Cache, Cloud Service, Team, External Vendor
- Custom icons per node type
- Node status indicators (healthy/warning/critical)

#### 2.7 Search & Filter Across Maps
- Global search across all maps and nodes
- Filter by node type, tag, status
- "Find all systems tagged PII" across entire workspace

#### 2.8 Map Versioning & History
- Auto-save with version history
- Restore previous versions
- Diff view between versions

#### 2.9 Embed & Iframe Support
- Embeddable map viewer for Notion, Confluence, internal wikis
- Read-only embed with optional interactivity
- Branded embed with company logo

### P2 - Enterprise Features (Post-launch roadmap)

#### 2.10 SSO / SAML Authentication
- Okta, Azure AD, Google Workspace SSO
- SCIM provisioning

#### 2.11 API Access
- REST API for programmatic map creation
- Webhook notifications for map changes
- Terraform/Pulumi provider (future)

#### 2.12 Real-time Collaboration
- Multiple cursors on same map
- Live presence indicators
- Commenting on nodes/edges

#### 2.13 Integrations
- Import from AWS/GCP/Azure (auto-discover infrastructure)
- Jira/Linear integration (link tickets to nodes)
- Slack notifications
- PagerDuty integration (link incidents to affected systems)

---

## 3. DATABASE SCHEMA UPGRADES

### New/Modified Models Needed:

```prisma
// Add to existing schema

model Template {
  id          String   @id @default(uuid())
  name        String
  description String
  category    String   // architecture, org, compliance, devops, custom
  thumbnail   String?
  mapData     String   // JSON blob of nodes/edges
  isPublic    Boolean  @default(true)
  authorId    String?
  author      User?    @relation(fields: [authorId], references: [id])
  usageCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MapVersion {
  id        String   @id @default(uuid())
  mapId     String
  map       DecodeMap @relation(fields: [mapId], references: [id], onDelete: Cascade)
  version   Int
  snapshot  String   // JSON blob of full map state
  createdBy String?
  createdAt DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  action      String   // map.created, map.shared, member.invited, plan.upgraded, etc.
  entityType  String   // map, workspace, member, subscription
  entityId    String
  metadata    String?  // JSON details
  createdAt   DateTime @default(now())
}

// Modify User model - add fields:
// isAdmin     Boolean  @default(false)
// onboardedAt DateTime?
// avatarUrl   String?
// auditLogs   AuditLog[]

// Modify DecodeMap model - add fields:
// versions   MapVersion[]
// isTemplate Boolean @default(false)

// Modify Subscription model - ensure fields:
// stripeCustomerId  String?  @unique
// stripeSubId       String?  @unique
// stripePriceId     String?
// plan              String   // free, pro, team
// status            String   // active, trialing, past_due, canceled, incomplete
// currentPeriodEnd  DateTime?
// cancelAtPeriodEnd Boolean  @default(false)
// trialEnd          DateTime?
```

---

## 4. STRIPE PAYMENT ARCHITECTURE (MRR Focus)

### Pricing Model

```
Plan        Monthly     Annual (per month)   Annual (billed)
-----------------------------------------------------------
Free        $0          -                    -
Pro         $29/mo      $19/mo               $228/yr (save 34%)
Team        $79/mo      $59/mo               $708/yr (save 25%)
Enterprise  Custom      Custom               Custom
```

### Stripe Products & Prices to Create
- Product: "SwayMaps Pro"
  - Price: $29/month (recurring)
  - Price: $228/year (recurring) - displayed as $19/mo
- Product: "SwayMaps Team"
  - Price: $79/month (recurring)
  - Price: $708/year (recurring) - displayed as $59/mo

### Subscription Flow

```
1. User signs up (free plan, no card required)
2. User hits plan limit (e.g., >3 maps) -> Upgrade modal shown
3. User clicks "Upgrade to Pro" or "Upgrade to Team"
4. Toggle: Monthly / Annual billing
5. Redirect to Stripe Checkout (with 14-day free trial)
6. Stripe processes payment
7. Webhook: checkout.session.completed -> activate plan in DB
8. User returns to app with upgraded plan

Upgrade/Downgrade:
- Pro -> Team: Stripe proration, immediate upgrade
- Team -> Pro: Downgrade at end of billing period
- Any -> Free: Cancel subscription, access until period end

Billing Management:
- "Manage Billing" button -> Stripe Customer Portal
- User can update card, switch plans, cancel, view invoices
```

### API Routes

```
POST /api/billing/checkout       - Create Stripe Checkout session
  Body: { plan: "pro"|"team", interval: "month"|"year" }
  Returns: { url: "https://checkout.stripe.com/..." }

POST /api/billing/portal         - Create Stripe Customer Portal session
  Returns: { url: "https://billing.stripe.com/..." }

POST /api/billing/webhook        - Stripe webhook handler (no auth, verify signature)
  Handles: checkout.session.completed, invoice.paid, invoice.payment_failed,
           customer.subscription.updated, customer.subscription.deleted

GET  /api/billing/status         - Get current user's subscription status
  Returns: { plan, status, currentPeriodEnd, cancelAtPeriodEnd, trialEnd }
```

### Webhook Event Handling

```
checkout.session.completed:
  - Get customer ID and subscription ID from session
  - Update user's Subscription record (plan, status, stripeCustomerId, stripeSubId)
  - Update user's plan field
  - Log to AuditLog

invoice.paid:
  - Update currentPeriodEnd on Subscription
  - Ensure status = "active"

invoice.payment_failed:
  - Set status = "past_due"
  - Send email notification (via Resend)
  - Grace period: 7 days before downgrading to free

customer.subscription.updated:
  - Handle plan changes (upgrade/downgrade)
  - Update plan, stripePriceId, cancelAtPeriodEnd
  - Handle trial_end changes

customer.subscription.deleted:
  - Set status = "canceled"
  - Downgrade user to free plan
  - Keep data intact (don't delete maps)
```

### Trial Strategy
- 14-day free trial on Pro and Team
- No credit card required to start trial (Stripe supports this)
- Trial reminder emails at Day 7 and Day 12
- Auto-convert to paid at Day 14 if card added
- Downgrade to free if no card at trial end

---

## 5. ADMIN PANEL ENHANCEMENTS

### Current State
- Basic user overview, plan breakdown, MRR

### Upgrades Needed

#### Dashboard Metrics
- Total users, active users (last 7/30 days)
- MRR breakdown: Pro monthly + Pro annual + Team monthly + Team annual
- ARR (Annual Run Rate)
- Churn rate (monthly)
- Trial-to-paid conversion rate
- Maps created per day/week/month
- Revenue per user (ARPU)
- Top users by map count
- Workspace utilization

#### Subscription Analytics
- MRR growth chart (month over month)
- New subscriptions vs cancellations
- Plan distribution pie chart
- Trial funnel: signups -> trial starts -> trial converts -> active
- Failed payment tracking
- Upcoming renewals this month

#### User Management
- Search/filter users by name, email, plan, status
- View user's maps and workspaces
- Change user plan manually (admin override)
- Extend trial period
- Impersonate user (view as user)
- Disable/enable accounts
- Export user list as CSV

#### Content Moderation
- View publicly shared maps
- Disable public shares
- Flag inappropriate content

#### System Health
- API response time monitoring
- Error rate tracking
- Database size and growth

---

## 6. LANDING PAGE REDESIGN

### Current State
- Hero section, features, pricing, FAQ
- Interactive demo

### Redesign for Conversion

#### Above the Fold
- Bold headline: "See What Depends on What. Before It Breaks."
- Sub-headline: "The visual dependency mapping platform for engineering teams. Map systems, trace impact, ship with confidence."
- CTA: "Start Free - No Credit Card Required" + "Watch Demo (2 min)"
- Social proof: "Trusted by teams at [logos]" (add after first customers)
- Interactive mini-demo showing a microservice map

#### Social Proof Section
- Customer testimonials (placeholder, then real)
- "Used by 500+ teams" counter
- G2/ProductHunt badges (post-launch)
- Security badges (SOC2 ready, GDPR compliant)

#### Use Case Sections (with tabs)
- "For Engineering Teams" - system maps, blast radius
- "For Platform Teams" - infrastructure dependencies
- "For Compliance" - data flow mapping
- "For Leadership" - org knowledge maps

#### Feature Deep Dives
- AI-Powered Map Generation (demo GIF)
- Real-time Collaboration (demo GIF)
- Public Sharing & Embeds (demo GIF)
- Templates Gallery (screenshot)

#### Pricing Section

```
Free               Pro                 Team                Enterprise
$0/forever         $29/mo              $79/mo              Custom
                   $19/mo billed       $59/mo billed
                   annually            annually

3 maps             Unlimited maps      Unlimited maps      Unlimited maps
1 workspace        5 workspaces        Unlimited           Unlimited
2 node types       All node types      All node types      All + custom types
Community support  Email support       Priority support    Dedicated CSM
-                  Export PDF/PNG/SVG  Everything in Pro   Everything in Team
-                  All templates       + Version history   + SSO/SAML
-                  AI brainstorm       + API access        + Custom integrations
-                  14-day free trial   + 14-day free trial + SLA guarantee

[Start Free]       [Start Free Trial]  [Start Free Trial]  [Contact Sales]
```

#### Trust & Security Section
- "Your data is safe with us"
- Encryption at rest and in transit
- SOC2 compliance (roadmap)
- GDPR compliant
- 99.9% uptime SLA (Enterprise)

#### FAQ Section
- "Can I cancel anytime?" -> Yes, cancel anytime. Access continues until end of billing period.
- "What happens to my maps if I downgrade?" -> Your maps are preserved. You just can't create new ones beyond the free limit.
- "Do you offer a free trial?" -> Yes, 14 days free on Pro and Team. No credit card required.
- "Can I switch between monthly and annual?" -> Yes, switch anytime from your billing dashboard.
- "Is there a discount for nonprofits/education?" -> Contact us for special pricing.

#### Footer
- Product links, company links, legal
- Status page link
- API docs link (future)
- Blog link (future)

---

## 7. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [ ] Migrate to PostgreSQL (Supabase)
- [ ] Add new schema models (Template, MapVersion, AuditLog)
- [ ] Add isAdmin, onboardedAt fields to User model
- [ ] Implement Stripe checkout + webhooks + customer portal
- [ ] Implement 14-day free trial flow
- [ ] Add admin authentication gate (isAdmin field)
- [ ] Build onboarding wizard (3-step)
- [ ] Add 5 starter templates
- [ ] Upgrade modal -> Stripe Checkout integration

### Phase 2: Product Polish (Week 3-4)
- [ ] Export maps as PNG/SVG/PDF
- [ ] Import/export JSON
- [ ] Map versioning (auto-save + restore)
- [ ] Advanced node types with icons
- [ ] Global search across maps
- [ ] Landing page redesign with new pricing
- [ ] Pricing page with monthly/annual toggle
- [ ] Plan comparison page

### Phase 3: Launch Prep (Week 5)
- [ ] Admin panel enhancements (MRR dashboard, subscription analytics, user mgmt)
- [ ] Email system via Resend (welcome, trial reminders, payment failed, cancellation)
- [ ] Error monitoring (Sentry)
- [ ] Analytics (PostHog or Mixpanel)
- [ ] Performance optimization
- [ ] Security audit (OWASP top 10)
- [ ] Terms of Service + Privacy Policy pages
- [ ] Production deployment (Vercel + custom domain)

### Phase 4: Launch (Week 6)
- [ ] ProductHunt launch
- [ ] Social media announcements
- [ ] Support system setup (Crisp/Intercom)
- [ ] Feedback collection system
- [ ] Monitor MRR, churn, trial conversion
- [ ] Hotfix as needed

### Phase 5: Growth & Enterprise (Week 7+)
- [ ] Embed/iframe support
- [ ] More templates based on user feedback
- [ ] SSO/SAML for enterprise tier
- [ ] REST API for developers
- [ ] Integrations (Slack, Jira, PagerDuty)
- [ ] Real-time collaboration
- [ ] Enterprise sales outreach to Fortune 500

---

## 8. TECH DECISIONS

| Decision | Choice | Rationale |
|---|---|---|
| Database | PostgreSQL on Supabase | Free tier, managed, scalable, Prisma compatible |
| Payments | Stripe Subscriptions | Industry standard, handles trials, proration, dunning |
| Email | Resend | Simple API, great DX, transactional + marketing |
| Monitoring | Sentry | Error tracking, free tier, Next.js integration |
| Analytics | PostHog | Product analytics, free tier, funnel tracking |
| Hosting | Vercel | Already Next.js, auto-scaling, edge functions |
| File Storage | Supabase Storage | For exports, thumbnails, co-located with DB |
| Support | Crisp | Free tier, live chat widget, knowledge base |

---

## 9. MRR PRICING STRATEGY

### Plan Limits & Feature Gates

| Feature | Free | Pro ($29/mo) | Team ($79/mo) | Enterprise |
|---|---|---|---|---|
| Maps | 3 | Unlimited | Unlimited | Unlimited |
| Workspaces | 1 | 5 | Unlimited | Unlimited |
| Members per workspace | 2 (viewers only) | 1 (solo) | Unlimited | Unlimited |
| Node types | Person, System | All 8 types | All 8 types | All + custom |
| AI brainstorm | 5/month | Unlimited | Unlimited | Unlimited |
| Templates | 3 basic | All templates | All templates | All + custom |
| Export (PNG/SVG/PDF) | No | Yes | Yes | Yes |
| Version history | No | No | Yes | Yes |
| Public sharing | No | Yes | Yes | Yes + embed |
| API access | No | No | Yes | Yes |
| SSO/SAML | No | No | No | Yes |
| Priority support | No | No | Yes | Dedicated CSM |
| Free trial | - | 14 days | 14 days | Demo call |

### Upgrade Triggers (When to show upgrade modal)
1. Free user tries to create 4th map -> "Upgrade to Pro for unlimited maps"
2. Free user tries to export -> "Export is a Pro feature"
3. Free user tries AI brainstorm after 5 uses -> "Upgrade for unlimited AI"
4. Pro user tries to invite team member -> "Upgrade to Team for collaboration"
5. Pro user tries version history -> "Upgrade to Team for version history"
6. Any user reaches plan limit -> Contextual upgrade modal with benefit messaging

### Revenue Projections (MRR Model)

| Month | Free Users | Pro Users | Team Users | MRR |
|---|---|---|---|---|
| Month 1 | 500 | 20 | 5 | $975 |
| Month 3 | 2,000 | 80 | 20 | $3,900 |
| Month 6 | 5,000 | 200 | 50 | $9,750 |
| Month 12 | 10,000 | 500 | 150 | $26,300 |
| Month 24 | 25,000 | 1,200 | 400 | $66,400 |

Assumptions: 5% free-to-pro conversion, 1% free-to-team, 3% monthly churn

### Annual Discount Strategy
- Monthly: Full price ($29 Pro, $79 Team)
- Annual: ~35% discount ($19/mo Pro = $228/yr, $59/mo Team = $708/yr)
- Annual billing improves cash flow and reduces churn
- Show annual as default with "Save 35%" badge
- Toggle to monthly available

---

## 10. SUCCESS METRICS

| Metric | Target (Month 1) | Target (Month 6) | Target (Month 12) |
|---|---|---|---|
| Signups | 500 | 5,000 | 10,000 |
| Active Users (WAU) | 150 | 1,500 | 3,000 |
| Paid Users | 25 | 250 | 650 |
| MRR | $975 | $9,750 | $26,300 |
| ARR | $11,700 | $117,000 | $315,600 |
| Trial Starts | 100 | 500 | 800/mo |
| Trial-to-Paid Rate | 20% | 30% | 35% |
| Monthly Churn | <8% | <5% | <3% |
| Maps Created | 1,000 | 15,000 | 50,000 |
| NPS | 30+ | 50+ | 60+ |
| ARPU | $39 | $39 | $40.50 |

### Key MRR Levers
1. **Activation:** Onboarding wizard + templates -> higher Day 1 map creation
2. **Trial conversion:** Trial reminder emails + in-app nudges at Day 7/12
3. **Expansion:** Free -> Pro -> Team upsell path with contextual triggers
4. **Retention:** Version history, templates, AI = sticky features that reduce churn
5. **Annual conversion:** Show annual as default, "save 35%" badge -> better LTV

---

## 11. EMAIL SEQUENCES (via Resend)

### Welcome Sequence
1. **Signup (Day 0):** Welcome email + "Create your first map in 2 minutes"
2. **Day 1:** "3 templates to get started" (link to template gallery)
3. **Day 3:** "See how [Company X] maps their microservices" (case study)
4. **Day 7:** "Your free plan includes 3 maps - here's what Pro unlocks"

### Trial Sequence (Pro/Team)
1. **Trial Start:** "Your 14-day trial is active! Here's what you can do."
2. **Day 3:** "Have you tried AI brainstorming? Generate a map in seconds."
3. **Day 7:** "7 days left - add your payment method to keep Pro features"
4. **Day 12:** "2 days left on your trial - don't lose access to [features]"
5. **Trial End (no card):** "Your trial ended. Your maps are safe. Upgrade anytime."
6. **Trial End (card):** "Welcome to SwayMaps Pro! Your first invoice is attached."

### Billing Sequence
1. **Payment received:** Invoice email
2. **Payment failed:** "Action needed: update your payment method"
3. **Payment failed (Day 3):** "Your account will be downgraded in 4 days"
4. **Cancellation:** "We're sorry to see you go. Your access continues until [date]."
5. **Win-back (Day 30):** "We've added [new feature]. Come back with 20% off."
