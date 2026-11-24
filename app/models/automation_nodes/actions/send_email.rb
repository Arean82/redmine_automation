module AutomationNodes
  module Actions
    class SendEmail < AutomationNodes::Action
      store :metadata, accessors: %i[to cc bcc subject body], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::SendEmailService.call(pipeline, self)
      end
    end
  end
end
