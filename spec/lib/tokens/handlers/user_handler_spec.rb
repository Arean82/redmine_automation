require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::UserHandler do
  it_behaves_like "automation token handler", :user
end
