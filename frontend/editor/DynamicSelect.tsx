import React, { useEffect, useState } from 'react';
import { timeEntryActivities, type Option } from '../api';

interface Props {
  value: string | undefined;
  onChange: (value: { value: string }) => void;
}

// A select whose options are loaded from the backend at render time.
// Currently only used for the "activity" list in the Log Work action.
export default function DynamicSelect({ value, onChange }: Props) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    timeEntryActivities()
      .then((o) => setOptions(o.map((x) => ({ value: String(x.value), label: x.label }))))
      .catch(() => setOptions([]));
  }, []);

  return (
    <select value={value || ''} onChange={(e) => onChange({ value: e.target.value })}>
      <option value="">— select —</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
