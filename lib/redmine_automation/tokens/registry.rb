module RedmineAutomation
  module Tokens
    # The Registry is a central place to map entity symbols (e.g., :issue)
    # to the handler classes responsible for processing their tokens.
    # This registry can be extended by other plugins using the configure DSL.
    module Registry
      class << self
        # Provides a block-based DSL for registering handlers.
        # It yields the Registry module itself.
        #
        # @example
        #   RedmineAutomation::Tokens::Registry.configure do |registry|
        #     registry.register :issue, MyIssueHandler
        #     registry.register :project, MyProjectHandler
        #   end
        def configure
          yield self if block_given?
        end

        # Registers a handler class for a given entity name.
        # @param entity_name [Symbol] The name of the entity (e.g., :issue).
        # @param handler_class [Class] The handler class.
        def register(entity_name, handler_class)
          handlers[entity_name.to_sym] = handler_class
        end

        # Retrieves the handler class for a given entity name.
        # @param entity_name [Symbol] The name of the entity.
        # @return [Class, nil] The registered handler class or nil if not found.
        def handler_for(entity_name)
          handlers[entity_name.to_sym]
        end

        # Returns a hash of all registered handlers.
        # @return [Hash]
        def handlers
          @handlers ||= {
            issue: RedmineAutomation::Tokens::Handlers::IssueHandler,
            tracker: RedmineAutomation::Tokens::Handlers::TrackerHandler,
            status: RedmineAutomation::Tokens::Handlers::IssueStatusHandler,
            priority: RedmineAutomation::Tokens::Handlers::IssuePriorityHandler,
            category: RedmineAutomation::Tokens::Handlers::IssueCategoryHandler,
            version: RedmineAutomation::Tokens::Handlers::VersionHandler,
            project: RedmineAutomation::Tokens::Handlers::ProjectHandler,
            journal: RedmineAutomation::Tokens::Handlers::JournalHandler
          }.merge(global_handlers)
        end

        def global_handlers
          @global_handlers ||= {
            initiator: RedmineAutomation::Tokens::Handlers::UserHandler,
            now: RedmineAutomation::Tokens::Handlers::DateTimeHandler,
            today: RedmineAutomation::Tokens::Handlers::DateHandler
          }
        end
      end
    end
  end
end