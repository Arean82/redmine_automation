module AutomationNodes
  module Actions
    class LogAction < AutomationNodes::Action
      store :metadata, accessors: %i[message], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::LogActionService.call(pipeline, self)
      end
    end
  end
end
