module RedmineAutomation
  module Patches
    module Models
      module TimeEntryPatch
        def self.included(base)
          base.send(:include, InstanceMethods)

          base.class_eval do
            attr_accessor :skip_automation_triggers

            after_create_commit :automation_trigger_created, if: -> { !skip_automation_triggers }
            after_update_commit :automation_trigger_updated, if: -> { !skip_automation_triggers }
            after_destroy_commit :automation_trigger_deleted, if: -> { !skip_automation_triggers }
          end
        end

        module InstanceMethods
          private

          def automation_trigger_created
            ::AutomationNodes::Triggers::TimeEntryCreated.trigger!(self)
          end

          def automation_trigger_updated
            ::AutomationNodes::Triggers::TimeEntryUpdated.trigger!(self)
          end

          def automation_trigger_deleted
            ::AutomationNodes::Triggers::TimeEntryDeleted.trigger!(self)
          end
        end
      end
    end
  end
end

unless TimeEntry.included_modules.include?(RedmineAutomation::Patches::Models::TimeEntryPatch)
  TimeEntry.send(:include, RedmineAutomation::Patches::Models::TimeEntryPatch)
end
