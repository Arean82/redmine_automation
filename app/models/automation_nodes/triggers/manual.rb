module AutomationNodes
  module Triggers
    class Manual < AutomationNodes::Trigger
      store :metadata, accessors: %i[projects trackers], coder: JSON

      def can_run?(user, issue)
        return false unless user&.logged?
        return false unless user.admin? || user.allowed_to?(:manage_automation_rules, issue.project)

        return false unless project_allowed?(issue.project)
        return false unless tracker_allowed?(issue.tracker)

        true
      end

      private

      def project_allowed?(project)
        return true if projects.blank?

        projects.map { |p| p.is_a?(Hash) ? p["value"] : p }.compact.include?(project.id)
      end

      def tracker_allowed?(tracker)
        return true if trackers.blank?

        trackers.map { |t| t.is_a?(Hash) ? t["value"] : t }.compact.include?(tracker.id)
      end
    end
  end
end
