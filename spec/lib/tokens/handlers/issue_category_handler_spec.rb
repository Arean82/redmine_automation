require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::IssueCategoryHandler do
  it_behaves_like "automation token handler", :issue_category
end
