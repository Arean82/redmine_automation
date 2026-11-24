import React, { useEffect, useState } from 'react';
import { availableFilters, filterConditions, filterValues, type Option } from '../api';

interface Props {
  metadata: Record<string, unknown>;
  onChange: (metadata: Record<string, unknown>) => void;
}

type FilterOption = Option & { type: string; group?: string };

// Cascading form for the QUERY / QUERY_SCOPE conditions:
// field (filter) → operator → values, each loaded from the backend.
export default function QueryConditionForm({ metadata, onChange }: Props) {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [operators, setOperators] = useState<Option[]>([]);
  const [values, setValues] = useState<Option[]>([]);

  const filterValue = (metadata.filter as { value?: string } | undefined)?.value;
  const operatorValue = (metadata.operator as { value?: string } | undefined)?.value;
  const selectedValues = Array.isArray(metadata.values)
    ? (metadata.values as { value?: string }[]).map((v) => v.value).filter(Boolean)
    : [];

  useEffect(() => {
    availableFilters().then(setFilters).catch(() => setFilters([]));
  }, []);

  useEffect(() => {
    if (!filterValue) {
      setOperators([]);
      setValues([]);
      return;
    }
    filterConditions(filterValue).then(setOperators).catch(() => setOperators([]));
    filterValues(filterValue).then(setValues).catch(() => setValues([]));
  }, [filterValue]);

  return (
    <div>
      <p style={{ margin: '6px 0' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Field</label>
        <select
          value={filterValue || ''}
          onChange={(e) => onChange({ ...metadata, filter: { value: e.target.value }, operator: undefined, values: [] })}
        >
          <option value="">— select field —</option>
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.group ? `${f.group} — ${f.label}` : f.label}
            </option>
          ))}
        </select>
      </p>
      <p style={{ margin: '6px 0' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Operator</label>
        <select
          value={operatorValue || ''}
          onChange={(e) => onChange({ ...metadata, operator: { value: e.target.value } })}
        >
          <option value="">— select operator —</option>
          {operators.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </p>
      <p style={{ margin: '6px 0' }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Values</label>
        <select
          multiple
          size={6}
          style={{ width: '100%' }}
          value={selectedValues as string[]}
          onChange={(e) =>
            onChange({ ...metadata, values: Array.from(e.target.selectedOptions).map((o) => ({ value: o.value })) })
          }
        >
          {values.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </p>
    </div>
  );
}
