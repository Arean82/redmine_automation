module AutomationNodes
  module Actions
    class AssignIssue < AutomationNodes::Action
      store :metadata, accessors: %i[assign_type value assign_method], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::AssignIssueService.call(pipeline, self)
      end
    end
  end
end
