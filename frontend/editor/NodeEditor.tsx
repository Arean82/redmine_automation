import React, { useState } from 'react';
import type { AutomationNode, NodePayload, NodeType } from '../types';
import { ACTIONS, BRANCHES, CONDITIONS, TRIGGERS, labelFor } from '../registry';
import NodeForm from './NodeForm';

interface Props {
  nodes: AutomationNode[];
  onChange: (nodes: AutomationNode[]) => void;
  onSave: (nodes: NodePayload[]) => Promise<void>;
}

const ORDER: NodeType[] = ['trigger', 'condition', 'branch', 'action'];
const CATEGORY_LABEL: Record<NodeType, string> = {
  trigger: 'WHEN (trigger)',
  condition: 'IF (condition)',
  branch: 'FOR EACH (branch)',
  action: 'THEN (action)',
};
const OPTIONS: Record<NodeType, typeof TRIGGERS> = {
  trigger: TRIGGERS,
  condition: CONDITIONS,
  branch: BRANCHES,
  action: ACTIONS,
};

function newUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `node-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

export default function NodeEditor({ nodes, onChange, onSave }: Props) {
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [picks, setPicks] = useState<Record<NodeType, string>>({
    trigger: TRIGGERS[0].type,
    condition: CONDITIONS[0].type,
    branch: BRANCHES[0].type,
    action: ACTIONS[0].type,
  });

  const addNode = (nodeType: NodeType) => {
    const type = picks[nodeType];
    const node: AutomationNode = {
      id: 0,
      uuid: newUuid(),
      name: labelFor(type),
      description: '',
      position: nodes.length,
      type,
      nodeType,
      parentNodeUuid: null,
      metadata: {},
    };
    onChange([...nodes, node]);
  };

  const removeNode = (uuid: string) => {
    onChange(nodes.filter((n) => n.uuid !== uuid && n.parentNodeUuid !== uuid));
    if (selectedUuid === uuid) setSelectedUuid(null);
  };

  const updateNodeMetadata = (uuid: string, metadata: Record<string, unknown>) => {
    onChange(nodes.map((n) => (n.uuid === uuid ? { ...n, metadata } : n)));
  };

  const selectedNode = nodes.find((n) => n.uuid === selectedUuid);

  const save = async () => {
    setSaving(true);
    try {
      const payload: NodePayload[] = nodes.map((n) => ({
        uuid: n.uuid,
        name: n.name,
        type: n.type,
        nodeType: n.nodeType,
        value: n.description,
        parentUuid: n.parentNodeUuid,
        formProps: n.metadata,
        children: [],
      }));
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {ORDER.map((t) => {
        const group = nodes.filter((n) => n.nodeType === t);
        return (
          <div key={t} className="box" style={{ marginBottom: 8 }}>
            <h3>{CATEGORY_LABEL[t]}</h3>
            {group.length === 0 ? (
              <p className="muted">None</p>
            ) : (
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {group.map((n) => (
                  <li
                    key={n.uuid}
                    onClick={() => setSelectedUuid(n.uuid)}
                    style={{
                      cursor: 'pointer',
                      padding: '4px 8px',
                      background: selectedUuid === n.uuid ? '#e8f0fe' : undefined,
                      borderRadius: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      <strong>{labelFor(n.type)}</strong> <span className="muted">({n.type})</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNode(n.uuid);
                      }}
                    >
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div>
              <select
                value={picks[t]}
                onChange={(e) => setPicks({ ...picks, [t]: e.target.value })}
              >
                {OPTIONS[t].map((o) => (
                  <option key={o.type} value={o.type}>
                    {o.label}
                  </option>
                ))}
              </select>{' '}
              <button type="button" onClick={() => addNode(t)}>
                Add
              </button>
            </div>
          </div>
        );
      })}
      {selectedNode && (
        <div className="box">
          <h3>Edit: {labelFor(selectedNode.type)}</h3>
          <NodeForm node={selectedNode} onChange={(m) => updateNodeMetadata(selectedNode.uuid, m)} />
        </div>
      )}
      <p>
        <button type="button" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </p>
    </div>
  );
}
