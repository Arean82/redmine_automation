module AutomationNodes
  module Triggers
    class IssueTransitioned < AutomationNodes::Trigger
      def triggered?
        entity.saved_changes.key?("status_id")
      end
    end
  end
end
