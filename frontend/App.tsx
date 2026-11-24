import React, { useEffect, useState } from 'react';
import { parseRuleFromDom, fetchNodes, saveNodes } from './api';
import type { AutomationNode, AutomationRule, NodePayload } from './types';
import NodeEditor from './editor/NodeEditor';

export default function App() {
  const [rule] = useState<AutomationRule>(() => parseRuleFromDom());
  const [nodes, setNodes] = useState<AutomationNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rule.id) return;
    fetchNodes(rule.id)
      .then(setNodes)
      .catch((e) => setError(e.message));
  }, [rule.id]);

  const handleSave = (payload: NodePayload[]) => saveNodes(rule.id, payload);

  // Always render the editor. A node-load error is shown as a warning,
  // never replaces the editor.
  return (
    <div className="box">
      <h2>{rule.name || 'Automation rule'}</h2>
      {error && <div className="flash warning">{error}</div>}
      <NodeEditor nodes={nodes} onChange={setNodes} onSave={handleSave} />
    </div>
  );
}
