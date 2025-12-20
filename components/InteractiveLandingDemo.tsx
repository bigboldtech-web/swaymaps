"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the actual DecodeMapCanvas to avoid SSR issues
const DecodeMapCanvas = dynamic(
  () => import("./DecodeMapCanvas").then((mod) => mod.default),
  { ssr: false }
);

export function InteractiveLandingDemo() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: string }>({
    "1": "This service handles all user authentication. Critical for production.\n\nRecent updates:\n- Added 2FA support\n- Improved session management\n- Fixed memory leak in token validation",
    "2": "PostgreSQL database cluster. Contains user data, auth tokens, and application state.\n\nMaintenance notes:\n- Weekly backups automated\n- Query optimization needed for user search",
    "3": "End user accessing the system through web or mobile app.\n\nUser flow:\n1. Login request\n2. Auth service validates\n3. Session token returned",
    "4": "Stripe payment processing API. Handles all billing and subscriptions.\n\nSLA: 99.9% uptime\nDocs: stripe.com/docs",
    "5": "Redis cache layer for session management and frequently accessed data.\n\nConfig:\n- TTL: 1 hour\n- Max memory: 2GB"
  });

  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "decodeNode",
      position: { x: 50, y: 80 },
      data: {
        meta: {
          id: "1",
          kind: "system" as const,
          kindLabel: "System",
          title: "Auth Service",
          tags: ["production", "critical"],
          noteId: "note-1",
          color: "#22c55e",
          position: { x: 50, y: 80 }
        },
        onUpdateMeta: () => {}
      }
    },
    {
      id: "2",
      type: "decodeNode",
      position: { x: 320, y: 50 },
      data: {
        meta: {
          id: "2",
          kind: "system" as const,
          kindLabel: "System",
          title: "Database",
          tags: ["production"],
          noteId: "note-2",
          color: "#3b82f6",
          position: { x: 320, y: 50 }
        },
        onUpdateMeta: () => {}
      }
    },
    {
      id: "3",
      type: "decodeNode",
      position: { x: 180, y: 250 },
      data: {
        meta: {
          id: "3",
          kind: "person" as const,
          kindLabel: "Person",
          title: "User",
          tags: [],
          noteId: "note-3",
          color: "#38bdf8",
          position: { x: 180, y: 250 }
        },
        onUpdateMeta: () => {}
      }
    },
    {
      id: "4",
      type: "decodeNode",
      position: { x: 500, y: 180 },
      data: {
        meta: {
          id: "4",
          kind: "process" as const,
          kindLabel: "Process",
          title: "Payment API",
          tags: ["external"],
          noteId: "note-4",
          color: "#fbbf24",
          position: { x: 500, y: 180 }
        },
        onUpdateMeta: () => {}
      }
    },
    {
      id: "5",
      type: "decodeNode",
      position: { x: 320, y: 320 },
      data: {
        meta: {
          id: "5",
          kind: "generic" as const,
          kindLabel: "Generic",
          title: "Cache Layer",
          tags: ["infrastructure"],
          noteId: "note-5",
          color: "#6366f1",
          position: { x: 320, y: 320 }
        },
        onUpdateMeta: () => {}
      }
    }
  ]);

  const [edges, setEdges] = useState([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "smoothstep",
      className: "edge-glow",
      data: {
        meta: {
          id: "e1-2",
          sourceId: "1",
          targetId: "2",
          sourceHandle: null,
          targetHandle: null,
          label: "queries",
          noteId: null,
          edgeType: "smoothstep" as const
        }
      }
    },
    {
      id: "e3-1",
      source: "3",
      target: "1",
      type: "smoothstep",
      className: "edge-glow",
      data: {
        meta: {
          id: "e3-1",
          sourceId: "3",
          targetId: "1",
          sourceHandle: null,
          targetHandle: null,
          label: "authenticates",
          noteId: null,
          edgeType: "smoothstep" as const
        }
      }
    },
    {
      id: "e2-4",
      source: "2",
      target: "4",
      type: "smoothstep",
      className: "edge-glow",
      data: {
        meta: {
          id: "e2-4",
          sourceId: "2",
          targetId: "4",
          sourceHandle: null,
          targetHandle: null,
          label: "processes",
          noteId: null,
          edgeType: "smoothstep" as const
        }
      }
    },
    {
      id: "e2-5",
      source: "2",
      target: "5",
      type: "smoothstep",
      className: "edge-glow",
      data: {
        meta: {
          id: "e2-5",
          sourceId: "2",
          targetId: "5",
          sourceHandle: null,
          targetHandle: null,
          label: "caches",
          noteId: null,
          edgeType: "smoothstep" as const
        }
      }
    }
  ]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-indigo-500/20 blur-2xl"></div>
      <div className="relative rounded-2xl border-2 border-sky-500/30 bg-slate-950 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Try it yourself!</h3>
            <p className="text-sm text-slate-400">Drag nodes, click to select, explore the interface</p>
          </div>
          <div className="rounded-lg bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
            ✨ Live Demo
          </div>
        </div>
        <div className="h-[500px] overflow-hidden rounded-xl border border-slate-800 bg-[#0b1422]">
          <DecodeMapCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              // Handle node changes in a simplified way
              console.log("Nodes changed:", changes);
            }}
            onEdgesChange={(changes) => {
              console.log("Edges changed:", changes);
            }}
            onSelectNode={(meta) => {
              setSelectedNodeId(meta.id);
            }}
            onSelectEdge={(edge) => {
              setSelectedNodeId(null);
            }}
            onClearSelection={() => {
              setSelectedNodeId(null);
            }}
            onConnectEdge={(connection) => console.log("Connected:", connection)}
            onEdgeUpdate={(oldEdge, newConnection) => console.log("Edge updated")}
            onCreateNodeAt={(pos, from) => console.log("Create node at:", pos)}
            focusNodeId={null}
            theme="dark"
            useGradientEdges={true}
            onViewportCenterChange={() => {}}
          />
        </div>

        {/* Scrollable Comment/Notes Section */}
        {selectedNodeId && (
          <div className="mt-3 max-h-[200px] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedNode?.data.meta.color }}
                />
                <h4 className="font-semibold text-slate-100">
                  {selectedNode?.data.meta.title}
                </h4>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {selectedNode?.data.meta.kind}
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {selectedNode?.data.meta.tags && selectedNode.data.meta.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {selectedNode.data.meta.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-xs font-semibold text-slate-400">Notes & Documentation</div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                {comments[selectedNodeId]}
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-500">
              💡 In the full app, you can edit notes, add attachments, and more
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>This is the actual SwayMaps interface</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
            Fully interactive
          </span>
        </div>
      </div>
    </div>
  );
}
