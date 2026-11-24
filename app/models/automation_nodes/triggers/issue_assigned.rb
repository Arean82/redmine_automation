module AutomationNodes
  module Triggers
    class IssueAssigned < AutomationNodes::Trigger
      def triggered?
        entity.saved_changes.key?("assigned_to_id")
      end
    end
  end
end
