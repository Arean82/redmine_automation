require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::IssuePriorityHandler do
  it_behaves_like "automation token handler", :issue_priority
end
