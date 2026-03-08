"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

interface EmbedNode {
  id: string;
  kind: string;
  kindLabel: string;
  title: string;
  color: string;
  position: { x: number; y: number };
}

interface EmbedEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export default function EmbedPage({ params }: { params: { token: string } }) {
  const [mapName, setMapName] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public/maps/${params.token}`);
        if (!res.ok) {
          setError("Map not found or not publicly shared.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        const map = data.map;
        setMapName(map.name);

        const flowNodes = (map.nodes || []).map((n: any, idx: number) => ({
          id: n.id,
          type: "default",
          position: n.position ?? { x: (idx % 3) * 280 + 40, y: Math.floor(idx / 3) * 200 + 40 },
          data: { label: n.title },
          style: {
            background: n.color || "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 600,
          },
        }));

        const flowEdges = (map.edges || []).map((e: any) => ({
          id: e.id,
          source: e.sourceId,
          target: e.targetId,
          label: e.label || "",
          type: "smoothstep",
          style: { strokeWidth: 1.5, stroke: "#64748b" },
          labelStyle: { fontSize: 11, fill: "#94a3b8" },
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch {
        setError("Failed to load map.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.token]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#030712", color: "#94a3b8", fontFamily: "system-ui" }}>
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#030712", color: "#f87171", fontFamily: "system-ui" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#030712" }}>
      <div style={{ position: "absolute", top: 12, left: 16, zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", fontFamily: "system-ui" }}>{mapName}</span>
        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "system-ui" }}>Powered by SwayMaps</span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        minZoom={0.3}
        maxZoom={2}
      >
        <Background color="#1e293b" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
