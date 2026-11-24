module AutomationNodes
  module Actions
    class AddAttachment < AutomationNodes::Action
      store :metadata, accessors: %i[filename content url], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::AddAttachmentService.call(pipeline, self)
      end
    end
  end
end
