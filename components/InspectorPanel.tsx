"use client";

import React from "react";
import {
  CompanyProcess,
  DecodeNodeData,
  EdgeWithEntities,
  Issue,
  Person,
  ProductFeature,
  SystemTool
} from "../types";
import { Tag } from "./Tag";

interface InspectorPanelProps {
  selectedNode: DecodeNodeData | null;
  selectedEdge: EdgeWithEntities | null;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  entities: DecodeNodeData[];
}

const sectionClass = "space-y-1 rounded-lg border border-slate-700/40 bg-slate-800/30 p-3";
const titleClass = "text-sm font-semibold text-slate-200";
const labelClass = "text-xs uppercase tracking-wide text-slate-500";

const isPerson = (entity: DecodeNodeData): entity is Person =>
  entity.type === "person";
const isFeature = (entity: DecodeNodeData): entity is ProductFeature =>
  entity.type === "feature";
const isProcess = (entity: DecodeNodeData): entity is CompanyProcess =>
  entity.type === "process";
const isSystem = (entity: DecodeNodeData): entity is SystemTool =>
  entity.type === "system";
const isIssue = (entity: DecodeNodeData): entity is Issue =>
  entity.type === "issue";

const toneForSeverity = (severity: Issue["severity"]): Parameters<typeof Tag>[0]["tone"] => {
  switch (severity) {
    case "Critical":
    case "High":
      return "red";
    case "Medium":
      return "yellow";
    default:
      return "slate";
  }
};

const toneForStatus = (status: ProductFeature["status"] | Issue["status"]): Parameters<typeof Tag>[0]["tone"] => {
  if (status === "Live") return "green";
  if (status === "In Progress") return "blue";
  if (status === "On Hold" || status === "Planned" || status === "Idea") return "yellow";
  return "slate";
};

const toneForHealth = (
  health: ProductFeature["health"] | CompanyProcess["health"]
): Parameters<typeof Tag>[0]["tone"] => {
  switch (health) {
    case "Working":
      return "green";
    case "Needs Improvement":
    case "Messy":
      return "yellow";
    case "Broken":
      return "red";
    default:
      return "slate";
  }
};

function getEntityName(entity: DecodeNodeData | undefined): string {
  if (!entity) return "Unknown";
  if (isPerson(entity)) return entity.name;
  if (isFeature(entity)) return entity.name;
  if (isProcess(entity)) return entity.name;
  if (isSystem(entity)) return entity.name;
  if (isIssue(entity)) return entity.title;
  return "Unknown";
}

function getEntityById(id: string | undefined, map: Record<string, DecodeNodeData>) {
  if (!id) return undefined;
  return map[id];
}

function EntityList({
  ids,
  map,
  fallback
}: {
  ids: string[];
  map: Record<string, DecodeNodeData>;
  fallback?: string;
}) {
  if (!ids.length) return <p className="text-sm text-slate-500">{fallback ?? "None"}</p>;
  return (
    <ul className="list-inside list-disc text-sm text-slate-300">
      {ids.map((id) => (
        <li key={id}>{getEntityName(map[id])}</li>
      ))}
    </ul>
  );
}

function PersonView({
  person,
  entityMap
}: {
  person: Person;
  entityMap: Record<string, DecodeNodeData>;
}) {
  return (
    <div className="space-y-3">
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <div>
            <div className={labelClass}>Role</div>
            <div className="text-base font-semibold text-slate-100">{person.roleTitle}</div>
            <div className="text-sm text-slate-400">{person.department}</div>
          </div>
          <Tag label={person.status} tone="blue" />
        </div>
        <div className="pt-2 text-sm text-slate-300">
          <span className="font-medium">Reports to:</span>{" "}
          {getEntityName(getEntityById(person.reportsToId, entityMap))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Core outcomes</div>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
          {person.coreOutcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Responsibilities</div>
        <p className="text-sm text-slate-300">{person.responsibilities}</p>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Systems owned</div>
        <EntityList ids={person.systemsOwnedIds} map={entityMap} fallback="No systems listed." />
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Features owned</div>
        <EntityList ids={person.featureIds} map={entityMap} fallback="No features listed." />
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Processes owned</div>
        <EntityList ids={person.processIds} map={entityMap} fallback="No processes listed." />
      </div>
    </div>
  );
}

function FeatureView({
  feature,
  entityMap,
  entities
}: {
  feature: ProductFeature;
  entityMap: Record<string, DecodeNodeData>;
  entities: DecodeNodeData[];
}) {
  const relatedIssues = entities.filter(
    (entity) => isIssue(entity) && entity.relatedFeatureIds.includes(feature.id)
  ) as Issue[];

  return (
    <div className="space-y-3">
      <div className={sectionClass}>
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={feature.area} tone="purple" />
          <Tag label={`Status: ${feature.status}`} tone={toneForStatus(feature.status)} />
          <Tag label={`Health: ${feature.health}`} tone={toneForHealth(feature.health)} />
          <Tag label={`Priority: ${feature.priority}`} tone="yellow" />
        </div>
        <div className="mt-2 text-sm text-slate-300">
          <span className="font-medium">Business owner: </span>
          {getEntityName(getEntityById(feature.businessOwnerId, entityMap))}
        </div>
        <div className="text-sm text-slate-300">
          <span className="font-medium">Tech owner: </span>
          {getEntityName(getEntityById(feature.techOwnerId, entityMap))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Description</div>
        <p className="text-sm text-slate-300">{feature.description}</p>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Related processes</div>
        <EntityList
          ids={feature.relatedProcessIds}
          map={entityMap}
          fallback="No related processes listed."
        />
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Related issues</div>
        {relatedIssues.length ? (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            {relatedIssues.map((issue) => (
              <li key={issue.id}>
                {issue.title} <Tag label={issue.severity} tone={toneForSeverity(issue.severity)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No related issues.</p>
        )}
      </div>
    </div>
  );
}

function ProcessView({
  process,
  entityMap
}: {
  process: CompanyProcess;
  entityMap: Record<string, DecodeNodeData>;
}) {
  return (
    <div className="space-y-3">
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Tag label={process.category} tone="purple" />
            <Tag label={`Health: ${process.health}`} tone={toneForHealth(process.health)} />
          </div>
          <div className="text-right text-sm text-slate-300">
            <div className="font-semibold text-slate-200">SLA</div>
            <div>{process.sla}</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-slate-300">
          <span className="font-medium">Primary owner: </span>
          {getEntityName(getEntityById(process.primaryOwnerId, entityMap))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Trigger</div>
        <p className="text-sm text-slate-300">{process.trigger}</p>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Tools used</div>
        <EntityList ids={process.toolsUsedIds} map={entityMap} fallback="No tools listed." />
      </div>

      {process.sopLink && (
        <div className={sectionClass}>
          <div className={titleClass}>SOP</div>
          <a
            href={process.sopLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-sky-400 hover:text-sky-300 hover:underline"
          >
            {process.sopLink}
          </a>
        </div>
      )}
    </div>
  );
}

function SystemView({ system, entityMap }: { system: SystemTool; entityMap: Record<string, DecodeNodeData> }) {
  return (
    <div className="space-y-3">
      <div className={sectionClass}>
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={system.systemType} tone="purple" />
          <Tag label={`Criticality: ${system.criticality}`} tone="red" />
        </div>
        <div className="mt-2 text-sm text-slate-300">
          <span className="font-medium">Business owner: </span>
          {getEntityName(getEntityById(system.businessOwnerId, entityMap))}
        </div>
        <div className="text-sm text-slate-300">
          <span className="font-medium">Technical owner: </span>
          {getEntityName(getEntityById(system.technicalOwnerId, entityMap))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Used for</div>
        <p className="text-sm text-slate-300">{system.usedFor}</p>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Who has access</div>
        <div className="flex flex-wrap gap-2">
          {system.whoHasAccess.map((item) => (
            <Tag key={item} label={item} />
          ))}
        </div>
      </div>

      {system.notes && (
        <div className={sectionClass}>
          <div className={titleClass}>Notes</div>
          <p className="text-sm text-slate-300">{system.notes}</p>
        </div>
      )}
    </div>
  );
}

function IssueView({
  issue,
  entityMap
}: {
  issue: Issue;
  entityMap: Record<string, DecodeNodeData>;
}) {
  return (
    <div className="space-y-3">
      <div className={sectionClass}>
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={`Severity: ${issue.severity}`} tone={toneForSeverity(issue.severity)} />
          <Tag label={`Status: ${issue.status}`} tone={toneForStatus(issue.status)} />
          <Tag label={`Area: ${issue.area}`} tone="purple" />
          <Tag label={`Root: ${issue.rootCause}`} tone="yellow" />
        </div>
        <div className="mt-2 text-sm text-slate-300">
          <span className="font-medium">Owner: </span>
          {getEntityName(getEntityById(issue.ownerId, entityMap))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Related features</div>
        <EntityList
          ids={issue.relatedFeatureIds}
          map={entityMap}
          fallback="No related features."
        />
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Related processes</div>
        <EntityList
          ids={issue.relatedProcessIds}
          map={entityMap}
          fallback="No related processes."
        />
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Related systems</div>
        <EntityList
          ids={issue.relatedSystemIds}
          map={entityMap}
          fallback="No related systems."
        />
      </div>

      {issue.notes && (
        <div className={sectionClass}>
          <div className={titleClass}>Notes</div>
          <p className="text-sm text-slate-300">{issue.notes}</p>
        </div>
      )}
    </div>
  );
}

function EdgeView({
  edge,
  onSelectNode
}: {
  edge: EdgeWithEntities;
  onSelectNode: (nodeId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className={sectionClass}>
        <div className="text-sm text-slate-300">
          <span className="font-medium text-slate-200">Relation:</span> {edge.relationType}
        </div>
        {edge.label && <div className="text-sm text-slate-400">Label: {edge.label}</div>}
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Source</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">
            {getEntityName(edge.sourceEntity)}{" "}
            <span className="text-xs uppercase text-slate-500">
              {edge.sourceEntity?.type}
            </span>
          </div>
          {edge.sourceId && (
            <button
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
              onClick={() => onSelectNode(edge.sourceId)}
            >
              Select
            </button>
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <div className={titleClass}>Target</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">
            {getEntityName(edge.targetEntity)}{" "}
            <span className="text-xs uppercase text-slate-500">
              {edge.targetEntity?.type}
            </span>
          </div>
          {edge.targetId && (
            <button
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
              onClick={() => onSelectNode(edge.targetId)}
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InspectorPanel({
  selectedNode,
  selectedEdge,
  onClose,
  onSelectNode,
  entities
}: InspectorPanelProps) {
  const entityMap = React.useMemo(
    () => Object.fromEntries(entities.map((e) => [e.id, e])),
    [entities]
  );

  let title = "Inspector";
  if (selectedNode) {
    title = `${selectedNode.type === "person" ? "Person" : selectedNode.type === "feature" ? "Feature" : selectedNode.type === "process" ? "Process" : selectedNode.type === "system" ? "System" : "Issue"
      }: ${getEntityName(selectedNode)}`;
  } else if (selectedEdge) {
    title = "Relationship";
  }

  const renderBody = () => {
    if (selectedNode) {
      if (isPerson(selectedNode)) return <PersonView person={selectedNode} entityMap={entityMap} />;
      if (isFeature(selectedNode))
        return (
          <FeatureView feature={selectedNode} entityMap={entityMap} entities={entities} />
        );
      if (isProcess(selectedNode))
        return <ProcessView process={selectedNode} entityMap={entityMap} />;
      if (isSystem(selectedNode)) return <SystemView system={selectedNode} entityMap={entityMap} />;
      if (isIssue(selectedNode)) return <IssueView issue={selectedNode} entityMap={entityMap} />;
    }

    if (selectedEdge) {
      return <EdgeView edge={selectedEdge} onSelectNode={onSelectNode} />;
    }

    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500">
        <div className="text-lg font-semibold text-slate-400">Nothing selected</div>
        <p>Click a node or connection on the map to see details here.</p>
      </div>
    );
  };

  return (
    <aside className="w-[360px] flex-none border-l border-slate-700/40 bg-[#050b15]/90 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Inspector</div>
          <div className="text-base font-semibold text-slate-100">{title}</div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-700/50 px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
        >
          Clear
        </button>
      </div>
      <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">{renderBody()}</div>
    </aside>
  );
}
