// Field schemas per node type. Each field maps to a metadata key.
// - kind 'select' stores { value, label } (backend reads .dig(key, "value"))
// - kind 'text'/'number'/'token'/'boolean' stores the raw value
// - kind 'multiselect' stores an array of { value, label }

export type FieldDef =
  | { key: string; kind: 'text'; label: string; multiline?: boolean; placeholder?: string }
  | { key: string; kind: 'number'; label: string }
  | { key: string; kind: 'select'; label: string; options: { value: string; label: string }[] }
  | { key: string; kind: 'multiselect'; label: string; options: { value: string; label: string }[] }
  | { key: string; kind: 'token'; label: string; placeholder?: string }
  | { key: string; kind: 'boolean'; label: string }
  | { key: string; kind: 'dynamicSelect'; label: string; source: 'activities' };

export type NodeSchema = FieldDef[];

const RELATION_TYPES = [
  { value: 'relates', label: 'Related to' },
  { value: 'duplicates', label: 'Duplicates' },
  { value: 'duplicated', label: 'Duplicated by' },
  { value: 'blocks', label: 'Blocks' },
  { value: 'blocked', label: 'Blocked by' },
  { value: 'precedes', label: 'Precedes' },
  { value: 'follows', label: 'Follows' },
  { value: 'copied_to', label: 'Copied to' },
  { value: 'copied_from', label: 'Copied from' },
];

const RELATED_ITEMS = [
  { value: 'current', label: 'Current issue' },
  { value: 'parent', label: 'Parent issue' },
  { value: 'subtasks', label: 'Sub-tasks' },
  { value: 'linked', label: 'Linked issue' },
  { value: 'created', label: 'Created issue' },
];

const RELATED_ITEM_CONDITIONS = [
  { value: 'arePresent', label: 'Are present' },
  { value: 'areNotPresent', label: 'Are not present' },
  { value: 'countEquals', label: 'Count equals' },
  { value: 'areGreaterThan', label: 'Count greater than' },
  { value: 'areLessThan', label: 'Count less than' },
  { value: 'matchRql', label: 'Match RQL query' },
  { value: 'doNotMatchRql', label: 'Do not match RQL query' },
];

export const SCHEMAS: Record<string, NodeSchema> = {
  // ---- triggers (only these two have configuration) ----
  VALUE_CHANGED: [
    {
      key: 'change_type',
      kind: 'select',
      label: 'Change type',
      options: [
        { value: 'any_change', label: 'Any change' },
        { value: 'value_added', label: 'Value added' },
        { value: 'value_deleted', label: 'Value deleted' },
      ],
    },
    { key: 'monitored_fields', kind: 'token', label: 'Fields to monitor', placeholder: 'Leave empty to match any field' },
  ],
  SCHEDULED: [
    { key: 'interval_value', kind: 'number', label: 'Every' },
    {
      key: 'interval',
      kind: 'select',
      label: 'Interval',
      options: [
        { value: 'minutes', label: 'minutes' },
        { value: 'hours', label: 'hours' },
        { value: 'days', label: 'days' },
        { value: 'weeks', label: 'weeks' },
        { value: 'months', label: 'months' },
      ],
    },
  ],

  // ---- conditions ----
  REDMINE_QUERY_LANGUAGE: [
    { key: 'query', kind: 'text', label: 'RQL query', placeholder: '{{issue.status.id}} = 1' },
  ],
  RELATED_ITEMS: [
    { key: 'related_items', kind: 'select', label: 'Related issues', options: RELATED_ITEMS },
    { key: 'condition', kind: 'select', label: 'Condition', options: RELATED_ITEM_CONDITIONS },
    { key: 'count', kind: 'number', label: 'Count' },
    { key: 'query', kind: 'text', label: 'RQL query', placeholder: '{{issue.status.id}} > 1' },
  ],

  // ---- branches ----
  FOR_EACH: [
    { key: 'related_issues', kind: 'select', label: 'Related issues', options: RELATED_ITEMS },
    { key: 'link_types', kind: 'multiselect', label: 'Link types', options: RELATION_TYPES },
  ],

  // ---- actions ----
  ADD_ATTACHMENT: [
    { key: 'filename', kind: 'text', label: 'Filename', placeholder: 'e.g. report.txt' },
    { key: 'url', kind: 'text', label: 'URL (optional)', placeholder: 'Download the file from this URL' },
    { key: 'content', kind: 'text', label: 'Content', multiline: true, placeholder: 'File content (used when no URL is set)' },
  ],
  ASSIGN_ISSUE: [
    {
      key: 'assign_type',
      kind: 'select',
      label: 'Assign to',
      options: [
        { value: 'user', label: 'Specific user' },
        { value: 'user_group', label: 'User in a group' },
        { value: 'user_role', label: 'User in a role' },
        { value: 'field', label: 'Copy from another field' },
        { value: 'parent_issue', label: 'Copy from parent issue' },
      ],
    },
    { key: 'value', kind: 'token', label: 'User / group / role / field', placeholder: 'Select a value' },
    {
      key: 'assign_method',
      kind: 'select',
      label: 'Assign method',
      options: [
        { value: 'balanced', label: 'Balanced workload' },
        { value: 'random', label: 'Random' },
        { value: 'round_robin', label: 'Round-robin' },
      ],
    },
  ],
  CLONE_ISSUE: [],
  COMMENT_ISSUE: [{ key: 'comment', kind: 'text', label: 'Comment', multiline: true }],
  CREATE_ISSUE: [],
  CREATE_SUBTASK: [],
  DELETE_ATTACHMENT: [
    {
      key: 'delete_type',
      kind: 'select',
      label: 'Delete',
      options: [
        { value: 'all', label: 'All attachments' },
        { value: 'matching', label: 'Matching' },
        { value: 'not_matching', label: 'Not matching' },
      ],
    },
    { key: 'regex', kind: 'text', label: 'Regular expression', placeholder: 'Leave empty to match all' },
  ],
  DELETE_ISSUE: [],
  DELETE_ISSUE_LINK: [{ key: 'link_types', kind: 'multiselect', label: 'Link types', options: RELATION_TYPES }],
  EDIT_COMMENT: [
    {
      key: 'target_comment',
      kind: 'select',
      label: 'Comment to edit',
      options: [
        { value: 'first', label: 'First comment' },
        { value: 'last', label: 'Last comment' },
      ],
    },
    { key: 'comment_text', kind: 'text', label: 'New comment content', multiline: true },
  ],
  EDIT_ISSUE: [],
  LINK_ISSUE: [
    { key: 'link_type', kind: 'select', label: 'Link type', options: RELATION_TYPES },
    {
      key: 'issue',
      kind: 'select',
      label: 'Issue to link',
      options: [
        { value: 'issue.trigger', label: 'Trigger issue' },
        { value: 'issue.most_recent_created_issue', label: 'Most recent created issue' },
      ],
    },
  ],
  LOG_ACTION: [{ key: 'message', kind: 'text', label: 'Log message', multiline: true }],
  LOG_WORK: [
    { key: 'user_id', kind: 'token', label: 'User' },
    { key: 'date', kind: 'token', label: 'Date' },
    { key: 'activity', kind: 'dynamicSelect', label: 'Activity', source: 'activities' },
    { key: 'spent_time', kind: 'token', label: 'Hours', placeholder: 'e.g. 1h, 30m' },
    { key: 'comment', kind: 'text', label: 'Comment' },
  ],
  MANAGE_WATCHERS: [
    { key: 'remove_all_watchers', kind: 'boolean', label: 'Remove all existing watchers' },
    { key: 'add_watchers', kind: 'token', label: 'Add watchers' },
    { key: 'remove_watchers', kind: 'token', label: 'Remove watchers' },
  ],
  SEND_EMAIL: [
    { key: 'to', kind: 'token', label: 'To' },
    { key: 'cc', kind: 'token', label: 'CC' },
    { key: 'bcc', kind: 'token', label: 'BCC' },
    { key: 'subject', kind: 'text', label: 'Subject' },
    { key: 'body', kind: 'text', label: 'Body', multiline: true },
  ],
  SEND_WEB_REQUEST: [
    { key: 'url', kind: 'text', label: 'Web request URL' },
    {
      key: 'method',
      kind: 'select',
      label: 'HTTP method',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => ({ value: m, label: m })),
    },
    { key: 'headers', kind: 'text', label: 'Headers', multiline: true, placeholder: 'Key: value (one per line)' },
    {
      key: 'body_type',
      kind: 'select',
      label: 'Body type',
      options: [
        { value: 'empty', label: 'Empty' },
        { value: 'json', label: 'JSON' },
        { value: 'issue_data', label: 'Issue data (Redmine format)' },
      ],
    },
    { key: 'body', kind: 'text', label: 'Web request body', multiline: true },
    { key: 'expected_response_codes', kind: 'text', label: 'Expected response codes', placeholder: 'leave empty to accept any' },
  ],
};

export function schemaFor(type: string): NodeSchema {
  return SCHEMAS[type] || [];
}
