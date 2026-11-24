module AutomationNodes
  module Actions
    class DeleteIssueLink < AutomationNodes::Action
      store :metadata, accessors: %i[link_types], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::DeleteIssueLinkService.call(pipeline, self)
      end
    end
  end
end
