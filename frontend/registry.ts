import type { NodeType } from './types';

export interface NodeTypeDef {
  type: string; // backend uppercase-snake type string
  nodeType: NodeType;
  label: string;
  description?: string;
}

export const TRIGGERS: NodeTypeDef[] = [
  { type: 'ISSUE_CREATED', nodeType: 'trigger', label: 'Issue created' },
  { type: 'ISSUE_UPDATED', nodeType: 'trigger', label: 'Issue updated' },
  { type: 'ISSUE_DELETED', nodeType: 'trigger', label: 'Issue deleted' },
  { type: 'ISSUE_ASSIGNED', nodeType: 'trigger', label: 'Issue assigned' },
  { type: 'ISSUE_COMMENT_CREATED', nodeType: 'trigger', label: 'Issue comment created' },
  { type: 'ISSUE_COMMENT_UPDATED', nodeType: 'trigger', label: 'Issue comment edited' },
  { type: 'ISSUE_COMMENT_DELETED', nodeType: 'trigger', label: 'Issue comment deleted' },
  { type: 'VALUE_CHANGED', nodeType: 'trigger', label: 'Field value changed' },
  { type: 'ISSUE_MOVED', nodeType: 'trigger', label: 'Issue moved' },
  { type: 'ISSUE_TRANSITIONED', nodeType: 'trigger', label: 'Issue transitioned' },
  { type: 'ISSUE_RELATION_CREATED', nodeType: 'trigger', label: 'Issue linked' },
  { type: 'ISSUE_RELATION_DELETED', nodeType: 'trigger', label: 'Issue link deleted' },
  { type: 'MANUAL', nodeType: 'trigger', label: 'Manual trigger' },
  { type: 'TIME_ENTRY_CREATED', nodeType: 'trigger', label: 'Spent time created' },
  { type: 'TIME_ENTRY_UPDATED', nodeType: 'trigger', label: 'Spent time edited' },
  { type: 'TIME_ENTRY_DELETED', nodeType: 'trigger', label: 'Spent time deleted' },
  { type: 'SCHEDULED', nodeType: 'trigger', label: 'Scheduled' },
  { type: 'INCOMING_WEBHOOK', nodeType: 'trigger', label: 'Incoming webhook' },
];

export const CONDITIONS: NodeTypeDef[] = [
  { type: 'QUERY', nodeType: 'condition', label: 'Issue filter condition' },
  { type: 'QUERY_SCOPE', nodeType: 'condition', label: 'Scope condition' },
  { type: 'REDMINE_QUERY_LANGUAGE', nodeType: 'condition', label: 'RQL condition' },
  { type: 'RELATED_ITEMS', nodeType: 'condition', label: 'Related items condition' },
];

export const BRANCHES: NodeTypeDef[] = [
  { type: 'FOR_EACH', nodeType: 'branch', label: 'Branch / related issues' },
];

export const ACTIONS: NodeTypeDef[] = [
  { type: 'ADD_ATTACHMENT', nodeType: 'action', label: 'Add attachment' },
  { type: 'ASSIGN_ISSUE', nodeType: 'action', label: 'Assign issue' },
  { type: 'CLONE_ISSUE', nodeType: 'action', label: 'Clone issue' },
  { type: 'COMMENT_ISSUE', nodeType: 'action', label: 'Comment on issue' },
  { type: 'CREATE_ISSUE', nodeType: 'action', label: 'Create issue' },
  { type: 'CREATE_SUBTASK', nodeType: 'action', label: 'Create sub-task' },
  { type: 'DELETE_ATTACHMENT', nodeType: 'action', label: 'Delete attachments' },
  { type: 'DELETE_ISSUE', nodeType: 'action', label: 'Delete issue' },
  { type: 'DELETE_ISSUE_LINK', nodeType: 'action', label: 'Delete issue links' },
  { type: 'EDIT_COMMENT', nodeType: 'action', label: 'Edit comment' },
  { type: 'EDIT_ISSUE', nodeType: 'action', label: 'Edit issue' },
  { type: 'LINK_ISSUE', nodeType: 'action', label: 'Link issues' },
  { type: 'LOG_ACTION', nodeType: 'action', label: 'Log action' },
  { type: 'LOG_WORK', nodeType: 'action', label: 'Log work' },
  { type: 'MANAGE_WATCHERS', nodeType: 'action', label: 'Manage watchers' },
  { type: 'SEND_EMAIL', nodeType: 'action', label: 'Send email' },
  { type: 'SEND_WEB_REQUEST', nodeType: 'action', label: 'Send web request' },
];

export function labelFor(type: string): string {
  return [...TRIGGERS, ...CONDITIONS, ...BRANCHES, ...ACTIONS].find((t) => t.type === type)?.label || type;
}
