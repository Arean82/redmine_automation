module AutomationNodes
  module Actions
    class ManageWatchers < AutomationNodes::Action
      store :metadata, accessors: %i[remove_all_watchers add_watchers remove_watchers], coder: JSON

      def run!(pipeline)
        ::AutomationNodes::Actions::ManageWatchersService.call(pipeline, self)
      end
    end
  end
end
