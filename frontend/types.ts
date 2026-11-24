// Shared types matching the backend contract.

export type NodeType = 'trigger' | 'condition' | 'branch' | 'action';

export interface AutomationNode {
  id: number;
  uuid: string;
  name: string;
  description: string;
  position: number;
  type: string; // e.g. "ISSUE_CREATED", "CLONE_ISSUE"
  nodeType: NodeType;
  parentNodeUuid: string | null;
  metadata: Record<string, unknown>;
}

export interface AutomationRule {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
  plugin_edition?: string;
  project_id?: number | null;
  [key: string]: unknown;
}

// The shape the backend expects in automation_rules#update_nodes
export interface NodePayload {
  uuid: string;
  name: string;
  type: string;
  nodeType: NodeType;
  value: string;
  parentUuid: string | null;
  formProps: Record<string, unknown>;
  children: unknown[];
}
