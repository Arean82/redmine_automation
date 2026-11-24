require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::VersionHandler do
  it_behaves_like "automation token handler", :version
end
