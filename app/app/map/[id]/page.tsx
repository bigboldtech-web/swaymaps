"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { WhiteboardEditor } from "@/components/editors/whiteboard/WhiteboardEditor";
import { MindMapEditor } from "@/components/editors/mindmap/MindMapEditor";
import { FlowchartEditor } from "@/components/editors/flowchart/FlowchartEditor";
import { OrgChartEditor } from "@/components/editors/orgchart/OrgChartEditor";
import { ProductFlowEditor } from "@/components/editors/productflow/ProductFlowEditor";
import { KanbanEditor } from "@/components/editors/kanban/KanbanEditor";

interface MapPayload {
  id: string;
  name: string;
  mapType: string;
  state: any;
}

export default function MapRouterPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: session, status } = useSession();
  const [data, setData] = React.useState<MapPayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id || status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    let cancelled = false;
    fetch(`/api/maps/${id}/canvas`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error ?? "Failed to load map");
        }
        return r.json();
      })
      .then((d) => {
        if (cancelled) return;
        setData(d);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load map");
      });
    return () => {
      cancelled = true;
    };
  }, [id, session, status, router]);

  if (status === "loading" || (!data && !error)) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-fg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-md text-fg">{error}</p>
          <button
            type="button"
            className="mt-3 text-sm text-accent hover:text-accent-hover"
            onClick={() => router.push("/app")}
          >
            Back to maps
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const goBack = () => router.push("/app");

  switch (data.mapType) {
    case "WHITEBOARD":
      return (
        <WhiteboardEditor
          mapId={data.id}
          initialName={data.name}
          initialState={data.state ?? null}
          onBack={goBack}
        />
      );
    case "MINDMAP":
      return (
        <MindMapEditor
          mapId={data.id}
          initialName={data.name}
          initialState={data.state ?? null}
          onBack={goBack}
        />
      );
    case "FLOWCHART":
      return (
        <FlowchartEditor
          mapId={data.id}
          initialName={data.name}
          initialState={data.state ?? null}
          onBack={goBack}
        />
      );
    case "ORGCHART":
      return (
        <OrgChartEditor
          mapId={data.id}
          initialName={data.name}
          initialState={data.state ?? null}
          onBack={goBack}
        />
      );
    case "PRODUCTFLOW":
      return (
        <ProductFlowEditor
          mapId={data.id}
          initialName={data.name}
          initialState={data.state ?? null}
          onBack={goBack}
        />
      );
    case "KANBAN":
      return (
        <KanbanEditor
          mapId={data.id}
          initialName={data.name}
          initialState={data.state ?? null}
          onBack={goBack}
        />
      );
    case "DEPENDENCY":
    default:
      // Dependency maps use the existing editor at /app with the activeMapId pre-selected.
      router.replace(`/app?map=${data.id}`);
      return null;
  }
}
