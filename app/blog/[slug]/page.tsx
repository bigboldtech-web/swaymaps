"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import "../../landing/landing.css";

/* ---- SVG ICONS ---- */
function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ---- LOGO ---- */
function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
      <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="white" />
      <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6" />
      <circle cx="12" cy="30" r="3.5" fill="white" />
    </svg>
  );
}

/* ---- SCROLL REVEAL ---- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`lp-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ---- TYPES ---- */
type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "nodes"; nodes: { label: string; type: string; color: string }[] }
  | { type: "code"; code: string };

interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: ContentBlock[];
}

/* ---- CATEGORY COLORS ---- */
const categoryColors: Record<string, string> = {
  Engineering: "#00c2ff",
  Compliance: "#8b5cf6",
  "Product Updates": "#22c55e",
  "Best Practices": "#f59e0b",
};

/* ---- BLOG POST DATA ---- */
const blogPosts: BlogPost[] = [
  {
    slug: "youtube-architecture-dependency-map",
    title: "How YouTube's Architecture Works: A Visual Dependency Map",
    category: "Engineering",
    date: "March 25, 2026",
    readTime: "12 min read",
    author: "SwayMaps Team",
    excerpt: "YouTube serves over 2 billion logged-in users every month and processes 500 hours of video uploads per minute. Here is how its massive architecture actually works, mapped as a visual dependency graph.",
    content: [
      { type: "p", text: "YouTube is one of the most complex distributed systems ever built. It serves over 2 billion logged-in users every single month, processes more than 500 hours of video uploads per minute, and streams over a billion hours of video per day. Behind that seamless play button is a sprawling architecture of interconnected services, databases, processing pipelines, and machine learning models that all need to work together flawlessly. Understanding how these pieces connect is not just an academic exercise -- it is essential for anyone building systems at scale." },
      { type: "h2", text: "The Frontend Layer" },
      { type: "p", text: "When you type youtube.com into your browser, your request does not go directly to a YouTube server. It first hits Google's global Content Delivery Network (CDN), one of the largest in the world, with edge nodes in over 100 countries. The CDN serves cached static assets -- JavaScript bundles, CSS, thumbnails, and frequently accessed video segments -- from the node closest to you geographically. This is why YouTube loads fast whether you are in Tokyo or Topeka." },
      { type: "p", text: "Requests that cannot be served from the CDN edge are routed through a sophisticated load balancing layer. Google uses a combination of DNS-based load balancing (Google Global Load Balancer) and software-defined networking to distribute traffic across data centers. The load balancer considers server health, geographic proximity, current load, and even the type of request when deciding where to route traffic." },
      { type: "p", text: "Behind the load balancers sit the web servers themselves. YouTube's frontend is built on a custom framework that server-renders the initial page and then hydrates it with a rich client-side application. The web servers communicate with dozens of backend microservices through gRPC, Google's high-performance RPC framework, to fetch video metadata, user preferences, recommendations, and ads -- all of which need to be assembled into a single page load in under 200 milliseconds." },
      { type: "h2", text: "The Video Processing Pipeline" },
      { type: "p", text: "The upload pipeline is where YouTube's engineering truly shines. When a creator uploads a video, it enters a multi-stage processing pipeline that is one of the most sophisticated batch processing systems in production anywhere." },
      { type: "p", text: "First, the raw video file is received by the Upload Service and written to temporary blob storage. The file is then picked up by the Transcoder, which is responsible for converting the single uploaded file into dozens of different formats and resolutions. A single 4K video upload generates versions in 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, and 2160p, in multiple codecs including H.264, VP9, and AV1. Each resolution also gets segmented into small chunks for adaptive bitrate streaming. A 10-minute 4K upload can generate over 100 individual output files." },
      { type: "p", text: "While transcoding happens, the Thumbnail Generation service extracts frames from the video, runs ML models to identify the most visually appealing frames, and generates multiple thumbnail options for the creator. Simultaneously, the Content Moderation pipeline kicks in -- a combination of machine learning classifiers and hash-matching algorithms scan the video for policy violations, copyright infringement (via Content ID), and age-restricted material. This entire pipeline runs in parallel using Google's Borg cluster management system, the predecessor to Kubernetes." },
      { type: "h2", text: "Storage and Database Layer" },
      { type: "p", text: "YouTube's data storage needs are staggering. The platform uses several different storage systems, each optimized for specific access patterns." },
      { type: "p", text: "Bigtable, Google's distributed NoSQL database, handles much of YouTube's metadata -- video information, channel data, comments, and view counts. Bigtable excels at high-throughput reads and writes with low latency, making it ideal for the kind of key-value lookups that dominate YouTube's access patterns. A single Bigtable cluster can handle millions of operations per second." },
      { type: "p", text: "For relational data that requires transactions and complex queries -- things like user account information, subscription relationships, and playlist structures -- YouTube uses Vitess, an open-source database clustering system originally built at YouTube to scale MySQL horizontally. Vitess shards data across hundreds of MySQL instances while presenting a single logical database to application code. It handles connection pooling, query routing, and automatic failover. YouTube open-sourced Vitess in 2012, and it is now used by companies like Slack, Square, and GitHub." },
      { type: "p", text: "The actual video files live in Google's Blob Storage system (Colossus), a distributed file system that stores exabytes of data across multiple data centers with automatic replication and erasure coding for durability. Popular videos are also cached at CDN edge nodes and in Google's network of cache servers distributed within ISP networks worldwide." },
      { type: "h2", text: "The Recommendation Engine" },
      { type: "p", text: "YouTube's recommendation system is responsible for over 70% of all watch time on the platform, making it arguably the most impactful recommendation engine in the world. It operates as a sophisticated ML pipeline with multiple stages." },
      { type: "p", text: "The first stage is Candidate Generation. Given the billions of videos on YouTube, you cannot score every single one for every user. Instead, a neural network model takes user signals -- watch history, search queries, demographics, time of day, device type -- and generates a shortlist of a few hundred candidate videos from the entire corpus. This model is trained on billions of examples and uses deep learning embeddings to understand both user preferences and video content." },
      { type: "p", text: "The second stage is Ranking. A separate, more computationally expensive model takes the candidate set and assigns a precise score to each video based on predicted watch time, predicted engagement (likes, shares, comments), and various policy signals. This ranking model considers hundreds of features and is updated continuously as new training data arrives. The output is the ranked list of videos you see on your homepage and in the \"Up Next\" sidebar." },
      { type: "p", text: "All of this is powered by an Analytics system that ingests billions of events per day -- every play, pause, seek, like, comment, and share -- processes them through a real-time streaming pipeline, and feeds them back into the ML training loop. The latency from a user action to it influencing recommendations can be as short as a few minutes." },
      { type: "h2", text: "The Dependency Map" },
      { type: "p", text: "When we map out YouTube's core architecture as a dependency graph, the interconnected nature of the system becomes immediately visible. Here are the primary nodes in the system:" },
      { type: "nodes", nodes: [
        { label: "CDN", type: "Cloud", color: "#6366f1" },
        { label: "Load Balancer", type: "System", color: "#3b82f6" },
        { label: "Web Server", type: "System", color: "#3b82f6" },
        { label: "Upload Service", type: "API", color: "#06b6d4" },
        { label: "Transcoder", type: "Process", color: "#22c55e" },
        { label: "Bigtable", type: "Database", color: "#8b5cf6" },
        { label: "Vitess", type: "Database", color: "#8b5cf6" },
        { label: "Blob Storage", type: "Database", color: "#8b5cf6" },
        { label: "ML Pipeline", type: "Process", color: "#22c55e" },
        { label: "Recommendation API", type: "API", color: "#06b6d4" },
        { label: "Content Moderation", type: "Process", color: "#22c55e" },
        { label: "Analytics", type: "System", color: "#3b82f6" },
      ]},
      { type: "p", text: "The edges between these nodes tell the real story. The CDN depends on Blob Storage for cache misses. The Web Server depends on the Recommendation API, Bigtable, and Vitess for page assembly. The Transcoder depends on Blob Storage for both input and output. The ML Pipeline depends on Analytics for training data and feeds into the Recommendation API. Content Moderation is a dependency for the Upload Service -- a video cannot go live until moderation clears it." },
      { type: "p", text: "What makes this dependency graph particularly interesting is the presence of circular dependencies. Analytics depends on user interactions on the Web Server, which depends on Recommendations, which depends on the ML Pipeline, which depends on Analytics data. Managing these circular dependencies without creating deadlocks or cascading failures is one of the core challenges of operating YouTube at scale." },
      { type: "h2", text: "Mapping Complex Systems with SwayMaps" },
      { type: "p", text: "YouTube's architecture is a masterclass in distributed systems design, but its complexity is also its biggest operational risk. When any one of these interconnected services degrades, the blast radius can be difficult to predict without a clear visual map of dependencies." },
      { type: "p", text: "This is exactly the kind of system that SwayMaps is built to map. By creating a visual dependency graph of your own infrastructure -- whether it is 12 services or 1,200 -- you give your team the ability to understand blast radius before an incident, plan migrations with confidence, and onboard new engineers in days instead of months. The architecture behind YouTube took thousands of engineers over a decade to build. Understanding your own architecture should not take nearly that long." },
    ],
  },
  {
    slug: "spotify-system-architecture-mapped",
    title: "Spotify's Microservices Architecture: 800+ Services Mapped",
    category: "Engineering",
    date: "March 18, 2026",
    readTime: "10 min read",
    author: "SwayMaps Team",
    excerpt: "Spotify runs over 800 microservices built by 2,000+ engineers across hundreds of teams. Here is how their architecture works and what it teaches us about managing dependencies at scale.",
    content: [
      { type: "p", text: "Spotify is one of the most frequently cited examples of microservices architecture done right -- and done at scale. With over 600 million monthly active users, 800+ backend microservices, and more than 2,000 engineers organized into autonomous squads, Spotify's system is a living case study in how to build, operate, and evolve a complex distributed platform. But with that scale comes a challenge that few companies have solved well: understanding how all those services actually connect." },
      { type: "h2", text: "How Spotify Organizes Its Backend" },
      { type: "p", text: "At the core of Spotify's architecture are the services that power the user experience. When you press play on a song, a cascade of service calls fires in rapid succession. The Play API receives the request and coordinates with multiple downstream services: the Content Catalog service to resolve track metadata, the Rights Management service to verify licensing for your region, the Audio Delivery service to locate the optimal audio file, and the Ads service (for free-tier users) to determine if an ad insertion point is needed." },
      { type: "p", text: "The Search service is another critical component. Spotify's search does not just query a single index -- it fans out to multiple specialized services. There is a track search index, an artist search index, a podcast search index, a playlist search index, and a user search index. Each is optimized differently. Track search needs to handle fuzzy matching and typo correction. Podcast search needs to index episode transcripts. Playlist search needs to understand collaborative filtering signals. The Search Gateway orchestrates all of these and merges results with personalization signals from the ML platform." },
      { type: "p", text: "The Playlist service is one of Spotify's most complex subsystems. It handles not just user-created playlists but also algorithmic playlists like Discover Weekly, Release Radar, and Daily Mixes. Each algorithmic playlist is generated by a different ML model that runs on a weekly or daily batch schedule, pulling data from the event pipeline and pushing results to a serving layer. The Playlist service must handle millions of concurrent reads while also supporting real-time collaborative editing for shared playlists." },
      { type: "h2", text: "The Data Pipeline" },
      { type: "p", text: "Spotify generates an enormous amount of event data. Every song play, skip, search query, playlist edit, and UI interaction is captured as a structured event and sent to Spotify's event delivery system. This system, built on top of Google Cloud Pub/Sub and Apache Kafka, processes billions of events per day." },
      { type: "p", text: "These events flow into two parallel pipelines. The real-time pipeline powers features that need immediate data: the \"Friend Activity\" sidebar, real-time play counts, and the ad targeting system. The batch pipeline, built on Apache Beam running on Google Cloud Dataflow, aggregates data for analytics, royalty calculations, and ML model training. Spotify pays rights holders based on stream counts, so the accuracy and reliability of this batch pipeline is not just a technical concern -- it is a legal and financial one." },
      { type: "p", text: "The ML Training pipeline consumes data from the batch pipeline to train the models that power Spotify's personalization. This includes the collaborative filtering models for Discover Weekly, the natural language processing models that analyze playlist names and podcast transcripts, and the audio analysis models that extract features like tempo, energy, and danceability directly from audio waveforms. These trained models are deployed to a model serving infrastructure that the Recommendation API and Search service query in real time." },
      { type: "h2", text: "Infrastructure: Kubernetes, GCP, and Backstage" },
      { type: "p", text: "Spotify migrated from on-premises data centers to Google Cloud Platform in a multi-year effort that completed in 2018. Today, the vast majority of Spotify's services run on Google Kubernetes Engine (GKE). Each squad owns and deploys its own services independently, using a standardized CI/CD pipeline that runs tests, builds container images, and deploys to Kubernetes clusters across multiple regions." },
      { type: "p", text: "Managing 800+ microservices across dozens of teams required tooling that did not exist, so Spotify built it. Backstage, which Spotify open-sourced in 2020, is their developer portal and service catalog. It provides a single pane of glass for every service: ownership information, API documentation, deployment status, dependencies, and operational health. Backstage has since become a CNCF incubating project and is used by hundreds of companies." },
      { type: "p", text: "However, Backstage is primarily a catalog and portal -- it excels at listing services and their metadata but is not specifically designed for visual dependency mapping. It can tell you that Service A depends on Service B, but it does not give you an interactive, visual graph where you can trace dependency chains, identify circular dependencies, or simulate the blast radius of a service failure. This is the gap that dedicated dependency mapping tools fill." },
      { type: "h2", text: "Spotify's Core Service Map" },
      { type: "p", text: "Here are the key services and infrastructure components in Spotify's architecture:" },
      { type: "nodes", nodes: [
        { label: "Play API", type: "API", color: "#06b6d4" },
        { label: "Search Gateway", type: "API", color: "#06b6d4" },
        { label: "Playlist Service", type: "API", color: "#06b6d4" },
        { label: "Content Catalog", type: "System", color: "#3b82f6" },
        { label: "Rights Management", type: "System", color: "#3b82f6" },
        { label: "Audio Delivery", type: "System", color: "#3b82f6" },
        { label: "Ads Service", type: "System", color: "#3b82f6" },
        { label: "Event Pipeline", type: "Process", color: "#22c55e" },
        { label: "ML Training", type: "Process", color: "#22c55e" },
        { label: "Recommendation API", type: "API", color: "#06b6d4" },
        { label: "Kubernetes (GKE)", type: "Cloud", color: "#6366f1" },
        { label: "Backstage", type: "System", color: "#3b82f6" },
      ]},
      { type: "h2", text: "SwayMaps vs Backstage for Dependency Mapping" },
      { type: "p", text: "Backstage and SwayMaps solve different but complementary problems. Backstage is a developer portal -- it catalogs services, documents APIs, and tracks ownership. It answers the question \"what services do we have?\" SwayMaps is a visual dependency intelligence platform -- it maps how services connect, traces dependency chains, and helps teams understand blast radius. It answers the question \"what happens when this service goes down?\"" },
      { type: "p", text: "For teams that already use Backstage, SwayMaps adds the visual layer that Backstage lacks. For teams that do not have a service catalog at all, SwayMaps provides an immediate, visual starting point for understanding system architecture. You do not need to instrument your services or set up a portal -- you can start mapping dependencies in minutes and have a shareable, interactive dependency graph that your entire team can use for incident response, migration planning, and onboarding." },
      { type: "p", text: "Spotify's architecture is a testament to what is possible with microservices at scale. But it is also a reminder that scale without visibility is a liability. Whether you have 8 services or 800, knowing how they connect is the foundation of operational excellence." },
    ],
  },
  {
    slug: "netflix-dependency-hell-visual-solution",
    title: "Netflix's Dependency Hell: How Visual Mapping Prevents Cascading Failures",
    category: "Engineering",
    date: "March 10, 2026",
    readTime: "9 min read",
    author: "SwayMaps Team",
    excerpt: "Netflix runs 700+ microservices in production. When one fails, the blast radius can be catastrophic. Here is how dependency mapping helps prevent cascading failures before they start.",
    content: [
      { type: "p", text: "On December 24, 2012, Netflix went down. Not because of a bug in their code, but because an AWS Elastic Load Balancer service in the US-East-1 region experienced an outage. The cascading failure took down Netflix's streaming service for hours on one of their highest-traffic days of the year. This single incident became a turning point in how Netflix -- and the industry -- thinks about dependency management in distributed systems." },
      { type: "p", text: "Today, Netflix operates over 700 microservices in production, serving more than 260 million subscribers across 190 countries. Their architecture is one of the most sophisticated in the world, and their approach to managing dependencies has become the gold standard. But even Netflix will tell you: without clear visibility into your dependency graph, every deployment is a calculated risk." },
      { type: "h2", text: "The API Gateway: Zuul and the Edge Layer" },
      { type: "p", text: "Every request to Netflix passes through Zuul, their API gateway. Zuul is the single entry point to Netflix's backend, handling authentication, routing, load shedding, and request transformation. It processes billions of API requests per day and routes them to the appropriate backend services. Zuul itself is a critical dependency -- if Zuul goes down, everything goes down. Netflix has invested heavily in making Zuul resilient, running it across multiple AWS regions with automatic failover." },
      { type: "p", text: "Behind Zuul sits the service mesh -- a network of interconnected microservices that communicate via Netflix's custom IPC (Inter-Process Communication) library. Each service registers itself with Eureka, Netflix's service discovery system. When Service A needs to call Service B, it queries Eureka for healthy instances of Service B, then uses Ribbon (Netflix's client-side load balancer) to distribute requests across those instances. This combination of service discovery and client-side load balancing means that services can scale independently and handle instance failures gracefully." },
      { type: "h2", text: "Circuit Breakers: Hystrix and Resilience" },
      { type: "p", text: "Netflix's most influential contribution to distributed systems engineering is arguably Hystrix, their circuit breaker library. The concept is simple but powerful: if a downstream dependency starts failing or responding slowly, stop sending it traffic before the failure cascades upstream." },
      { type: "p", text: "Consider this scenario. The User Profile Service depends on the Viewing History Service. The Viewing History Service depends on a Cassandra database cluster. If that Cassandra cluster starts experiencing high latency due to a compaction storm, the Viewing History Service's response times increase from 50ms to 5 seconds. Without circuit breakers, the User Profile Service's thread pool fills up with requests waiting for Viewing History responses. Its response times spike. The API Gateway's thread pool fills up with requests waiting for User Profile responses. Within minutes, the entire platform is unresponsive -- all because of a single database's performance degradation." },
      { type: "p", text: "Hystrix breaks this cascade by monitoring the error rate and latency of each dependency call. When a dependency exceeds its configured threshold, the circuit \"opens\" and all subsequent requests immediately return a fallback response instead of waiting. The circuit periodically allows a test request through to check if the dependency has recovered, and closes again when it has. This simple pattern prevents the kind of cascading failure that took Netflix down in 2012." },
      { type: "h2", text: "Chaos Engineering: Testing Dependencies in Production" },
      { type: "p", text: "Netflix does not just build resilient systems -- they actively test that resilience by breaking things in production. Chaos Monkey randomly terminates production instances. Chaos Kong simulates the failure of an entire AWS region. Latency Monkey injects artificial delays into service-to-service communication. These tools are part of Netflix's Simian Army, and their purpose is to ensure that dependency failures are handled gracefully." },
      { type: "p", text: "But here is the key insight: chaos engineering is only effective when you understand your dependency graph. If you do not know that Service A depends on Service B, which depends on Service C, you cannot predict what will happen when you kill Service C. You cannot write meaningful chaos experiments. You cannot validate that your circuit breakers are configured correctly. Dependency mapping is the prerequisite for effective chaos engineering." },
      { type: "h2", text: "How a Single Service Failure Cascades" },
      { type: "p", text: "Let us trace a real-world failure scenario through Netflix's dependency chain:" },
      { type: "list", items: [
        "A Cassandra node fails in the Viewing History cluster, increasing read latency by 10x.",
        "The Viewing History Service's P99 latency jumps from 50ms to 500ms. Hystrix circuit breakers start opening.",
        "The Personalization Service, which depends on Viewing History for recommendation input, starts returning degraded (cached) recommendations.",
        "The API Aggregation layer, which assembles the Netflix homepage, receives slower responses from Personalization. Page load times increase.",
        "Zuul starts seeing increased connection counts as slower responses consume more connections for longer.",
        "If not mitigated, Zuul's connection pool could saturate, affecting ALL services -- including unrelated ones like Search and Payments.",
      ]},
      { type: "p", text: "This is the anatomy of a cascading failure. Each hop in the dependency chain amplifies the impact. What started as a single database node failure could theoretically affect every Netflix user worldwide. The only way to understand, predict, and prevent this cascade is to have a clear map of every dependency in the chain." },
      { type: "h2", text: "Netflix's Core Dependency Chain" },
      { type: "nodes", nodes: [
        { label: "Zuul (API Gateway)", type: "System", color: "#3b82f6" },
        { label: "Eureka (Discovery)", type: "System", color: "#3b82f6" },
        { label: "User Profile", type: "API", color: "#06b6d4" },
        { label: "Viewing History", type: "API", color: "#06b6d4" },
        { label: "Personalization", type: "Process", color: "#22c55e" },
        { label: "Content Catalog", type: "API", color: "#06b6d4" },
        { label: "Cassandra Cluster", type: "Database", color: "#8b5cf6" },
        { label: "EVCache", type: "Cache", color: "#ef4444" },
        { label: "Chaos Monkey", type: "Process", color: "#22c55e" },
        { label: "Hystrix", type: "System", color: "#3b82f6" },
      ]},
      { type: "h2", text: "Visual Dependency Mapping as Prevention" },
      { type: "p", text: "Netflix's engineering team did not arrive at their current level of resilience overnight. It took years of incidents, postmortems, and tooling investment. But the foundation of all of it -- circuit breakers, chaos engineering, graceful degradation -- is a deep understanding of the dependency graph." },
      { type: "p", text: "For most organizations, building Netflix-grade internal tooling is not feasible. But the principle is universal: you cannot protect against failures you cannot see. A visual dependency map gives every team -- from a 5-person startup to a 500-person engineering org -- the ability to trace dependency chains, identify single points of failure, plan circuit breaker placement, and predict blast radius before incidents happen." },
      { type: "p", text: "SwayMaps lets you build these dependency maps in minutes, not months. Map your services, draw the connections, annotate with health status and ownership, and share with your team. The next time someone asks \"what happens if this service goes down?\", you will have an answer." },
    ],
  },
  {
    slug: "soc2-compliance-visual-mapping-guide",
    title: "SOC2 Compliance Made Visual: Map Your Data Flows in Under an Hour",
    category: "Compliance",
    date: "March 5, 2026",
    readTime: "8 min read",
    author: "SwayMaps Team",
    excerpt: "SOC2 auditors need to see how data flows through your system. Here is a practical guide to creating audit-ready data flow diagrams that satisfy SOC2 requirements using visual dependency maps.",
    content: [
      { type: "p", text: "SOC2 compliance has become table stakes for any SaaS company selling to enterprises. If you are a B2B software company, your prospects' security teams are going to ask for your SOC2 report before they sign a contract. And one of the most time-consuming parts of SOC2 preparation is documenting your data flows -- showing auditors exactly how customer data enters your system, where it is processed, where it is stored, and how it is protected at each stage." },
      { type: "p", text: "Most teams approach this with Lucidchart or draw.io, spending days creating static diagrams that become outdated within weeks. There is a better way. By using a dependency mapping tool purpose-built for system architecture, you can create audit-ready data flow maps in under an hour -- and keep them up to date as your system evolves." },
      { type: "h2", text: "What SOC2 Requires for Data Flow Documentation" },
      { type: "p", text: "SOC2 is organized around five Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. For most SaaS companies pursuing SOC2 Type II, the Security and Confidentiality criteria require detailed documentation of how data flows through the system." },
      { type: "p", text: "Specifically, auditors want to see: (1) Data ingestion points -- how does customer data enter your system? APIs, file uploads, webhooks, manual entry? (2) Processing stages -- what services touch the data, and what do they do with it? (3) Storage locations -- where is data at rest, and how is it encrypted? (4) Data transmission -- how does data move between services, and is it encrypted in transit? (5) Access controls -- who and what can access the data at each stage? (6) Third-party integrations -- does data leave your system, and to where?" },
      { type: "p", text: "A well-constructed data flow diagram answers all of these questions visually. Auditors are not code reviewers -- they need to understand your system architecture at a conceptual level, and diagrams are the most effective way to communicate that." },
      { type: "h2", text: "Step-by-Step: Mapping Your Data Flows" },
      { type: "h3", text: "Step 1: Identify Your Data Entry Points" },
      { type: "p", text: "Start by mapping every way customer data enters your system. Common entry points include your public API, web application forms, file upload endpoints, webhook receivers, email ingestion, and third-party OAuth integrations. Create a node for each entry point, using the Person node type for human actors (end users, administrators) and the API node type for programmatic entry points." },
      { type: "h3", text: "Step 2: Map Your Processing Services" },
      { type: "p", text: "Next, add nodes for every service that processes customer data. This includes your API servers, background job processors, data transformation pipelines, and any service that reads, writes, or transforms customer data. Use the Process node type for these. Be thorough -- auditors will ask about services you forgot to include." },
      { type: "h3", text: "Step 3: Add Your Data Stores" },
      { type: "p", text: "Add nodes for every location where customer data is stored at rest. This includes your primary database, cache layers (Redis, Memcached), search indices (Elasticsearch), file storage (S3), data warehouses, and backup systems. Use the Database node type and annotate each node with the encryption method used (AES-256, at-rest encryption, etc.)." },
      { type: "h3", text: "Step 4: Draw the Connections" },
      { type: "p", text: "Connect the nodes with edges that represent data flow. Label each edge with the protocol used (HTTPS, gRPC, TLS 1.3) and the type of data that flows through it. This is where the visual map becomes powerful -- you can immediately see if any data path is missing encryption or if data flows through an unexpected service." },
      { type: "h3", text: "Step 5: Annotate with Access Controls" },
      { type: "p", text: "For each node, add notes about who has access. Which IAM roles can access the database? Which services have credentials to the cache layer? Is access logged and auditable? These annotations turn a simple architecture diagram into an audit-ready compliance document." },
      { type: "h2", text: "Example: An 8-Node Compliance Map" },
      { type: "p", text: "Here is a typical data flow map for a SaaS application's SOC2 compliance documentation:" },
      { type: "nodes", nodes: [
        { label: "End User", type: "Person", color: "#ec4899" },
        { label: "API Gateway", type: "System", color: "#3b82f6" },
        { label: "Auth Service", type: "API", color: "#06b6d4" },
        { label: "App Server", type: "Process", color: "#22c55e" },
        { label: "PostgreSQL (AES-256)", type: "Database", color: "#8b5cf6" },
        { label: "Redis Cache", type: "Cache", color: "#ef4444" },
        { label: "S3 (SSE-S3)", type: "Database", color: "#8b5cf6" },
        { label: "Stripe (PCI DSS)", type: "Vendor", color: "#f59e0b" },
      ]},
      { type: "p", text: "In this example, the End User connects to the API Gateway via HTTPS/TLS 1.3. The API Gateway authenticates via the Auth Service and routes to the App Server. The App Server reads and writes to PostgreSQL (encrypted at rest with AES-256) and Redis Cache (in-memory, VPC-only access). File uploads go to S3 with server-side encryption. Payment data is tokenized and sent directly to Stripe, a PCI DSS-compliant payment processor -- your servers never store card numbers." },
      { type: "h2", text: "How Auditors Benefit from Visual Maps" },
      { type: "p", text: "Auditors review dozens of SOC2 reports every month. They appreciate clear, visual documentation for several reasons. First, it dramatically reduces the number of follow-up questions. A well-labeled data flow diagram preemptively answers questions about encryption, access controls, and third-party data sharing. Second, it makes the audit faster. Instead of reading through pages of written descriptions, the auditor can trace data flows visually and focus their testing on specific controls. Third, it builds confidence. A company that can produce a clear, accurate architecture diagram demonstrates a level of operational maturity that correlates with strong controls." },
      { type: "p", text: "Several SwayMaps users have reported that their SOC2 audit time was cut by 30-40% after switching from static documents to interactive visual maps. Auditors could explore the map, click on nodes to see annotations, and trace specific data flows without requesting additional documentation." },
      { type: "h2", text: "Getting Started" },
      { type: "p", text: "SwayMaps includes a SOC2 Data Flow template that gives you a pre-built starting point with common node types and suggested annotations. Open the template, customize it to match your architecture, and you will have an audit-ready data flow diagram in under an hour. You can export it as a PDF for your SOC2 evidence package or share a live link with your auditor for an interactive review." },
      { type: "p", text: "Your SOC2 audit does not have to be a months-long documentation ordeal. With the right tooling, you can create clear, accurate, and maintainable data flow documentation that auditors love and your engineering team actually keeps up to date." },
    ],
  },
  {
    slug: "onboarding-engineers-faster-visual-maps",
    title: "From 6-Month Onboarding to 2 Weeks: The Power of Visual Dependency Maps",
    category: "Best Practices",
    date: "February 25, 2026",
    readTime: "7 min read",
    author: "SwayMaps Team",
    excerpt: "New engineers spend months building a mental model of your system architecture. Visual dependency maps can compress that timeline from months to weeks by making tribal knowledge explicit and explorable.",
    content: [
      { type: "p", text: "There is a pattern that plays out at nearly every growing engineering organization. A new engineer joins the team, bright and motivated. They are handed a laptop, pointed to a Confluence wiki with 200 pages of documentation (half of it outdated), and told to \"just ask if you have questions.\" Three months later, they are still discovering services they did not know existed. Six months in, they finally feel confident enough to make changes to core systems without hand-holding. The organization has spent tens of thousands of dollars in lost productivity, and the new engineer has spent months in a state of low confidence and high frustration." },
      { type: "p", text: "This is the onboarding tax, and it scales with the complexity of your system. A company with 10 microservices might onboard engineers in a few weeks. A company with 100 services might take months. A company with 500+ services? It can take a year before a new engineer has a complete mental model of the system. And by the time they do, the system has changed." },
      { type: "h2", text: "Why Written Documentation Fails" },
      { type: "p", text: "The instinct to solve this with documentation is understandable but flawed. Written documentation -- wikis, READMEs, architecture decision records -- has three fundamental problems when it comes to system architecture." },
      { type: "p", text: "First, it rots. Architecture documentation is outdated the moment it is written. Services are added, dependencies change, databases are migrated, and nobody updates the wiki. A study by Stripe found that developers spend 42% of their time dealing with technical debt and maintenance, and outdated documentation is a significant contributor." },
      { type: "p", text: "Second, it is linear. A wiki page describes a system in sequential paragraphs, but system architecture is inherently a graph. You cannot understand a distributed system by reading about it one service at a time -- you need to see how the services connect. Reading documentation about microservices is like reading a description of a city map instead of looking at the map itself." },
      { type: "p", text: "Third, it is passive. Reading documentation is a passive activity. The new engineer reads about the billing service, nods, and moves on. Two days later, they cannot remember which database the billing service uses or which services depend on it. There is no way to explore, trace paths, or ask \"what if\" questions." },
      { type: "h2", text: "How Visual Maps Replace Documentation" },
      { type: "p", text: "A visual dependency map solves all three of these problems. It is a living, interactive representation of your system architecture that engineers can explore, annotate, and update collaboratively." },
      { type: "p", text: "Unlike a wiki, a visual map is inherently graph-structured -- it shows relationships between services, not just descriptions of individual services. A new engineer can click on the User Service, see that it depends on PostgreSQL, Redis, and the Auth Service, and trace those dependencies further. In five minutes of exploring a visual map, they gain more architectural understanding than in an hour of reading documentation." },
      { type: "p", text: "Visual maps are also active, not passive. Instead of reading about the system, the new engineer explores it. They can trace a request from the API Gateway through to the database. They can ask \"what happens if the Payment Service goes down?\" and visually trace the blast radius. This active exploration creates stronger mental models than passive reading." },
      { type: "h2", text: "What to Map First" },
      { type: "p", text: "If you are starting from scratch, here are the three maps that deliver the most value for onboarding:" },
      { type: "h3", text: "1. Team Ownership Map" },
      { type: "p", text: "Create a map where each node is a service or system, color-coded by the team that owns it. This immediately answers the most common new-engineer question: \"who do I ask about this?\" When an engineer encounters an unfamiliar service in a log or error message, they can look it up on the ownership map and know exactly which team to contact." },
      { type: "h3", text: "2. Service Dependency Map" },
      { type: "p", text: "The core dependency graph of your system. Every service as a node, every dependency as an edge. Label edges with the protocol (REST, gRPC, async/event) and annotate nodes with their primary technology (Python, Go, Java) and data store. This is the map that new engineers will reference most frequently during their first months." },
      { type: "h3", text: "3. Data Flow Map" },
      { type: "p", text: "A specialized view that traces how data moves through the system -- from user input to storage to processing to output. This is especially valuable for engineers working on features that touch multiple services, as it shows the full lifecycle of a piece of data." },
      { type: "h2", text: "Real Impact: Months to Weeks" },
      { type: "p", text: "The impact of visual onboarding maps is not theoretical. Companies that have adopted visual dependency mapping for onboarding consistently report dramatic improvements in ramp-up time." },
      { type: "list", items: [
        "A fintech company with 80 microservices reduced new engineer ramp-up from 4 months to 3 weeks after creating comprehensive dependency maps that new hires explored during their first week.",
        "A healthcare SaaS platform cut onboarding-related questions in Slack by 60% after publishing an interactive system map that engineers could self-serve from.",
        "A 200-person engineering org found that engineers who onboarded with visual maps were shipping production code 2.5x faster in their first quarter compared to those who onboarded with documentation alone.",
        "An e-commerce platform reduced the number of \"wrong team\" support escalations by 45% after creating a team ownership map that customer support and engineering both used.",
      ]},
      { type: "h2", text: "Building Your Onboarding Knowledge Graph" },
      { type: "p", text: "Here is a practical approach to creating onboarding maps with SwayMaps. Start with your team ownership map -- list every service and assign a team owner. This takes 30 minutes with the right people in the room. Next, add dependencies between services. Do this incrementally -- start with the services your team owns and expand outward. Finally, annotate with context: what does each service do (one sentence), what technology is it built on, and what are its critical dependencies?" },
      { type: "p", text: "Share the map with your next new hire and ask them to explore it on their first day. Watch how they navigate it. Where do they get confused? What is missing? Their fresh eyes will reveal gaps in your map that long-tenured engineers have become blind to. Update the map based on their feedback, and it will be even better for the next new hire." },
      { type: "p", text: "The best documentation is not written -- it is drawn. Visual dependency maps turn tribal knowledge into shared knowledge, and shared knowledge is the foundation of fast, confident onboarding." },
    ],
  },
  {
    slug: "diagram-as-code-yaml-dsl-guide",
    title: "Diagram as Code: Why Your Architecture Maps Belong in Git",
    category: "Product Updates",
    date: "February 18, 2026",
    readTime: "6 min read",
    author: "SwayMaps Team",
    excerpt: "Architecture diagrams created in GUI tools rot because they live outside your development workflow. SwayMaps' YAML DSL lets you define, version, and review architecture maps alongside your code.",
    content: [
      { type: "p", text: "There is a dirty secret in software engineering: the architecture diagram on your team's wiki is wrong. It was accurate for about two weeks after someone spent an afternoon creating it in Lucidchart. Then a service was added, a database was migrated, an API was deprecated, and nobody updated the diagram. Six months later, it is a historical artifact that actively misleads anyone who references it." },
      { type: "p", text: "This happens because traditional architecture diagrams live outside the development workflow. They are created in GUI tools that engineers do not interact with daily. They are stored in wikis that are separate from the codebase. They are not part of the pull request process, so changes to the system's architecture are never reflected in the diagram as part of the same workflow. The diagram and the code drift apart, and eventually the diagram becomes fiction." },
      { type: "h2", text: "The Diagram-as-Code Philosophy" },
      { type: "p", text: "Diagram-as-code solves this by treating architecture diagrams as code artifacts. Instead of drawing boxes and arrows in a GUI, you define your architecture in a declarative configuration file -- YAML, HCL, Python, or a custom DSL. This file lives in your repository, is version-controlled with Git, and can be reviewed in pull requests alongside the code changes that modify the architecture." },
      { type: "p", text: "The benefits are significant. Version history: you can see how your architecture has evolved over time with git log. Review process: architecture changes are reviewed in PRs, not silently made in a drawing tool. Automation: you can generate diagrams in CI/CD, validate them against live infrastructure, and detect drift. Reproducibility: anyone can regenerate the diagram from the source file, eliminating \"but it looks different on my machine\" issues." },
      { type: "h2", text: "SwayMaps YAML DSL" },
      { type: "p", text: "SwayMaps now supports a YAML DSL that lets you define your architecture maps declaratively. The DSL is designed to be readable, minimal, and expressive enough to capture the full richness of a SwayMaps dependency map -- nodes with types and metadata, edges with labels and styles, and layout hints." },
      { type: "p", text: "Here is an example of a 5-node map defined in the SwayMaps YAML DSL:" },
      { type: "code", code: `# swaymaps.yaml — E-commerce Platform
name: E-Commerce Platform
description: Core service architecture

nodes:
  - id: api-gateway
    label: API Gateway
    type: system
    position: [0, 0]
    notes: "Kong Gateway, rate-limited to 10k req/s"

  - id: user-service
    label: User Service
    type: api
    position: [200, 100]
    notes: "Go, gRPC, owns auth and profiles"

  - id: order-service
    label: Order Service
    type: api
    position: [200, 250]
    notes: "Python, REST, saga pattern for transactions"

  - id: postgres
    label: PostgreSQL
    type: database
    position: [450, 100]
    notes: "RDS, encrypted at rest, daily backups"

  - id: redis
    label: Redis Cache
    type: cache
    position: [450, 250]
    notes: "ElastiCache, session store + rate limiting"

edges:
  - from: api-gateway
    to: user-service
    label: "gRPC / TLS"

  - from: api-gateway
    to: order-service
    label: "REST / HTTPS"

  - from: user-service
    to: postgres
    label: "SQL / TLS"

  - from: order-service
    to: postgres
    label: "SQL / TLS"

  - from: order-service
    to: redis
    label: "Redis protocol / VPC"` },
      { type: "h2", text: "The Workflow: YAML to Canvas to PR" },
      { type: "p", text: "The diagram-as-code workflow with SwayMaps works like this:" },
      { type: "list", items: [
        "Define: Create a swaymaps.yaml file in your repository that describes your architecture. Use the DSL reference in our docs for the full syntax.",
        "Apply: Run `swaymaps apply swaymaps.yaml` or use the SwayMaps web UI to import the YAML. The canvas renders your map with the specified nodes, edges, and layout.",
        "Edit visually (optional): Use the SwayMaps canvas to refine positions, add annotations, or explore the map interactively. Export back to YAML when done.",
        "Commit and review: When an engineer adds a new service or changes a dependency, they update the YAML file and open a PR. Reviewers can see exactly what changed in the architecture -- a new node, a removed edge, a changed label -- right in the diff.",
        "CI validation: Add a SwayMaps validation step to your CI pipeline to ensure the YAML is well-formed, all referenced node IDs exist, and no orphan nodes are present.",
      ]},
      { type: "h2", text: "Version Control Benefits" },
      { type: "p", text: "When your architecture diagrams live in Git, you gain capabilities that are impossible with GUI-only tools." },
      { type: "p", text: "Git blame tells you who changed the architecture and when. If a dependency was added six months ago and is now causing issues, you can trace it back to the exact PR, the engineer who added it, and the context around why it was added. This is invaluable during incident response and architecture reviews." },
      { type: "p", text: "Branch-based workflows let teams propose architecture changes before implementing them. An engineer can create a branch, modify the YAML to add a new service and its dependencies, and open a PR for discussion. The team can review the architectural change on a visual map before a single line of application code is written. This shifts architecture discussions left, catching design issues early." },
      { type: "p", text: "Diff-based reviews make architecture changes reviewable. Instead of someone silently adding a new database to a diagram in Lucidchart, the change shows up as a diff in a PR. Your team can comment on it, request changes, and approve it -- just like code. This brings the same rigor to architecture changes that you already apply to code changes." },
      { type: "h2", text: "Getting Started" },
      { type: "p", text: "To start using diagram-as-code with SwayMaps, create a swaymaps.yaml file in your repository's root directory. Define your services as nodes and your dependencies as edges. Push to your branch and import the file into SwayMaps. From there, you can refine the visual layout and export back to YAML whenever the canonical source needs updating." },
      { type: "p", text: "Your architecture is too important to live in a drawing tool that nobody opens. Put it in Git, review it in PRs, and treat it with the same rigor you apply to your code. Because your architecture is code -- it just has not been represented that way until now." },
    ],
  },
];

/* ---- BLOG POST PAGE ---- */
export default function BlogPostPage({ params: _params }: { params: { slug: string } }) {
  const params = useParams();
  const slug = (params?.slug ?? _params?.slug) as string;
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="lp-root">
        <div className="lp-bg">
          <div className="lp-orb lp-orb--1" />
          <div className="lp-orb lp-orb--2" />
        </div>
        <nav className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
          <div className="lp-nav-inner">
            <Link href="/" className="lp-nav-logo">
              <span className="lp-nav-logo-icon"><Logo size={20} /></span>
              SwayMaps
            </Link>
            <div className="lp-nav-ctas">
              <Link href="/blog" className="lp-btn lp-btn--ghost">Back to Blog</Link>
            </div>
          </div>
        </nav>
        <section className="lp-section" style={{ textAlign: "center", paddingTop: 160 }}>
          <div className="lp-container">
            <h1 className="lp-section-title">Post not found</h1>
            <p className="lp-section-subtitle">The article you are looking for does not exist.</p>
            <Link href="/blog" className="lp-btn lp-btn--primary" style={{ marginTop: 32 }}>
              Browse all articles <IconArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const catColor = categoryColors[post.category] || "#00c2ff";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lp-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "datePublished": post.date,
        "author": { "@type": "Organization", "name": post.author },
        "publisher": { "@type": "Organization", "name": "SwayMaps", "url": "https://swaymaps.com" },
        "url": `https://swaymaps.com/blog/${post.slug}`,
      }) }} />

      {/* BACKGROUND */}
      <div className="lp-bg">
        <div className="lp-orb lp-orb--1" />
        <div className="lp-orb lp-orb--2" />
        <div className="lp-orb lp-orb--3" />
      </div>

      {/* NAVBAR */}
      <nav className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-nav-logo">
            <span className="lp-nav-logo-icon"><Logo size={20} /></span>
            SwayMaps
          </Link>
          <ul className="lp-nav-links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/use-cases">Use Cases</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/docs">Docs</Link></li>
          </ul>
          <div className="lp-nav-ctas">
            <Link href="/auth/signin" className="lp-btn lp-btn--ghost">Sign In</Link>
            <Link href="/auth/signup" className="lp-btn lp-btn--primary">
              Get Started <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ARTICLE HEADER */}
      <section className="lp-section" style={{ paddingBottom: 0 }}>
        <div className="lp-container" style={{ maxWidth: 780 }}>
          <Reveal>
            <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "var(--t3)", textDecoration: "none", marginBottom: 32, transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--t3)"; }}
            >
              &larr; Back to Blog
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{
                padding: "4px 14px",
                borderRadius: 6,
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                background: `${catColor}15`,
                color: catColor,
              }}>
                {post.category}
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--t1)",
              marginBottom: 24,
            }}>
              {post.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700, color: "#fff",
                }}>
                  SM
                </div>
                <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--t1)" }}>
                  {post.author}
                </span>
              </div>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border2)" }} />
              <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                {post.date}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border2)" }} />
              <span style={{ fontSize: "0.82rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                {post.readTime}
              </span>
            </div>

            <div style={{ width: "100%", height: 1, background: "var(--border)", marginBottom: 48 }} />
          </Reveal>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section style={{ paddingTop: 0, paddingBottom: 60, position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ maxWidth: 780 }}>
          <Reveal>
            <article>
              {post.content.map((block, i) => {
                if (block.type === "p") {
                  return (
                    <p key={i} style={{
                      fontSize: "1.05rem",
                      color: "var(--t2)",
                      lineHeight: 1.8,
                      marginBottom: 24,
                    }}>
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "h2") {
                  return (
                    <h2 key={i} style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "var(--t1)",
                      letterSpacing: "-0.02em",
                      marginTop: 48,
                      marginBottom: 20,
                    }}>
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "h3") {
                  return (
                    <h3 key={i} style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--t1)",
                      letterSpacing: "-0.01em",
                      marginTop: 32,
                      marginBottom: 14,
                    }}>
                      {block.text}
                    </h3>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} style={{
                      margin: "16px 0 28px 0",
                      padding: "0 0 0 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}>
                      {block.items.map((item, j) => (
                        <li key={j} style={{
                          fontSize: "1rem",
                          color: "var(--t2)",
                          lineHeight: 1.7,
                        }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "nodes") {
                  return (
                    <div key={i} style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      margin: "24px 0 32px 0",
                      padding: 24,
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                    }}>
                      {block.nodes.map((node, j) => (
                        <span key={j} style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 14px",
                          borderRadius: 8,
                          background: `${node.color}12`,
                          border: `1px solid ${node.color}30`,
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: node.color,
                          fontFamily: "var(--font-mono)",
                          whiteSpace: "nowrap",
                        }}>
                          <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: node.color,
                            flexShrink: 0,
                          }} />
                          {node.label}
                          <span style={{
                            fontSize: "0.65rem",
                            fontWeight: 500,
                            color: `${node.color}99`,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}>
                            {node.type}
                          </span>
                        </span>
                      ))}
                    </div>
                  );
                }
                if (block.type === "code") {
                  return (
                    <pre key={i} style={{
                      margin: "24px 0 32px 0",
                      padding: 24,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      overflowX: "auto",
                      fontSize: "0.82rem",
                      lineHeight: 1.7,
                      fontFamily: "var(--font-mono)",
                      color: "var(--t2)",
                    }}>
                      <code>{block.code}</code>
                    </pre>
                  );
                }
                return null;
              })}
            </article>
          </Reveal>
        </div>
      </section>

      {/* SHARE SECTION */}
      <section style={{ paddingTop: 0, paddingBottom: 60, position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ maxWidth: 780 }}>
          <Reveal>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "28px 32px",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              flexWrap: "wrap",
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>
                  Share this article
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--t3)" }}>
                  Help others discover this content
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://swaymaps.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 40, height: 40, borderRadius: 10,
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    color: "var(--t2)", textDecoration: "none",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLElement).style.color = "var(--t1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--t2)"; }}
                >
                  <IconTwitter />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://swaymaps.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 40, height: 40, borderRadius: 10,
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    color: "var(--t2)", textDecoration: "none",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLElement).style.color = "var(--t1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--t2)"; }}
                >
                  <IconLinkedIn />
                </a>
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 40, height: 40, borderRadius: 10,
                    background: copied ? "var(--accent)" : "var(--bg2)",
                    border: `1px solid ${copied ? "var(--accent)" : "var(--border)"}`,
                    color: copied ? "#070b14" : "var(--t2)",
                    cursor: "pointer",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => { if (!copied) { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLElement).style.color = "var(--t1)"; } }}
                  onMouseLeave={(e) => { if (!copied) { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--t2)"; } }}
                  title={copied ? "Link copied!" : "Copy link"}
                >
                  {copied ? <IconShare /> : <IconCopy />}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RELATED POSTS */}
      <section style={{ paddingTop: 0, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ maxWidth: 1000 }}>
          <Reveal>
            <h2 style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--t1)",
              letterSpacing: "-0.02em",
              marginBottom: 32,
              textAlign: "center",
            }}>
              Related articles
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}>
              {relatedPosts.map((rp, i) => {
                const rpColor = categoryColors[rp.category] || "#00c2ff";
                return (
                  <Link
                    key={i}
                    href={`/blog/${rp.slug}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: "24px 22px",
                      textDecoration: "none",
                      transition: "all 0.25s var(--ease)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <span style={{
                      alignSelf: "flex-start",
                      padding: "3px 10px",
                      borderRadius: 6,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: `${rpColor}15`,
                      color: rpColor,
                      marginBottom: 14,
                    }}>
                      {rp.category}
                    </span>
                    <h3 style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--t1)",
                      lineHeight: 1.3,
                      marginBottom: 10,
                    }}>
                      {rp.title}
                    </h3>
                    <p style={{
                      fontSize: "0.82rem",
                      color: "var(--t2)",
                      lineHeight: 1.6,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                      marginBottom: 16,
                    }}>
                      {rp.excerpt}
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderTop: "1px solid var(--border)",
                      paddingTop: 14,
                    }}>
                      <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                        {rp.readTime}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: 0, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ maxWidth: 700 }}>
          <Reveal>
            <div style={{
              textAlign: "center",
              padding: "56px 40px",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, var(--accent), #6366f1, #ec4899)",
              }} />

              <h2 style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                color: "var(--t1)",
                letterSpacing: "-0.025em",
                marginBottom: 16,
              }}>
                Map your architecture today
              </h2>
              <p style={{
                fontSize: "1rem",
                color: "var(--t2)",
                lineHeight: 1.7,
                maxWidth: 480,
                margin: "0 auto 32px auto",
              }}>
                Start visualizing your system dependencies in minutes. Free plan available, no credit card required.
              </p>
              <Link href="/auth/signup" className="lp-btn lp-btn--primary" style={{ fontSize: "0.95rem", padding: "14px 32px" }}>
                Get Started Free <IconArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-footer-brand-logo">
                <span className="lp-nav-logo-icon"><Logo size={20} /></span>
                SwayMaps
              </Link>
              <p className="lp-footer-brand-desc">
                The visual planning and dependency mapping platform for every team.
              </p>
            </div>
            <div>
              <div className="lp-footer-col-title">Product</div>
              <ul className="lp-footer-links">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/templates-gallery">Templates</Link></li>
                <li><Link href="/changelog">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <div className="lp-footer-col-title">Resources</div>
              <ul className="lp-footer-links">
                <li><Link href="/docs">Docs</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/use-cases">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <div className="lp-footer-col-title">Company</div>
              <ul className="lp-footer-links">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="lp-footer-col-title">Legal</div>
              <ul className="lp-footer-links">
                <li><Link href="/legal/terms">Terms</Link></li>
                <li><Link href="/legal/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span className="lp-footer-copy">&copy; 2026 SwayMaps. All rights reserved.</span>
            <div className="lp-footer-socials">
              <a href="https://twitter.com/swaymaps" target="_blank" rel="noopener noreferrer"><IconTwitter /></a>
              <a href="https://github.com/swaymaps" target="_blank" rel="noopener noreferrer"><IconGitHub /></a>
              <a href="https://linkedin.com/company/swaymaps" target="_blank" rel="noopener noreferrer"><IconLinkedIn /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
