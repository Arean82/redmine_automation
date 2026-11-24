// API client for the plugin's backend endpoints.

import type { AutomationNode, AutomationRule, NodePayload } from './types';

function csrfToken(): string | null {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
  return meta ? meta.content : null;
}

export async function fetchNodes(ruleId: number): Promise<AutomationNode[]> {
  const res = await fetch(`/automation_rules/${ruleId}/automation_nodes.json`);
  if (!res.ok) throw new Error(`Failed to load nodes: ${res.status}`);
  return res.json();
}

export async function saveNodes(ruleId: number, nodes: NodePayload[]): Promise<void> {
  const token = csrfToken();
  const body: Record<string, unknown> = { nodes };

  const res = await fetch(`/automation_rules/${ruleId}/update_nodes.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-CSRF-Token': token } : {}),
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to save nodes: ${res.status}`);
}

export interface Option {
  value: string;
  label: string;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function availableFilters(): Promise<(Option & { type: string; group?: string })[]> {
  return getJson('/automation_triggers/available_filters');
}

export function filterConditions(filter: string): Promise<Option[]> {
  return getJson(`/automation_triggers/filter_conditions?filter=${encodeURIComponent(filter)}`);
}

export function filterValues(filter: string): Promise<Option[]> {
  return getJson(`/automation_triggers/available_values?filter=${encodeURIComponent(filter)}`);
}

export function timeEntryActivities(): Promise<Option[]> {
  return getJson('/automation_triggers/available_time_entry_activities');
}

export function availableTokens(): Promise<unknown[]> {
  return getJson('/automation_triggers/available_tokens');
}

export function parseRuleFromDom(): AutomationRule {
  const el = document.getElementById('my-plugin-root');
  const raw = el?.getAttribute('data-automation-rule') || '{}';
  try {
    return JSON.parse(raw) as AutomationRule;
  } catch {
    return { id: 0, name: '', description: null, enabled: false };
  }
}
