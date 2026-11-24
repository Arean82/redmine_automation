module AutomationNodes
  module Actions
    class LogWork < AutomationNodes::Action
      store :metadata, accessors: %i[user_id date activity spent_time comment], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::LogWorkService.call(pipeline, self)
      end
    end
  end
end
