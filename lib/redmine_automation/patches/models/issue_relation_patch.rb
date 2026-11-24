module RedmineAutomation
  module Patches
    module Models
      module IssueRelationPatch
        def self.included(base)
          base.send(:include, InstanceMethods)

          base.class_eval do
            attr_accessor :skip_automation_triggers

            after_create_commit :automation_relation_created, if: -> { !skip_automation_triggers }
            after_destroy_commit :automation_relation_deleted, if: -> { !skip_automation_triggers }
          end
        end

        module InstanceMethods
          private

          def automation_relation_created
            ::AutomationNodes::Triggers::IssueRelationCreated.trigger!(issue_from, self)
          end

          def automation_relation_deleted
            ::AutomationNodes::Triggers::IssueRelationDeleted.trigger!(issue_from, self)
          end
        end
      end
    end
  end
end

unless IssueRelation.included_modules.include?(RedmineAutomation::Patches::Models::IssueRelationPatch)
  IssueRelation.send(:include, RedmineAutomation::Patches::Models::IssueRelationPatch)
end
