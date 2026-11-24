module AutomationNodes
  module Triggers
    class Scheduled < AutomationNodes::Trigger
      store :metadata, accessors: %i[interval interval_value next_run_date next_run_time], coder: JSON

      def should_run?
        return false unless next_run_date.present? && next_run_time.present?

        scheduled_at = Time.zone.parse("#{next_run_date} #{next_run_time}")
        scheduled_at <= Time.zone.now
      end
    end
  end
end
