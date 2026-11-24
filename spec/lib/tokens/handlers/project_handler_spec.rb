require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::ProjectHandler do
  it_behaves_like "automation token handler", :project
end
