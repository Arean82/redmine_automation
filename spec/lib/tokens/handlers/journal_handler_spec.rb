require_relative '../../../spec_helper'

describe RedmineAutomation::Tokens::Handlers::JournalHandler do
  it_behaves_like "automation token handler", :journal
end
