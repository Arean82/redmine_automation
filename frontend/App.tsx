import React, { useEffect, useState } from 'react';
import { parseRuleFromDom, fetchNodes, saveNodes } from './api';
import type { AutomationNode, AutomationRule, NodePayload } from './types';
import NodeEditor from './editor/NodeEditor';

export default function App() {
  const [rule] = useState<AutomationRule>(() => parseRuleFromDom());
  const [nodes, setNodes] = useState<AutomationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rule.id) {
      setLoading(false);
      return;
    }
    fetchNodes(rule.id)
      .then(setNodes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [rule.id]);

  if (loading) return <div className="box">Loading…</div>;
  if (error) return <div className="flash error">{error}</div>;

  const handleSave = (payload: NodePayload[]) => saveNodes(rule.id, payload);

  return (
    <div className="box">
      <h2>{rule.name || 'Automation rule'}</h2>
      <NodeEditor nodes={nodes} onChange={setNodes} onSave={handleSave} />
    </div>
  );
}
