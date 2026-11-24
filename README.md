# Redmine Automation

Workflow automation for Redmine — build rule-based automations with triggers, conditions, branches and actions.

- **Author:** Arean Narrayan — <arean@synorastudio.in>
- **Repository:** https://github.com/Arean82/redmine_automation
- **Version:** 1.0.0
- **License:** GPL v3
- **Requires:** Redmine 6.x or later, Ruby 3.x+, PostgreSQL

> Originally developed by INTEGRITY SOFTWARE LIMITED (redmineplus.com), released under GPLv3.

## Features

**Triggers** — events that start a rule:
- Issue created / updated / deleted
- Issue assigned
- Issue comment created / edited / deleted
- Field value changed
- Issue moved / transitioned
- Issue relation created / deleted
- Manual trigger (from the issue menu)
- Spent time logged / edited / deleted
- Scheduled (recurring)
- Incoming webhook (external HTTP call)

**Conditions** — filters that gate the rule:
- Issue filter condition (native Redmine filters)
- Scope condition
- RQL condition (expression-based, see below)
- Related items condition (parent/sub-tasks/linked by presence, count, or RQL)
- Condition logic: all conditions must match (AND) or any can match (OR)

**Branches** — run against related issues:
- Current issue, parent issue, sub-tasks, linked issues, created issue

**Actions** — what the rule does (17 total):
- Add attachment, Assign, Clone, Comment, Create issue / sub-task, Edit issue / comment
- Delete issue / attachments / issue links
- Link issues, Log work, Manage watchers
- Send email, Send web request (webhook), Log action

**Smart values (tokens)** — `{{issue.subject}}`, `{{issue.assignee.name}}`, `{{initiator.name}}`, etc.

**Settings** — a Configure screen (Administration → Plugins → Configure):
- Scheduler (enable/interval)
- Log retention (days)
- Webhook timeout + allowed hosts
- Debug mode

## Installation

```bash
# 1. copy into the plugins directory (folder must be named redmine_automation)
cp -a redmine_automation /data/redmine/plugins/redmine_automation
chown -R <redmine_user>:<redmine_group> /data/redmine/plugins/redmine_automation

# 2. install the gem dependency (httparty)
cd /data/redmine && bundle install

# 3. run migrations (production)
RAILS_ENV=production bundle exec rake redmine:plugins:migrate

# 4. restart
sudo systemctl restart redmine sidekiq
```

## Rake tasks

```bash
# Run due scheduled triggers (schedule this via cron/systemd timer)
RAILS_ENV=production bundle exec rake redmine_automation:run_scheduled_triggers

# Purge logs older than the configured retention period
RAILS_ENV=production bundle exec rake redmine_automation:purge_logs

# Export / import a rule as JSON
RAILS_ENV=production bundle exec rake redmine_automation:export_rule ID=1
RAILS_ENV=production bundle exec rake redmine_automation:import_rule FILE=automation_rule_1.json
```

To run scheduled triggers on a recurring basis, add a cron entry, e.g.:

```
*/5 * * * * cd /data/redmine && RAILS_ENV=production bundle exec rake redmine_automation:run_scheduled_triggers
```

## Incoming webhook

Trigger rules from an external system:

```
POST /automation_webhooks   { "issue_id": 123 }
```

Runs all enabled rules with an Incoming Webhook trigger against the given issue. Note: the endpoint is unauthenticated — restrict access at the network layer (firewall/reverse proxy).

## Uninstallation

```bash
# 1. stop
sudo systemctl stop redmine sidekiq

# 2. roll back migrations
cd /data/redmine && RAILS_ENV=production bundle exec rake redmine:plugins:migrate NAME=redmine_automation VERSION=0

# 3. remove the plugin
sudo rm -rf /data/redmine/plugins/redmine_automation

# 4. start
sudo systemctl start redmine sidekiq
```

## RQL (Redmine Query Language)

An expression-based condition of the form `{{token}} operator value`:

```
{{issue.status.id}} = 1
{{issue.priority.id}} > 2
{{issue.subject}} contains bug
{{issue.project.status}} = 1
```

Operators: `=` `==` `!=` `>` `>=` `<` `<=` `contains` `in`

See **[USER_MANUAL.md](USER_MANUAL.md)** for the full reference.

## License

GNU General Public License v3 — see [LICENSE](LICENSE).
