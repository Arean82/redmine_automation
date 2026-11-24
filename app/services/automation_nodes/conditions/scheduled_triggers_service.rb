module AutomationNodes
  module Conditions
    class ScheduledTriggersService

      def perform
        automation_rules.each do |rule|
          nodes = rule.automation_nodes
          scheduled_trigger = find_scheduled_trigger(nodes)

          next unless scheduled_trigger&.should_run?

          entities = build_query_from_scope_nodes(find_scope_nodes(nodes)).base_scope

          entities.each do |entity|
            AutomationPipelineJob.schedule(scheduled_trigger, entity, async: false)
          end

          set_next_run(scheduled_trigger)
        end
      end

      private

      def set_next_run(scheduled_trigger)
        interval_value = scheduled_trigger.interval_value["value"].to_i
        interval_unit = scheduled_trigger.interval["value"]

        next_run = Time.current
        next_run +=
          case interval_unit
          when "minutes" then interval_value.minutes
          when "hours"   then interval_value.hours
          when "days"    then interval_value.days
          when "weeks"   then interval_value.weeks
          when "months"  then interval_value.months
          else 0
          end

        scheduled_trigger.update!(
          next_run_date: next_run.strftime("%Y-%m-%d"),
          next_run_time: next_run.strftime("%H:%M")
        )
      end

      def automation_rules
        AutomationRule
          .joins(:automation_nodes)
          .preload(:automation_nodes)
          .where(automation_nodes: { type: "AutomationNodes::Triggers::Scheduled" }, automation_rules: { enabled: true })
      end

      def find_scheduled_trigger(nodes)
        nodes.find { |node| node.is_a?(AutomationNodes::Triggers::Scheduled) }
      end

      def find_scope_nodes(nodes)
        nodes.select { |node| node.is_a?(AutomationNodes::Conditions::QueryScope) }
      end

      def build_query_from_scope_nodes(scope_nodes)
        query = IssueQuery.new.tap do |q|
          q.name = "-"
          q.filters = {}
          q.group_by = nil
          q.column_names = nil
          q.sort_criteria = nil

          scope_nodes.each do |node|
            q.add_filter(
              node.filter[:value],
              node.operator[:value],
              node.values.map { |v| v[:value] }
            )
          end
        end
        query
      end

      def valid?
        node.next_run_date && node.next_run_time
      end
    end
  end
end
