"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { MAP_TYPES, type MapTypeId } from "@/lib/mapTypes";
import { toast } from "@/components/ui/Toast";

interface CreateMapDialogProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string | null;
  folderId?: string | null;
  defaultName?: string;
  onCreated: (map: { id: string; name: string; mapType: MapTypeId }) => void;
}

export function CreateMapDialog({
  open,
  onClose,
  workspaceId,
  folderId,
  defaultName,
  onCreated,
}: CreateMapDialogProps) {
  const [step, setStep] = React.useState<"pick" | "name">("pick");
  const [type, setType] = React.useState<MapTypeId>("DEPENDENCY");
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setStep("pick");
    setType("DEPENDENCY");
    setName(defaultName ?? "");
    setSubmitting(false);
  }, [open, defaultName]);

  const onPick = (id: MapTypeId) => {
    setType(id);
    const def = MAP_TYPES.find((t) => t.id === id);
    if (!name && def) setName(`Untitled ${def.shortLabel.toLowerCase()}`);
    setStep("name");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mapType: type,
          workspaceId,
          folderId: folderId ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to create map");
        return;
      }
      const data = await res.json();
      onCreated({
        id: data.id ?? data.map?.id,
        name: data.name ?? data.map?.name ?? name.trim(),
        mapType: type,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {step === "pick" ? "Choose a format" : "Name your map"}
          </DialogTitle>
          <DialogDescription>
            {step === "pick"
              ? "Pick the right shape for what you're trying to model. You can convert later."
              : `Creating a new ${MAP_TYPES.find((t) => t.id === type)?.label.toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>

        {step === "pick" ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {MAP_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onPick(t.id)}
                className={cn(
                  "flex flex-col items-start text-left gap-2 rounded-md border p-4 transition-colors",
                  "border-border bg-panel hover:border-fg hover:bg-bg-muted"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-bg-muted text-fg">
                  <t.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-fg">{t.label}</h3>
                <p className="text-xs text-fg-muted leading-relaxed">{t.blurb}</p>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="map-name">Name</Label>
              <Input
                id="map-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
                className="mt-1.5"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("pick")}>
                Back
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
