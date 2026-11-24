module AutomationNodes
  module Conditions
    class RelatedItems < AutomationNodes::Condition
      store :metadata, accessors: %i[related_items condition count query], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Conditions::RelatedItemsService.call(pipeline, self)
      end
    end
  end
end
