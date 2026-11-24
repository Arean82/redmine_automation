module AutomationNodes
  module Actions
    class SendWebRequest < AutomationNodes::Action
      store :metadata, accessors: %i[url method headers body body_type expected_response_codes], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::SendWebRequestService.call(pipeline, self)
      end
    end
  end
end
