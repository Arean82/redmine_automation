# Redmine Automation — User Manual

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

## 3. Creating and managing a rule

1. Click **New automation rule**.
2. Set a **name**, choose **project(s)** (or "all projects"), toggle **enabled**.
3. In the editor, build the flow:
   - **WHEN** — add a trigger.
   - **IF / AND** — add conditions.
   - **FOR EACH** — add a branch.
   - **THEN** — add actions.
4. Save.

Rules are edited in a visual node editor. Each node has its own configuration form.

From the rule's context menu (right-click) you can:

- **Open** — view the rule.
- **Pipelines** — view run history.
- **Settings** — edit.
- **Copy** — duplicate the rule (saved disabled).
- **Enable / Disable** — toggle the rule on/off without deleting it.
- **Delete** — remove the rule.

---

## 4. Triggers (WHEN)

| Trigger | Description |
|---|---|
| Issue created / updated / deleted | Fires on issue CRUD. |
| Issue assigned | Fires when an issue's assignee changes. |
| Issue comment created / edited / deleted | Fires on comment CRUD. |
| Field value changed | Fires when a monitored field changes (with change type: any / added / removed). |
| Issue moved | Fires when an issue's project changes. |
| Issue transitioned | Fires when an issue's status changes. |
| Issue relation created / deleted | Fires when an issue is linked / unlinked (optionally filtered by link type). |
| Manual trigger | Run manually from the issue's actions menu (subject to permission + project/tracker scope). |
| Spent time created / edited / deleted | Fires on time-entry CRUD. |
| Scheduled | Fires on a recurring interval (e.g. every N minutes/hours/days). |
| Incoming webhook | Triggered by an external HTTP call (see §13). |

---

## 5. Conditions (IF / AND)

| Condition | Description |
|---|---|
| Issue filter condition | Filter the issue by native Redmine fields (tracker, status, priority, assignee, custom fields…). |
| Scope condition | Limit the rule to a scope. |
| RQL condition | Expression-based condition (see §8). |
| Related items condition | Check related issues (parent/sub-tasks/linked/created) by presence, count, or RQL (see §9). |

### Condition logic (AND / OR)

Each rule has a **condition logic** setting (on the rule form):

- **All conditions must match (AND)** — the rule runs only if every condition passes.
- **Any condition can match (OR)** — the rule runs if at least one condition passes.

If a condition is not satisfied under AND logic, the rule **skips** (stops) — it does not fail.

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
| Add attachment | Attach a file to the issue (from literal content or a URL). |
| Assign issue | Assign to a user / group / role / copied-from-field / parent, with methods balanced / random / round-robin. |
| Clone issue | Copy an issue. |
| Comment on issue | Add a comment. |
| Create issue / sub-task | Create a new issue / child. |
| Edit issue / comment | Set field values (incl. status and project) / edit a comment. |
| Delete issue / attachments / issue links | Remove data (irreversible). |
| Link issues | Create a relation. |
| Log work | Create a time entry. |
| Manage watchers | Add / remove watchers. |
| Send email | Email with configurable to/cc/bcc/subject/body. |
| Send web request | HTTP request (webhook) with method, headers, body, expected status; retries twice on failure. |
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

## 9. Related Items condition

Checks a set of related issues against a criterion.

**Item options** (which related issues to consider): parent, current, sub-tasks, linked, created.

**Condition options**:

| Condition | Meaning |
|---|---|
| are present / not present | Whether any related issue exists. |
| exists / not exists | Alias of presence checks. |
| count equals / greater than / less than | Compare the number of related issues to a count. |
| match RQL / do not match RQL / at least one matches RQL | Evaluate an RQL expression against each related issue. |

---

## 10. Tokens (smart values)

Tokens can be used in most text fields (comment, email body, web request, etc.) using `{{...}}`:

- `{{issue.subject}}`, `{{issue.description}}`, `{{issue.due_date}}`
- `{{issue.assignee.name}}`, `{{issue.author.mail}}`
- `{{initiator.name}}`, `{{initiator.mail}}`
- `{{now.plus_days(5)}}`, `{{today.plus_months(1)}}`

---

## 11. Pipelines and logs

- Each rule run creates a **pipeline** with a status (scheduled / in progress / success / failed).
- **Automation → Pipelines** and **Automation → Logs** show run history and per-action messages.
- Logs are stored in the database and auto-purged after the configured retention period (see §12).

---

## 12. Settings (Configure screen)

**Administration → Plugins → Configure** (on this plugin) offers:

| Setting | Purpose |
|---|---|
| Enable scheduled triggers | Turn the scheduler on/off. |
| Scheduler interval | How often the scheduler checks for due triggers (see §13). |
| Log retention (days) | Auto-purge automation logs older than N days (0 = keep forever). |
| Webhook timeout (seconds) | Timeout for the Send Web Request action. |
| Webhook allowed hosts | Comma-separated hostnames allowed for web requests (blank = any). |
| Debug mode | Write extra detail to `log/production.log`. |

---

## 13. Scheduling and the incoming webhook

### Scheduled triggers

The scheduler must be run on a recurring basis. Schedule this via cron (or a systemd timer):

```
*/5 * * * * cd /data/redmine && RAILS_ENV=production bundle exec rake redmine_automation:run_scheduled_triggers
```

Match the cron interval to the scheduler interval in the settings.

Other rake tasks:

```bash
# Purge old logs (uses the retention setting)
bundle exec rake redmine_automation:purge_logs

# Export / import a rule as JSON
bundle exec rake redmine_automation:export_rule ID=1
bundle exec rake redmine_automation:import_rule FILE=automation_rule_1.json
```

### Incoming webhook

Trigger rules from an external system by posting:

```
POST /automation_webhooks   { "issue_id": 123 }
```

This runs all enabled rules with an Incoming Webhook trigger against the given issue. The endpoint is unauthenticated — restrict access at the network layer.

---

## 14. Permissions

Roles have two automation permissions:

- **View automation rules** — see rules.
- **Manage automation rules** — create/edit/delete rules.

And a visibility setting on the role form:

- **All automation rules** — see everyone's rules.
- **Own automation rules** — see only rules the user created.
