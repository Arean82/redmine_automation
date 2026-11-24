module RedmineAutomation
  module Patches
    module Controllers
      module JournalsControllerPatch
        def self.included(base)
          base.send(:include, InstanceMethods)

          base.class_eval do
            after_action :automation_trigger_updated_deleted, only: :update
          end
        end

        module InstanceMethods

          private

          def automation_trigger_updated_deleted
            return unless @journal.journalized_type == "Issue"
            return if @journal.persisted?

            ::AutomationNodes::Triggers::IssueCommentDeleted.trigger!(@journal.journalized)
          end
        end
      end
    end
  end
end

unless JournalsController.included_modules.include?(RedmineAutomation::Patches::Controllers::JournalsControllerPatch)
  JournalsController.send(:include, RedmineAutomation::Patches::Controllers::JournalsControllerPatch)
end
