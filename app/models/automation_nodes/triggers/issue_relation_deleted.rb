module AutomationNodes
  module Triggers
    class IssueRelationDeleted < AutomationNodes::Trigger
      store :metadata, accessors: %i[link_types], coder: JSON

      attr_accessor :relation

      class << self
        def trigger!(issue, relation)
          trigger_scope(issue, project: issue.project).each do |trigger|
            trigger.entity = issue
            trigger.relation = relation
            next unless trigger.triggered?

            trigger.run!
          end
        end
      end

      def triggered?
        return true if link_types.blank?
        return false unless relation

        types = link_types.map { |t| t.is_a?(Hash) ? t["value"] : t }.compact
        types.include?(relation.relation_type_for(entity))
      end
    end
  end
end
