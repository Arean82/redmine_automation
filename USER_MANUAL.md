# Redmine Plus Automation — User Manual

## 1. Overview

Automation rules follow a simple flow:

```
WHEN  (trigger)   →  IF  (condition)   →  FOR EACH  (branch)   →  THEN  (action)
```

A rule watches for a **trigger**, optionally filters with **conditions**, optionally branches over **related issues**, then runs **actions**.

---

## 2. Accessing automation

- **Administration → Automation** — global list of all rules.
- **Project → Automation** (in the project menu, after Gantt) — rules for that project.

---

## 3. Creating a rule

1. Click **New automation rule**.
2. Set a **name**, choose **project(s)** (or "all projects"), toggle **enabled**.
3. In the editor, build the flow:
   - **WHEN** — add a trigger.
   - **IF / AND** — add conditions.
   - **FOR EACH** — add a branch.
   - **THEN** — add actions.
4. Save.

Rules are edited in a visual node editor. Each node has its own configuration form.

---

## 4. Triggers (WHEN)

| Trigger | Description |
|---|---|
| Issue created / updated / deleted | Fires on issue CRUD. |
| Issue comment created / edited / deleted | Fires on comment CRUD. |
| Field value changed | Fires when a monitored field changes (with change type: any / added / removed). |
| Issue moved | Fires when an issue's project changes. |
| Issue transitioned | Fires when an issue's status changes. |
| Manual trigger | Run manually from the issue's actions menu (subject to permission + project/tracker scope). |
| Spent time created / edited / deleted | Fires on time-entry CRUD. |
| Scheduled | Fires on a recurring interval (e.g. every N minutes/hours/days). |

---

## 5. Conditions (IF / AND)

| Condition | Description |
|---|---|
| Issue filter condition | Filter the issue by native Redmine fields (tracker, status, priority, assignee, custom fields…). |
| Scope condition | Limit the rule to a scope. |
| RQL condition | Expression-based condition (see §8). |

If a condition is not satisfied, the rule **skips** (stops) — it does not fail.

---

## 6. Branches (FOR EACH)

A branch runs the following actions against each matching related issue:

| Option | Targets |
|---|---|
| Current issue | The triggering issue. |
| Parent issue | The issue's parent. |
| Sub-tasks | Direct children. |
| Linked issue | Issues linked via relations (optionally filtered by link type). |
| Created issue | The issue created by a previous action. |

---

## 7. Actions (THEN)

| Action | What it does |
|---|---|
| Assign issue | Assign to a user / group / role / copied-from-field / parent, with methods balanced / random / round-robin. |
| Clone issue | Copy an issue. |
| Comment on issue | Add a comment. |
| Create issue / sub-task | Create a new issue / child. |
| Edit issue / comment | Set field values / edit a comment. |
| Delete issue / attachments / issue links | Remove data (irreversible). |
| Link issues | Create a relation. |
| Log work | Create a time entry. |
| Manage watchers | Add / remove watchers. |
| Send email | Email with configurable to/cc/bcc/subject/body. |
| Send web request | HTTP request (webhook) with method, headers, body, expected status. |
| Log action | Write a custom message to the rule's log. |

---

## 8. RQL (Redmine Query Language)

An RQL condition is a single expression:

```
{{token}} operator value
```

### Tokens

Tokens resolve issue/initiator fields. Common examples:

| Token | Value |
|---|---|
| `{{issue.id}}` | Issue ID |
| `{{issue.status.id}}` | Status ID |
| `{{issue.status.name}}` | Status name |
| `{{issue.priority.id}}` | Priority ID |
| `{{issue.tracker.name}}` | Tracker name |
| `{{issue.project.status}}` | Project status (1 = active) |
| `{{issue.assignee.id}}` | Assignee ID |
| `{{issue.subject}}` | Subject text |
| `{{initiator.id}}` | User who triggered the rule |

Custom fields: `{{issue.cf_<id>}}` (e.g. `{{issue.cf_4}}`).

### Operators

| Operator | Meaning | Example |
|---|---|---|
| `=` or `==` | equals | `{{issue.status.id}} = 1` |
| `!=` | not equals | `{{issue.status.id}} != 1` |
| `>` `>=` `<` `<=` | numeric | `{{issue.priority.id}} > 2` |
| `contains` | substring | `{{issue.subject}} contains bug` |
| `in` | membership (comma list) | `{{issue.status.id}} in 1,2,3` |

### Notes

- Whitespace around the operator is ignored.
- The right side may also be a `{{token}}` (compares two fields).
- Invalid/unresolvable expressions return `false` (rule skips).

---

## 9. Tokens (smart values)

Tokens can be used in most text fields (comment, email body, web request, etc.) using `{{...}}`:

- `{{issue.subject}}`, `{{issue.description}}`, `{{issue.due_date}}`
- `{{issue.assignee.name}}`, `{{issue.author.mail}}`
- `{{initiator.name}}`, `{{initiator.mail}}`
- `{{now.plus_days(5)}}`, `{{today.plus_months(1)}}`

---

## 10. Pipelines and logs

- Each rule run creates a **pipeline** with a status (scheduled / in progress / success / failed).
- **Automation → Pipelines** and **Automation → Logs** show run history and per-action messages.

---

## 11. Permissions

Roles have two automation permissions:

- **View automation rules** — see rules.
- **Manage automation rules** — create/edit/delete rules.

And a visibility setting on the role form:

- **All automation rules** — see everyone's rules.
- **Own automation rules** — see only rules the user created.
