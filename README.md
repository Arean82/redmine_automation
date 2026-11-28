# Redmine Automation

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/Arean82/redmine_automation)
[![Redmine](https://img.shields.io/badge/redmine-%3E%3D6.0-blue?logo=redmine&logoColor=%23B32024&labelColor=f0f0f0)](https://www.redmine.org)
[![Ruby](https://img.shields.io/badge/ruby-%3E%3D3.2-red?logo=ruby&logoColor=white)](https://www.ruby-lang.org)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

*Maintained and developed by **Arean Narrayan** (<arean@synorastudio.in>)*  
*Originally developed by INTEGRITY SOFTWARE LIMITED (redmineplus.com), released under GPLv3.*

---

## Overview

**Redmine Automation (`v1.0.0`)** is an enterprise-grade, no-code workflow automation engine for **Redmine 6.0+ & 7.0+**. Build deterministic, auditable automation rules using **Triggers → Conditions → Branches → Actions**, complete with **RQL (Redmine Query Language)** expressions, **Smart Values**, scheduled jobs, and incoming/outgoing webhooks.

---

## Architecture & Capabilities

### 1. Triggers (Event, Schedule & Webhook)
- **Issue Lifecycle:** Issue created, updated, deleted, assigned, moved, or transitioned.
- **Comments & Relations:** Comment created/edited/deleted; issue relation created/deleted; field value changed.
- **Time Tracking:** Spent time logged, edited, or deleted.
- **Manual & External:** Manual trigger from the issue menu, recurring **Scheduled** rules, and **Incoming Webhooks** (external HTTP calls).

### 2. Conditions & RQL
- **Native Filters:** Standard Redmine issue filter conditions and scope conditions.
- **RQL Conditions:** Expression-based evaluation (`AND` / `OR` logic).
- **Related Items:** Gate rules on parent, sub-tasks, or linked issues by presence, count, or RQL.

### 3. Branches
Execute downstream actions against:
- Current issue, Parent issue, Sub-tasks, Linked issues, or Newly created issue.

### 4. Actions (17 Built-In)
- **Issues & Comments:** Create issue / sub-task, Clone, Edit issue / comment, Comment, Assign, Delete issue.
- **Attachments & Links:** Add attachment, Delete attachments, Link issues, Delete issue links.
- **Tracking & Collaboration:** Log work, Manage watchers, Send notifications / webhooks.

---

## Installation

1. Clone `redmine_automation` into `/path/to/redmine/plugins/redmine_automation`:
   ```bash
   cd /path/to/redmine/plugins
   git clone https://github.com/Arean82/redmine_automation.git
   ```
2. Run plugin migrations:
   ```bash
   cd /path/to/redmine
   bundle exec rake redmine:plugins:migrate RAILS_ENV=production
   ```
3. Restart Redmine:
   ```bash
   sudo systemctl restart redmine
   ```

---

## Configuration

Configure global engine behavior under **Administration → Plugins → Redmine Automation plugin → Configure**:

| Setting | Default | Description |
| :--- | :--- | :--- |
| **Scheduler Enabled** | `1` | Enables or disables recurring scheduled automation rules. |
| **Scheduler Interval / Unit** | `5 minutes` | Polling frequency for scheduled rules. |
| **Log Retention (Days)** | `30` | Number of days to retain automation execution audit logs. |
| **Webhook Timeout (s)** | `10` | HTTP timeout for outgoing webhook actions. |
| **Webhook Allowed Hosts** | *(empty)* | Optional allowlist of permitted webhook target hosts. |
| **Debug Mode** | `0` | Enables verbose diagnostic logging for rule troubleshooting. |

---

## Author & Maintainer

- **Arean Narrayan** — [arean@synorastudio.in](mailto:arean@synorastudio.in)  
  GitHub: [@Arean82](https://github.com/Arean82/redmine_automation)

---

## License

Distributed under the **GNU General Public License v3.0 (GPLv3)**.
