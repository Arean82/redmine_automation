import React from 'react';
import type { AutomationNode } from '../types';
import { schemaFor, type FieldDef } from './schema';
import QueryConditionForm from './QueryConditionForm';
import DynamicSelect from './DynamicSelect';

interface Props {
  node: AutomationNode;
  onChange: (metadata: Record<string, unknown>) => void;
}

export default function NodeForm({ node, onChange }: Props) {
  const schema = schemaFor(node.type);
  const metadata = (node.metadata || {}) as Record<string, unknown>;

  if (node.type === 'QUERY' || node.type === 'QUERY_SCOPE') {
    return (
      <div style={{ paddingLeft: 8, borderLeft: '3px solid #ddd' }}>
        <QueryConditionForm metadata={metadata} onChange={onChange} />
      </div>
    );
  }

  if (schema.length === 0) {
    return <p className="muted">This node has no configuration.</p>;
  }

  const setField = (key: string, value: unknown) => {
    onChange({ ...metadata, [key]: value });
  };

  return (
    <div style={{ paddingLeft: 8, borderLeft: '3px solid #ddd' }}>
      {schema.map((f) => (
        <p key={f.key} style={{ margin: '6px 0' }}>
          <label style={{ display: 'block', fontWeight: 600 }}>{f.label}</label>
          {renderField(f, readValue(f, metadata), (v) => setField(f.key, v))}
        </p>
      ))}
    </div>
  );
}

function readValue(f: FieldDef, metadata: Record<string, unknown>): unknown {
  const raw = metadata[f.key];
  if (f.kind === 'select') return raw && typeof raw === 'object' ? (raw as Record<string, unknown>).value : raw;
  if (f.kind === 'multiselect') {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((v) => (v && typeof v === 'object' ? (v as Record<string, unknown>).value : v));
  }
  return raw;
}

function renderField(f: FieldDef, value: unknown, onChange: (v: unknown) => void) {
  switch (f.kind) {
    case 'text':
      return f.multiline ? (
        <textarea
          rows={3}
          style={{ width: '100%' }}
          placeholder={f.placeholder}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          style={{ width: '100%' }}
          placeholder={f.placeholder}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={(value as number | string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'token':
      return (
        <input
          type="text"
          style={{ width: '100%' }}
          placeholder={f.placeholder}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'boolean':
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case 'dynamicSelect':
      return <DynamicSelect value={(value as string) || ''} onChange={(v) => onChange(v)} />;
    case 'select':
      return (
        <select value={(value as string) || ''} onChange={(e) => onChange({ value: e.target.value })}>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'multiselect':
      return (
        <select
          multiple
          size={Math.min(5, f.options.length)}
          value={(value as string[]) || []}
          onChange={(e) =>
            onChange(Array.from(e.target.selectedOptions).map((o) => ({ value: o.value })))
          }
        >
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    default:
      return null;
  }
}
