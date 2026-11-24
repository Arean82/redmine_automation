require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::TrackerHandler do
  it_behaves_like "automation token handler", :tracker
end
