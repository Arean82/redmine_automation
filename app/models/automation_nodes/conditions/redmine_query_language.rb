module AutomationNodes
  module Conditions
    class RedmineQueryLanguage < AutomationNodes::Condition
      store :metadata, accessors: %i[query], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Conditions::RedmineQueryLanguageService.call(pipeline, self)
      end
    end
  end
end
