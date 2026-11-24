module AutomationNodes
  module Actions
    class LinkIssue < AutomationNodes::Action
      store :metadata, accessors: %i[link_type issue], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::LinkIssueService.call(pipeline, self)
      end
    end
  end
end
