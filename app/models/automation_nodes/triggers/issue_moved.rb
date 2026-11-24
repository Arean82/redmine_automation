module AutomationNodes
  module Triggers
    class IssueMoved < AutomationNodes::Trigger
      def triggered?
        entity.saved_changes.key?("project_id")
      end
    end
  end
end
