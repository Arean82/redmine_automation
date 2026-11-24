namespace :redmine_plus_automation do
  desc 'Run due scheduled automation triggers'
  task run_scheduled_triggers: :environment do
    User.current.as_automation_admin do
      AutomationNodes::Conditions::ScheduledTriggersService.new.perform
    end
  end

  desc 'Purge automation logs older than the configured retention period'
  task purge_logs: :environment do
    settings = Setting.plugin_redmine_plus_automation || {}
    days = (settings['log_retention_days'].presence || 0).to_i

    if days > 0
      cutoff = Time.current - days.days
      deleted = AutomationLog.where('created_at < ?', cutoff).delete_all
      puts "Deleted #{deleted} automation log(s) older than #{days} day(s)."
    else
      puts 'Log retention is disabled (0 days).'
    end
  end

  desc 'Export an automation rule to JSON (ID=rule_id)'
  task export_rule: :environment do
    rule = AutomationRule.find(ENV.fetch('ID'))
    data = {
      'rule' => rule.attributes.except('id', 'author_id').merge('project_ids' => rule.project_ids),
      'nodes' => rule.automation_nodes.map(&:attributes).map { |a| a.except('id', 'automation_rule_id', 'created_at', 'updated_at') }
    }
    file = "automation_rule_#{rule.id}.json"
    File.write(file, JSON.pretty_generate(data))
    puts "Exported rule ##{rule.id} to #{file}"
  end

  desc 'Import an automation rule from JSON (FILE=path)'
  task import_rule: :environment do
    data = JSON.parse(File.read(ENV.fetch('FILE')))
    attrs = data['rule']
    nodes = data['nodes']

    rule = AutomationRule.new(author: User.current || User.first)
    rule.name = attrs['name']
    rule.description = attrs['description']
    rule.enabled = false
    rule.is_for_all = attrs['is_for_all'] || false
    rule.project_ids = attrs['project_ids'] || []
    rule.save!

    uuid_map = {}
    nodes.each do |n|
      new_uuid = SecureRandom.uuid
      uuid_map[n['uuid']] = new_uuid
      AutomationNode.create!(
        uuid: new_uuid,
        type: n['type'],
        name: n['name'],
        description: n['description'],
        position: n['position'],
        metadata: n['metadata'],
        parent_node_uuid: nil,
        automation_rule: rule
      )
    end

    rule.automation_nodes.each do |node|
      orig = nodes.find { |n| n['uuid'] && uuid_map[n['uuid']] == node.uuid }
      next unless orig && orig['parent_node_uuid']

      node.update_column(:parent_node_uuid, uuid_map[orig['parent_node_uuid']])
    end

    puts "Imported rule ##{rule.id} from #{ENV['FILE']}"
  end
end
