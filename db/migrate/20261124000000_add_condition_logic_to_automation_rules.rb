class AddConditionLogicToAutomationRules < ActiveRecord::Migration[7.0]
  def change
    add_column :automation_rules, :condition_logic, :string, limit: 3, default: 'and', null: false
  end
end
