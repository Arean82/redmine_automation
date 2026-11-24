# Redmine Plus Automation

Workflow automation for Redmine — build rule-based automations with triggers, conditions, branches and actions.

- **Author:** arean narrayan — <arean@synorastudio.in>
- **Repository:** https://github.com/Arean82/redmine_plus_automation
- **License:** GPL v3
- **Requires:** Redmine 7.x, Ruby 3.x+, PostgreSQL

> Originally developed by INTEGRITY SOFTWARE LIMITED (redmineplus.com), released under GPLv3.

## Features

**Triggers** — events that start a rule:
- Issue created / updated / deleted
- Issue comment created / edited / deleted
- Field value changed
- Issue moved / transitioned
- Manual trigger (from the issue menu)
- Spent time logged / edited / deleted
- Scheduled (recurring)

**Conditions** — filters that gate the rule:
- Issue filter condition (native Redmine filters)
- Scope condition
- RQL condition (expression-based, see below)

**Branches** — run against related issues:
- Current issue, parent issue, sub-tasks, linked issues, created issue

**Actions** — what the rule does (16 total):
- Assign, Clone, Comment, Create issue / sub-task, Edit issue / comment
- Delete issue / attachments / issue links
- Link issues, Log work, Manage watchers
- Send email, Send web request (webhook), Log action

**Smart values (tokens)** — `{{issue.subject}}`, `{{issue.assignee.name}}`, `{{initiator.name}}`, etc.

## Installation

```bash
# 1. copy into the plugins directory (folder must be named redmine_plus_automation)
cp -a redmine_plus_automation /data/redmine/plugins/redmine_plus_automation
chown -R <redmine_user>:<redmine_group> /data/redmine/plugins/redmine_plus_automation

# 2. install the gem dependency (httparty)
cd /data/redmine && bundle install

# 3. run migrations (production)
RAILS_ENV=production bundle exec rake redmine:plugins:migrate

# 4. restart
sudo systemctl restart redmine sidekiq
```

## Uninstallation

```bash
# 1. stop
sudo systemctl stop redmine sidekiq

# 2. roll back migrations
cd /data/redmine && RAILS_ENV=production bundle exec rake redmine:plugins:migrate NAME=redmine_plus_automation VERSION=0

# 3. remove the plugin
sudo rm -rf /data/redmine/plugins/redmine_plus_automation

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
